package com.productapi.controller;

import com.productapi.model.Product;
import com.productapi.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for product operations
 */
@RestController
public class ProductController {

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /**
     * Filter products by price range
     *
     * @param initialRange the minimum price
     * @param finalRange the maximum price
     * @return list of products within the price range
     */
    @GetMapping("/filter/price/{initial_range}/{final_range}")
    public ResponseEntity<?> filterByPrice(
            @PathVariable("initial_range") String initialRangeStr,
            @PathVariable("final_range") String finalRangeStr) {
        
        try {
            int initialRange = Integer.parseInt(initialRangeStr);
            int finalRange = Integer.parseInt(finalRangeStr);
            
            if (initialRange < 0 || finalRange < 0 || initialRange > finalRange) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid price range");
            }
            
            List<Product> filteredProducts = productService.filterByPriceRange(initialRange, finalRange);
            return ResponseEntity.ok(filteredProducts);
        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid price range parameters");
        }
    }

    /**
     * Sort products by price in ascending order
     *
     * @return list of product names sorted by price
     */
    @GetMapping("/sort/price")
    public ResponseEntity<List<String>> sortByPrice() {
        List<String> sortedProducts = productService.sortByPrice();
        return ResponseEntity.ok(sortedProducts);
    }

    /**
     * Get all products
     *
     * @return list of all products
     */
    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }
    
    /**
     * Get product by barcode
     *
     * @param barcode the product barcode
     * @return the product if found
     */
    @GetMapping("/products/{barcode}")
    public ResponseEntity<?> getProductByBarcode(@PathVariable String barcode) {
        try {
            Product product = productService.getProductByBarcode(barcode);
            if (product != null) {
                return ResponseEntity.ok(product);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found with barcode: " + barcode);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving product: " + e.getMessage());
        }
    }
    
    /**
     * Create a new product
     *
     * @param product the product to create
     * @return the created product
     */
    @PostMapping("/products")
    public ResponseEntity<?> createProduct(@RequestBody Product product) {
        try {
            Product createdProduct = productService.createProduct(product);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating product: " + e.getMessage());
        }
    }
    
    /**
     * Update an existing product
     *
     * @param barcode the product barcode
     * @param product the updated product data
     * @return the updated product
     */
    @PutMapping("/products/{barcode}")
    public ResponseEntity<?> updateProduct(@PathVariable String barcode, @RequestBody Product product) {
        try {
            product.setBarcode(barcode);
            Product updatedProduct = productService.updateProduct(product);
            if (updatedProduct != null) {
                return ResponseEntity.ok(updatedProduct);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found with barcode: " + barcode);
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating product: " + e.getMessage());
        }
    }
    
    /**
     * Delete a product
     *
     * @param barcode the product barcode
     * @return success message
     */
    @DeleteMapping("/products/{barcode}")
    public ResponseEntity<?> deleteProduct(@PathVariable String barcode) {
        try {
            boolean deleted = productService.deleteProduct(barcode);
            if (deleted) {
                return ResponseEntity.ok("Product deleted successfully");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found with barcode: " + barcode);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting product: " + e.getMessage());
        }
    }
} 