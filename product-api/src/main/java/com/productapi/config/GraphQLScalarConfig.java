package com.productapi.config;

import graphql.schema.GraphQLScalarType;
import graphql.schema.idl.RuntimeWiring;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.graphql.execution.RuntimeWiringConfigurer;

/**
 * Configuration class for GraphQL scalar types
 */
@Configuration
public class GraphQLScalarConfig {

    /**
     * Define the Long scalar type for GraphQL schema
     * This allows mapping between Java Long and GraphQL Long types
     */
    @Bean
    public GraphQLScalarType longScalar() {
        return GraphQLScalarType.newScalar()
                .name("Long")
                .description("Java Long type")
                .coercing(new LongCoercing())
                .build();
    }

    /**
     * Register the scalar types with the GraphQL runtime
     */
    @Bean
    public RuntimeWiringConfigurer runtimeWiringConfigurer(GraphQLScalarType longScalar) {
        return wiringBuilder -> wiringBuilder
                .scalar(longScalar);
    }
} 