package com.productapi.repository;

import com.productapi.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Message entity operations with MongoDB
 */
@Repository
public interface MessageRepository extends MongoRepository<Message, String> {
    
    /**
     * Find messages by sender ID
     * 
     * @param senderId the sender user ID
     * @return list of messages
     */
    List<Message> findBySenderId(String senderId);
    
    /**
     * Find messages by recipient ID
     * 
     * @param recipientId the recipient user ID
     * @return list of messages
     */
    List<Message> findByRecipientId(String recipientId);
    
    /**
     * Find messages between two users
     * 
     * @param user1Id first user ID
     * @param user2Id second user ID
     * @return list of messages
     */
    List<Message> findBySenderIdAndRecipientIdOrRecipientIdAndSenderIdOrderByTimestampDesc(
            String user1Id, String user2Id, String user3Id, String user4Id);
    
    /**
     * Find unread messages for a user
     * 
     * @param recipientId the recipient user ID
     * @param read the read status (false for unread)
     * @return list of unread messages
     */
    List<Message> findByRecipientIdAndRead(String recipientId, boolean read);
} 