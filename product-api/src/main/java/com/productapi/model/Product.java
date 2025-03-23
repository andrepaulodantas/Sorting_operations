package com.productapi.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Product entity class containing product details
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    
    /**
     * The unique identifier of the product
     */
    private String barcode;
    
    /**
     * The name of the product
     */
    private String item;
    
    /**
     * The product category
     */
    private String category;
    
    /**
     * The price of the product
     */
    private Integer price;
    
    /**
     * The discount percentage on the product
     */
    private Integer discount;
    
    /**
     * Availability status (0 for unavailable, 1 for available)
     */
    private Integer available;
} 