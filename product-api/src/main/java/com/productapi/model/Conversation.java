package com.productapi.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

/**
 * Conversation entity class for managing conversations between users
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "conversations")
public class Conversation {
    
    @Id
    private String id;
    
    // List of participant user IDs
    private List<String> participants = new ArrayList<>();
    
    // Conversation title for group chats (optional)
    private String title;
    
    // Timestamp when the conversation was created
    private long createdAt;
    
    // Timestamp of the last message
    private long lastActivity;
    
    // Flag for group conversation
    private boolean isGroup = false;
    
    // Optional icon URL for group chats
    private String iconUrl;
    
    // ID of the last message in the conversation
    private String lastMessageId;
    
    // Unread message counts for each participant
    private List<ParticipantStatus> participantStatus = new ArrayList<>();
    
    /**
     * Inner class to track status for each participant
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ParticipantStatus {
        private String userId;
        private int unreadCount;
        private long lastSeen;
    }
}