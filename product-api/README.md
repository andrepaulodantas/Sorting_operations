# Product API

This is the backend component of the Product Management System, built with Spring Boot. It provides a REST API for managing products, including retrieving, filtering, and sorting functionalities.

## Features

- RESTful API for product management
- Filter products by price range
- Sort products by price
- In-memory data storage for simplicity
- Comprehensive error handling
- Unit and integration tests

## Project Structure

```
product-api/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── productapi/
│   │   │           ├── config/           # Configuration classes
│   │   │           ├── controller/       # REST controllers
│   │   │           ├── model/            # Data models
│   │   │           ├── service/          # Business logic
│   │   │           └── ProductApiApplication.java
│   │   └── resources/
│   │       ├── application.properties    # Main configuration
│   │       └── application-docker.properties # Docker-specific config
│   └── test/
│       └── java/
│           └── com/
│               └── productapi/
│                   ├── controller/       # Controller tests
│                   └── service/          # Service tests
├── Dockerfile                        # Container definition
├── pom.xml                           # Maven dependencies
└── run.sh                            # Utility script
```

## Technical Implementation

### REST API Design

The API follows REST principles with appropriate HTTP methods and status codes:

- `GET` for retrieving resources
- `POST` for creating resources
- `PUT` for updating resources
- `DELETE` for removing resources

Status codes are used according to best practices:

- `200 OK` for successful operations
- `201 Created` for successful resource creation
- `204 No Content` for successful deletion
- `400 Bad Request` for invalid inputs
- `404 Not Found` for non-existent resources

### Data Model

The main data model is the `Product` class, which includes:

```java
public class Product {
    private String barcode;      // Unique identifier
    private String item;         // Product name
    private String category;     // Product category
    private Integer price;       // Price in cents
    private Integer discount;    // Discount percentage
    private Integer available;   // Availability status (0 or 1)
}
```

### Service Layer

The service layer implements the business logic with methods for:

- Retrieving all products
- Filtering products by price range
- Sorting products by price
- Creating, updating, and deleting products

### Controller Layer

Controllers handle HTTP requests and responses:

- `ProductController` - Main API endpoints for managing products

### Security Configuration

Security is configured to:

- Allow public access to product-related endpoints
- Properly handle CORS for cross-origin requests
- Basic authentication for secured endpoints

## API Endpoints

### Product Operations

#### Get All Products

```
GET /products
```

Returns all products in the catalog.

**Response:**

- `200 OK` with array of products

#### Get Product by Barcode

```
GET /products/{barcode}
```

Returns a specific product by barcode.

**Response:**

- `200 OK` with product details
- `404 Not Found` if product does not exist

#### Create Product

```
POST /products
```

Creates a new product.

**Request Body:**

```json
{
  "barcode": "12345678",
  "item": "New Product",
  "category": "Category",
  "price": 1999,
  "discount": 0,
  "available": 1
}
```

**Response:**

- `201 Created` with created product
- `400 Bad Request` if request is invalid

#### Update Product

```
PUT /products/{barcode}
```

Updates an existing product.

**Request Body:**

```json
{
  "barcode": "12345678",
  "item": "Updated Product",
  "category": "Category",
  "price": 1999,
  "discount": 10,
  "available": 1
}
```

**Response:**

- `200 OK` with updated product
- `404 Not Found` if product does not exist
- `400 Bad Request` if request is invalid

#### Delete Product

```
DELETE /products/{barcode}
```

Deletes a product.

**Response:**

- `204 No Content` on successful deletion
- `404 Not Found` if product does not exist

### Filtering and Sorting

#### Filter Products by Price Range

```
GET /filter/price/{initial_range}/{final_range}
```

Returns products within the specified price range.

**Parameters:**

- `initial_range`: Minimum price (cents)
- `final_range`: Maximum price (cents)

**Response:**

- `200 OK` with filtered products
- `400 Bad Request` if range is invalid

#### Sort Products by Price

```
GET /sort/price
```

Returns product names sorted by price in ascending order.

**Response:**

- `200 OK` with sorted product names

## Building and Running

### Prerequisites

- Java 11 JDK
- Maven

### Using Maven

```bash
# Build the application
mvn clean install

# Run the application
mvn spring-boot:run
```

### Using the run.sh Script

```bash
# Build the application
./run.sh build

# Run the application
./run.sh run

# Run tests
./run.sh test
```

### Using Docker

```bash
# Build the Docker image
docker build -t product-api .

# Run the container
docker run -p 8080:8080 product-api
```

## Testing

### Running Tests

```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=ProductControllerTest
```

### Test Coverage

The test suite includes:

- Unit tests for services
- Integration tests for controllers
- Test cases for normal and edge conditions

## Extending the API

To add new functionality:

1. Define new methods in the appropriate service interface
2. Implement the methods in the service implementation
3. Add new endpoints in the controller
4. Create tests for the new functionality
