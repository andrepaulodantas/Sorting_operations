package com.productapi.repository;

import com.productapi.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for User entity operations with MongoDB
 */
@Repository
public interface UserRepository extends MongoRepository<User, String> {
    
    /**
     * Find a user by username
     * 
     * @param username the username
     * @return optional containing user if found
     */
    Optional<User> findByUsername(String username);
    
    /**
     * Check if a user exists by username
     * 
     * @param username the username
     * @return true if user exists
     */
    boolean existsByUsername(String username);
    
    /**
     * Find a user by email
     * 
     * @param email the email
     * @return optional containing user if found
     */
    Optional<User> findByEmail(String email);
    
    /**
     * Check if a user exists by email
     * 
     * @param email the email
     * @return true if user exists
     */
    boolean existsByEmail(String email);
} 