package com.productapi.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

/**
 * User entity class for user management and authentication
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
    
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String username;
    
    private String password;
    
    private String email;
    
    private String fullName;
    
    private String role;
    
    private List<String> connections = new ArrayList<>();
    
    // Flag to indicate if user is online
    private boolean online = false;
    
    // Profile picture URL
    private String profilePicture;
    
    // Last active timestamp
    private long lastActive;
} 