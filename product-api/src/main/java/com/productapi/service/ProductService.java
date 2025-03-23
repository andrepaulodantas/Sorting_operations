package com.productapi.service;

import com.productapi.model.Product;
import java.util.List;

/**
 * Service interface for handling product operations
 */
public interface ProductService {
    
    /**
     * Filter products by price range
     * 
     * @param initialRange the minimum price
     * @param finalRange the maximum price
     * @return list of products within the price range
     */
    List<Product> filterByPriceRange(int initialRange, int finalRange);
    
    /**
     * Sort products by price in ascending order
     * 
     * @return list of product names sorted by price
     */
    List<String> sortByPrice();
    
    /**
     * Get all products
     * 
     * @return list of all products
     */
    List<Product> getAllProducts();
    
    /**
     * Get product by barcode
     * 
     * @param barcode the product barcode
     * @return the product if found, null otherwise
     */
    Product getProductByBarcode(String barcode);
    
    /**
     * Create a new product
     * 
     * @param product the product to create
     * @return the created product
     * @throws IllegalArgumentException if product data is invalid
     */
    Product createProduct(Product product);
    
    /**
     * Update an existing product
     * 
     * @param product the product to update
     * @return the updated product, or null if not found
     * @throws IllegalArgumentException if product data is invalid
     */
    Product updateProduct(Product product);
    
    /**
     * Delete a product by barcode
     * 
     * @param barcode the product barcode
     * @return true if deleted, false if not found
     */
    boolean deleteProduct(String barcode);
} 