package com.productapi.service;

import com.productapi.model.Product;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.annotation.PostConstruct;

/**
 * Implementation of the ProductService interface
 */
@Service
public class ProductServiceImpl implements ProductService {
    
    private static final Logger log = LoggerFactory.getLogger(ProductServiceImpl.class);
    
    // In-memory product list for demo purposes
    private List<Product> products = new ArrayList<>();
    
    /**
     * Initialize some sample product data
     */
    @PostConstruct
    public void init() {
        if (products.isEmpty()) {
            log.info("Inicializando lista de produtos in-memory como fallback devido a falha de conexão com MongoDB");
            
            // Produtos disponíveis
            products.add(new Product("74001755", "Ball Gown", "Full Body Outfits", 3548, 7, 1));
            products.add(new Product("74001756", "Summer Dress", "Full Body Outfits", 2500, 5, 1));
            products.add(new Product("74001757", "Winter Coat", "Outerwear", 4000, 10, 1));
            products.add(new Product("74002423", "Silk Scarf", "Accessories", 890, 15, 1));
            products.add(new Product("74003512", "Leather Jacket", "Outerwear", 2250, 5, 1));
            products.add(new Product("74004298", "Cotton T-Shirt", "Casual Wear", 450, 0, 1));
            
            // Produtos não disponíveis
            products.add(new Product("74005123", "Denim Jeans", "Casual Wear", 1200, 10, 0));
            products.add(new Product("74006789", "Wool Sweater", "Winter Collection", 1750, 12, 0));
            products.add(new Product("74007890", "Designer Sunglasses", "Accessories", 1580, 8, 0));
        }
    }
    
    @Override
    public List<Product> filterByPriceRange(int initialRange, int finalRange) {
        return products.stream()
                .filter(product -> product.getPrice() >= initialRange && product.getPrice() <= finalRange)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<String> sortByPrice() {
        return products.stream()
                .sorted(Comparator.comparing(Product::getPrice))
                .map(Product::getItem)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<Product> getAllProducts() {
        return new ArrayList<>(products);
    }
    
    @Override
    public Product getProductByBarcode(String barcode) {
        return products.stream()
                .filter(product -> product.getBarcode().equals(barcode))
                .findFirst()
                .orElse(null);
    }
    
    @Override
    public Product createProduct(Product product) {
        // Validate product data
        validateProduct(product);
        
        // Check if barcode already exists
        if (products.stream().anyMatch(p -> p.getBarcode().equals(product.getBarcode()))) {
            throw new IllegalArgumentException("Product with barcode " + product.getBarcode() + " already exists");
        }
        
        // Add product to list
        products.add(product);
        return product;
    }
    
    @Override
    public Product updateProduct(Product product) {
        // Validate product data
        validateProduct(product);
        
        // Find and update product
        for (int i = 0; i < products.size(); i++) {
            if (products.get(i).getBarcode().equals(product.getBarcode())) {
                products.set(i, product);
                return product;
            }
        }
        
        // Return null if product not found
        return null;
    }
    
    @Override
    public boolean deleteProduct(String barcode) {
        int initialSize = products.size();
        products.removeIf(product -> product.getBarcode().equals(barcode));
        return products.size() < initialSize;
    }
    
    /**
     * Validate product data
     * 
     * @param product the product to validate
     * @throws IllegalArgumentException if product data is invalid
     */
    private void validateProduct(Product product) {
        if (product == null) {
            throw new IllegalArgumentException("Product cannot be null");
        }
        
        if (product.getBarcode() == null || product.getBarcode().trim().isEmpty()) {
            throw new IllegalArgumentException("Product barcode is required");
        }
        
        if (product.getItem() == null || product.getItem().trim().isEmpty()) {
            throw new IllegalArgumentException("Product name is required");
        }
        
        if (product.getCategory() == null || product.getCategory().trim().isEmpty()) {
            throw new IllegalArgumentException("Product category is required");
        }
        
        if (product.getPrice() == null || product.getPrice() < 0) {
            throw new IllegalArgumentException("Product price must be a non-negative value");
        }
        
        if (product.getDiscount() == null || product.getDiscount() < 0 || product.getDiscount() > 100) {
            throw new IllegalArgumentException("Product discount must be between 0 and 100");
        }
        
        if (product.getAvailable() == null || (product.getAvailable() != 0 && product.getAvailable() != 1)) {
            throw new IllegalArgumentException("Product availability must be 0 (unavailable) or 1 (available)");
        }
    }
} 