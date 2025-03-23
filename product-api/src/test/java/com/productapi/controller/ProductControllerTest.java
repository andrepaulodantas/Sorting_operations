package com.productapi.controller;

import com.productapi.model.Product;
import com.productapi.service.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ProductController.class)
public class ProductControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private ProductService productService;
    
    @Test
    public void testFilterByPriceRange() throws Exception {
        // Sample products for testing
        Product product1 = new Product("74001755", "Ball Gown", "Full Body Outfits", 3548, 7, 1);
        Product product2 = new Product("74002423", "Shawl", "Accessories", 758, 12, 1);
        
        List<Product> filteredProducts = Arrays.asList(product1);
        
        // Mock service method
        when(productService.filterByPriceRange(1000, 4000)).thenReturn(filteredProducts);
        
        // Test the endpoint
        mockMvc.perform(get("/filter/price/1000/4000")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].barcode").value("74001755"))
                .andExpect(jsonPath("$[0].item").value("Ball Gown"));
    }
    
    @Test
    public void testFilterByPriceRangeInvalidParameters() throws Exception {
        // Test with invalid range
        mockMvc.perform(get("/filter/price/abc/xyz")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
        
        // Test with negative values
        mockMvc.perform(get("/filter/price/-100/500")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
        
        // Test with inverted range
        mockMvc.perform(get("/filter/price/1000/500")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }
    
    @Test
    public void testSortByPrice() throws Exception {
        // Mock sorted product names
        List<String> sortedProductNames = Arrays.asList("Shawl", "Ball Gown");
        
        // Mock service method
        when(productService.sortByPrice()).thenReturn(sortedProductNames);
        
        // Test the endpoint
        mockMvc.perform(get("/sort/price")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0]").value("Shawl"))
                .andExpect(jsonPath("$[1]").value("Ball Gown"));
    }
    
    @Test
    public void testGetAllProducts() throws Exception {
        // Sample products for testing
        Product product1 = new Product("74001755", "Ball Gown", "Full Body Outfits", 3548, 7, 1);
        Product product2 = new Product("74002423", "Shawl", "Accessories", 758, 12, 1);
        
        List<Product> allProducts = Arrays.asList(product1, product2);
        
        // Mock service method
        when(productService.getAllProducts()).thenReturn(allProducts);
        
        // Test the endpoint
        mockMvc.perform(get("/products")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[*].item", containsInAnyOrder("Ball Gown", "Shawl")));
    }
} 