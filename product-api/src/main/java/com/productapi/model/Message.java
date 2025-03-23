package com.productapi.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Message entity class for storing chat messages between users
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "messages")
public class Message {
    
    @Id
    private String id;
    
    // Sender user ID
    private String senderId;
    
    // Recipient user ID
    private String recipientId;
    
    // Message content
    private String content;
    
    // Timestamp when the message was sent
    private long timestamp;
    
    // Flag to indicate if the message has been read
    private boolean read;
    
    // Message type (e.g., TEXT, IMAGE, FILE)
    private MessageType type;
    
    // Optional attachment URL for images/files
    private String attachmentUrl;
    
    /**
     * Enumeration for different message types
     */
    public enum MessageType {
        TEXT,
        IMAGE,
        FILE,
        AUDIO,
        VIDEO
    }
} 