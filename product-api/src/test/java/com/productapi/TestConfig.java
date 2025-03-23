package com.productapi;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.data.mongodb.core.MongoTemplate;

import static org.mockito.Mockito.mock;

/**
 * Test configuration for mocking RabbitMQ components.
 * This prevents tests from requiring a real RabbitMQ connection.
 * Also provides MongoDB configuration for tests.
 */
@TestConfiguration
@Profile("test")
public class TestConfig {

    /**
     * Create a mock ConnectionFactory for testing
     */
    @Bean
    @Primary
    public ConnectionFactory connectionFactory() {
        return mock(ConnectionFactory.class);
    }

    /**
     * Create a mock RabbitTemplate for testing
     */
    @Bean
    @Primary
    public RabbitTemplate rabbitTemplate() {
        return mock(RabbitTemplate.class);
    }

    /**
     * Create a mock MessageConverter for testing
     */
    @Bean
    @Primary
    public MessageConverter messageConverter() {
        return mock(MessageConverter.class);
    }
    
    /**
     * Create a MongoClient connecting to in-memory MongoDB
     */
    @Bean
    @Primary
    public MongoClient mongoClient() {
        return MongoClients.create("mongodb://localhost:27017/test");
    }
    
    /**
     * Create a MongoTemplate using the MongoClient
     */
    @Bean
    @Primary
    public MongoTemplate mongoTemplate(MongoClient mongoClient) {
        return new MongoTemplate(mongoClient, "test");
    }
} 