package com.productapi.graphql;

import com.productapi.model.Conversation;
import com.productapi.model.Message;
import com.productapi.model.Message.MessageType;
import com.productapi.service.messaging.ConversationService;
import com.productapi.service.messaging.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * GraphQL controller for message operations
 */
@Controller
public class MessageController {

    private final MessageService messageService;
    private final ConversationService conversationService;

    @Autowired
    public MessageController(MessageService messageService, ConversationService conversationService) {
        this.messageService = messageService;
        this.conversationService = conversationService;
    }

    /**
     * Query to get a conversation by ID
     *
     * @param id conversation ID
     * @return the conversation if found
     */
    @QueryMapping
    @PreAuthorize("isAuthenticated()")
    public Optional<Conversation> conversationById(@Argument String id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = auth.getName(); // Assuming username is used as user ID
        return conversationService.getConversationById(id, userId);
    }

    /**
     * Query to get all conversations for the current user
     *
     * @return list of conversations
     */
    @QueryMapping
    @PreAuthorize("isAuthenticated()")
    public List<Conversation> userConversations() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = auth.getName();
        return conversationService.getUserConversations(userId);
    }

    /**
     * Query to get messages for a conversation
     *
     * @param conversationId conversation ID
     * @return list of messages
     */
    @QueryMapping
    @PreAuthorize("isAuthenticated()")
    public List<Message> messagesByConversation(@Argument String conversationId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = auth.getName();
        
        // Verify user has access to this conversation
        Optional<Conversation> conversationOpt = conversationService.getConversationById(conversationId, userId);
        if (conversationOpt.isEmpty()) {
            throw new IllegalArgumentException("Conversation not found or access denied");
        }
        
        return messageService.getConversationMessages(conversationId);
    }

    /**
     * Mutation to create a new conversation
     *
     * @param input conversation details
     * @return the created conversation
     */
    @MutationMapping
    @PreAuthorize("isAuthenticated()")
    public Conversation createConversation(@Argument Map<String, Object> input) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = auth.getName();
        
        @SuppressWarnings("unchecked")
        List<String> participants = (List<String>) input.get("participants");
        String title = (String) input.get("title");
        Boolean isGroup = (Boolean) input.get("isGroup");
        String iconUrl = (String) input.get("iconUrl");
        
        // Ensure current user is included in participants
        if (!participants.contains(userId)) {
            participants.add(userId);
        }
        
        return conversationService.createConversation(
                participants, 
                title, 
                isGroup != null ? isGroup : false, 
                iconUrl);
    }

    /**
     * Mutation to send a message
     *
     * @param input message details
     * @return the sent message
     */
    @MutationMapping
    @PreAuthorize("isAuthenticated()")
    public Message sendMessage(@Argument Map<String, Object> input) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String senderId = auth.getName();
        
        String conversationId = (String) input.get("conversationId");
        String content = (String) input.get("content");
        MessageType type = MessageType.valueOf((String) input.get("type"));
        String attachmentUrl = (String) input.get("attachmentUrl");
        
        return messageService.sendMessage(conversationId, senderId, content, type, attachmentUrl);
    }

    /**
     * Mutation to mark a message as read
     *
     * @param messageId message ID
     * @return true if successful
     */
    @MutationMapping
    @PreAuthorize("isAuthenticated()")
    public Boolean markMessageRead(@Argument String messageId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = auth.getName();
        
        return messageService.markMessageAsRead(messageId, userId);
    }
} 