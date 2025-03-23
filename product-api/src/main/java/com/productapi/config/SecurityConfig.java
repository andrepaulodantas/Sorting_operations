package com.productapi.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.http.HttpMethod;

import java.util.Arrays;
import java.util.Collections;

/**
 * Security configuration for the API
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * Configure security settings for the application
     * 
     * @param http HttpSecurity to configure
     * @return The configured security filter chain
     * @throws Exception If configuration fails
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors().configurationSource(corsConfigurationSource()).and()
            .csrf().disable()
            .authorizeRequests()
                // Allow all product-related endpoints without authentication
                .antMatchers("/products/**", "/filter/**", "/sort/**").permitAll()
                // Allow OPTIONS requests without authentication for CORS preflight
                .antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                // Anything else requires authentication
                .anyRequest().authenticated()
            .and()
            .httpBasic();
        
        return http.build();
    }
    
    /**
     * Configure CORS settings
     * 
     * @return CORS configuration source
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Allow requests from any origin
        configuration.setAllowedOrigins(Collections.singletonList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Auth-Token"));
        configuration.setAllowCredentials(false); // Changed to false to avoid CORS preflight with credentials
        configuration.setMaxAge(3600L); // Cache preflight request for 1 hour
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
} 