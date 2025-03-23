package com.productapi.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.productapi.TestConfig;
import com.productapi.model.Product;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Import(TestConfig.class)
@ActiveProfiles("test")
public class ProductAPIIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testCreateAndRetrieveProduct() throws Exception {
        // Create a new product
        Product newProduct = new Product("74003999", "Test Product", "Test Category", 1299, 5, 1);
        
        // Test creating the product
        mockMvc.perform(post("/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newProduct)))
                .andExpect(status().isCreated());
        
        // Test retrieving the product
        mockMvc.perform(get("/products/74003999")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.barcode").value("74003999"))
                .andExpect(jsonPath("$.item").value("Test Product"))
                .andExpect(jsonPath("$.category").value("Test Category"))
                .andExpect(jsonPath("$.price").value(1299))
                .andExpect(jsonPath("$.discount").value(5))
                .andExpect(jsonPath("$.available").value(1));
    }

    @Test
    public void testFullCrudLifecycle() throws Exception {
        // 1. Create a new product
        Product newProduct = new Product("74008901", "CRUD Test", "Test Category", 2499, 10, 1);
        String productJson = objectMapper.writeValueAsString(newProduct);

        mockMvc.perform(post("/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(productJson))
                .andExpect(status().isCreated());

        // 2. Retrieve the product
        mockMvc.perform(get("/products/74008901"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.item", is("CRUD Test")));

        // 3. Update the product
        newProduct.setItem("Updated CRUD Test");
        newProduct.setPrice(2999);
        productJson = objectMapper.writeValueAsString(newProduct);

        mockMvc.perform(put("/products/74008901")
                .contentType(MediaType.APPLICATION_JSON)
                .content(productJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.item", is("Updated CRUD Test")))
                .andExpect(jsonPath("$.price", is(2999)));

        // 4. Delete the product
        mockMvc.perform(delete("/products/74008901"))
                .andExpect(status().isOk());

        // 5. Verify product is deleted
        mockMvc.perform(get("/products/74008901"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testFilterByPriceRange() throws Exception {
        // Create products with different prices
        Product lowPriceProduct = new Product("74001001", "Low Price", "Test", 500, 0, 1);
        Product midPriceProduct = new Product("74001002", "Mid Price", "Test", 1000, 0, 1);
        Product highPriceProduct = new Product("74001003", "High Price", "Test", 1500, 0, 1);

        // Add all products
        mockMvc.perform(post("/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(lowPriceProduct)))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(midPriceProduct)))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(highPriceProduct)))
                .andExpect(status().isCreated());

        // Test filter by price range (should return mid price and any existing products in this range)
        mockMvc.perform(get("/filter/price/750/1200"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.barcode=='74001002')]").exists()) // Ensure our midPriceProduct exists
                .andExpect(jsonPath("$[?(@.item=='Mid Price')]").exists());  // Another way to verify the same

        // Test filter by price range (should return all created products and possibly others)
        mockMvc.perform(get("/filter/price/0/2000"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.barcode=='74001001')]").exists())
                .andExpect(jsonPath("$[?(@.barcode=='74001002')]").exists())
                .andExpect(jsonPath("$[?(@.barcode=='74001003')]").exists());

        // Test filter by price range (should return high and mid price products and possibly others)
        mockMvc.perform(get("/filter/price/1000/2000"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.barcode=='74001002')]").exists())
                .andExpect(jsonPath("$[?(@.barcode=='74001003')]").exists());

        // Test invalid range parameters
        mockMvc.perform(get("/filter/price/abc/xyz"))
                .andExpect(status().isBadRequest());

        mockMvc.perform(get("/filter/price/-100/500"))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testSortByPrice() throws Exception {
        // Create test products if not already present
        try {
            mockMvc.perform(post("/products")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(
                            new Product("74001011", "Expensive", "Test", 3000, 0, 1))))
                    .andExpect(status().isCreated());

            mockMvc.perform(post("/products")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(
                            new Product("74001012", "Cheap", "Test", 500, 0, 1))))
                    .andExpect(status().isCreated());

            mockMvc.perform(post("/products")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(
                            new Product("74001013", "Medium", "Test", 1500, 0, 1))))
                    .andExpect(status().isCreated());
        } catch (Exception e) {
            // Products might already exist, continue with test
        }

        // Test sort by price endpoint
        MvcResult result = mockMvc.perform(get("/sort/price"))
                .andExpect(status().isOk())
                .andReturn();

        String content = result.getResponse().getContentAsString();
        String[] sortedProducts = objectMapper.readValue(content, String[].class);

        // Verify sorting
        assertTrue(sortedProducts.length > 0);
        
        // Get prices to verify sorting
        int previousPrice = Integer.MIN_VALUE;
        for (String productName : sortedProducts) {
            // Find the product price by name (this would be more efficient with a direct endpoint)
            MvcResult productsResult = mockMvc.perform(get("/products"))
                    .andExpect(status().isOk())
                    .andReturn();
            
            Product[] products = objectMapper.readValue(productsResult.getResponse().getContentAsString(), Product[].class);
            for (Product product : products) {
                if (product.getItem().equals(productName)) {
                    assertTrue(product.getPrice() >= previousPrice, 
                            "Products should be sorted by price in ascending order");
                    previousPrice = product.getPrice();
                    break;
                }
            }
        }
    }

    @Test
    public void testInvalidRequests() throws Exception {
        // Test creating product with missing required field
        Product invalidProduct = new Product("74007890", null, "Test", 999, 0, 1);
        mockMvc.perform(post("/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidProduct)))
                .andExpect(status().isBadRequest());

        // Test attempting to update non-existent product
        Product nonExistentProduct = new Product("99999999", "Non-existent", "Test", 999, 0, 1);
        mockMvc.perform(put("/products/99999999")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(nonExistentProduct)))
                .andExpect(status().isNotFound());

        // Test deleting non-existent product
        mockMvc.perform(delete("/products/99999999"))
                .andExpect(status().isNotFound());
    }
} 