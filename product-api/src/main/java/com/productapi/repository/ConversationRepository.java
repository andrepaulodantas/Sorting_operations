package com.productapi.repository;

import com.productapi.model.Conversation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Conversation entity operations with MongoDB
 */
@Repository
public interface ConversationRepository extends MongoRepository<Conversation, String> {
    
    /**
     * Find conversations containing a specific participant
     * 
     * @param participantId the participant user ID
     * @return list of conversations
     */
    List<Conversation> findByParticipantsContaining(String participantId);
    
    /**
     * Find direct conversation between two users
     * 
     * @param user1Id first user ID
     * @param user2Id second user ID
     * @param isGroup group status (false for direct conversations)
     * @return list of conversations
     */
    List<Conversation> findByParticipantsContainingAndParticipantsContainingAndIsGroup(
            String user1Id, String user2Id, boolean isGroup);
    
    /**
     * Find group conversations
     * 
     * @param participantId the participant user ID
     * @param isGroup group status (true for group conversations)
     * @return list of group conversations
     */
    List<Conversation> findByParticipantsContainingAndIsGroup(String participantId, boolean isGroup);
} 