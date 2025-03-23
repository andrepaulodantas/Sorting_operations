package com.productapi.service.messaging;

import com.productapi.config.RabbitMQConfig;
import com.productapi.model.Conversation;
import com.productapi.model.Conversation.ParticipantStatus;
import com.productapi.model.User;
import com.productapi.repository.ConversationRepository;
import com.productapi.repository.UserRepository;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service for conversation operations
 */
@Service
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;
    private final RabbitTemplate rabbitTemplate;

    @Autowired
    public ConversationService(
            ConversationRepository conversationRepository,
            UserRepository userRepository,
            RabbitTemplate rabbitTemplate) {
        this.conversationRepository = conversationRepository;
        this.userRepository = userRepository;
        this.rabbitTemplate = rabbitTemplate;
    }

    /**
     * Create a new conversation
     *
     * @param participants list of participant user IDs
     * @param title optional title for group chats
     * @param isGroup whether this is a group conversation
     * @param iconUrl optional icon URL for group chats
     * @return the created conversation
     */
    public Conversation createConversation(List<String> participants, String title, 
                                          boolean isGroup, String iconUrl) {
        // Validate participants
        for (String userId : participants) {
            if (!userRepository.existsById(userId)) {
                throw new IllegalArgumentException("User not found with ID: " + userId);
            }
        }
        
        // For direct conversations between 2 users, check if it already exists
        if (!isGroup && participants.size() == 2) {
            List<Conversation> existingConvos = conversationRepository
                    .findByParticipantsContainingAndParticipantsContainingAndIsGroup(
                            participants.get(0), participants.get(1), false);
            
            if (!existingConvos.isEmpty()) {
                return existingConvos.get(0); // Return existing conversation
            }
        }
        
        // Create new conversation
        Conversation conversation = new Conversation();
        conversation.setParticipants(participants);
        conversation.setTitle(title);
        conversation.setGroup(isGroup);
        conversation.setIconUrl(iconUrl);
        conversation.setCreatedAt(System.currentTimeMillis());
        conversation.setLastActivity(System.currentTimeMillis());
        
        // Initialize participant status
        List<ParticipantStatus> statuses = new ArrayList<>();
        for (String userId : participants) {
            ParticipantStatus status = new ParticipantStatus(userId, 0, System.currentTimeMillis());
            statuses.add(status);
        }
        conversation.setParticipantStatus(statuses);
        
        // Save conversation
        Conversation savedConversation = conversationRepository.save(conversation);
        
        // Notify participants via RabbitMQ
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE_MESSAGES,
                RabbitMQConfig.ROUTING_KEY_NOTIFICATIONS,
                savedConversation);
        
        return savedConversation;
    }

    /**
     * Get all conversations for a user
     *
     * @param userId ID of the user
     * @return list of conversations
     */
    public List<Conversation> getUserConversations(String userId) {
        return conversationRepository.findByParticipantsContaining(userId);
    }

    /**
     * Get a conversation by ID
     *
     * @param conversationId ID of the conversation
     * @param userId ID of the requesting user (for authorization)
     * @return the conversation if found and authorized
     */
    public Optional<Conversation> getConversationById(String conversationId, String userId) {
        Optional<Conversation> conversationOpt = conversationRepository.findById(conversationId);
        
        if (conversationOpt.isPresent()) {
            Conversation conversation = conversationOpt.get();
            
            // Check if user is a participant
            if (conversation.getParticipants().contains(userId)) {
                return conversationOpt;
            }
        }
        
        return Optional.empty();
    }

    /**
     * Get group conversations for a user
     *
     * @param userId ID of the user
     * @return list of group conversations
     */
    public List<Conversation> getUserGroupConversations(String userId) {
        return conversationRepository.findByParticipantsContainingAndIsGroup(userId, true);
    }

    /**
     * Get direct conversations for a user
     *
     * @param userId ID of the user
     * @return list of direct (one-to-one) conversations
     */
    public List<Conversation> getUserDirectConversations(String userId) {
        return conversationRepository.findByParticipantsContainingAndIsGroup(userId, false);
    }

    /**
     * Update unread count for a participant
     *
     * @param conversationId ID of the conversation
     * @param userId ID of the user
     * @param increment whether to increment (true) or reset to zero (false)
     * @return updated conversation
     */
    public Conversation updateUnreadCount(String conversationId, String userId, boolean increment) {
        Optional<Conversation> conversationOpt = conversationRepository.findById(conversationId);
        if (conversationOpt.isEmpty()) {
            throw new IllegalArgumentException("Conversation not found");
        }
        
        Conversation conversation = conversationOpt.get();
        List<ParticipantStatus> statuses = conversation.getParticipantStatus();
        
        for (ParticipantStatus status : statuses) {
            if (status.getUserId().equals(userId)) {
                if (increment) {
                    status.setUnreadCount(status.getUnreadCount() + 1);
                } else {
                    status.setUnreadCount(0);
                }
                status.setLastSeen(System.currentTimeMillis());
                break;
            }
        }
        
        return conversationRepository.save(conversation);
    }
} 