package com.productapi.service.messaging;

import com.productapi.config.RabbitMQConfig;
import com.productapi.model.Conversation;
import com.productapi.model.Message;
import com.productapi.model.Message.MessageType;
import com.productapi.repository.ConversationRepository;
import com.productapi.repository.MessageRepository;
import com.productapi.repository.UserRepository;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service for message operations and communication via RabbitMQ
 */
@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;
    private final RabbitTemplate rabbitTemplate;

    @Autowired
    public MessageService(
            MessageRepository messageRepository,
            ConversationRepository conversationRepository,
            UserRepository userRepository,
            RabbitTemplate rabbitTemplate) {
        this.messageRepository = messageRepository;
        this.conversationRepository = conversationRepository;
        this.userRepository = userRepository;
        this.rabbitTemplate = rabbitTemplate;
    }

    /**
     * Send a message to a conversation
     *
     * @param conversationId ID of the conversation
     * @param senderId ID of the sender
     * @param content message content
     * @param type message type
     * @param attachmentUrl optional attachment URL
     * @return the saved message
     */
    public Message sendMessage(String conversationId, String senderId, String content, 
                              MessageType type, String attachmentUrl) {
        
        Optional<Conversation> conversationOpt = conversationRepository.findById(conversationId);
        if (conversationOpt.isEmpty()) {
            throw new IllegalArgumentException("Conversation not found");
        }
        
        Conversation conversation = conversationOpt.get();
        if (!conversation.getParticipants().contains(senderId)) {
            throw new IllegalArgumentException("Sender is not a participant in this conversation");
        }
        
        // Create new message
        Message message = new Message();
        message.setSenderId(senderId);
        message.setContent(content);
        message.setType(type);
        message.setAttachmentUrl(attachmentUrl);
        message.setTimestamp(System.currentTimeMillis());
        message.setRead(false);
        
        // Save to database
        Message savedMessage = messageRepository.save(message);
        
        // Update conversation's last activity and last message
        conversation.setLastActivity(System.currentTimeMillis());
        conversation.setLastMessageId(savedMessage.getId());
        conversationRepository.save(conversation);
        
        // Send to RabbitMQ for notification delivery
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE_MESSAGES,
                RabbitMQConfig.ROUTING_KEY_MESSAGES,
                savedMessage);
        
        return savedMessage;
    }
    
    /**
     * Get messages for a conversation
     *
     * @param conversationId ID of the conversation
     * @return list of messages
     */
    public List<Message> getConversationMessages(String conversationId) {
        // Implementation depends on the relationship between messages and conversations
        // This is a placeholder implementation
        return messageRepository.findAll(); // Would be filtered by conversation ID in a real implementation
    }
    
    /**
     * Mark a message as read
     *
     * @param messageId ID of the message
     * @param userId ID of the user
     * @return true if successful
     */
    public boolean markMessageAsRead(String messageId, String userId) {
        Optional<Message> messageOpt = messageRepository.findById(messageId);
        if (messageOpt.isEmpty()) {
            return false;
        }
        
        Message message = messageOpt.get();
        
        // Only mark as read if current user is the recipient
        if (!message.getRecipientId().equals(userId)) {
            return false;
        }
        
        message.setRead(true);
        messageRepository.save(message);
        
        // Notify via RabbitMQ that message status has changed
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE_MESSAGES,
                RabbitMQConfig.ROUTING_KEY_USER_EVENTS,
                message);
        
        return true;
    }
    
    /**
     * Get unread messages for a user
     *
     * @param userId ID of the user
     * @return list of unread messages
     */
    public List<Message> getUnreadMessages(String userId) {
        return messageRepository.findByRecipientIdAndRead(userId, false);
    }
} 