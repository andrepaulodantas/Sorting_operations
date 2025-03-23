package com.productapi.service;

import com.productapi.model.Product;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class ProductServiceImplTest {

    @InjectMocks
    private ProductServiceImpl productService;

    @BeforeEach
    public void setup() {
        productService = new ProductServiceImpl();
        productService.init(); // Initialize with sample data
    }

    @Test
    public void testFilterByPriceRange() {
        // Test filtering within range with results
        List<Product> filteredProducts = productService.filterByPriceRange(700, 1000);
        assertEquals(1, filteredProducts.size());
        assertEquals("74002423", filteredProducts.get(0).getBarcode());
        assertEquals("Shawl", filteredProducts.get(0).getItem());

        // Test filtering with wider range
        filteredProducts = productService.filterByPriceRange(700, 4000);
        assertEquals(2, filteredProducts.size());

        // Test filtering with no results
        filteredProducts = productService.filterByPriceRange(10, 500);
        assertEquals(0, filteredProducts.size());
    }

    @Test
    public void testSortByPrice() {
        List<String> sortedProducts = productService.sortByPrice();
        assertEquals(2, sortedProducts.size());
        assertEquals("Shawl", sortedProducts.get(0)); // Should be first (lowest price)
        assertEquals("Ball Gown", sortedProducts.get(1)); // Should be second (higher price)
    }

    @Test
    public void testGetAllProducts() {
        List<Product> allProducts = productService.getAllProducts();
        assertEquals(2, allProducts.size());
        
        // Verify all sample data is present
        boolean hasBallGown = false;
        boolean hasShawl = false;
        
        for (Product product : allProducts) {
            if (product.getBarcode().equals("74001755")) {
                hasBallGown = true;
                assertEquals("Ball Gown", product.getItem());
                assertEquals("Full Body Outfits", product.getCategory());
                assertEquals(3548, product.getPrice());
                assertEquals(7, product.getDiscount());
                assertEquals(1, product.getAvailable());
            } else if (product.getBarcode().equals("74002423")) {
                hasShawl = true;
                assertEquals("Shawl", product.getItem());
                assertEquals("Accessories", product.getCategory());
                assertEquals(758, product.getPrice());
                assertEquals(12, product.getDiscount());
                assertEquals(1, product.getAvailable());
            }
        }
        
        assertTrue(hasBallGown, "Ball Gown product not found");
        assertTrue(hasShawl, "Shawl product not found");
    }

    @Test
    public void testGetProductByBarcode() {
        // Test retrieving existing product
        Product product = productService.getProductByBarcode("74001755");
        assertNotNull(product);
        assertEquals("Ball Gown", product.getItem());
        
        // Test retrieving non-existent product
        product = productService.getProductByBarcode("nonexistent");
        assertNull(product);
    }

    @Test
    public void testCreateProduct() {
        // Create a new product
        Product newProduct = new Product("74003999", "T-Shirt", "Tops", 1299, 5, 1);
        Product created = productService.createProduct(newProduct);
        
        assertNotNull(created);
        assertEquals("74003999", created.getBarcode());
        
        // Verify product was added to the list
        List<Product> allProducts = productService.getAllProducts();
        assertEquals(3, allProducts.size());
        
        // Test creating product with existing barcode (should throw exception)
        Product duplicate = new Product("74001755", "Duplicate", "Test", 100, 0, 1);
        assertThrows(IllegalArgumentException.class, () -> {
            productService.createProduct(duplicate);
        });
        
        // Test creating product with invalid data
        Product invalidProduct = new Product(null, "Invalid", "Test", 100, 0, 1);
        assertThrows(IllegalArgumentException.class, () -> {
            productService.createProduct(invalidProduct);
        });
    }

    @Test
    public void testUpdateProduct() {
        // Update existing product
        Product updatedProduct = new Product("74001755", "Updated Ball Gown", "Full Body Outfits", 3999, 10, 0);
        Product result = productService.updateProduct(updatedProduct);
        
        assertNotNull(result);
        assertEquals("Updated Ball Gown", result.getItem());
        assertEquals(3999, result.getPrice());
        assertEquals(10, result.getDiscount());
        assertEquals(0, result.getAvailable());
        
        // Test the updated product is actually in the list
        Product retrieved = productService.getProductByBarcode("74001755");
        assertEquals("Updated Ball Gown", retrieved.getItem());
        
        // Test updating non-existent product
        Product nonExistent = new Product("nonexistent", "Test", "Test", 100, 0, 1);
        Product updateResult = productService.updateProduct(nonExistent);
        assertNull(updateResult);
        
        // Test updating with invalid data
        Product invalidProduct = new Product("74001755", null, "Test", 100, 0, 1);
        assertThrows(IllegalArgumentException.class, () -> {
            productService.updateProduct(invalidProduct);
        });
    }

    @Test
    public void testDeleteProduct() {
        // Delete existing product
        boolean result = productService.deleteProduct("74001755");
        assertTrue(result);
        
        // Verify product was removed
        List<Product> allProducts = productService.getAllProducts();
        assertEquals(1, allProducts.size());
        assertNull(productService.getProductByBarcode("74001755"));
        
        // Test deleting non-existent product
        result = productService.deleteProduct("nonexistent");
        assertFalse(result);
    }
} 