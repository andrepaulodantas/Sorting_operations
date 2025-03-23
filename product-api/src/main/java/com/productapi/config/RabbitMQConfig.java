package com.productapi.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration class for RabbitMQ
 */
@Configuration
public class RabbitMQConfig {
    
    // Queue names
    public static final String QUEUE_MESSAGES = "messages-queue";
    public static final String QUEUE_USER_EVENTS = "user-events-queue";
    public static final String QUEUE_NOTIFICATIONS = "notifications-queue";
    
    // Exchange names
    public static final String EXCHANGE_MESSAGES = "messages-exchange";
    
    // Routing keys
    public static final String ROUTING_KEY_MESSAGES = "messages.routing.key";
    public static final String ROUTING_KEY_USER_EVENTS = "user-events.routing.key";
    public static final String ROUTING_KEY_NOTIFICATIONS = "notifications.routing.key";
    
    /**
     * Create message queue
     */
    @Bean
    public Queue messagesQueue() {
        return new Queue(QUEUE_MESSAGES, true);
    }
    
    /**
     * Create user events queue
     */
    @Bean
    public Queue userEventsQueue() {
        return new Queue(QUEUE_USER_EVENTS, true);
    }
    
    /**
     * Create notifications queue
     */
    @Bean
    public Queue notificationsQueue() {
        return new Queue(QUEUE_NOTIFICATIONS, true);
    }
    
    /**
     * Create direct exchange
     */
    @Bean
    public DirectExchange messagesExchange() {
        return new DirectExchange(EXCHANGE_MESSAGES);
    }
    
    /**
     * Bind messages queue to exchange
     */
    @Bean
    public Binding messagesBinding(Queue messagesQueue, DirectExchange messagesExchange) {
        return BindingBuilder
                .bind(messagesQueue)
                .to(messagesExchange)
                .with(ROUTING_KEY_MESSAGES);
    }
    
    /**
     * Bind user events queue to exchange
     */
    @Bean
    public Binding userEventsBinding(Queue userEventsQueue, DirectExchange messagesExchange) {
        return BindingBuilder
                .bind(userEventsQueue)
                .to(messagesExchange)
                .with(ROUTING_KEY_USER_EVENTS);
    }
    
    /**
     * Bind notifications queue to exchange
     */
    @Bean
    public Binding notificationsBinding(Queue notificationsQueue, DirectExchange messagesExchange) {
        return BindingBuilder
                .bind(notificationsQueue)
                .to(messagesExchange)
                .with(ROUTING_KEY_NOTIFICATIONS);
    }
    
    /**
     * Configure message converter to JSON
     */
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
    
    /**
     * Configure RabbitTemplate with connection factory and message converter
     */
    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter());
        return template;
    }
} 