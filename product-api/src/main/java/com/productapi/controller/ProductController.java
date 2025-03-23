package com.productapi.controller;

import com.productapi.model.Product;
import com.productapi.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for product operations
 */
@RestController
@Tag(name = "Product Controller", description = "API endpoints for product management")
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
    @Operation(summary = "Filter products by price range", description = "Returns all products within the specified price range")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Products found", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = Product.class)) }),
        @ApiResponse(responseCode = "400", description = "Invalid price range parameters"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/filter/price/{initial_range}/{final_range}")
    public ResponseEntity<?> filterByPrice(
            @Parameter(description = "Minimum price", required = true) @PathVariable("initial_range") String initialRangeStr,
            @Parameter(description = "Maximum price", required = true) @PathVariable("final_range") String finalRangeStr) {
        
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
    @Operation(summary = "Sort products by price", description = "Returns a list of product names sorted by price in ascending order")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Success", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = String.class)) }),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
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
    @Operation(summary = "Get all products", description = "Returns a list of all products in the catalog")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Success", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = Product.class)) }),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
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
    @Operation(summary = "Get product by barcode", description = "Returns a single product by its barcode")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Product found", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = Product.class)) }),
        @ApiResponse(responseCode = "404", description = "Product not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/products/{barcode}")
    public ResponseEntity<?> getProductByBarcode(
            @Parameter(description = "Barcode of the product", required = true) @PathVariable String barcode) {
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
    @Operation(summary = "Create a new product", description = "Creates a new product in the catalog")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Product created", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = Product.class)) }),
        @ApiResponse(responseCode = "400", description = "Invalid product data"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping("/products")
    public ResponseEntity<?> createProduct(
            @Parameter(description = "Product to be created", required = true) @RequestBody Product product) {
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
    @Operation(summary = "Update an existing product", description = "Updates an existing product by its barcode")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Product updated", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = Product.class)) }),
        @ApiResponse(responseCode = "400", description = "Invalid product data"),
        @ApiResponse(responseCode = "404", description = "Product not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PutMapping("/products/{barcode}")
    public ResponseEntity<?> updateProduct(
            @Parameter(description = "Barcode of the product to update", required = true) @PathVariable String barcode,
            @Parameter(description = "Updated product data", required = true) @RequestBody Product product) {
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
    @Operation(summary = "Delete a product", description = "Deletes a product by its barcode")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Product deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Product not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @DeleteMapping("/products/{barcode}")
    public ResponseEntity<?> deleteProduct(
            @Parameter(description = "Barcode of the product to delete", required = true) @PathVariable String barcode) {
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