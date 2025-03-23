package com.productapi.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Product entity class containing product details
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Product information")
public class Product {
    
    /**
     * The unique identifier of the product
     */
    @Schema(description = "Product barcode (unique identifier)", example = "74001755", required = true)
    private String barcode;
    
    /**
     * The name of the product
     */
    @Schema(description = "Product name", example = "Ball Gown", required = true)
    private String item;
    
    /**
     * The product category
     */
    @Schema(description = "Product category", example = "Full Body Outfits")
    private String category;
    
    /**
     * The price of the product
     */
    @Schema(description = "Product price in cents", example = "3548")
    private Integer price;
    
    /**
     * The discount percentage on the product
     */
    @Schema(description = "Discount percentage", example = "7", minimum = "0", maximum = "100")
    private Integer discount;
    
    /**
     * Availability status (0 for unavailable, 1 for available)
     */
    @Schema(description = "Availability status (0 = unavailable, 1 = available)", example = "1", allowableValues = {"0", "1"})
    private Integer available;
    
    /**
     * Get the final price after discount
     * 
     * @return the price after discount is applied
     */
    @Schema(description = "Final price after applying discount", example = "3300")
    public Integer getFinalPrice() {
        if (price == null || discount == null) {
            return price;
        }
        return Math.round(price * (100 - discount) / 100.0f);
    }
} 