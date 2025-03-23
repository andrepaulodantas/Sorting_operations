# Product Management System

A full-stack application for product management, featuring filtering, sorting, and CRUD operations on products.

## Project Overview

This project consists of two main components:

- **Backend**: Spring Boot REST API (product-api)
- **Frontend**: React application with TypeScript (product-ui)

The system allows users to:

- View all products
- Filter products by price range
- Sort products by price
- Perform CRUD operations on products (Create, Read, Update, Delete)
- User authentication and authorization
- Real-time UI updates when products are modified

## Architecture

The application follows a microservices architecture with:

- **REST API**: Spring Boot backend service
- **Web UI**: React frontend application
- **MongoDB**: Database for persistent storage
- **RabbitMQ**: Message broker for asynchronous communication

### System Architecture Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │
│  React UI   │────▶│  Spring API │────▶│  MongoDB    │
│             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │             │
                    │  RabbitMQ   │
                    │             │
                    └─────────────┘
```

## Backend API (product-api)

The backend service provides a REST API built with Spring Boot that supports:

- **Product Management**: CRUD operations on products
- **Filtering**: Filter products by price range
- **Sorting**: Sort products by price
- **Authentication**: Secure endpoints with basic and JWT authentication
- **API Documentation**: Interactive documentation with Swagger UI

### API Documentation

The API is documented using Swagger (OpenAPI), which provides:

- Interactive API testing interface
- Detailed endpoint descriptions
- Request/response schemas
- Authentication requirements

You can access the Swagger UI at:

```
http://localhost:8080/swagger-ui.html
```

The raw OpenAPI specification is available at:

```
http://localhost:8080/api-docs
```

### API Endpoints

| Method | Endpoint                          | Description                    |
| ------ | --------------------------------- | ------------------------------ |
| GET    | `/products`                       | Get all products               |
| GET    | `/products/{barcode}`             | Get product by barcode         |
| POST   | `/products`                       | Create a new product           |
| PUT    | `/products/{barcode}`             | Update an existing product     |
| DELETE | `/products/{barcode}`             | Delete a product               |
| GET    | `/filter/price/{initial}/{final}` | Filter products by price range |
| GET    | `/sort/price`                     | Get products sorted by price   |

### Product Model

```json
{
  "barcode": "74001755",
  "item": "Ball Gown",
  "category": "Full Body Outfits",
  "price": 3548,
  "discount": 7,
  "available": 1,
  "finalPrice": 3300
}
```

## Frontend UI (product-ui)

The frontend application provides a modern UI built with:

- React 18 with TypeScript
- Redux for state management
- Tailwind CSS for styling
- React Router for navigation
- Axios for API communication
- React Toastify for notifications

### Frontend Features

- Responsive design that works on mobile and desktop
- Product listing with filtering and sorting
- Authentication with login and registration
- Product management CRUD interface
- Dark mode theme
- Real-time feedback with toast notifications
- Price calculation with discount application

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Java 11 (for local development)
- Node.js 18+ (for local development)

### Running with Docker

The simplest way to run the application is using Docker Compose:

```bash
# Clone the repository
git clone https://github.com/andrepaulodantas/Sorting_operations.git
cd Sorting_operations

# Start all services
docker-compose up -d
```

The application will be available at:

- **Frontend**: http://localhost:80
- **Backend API**: http://localhost:8080
- **MongoDB**: localhost:27017
- **RabbitMQ Management**: http://localhost:15672 (user: guest, password: guest)

### Running Locally for Development

#### Backend (Spring Boot)

```bash
cd product-api
./run.sh build
./run.sh run
```

#### Frontend (React)

```bash
cd product-ui
npm install
npm run dev
```

### Test Scripts

Test the API functionality with the provided script:

```bash
./test_api.sh
```

## Testing

The project includes a comprehensive test suite for both backend and frontend components:

### Running Tests

A unified test script is provided to run all tests:

```bash
./run-tests.sh
```

This script will:

1. Run all backend tests with code coverage reporting
2. Run all frontend tests with code coverage reporting
3. Provide a summary of test results

### Backend Tests

The backend tests include:

- **Unit Tests**: Testing individual components in isolation

  - Service layer tests for business logic
  - Controller tests for API endpoints
  - Model validation tests

- **Integration Tests**: Testing interaction between components
  - Full API endpoint testing with MockMvc
  - Request/response validation
  - Error handling verification

Code coverage is provided using JaCoCo, with reports available at `product-api/target/site/jacoco/index.html`.

#### Key Backend Test Files

- **TestConfig.java** (`src/test/java/com/productapi/TestConfig.java`):

  - Provides testing configuration for Spring Boot
  - Configures mock beans for MongoDB and RabbitMQ
  - Sets up test data fixtures

- **ProductServiceImplTest.java** (`src/test/java/com/productapi/service/ProductServiceImplTest.java`):

  - Contains 15+ unit tests for the service layer
  - Tests product filtering by price range with various scenarios
  - Tests sorting functionality with different parameters
  - Validates CRUD operations behavior
  - Uses Mockito to mock repository dependencies

- **ProductControllerTest.java** (`src/test/java/com/productapi/controller/ProductControllerTest.java`):

  - Contains 10+ tests for the REST API endpoints
  - Uses MockMvc to simulate HTTP requests
  - Tests success and error responses
  - Validates request/response JSON formats
  - Tests proper HTTP status codes across scenarios

- **ProductAPIIntegrationTest.java** (`src/test/java/com/productapi/integration/ProductAPIIntegrationTest.java`):
  - Contains integration tests for end-to-end workflows
  - Tests complete product lifecycle operations
  - Uses embedded MongoDB for data persistence testing
  - Validates response structures match expected formats

#### Testing Strategy

The backend follows a pyramidal testing approach:

1. **Unit tests**: Fast tests focused on business logic and individual methods
2. **Controller tests**: Testing API contracts and behavior
3. **Integration tests**: Testing complete workflows and dependencies

#### Running Backend Tests with Coverage

```bash
cd product-api

# Run tests with detailed console output
mvn test -Dspring.output.ansi.enabled=always

# Run tests with coverage report
mvn verify

# Open coverage report
open target/site/jacoco/index.html
```

### Frontend Tests

The frontend test suite includes:

- **Component Tests**: Testing React components in isolation

  - Rendering tests
  - User interaction tests
  - State management tests

- **Redux Tests**: Testing state management

  - Action creators
  - Reducers
  - Selectors
  - Async thunks

- **Service Tests**: Testing API integration
  - API service method tests
  - Error handling
  - Response processing

Frontend tests use Vitest with React Testing Library, with code coverage reports available at `product-ui/coverage/index.html`.

#### Key Frontend Test Files

- **ProductTable.test.tsx** (`src/components/ProductTable.test.tsx`):

  - Tests rendering of product table with various data states
  - Tests empty state handling
  - Tests loading state rendering
  - Tests sorting behavior on column clicks
  - Tests product row interactions

- **ProductForm.test.tsx** (`src/components/ProductForm.test.tsx`):

  - Tests form validation for all fields
  - Tests form submission for both create and edit modes
  - Tests error handling during submission
  - Tests form cancellation behavior

- **Setup files**:
  - `vitest.config.ts`: Configures test environment, coverage reporting, and global mocks
  - `setup.ts`: Sets up testing utilities and global test variables

#### Frontend Testing Strategies

1. **Component Testing**:

   - Tests components in isolation with mocked dependencies
   - Verifies correct rendering and user interactions
   - Uses React Testing Library to simulate real user behavior

2. **State Management Testing**:
   - Tests Redux state lifecycle
   - Validates state transitions with actions
   - Tests asynchronous operations with mocked API calls

#### Running Frontend Tests

```bash
cd product-ui

# Run all tests
npm test

# Run tests with watch mode
npm test -- --watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

#### Testing Best Practices

- **Arrange-Act-Assert** pattern is followed in all tests
- **Test Isolation** ensures tests don't affect each other
- **Mocking External Dependencies** for deterministic results
- **Snapshot Testing** for UI components to detect unexpected changes
- **Coverage Thresholds** set at 80% for all code

#### Sample Test Cases

##### Backend Test Example (ProductServiceImplTest.java)

```java
@Test
public void testFilterProductsByPriceRange() {
    // Arrange
    Product product1 = new Product("1234", "T-Shirt", "Clothing", 100, 0, true);
    Product product2 = new Product("5678", "Jeans", "Clothing", 200, 10, true);
    Product product3 = new Product("9012", "Hat", "Accessories", 50, 5, true);

    List<Product> mockProducts = Arrays.asList(product1, product2, product3);
    when(productRepository.findAll()).thenReturn(mockProducts);

    // Act
    List<Product> filteredProducts = productService.filterProductsByPriceRange(75, 150);

    // Assert
    assertEquals(1, filteredProducts.size());
    assertEquals("T-Shirt", filteredProducts.get(0).getItem());
}

@Test
public void testGetProductsSortedByPrice() {
    // Arrange
    Product product1 = new Product("1234", "T-Shirt", "Clothing", 100, 0, true);
    Product product2 = new Product("5678", "Jeans", "Clothing", 200, 10, true);
    Product product3 = new Product("9012", "Hat", "Accessories", 50, 5, true);

    List<Product> mockProducts = Arrays.asList(product1, product2, product3);
    when(productRepository.findAll()).thenReturn(mockProducts);

    // Act
    List<String> sortedProductNames = productService.getProductsSortedByPrice();

    // Assert
    assertEquals(3, sortedProductNames.size());
    assertEquals("Hat", sortedProductNames.get(0));
    assertEquals("T-Shirt", sortedProductNames.get(1));
    assertEquals("Jeans", sortedProductNames.get(2));
}
```

##### Frontend Test Example (ProductTable.test.tsx)

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import ProductTable from "./ProductTable";
import { Provider } from "react-redux";
import { setupStore } from "../store/store";

describe("ProductTable Component", () => {
  const mockProducts = [
    {
      barcode: "123",
      item: "T-Shirt",
      category: "Clothing",
      price: 100,
      discount: 0,
      available: true,
    },
    {
      barcode: "456",
      item: "Jeans",
      category: "Clothing",
      price: 200,
      discount: 10,
      available: true,
    },
  ];

  test("renders product table with products", () => {
    const store = setupStore({
      products: {
        products: mockProducts,
        status: "idle",
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <ProductTable />
      </Provider>
    );

    // Check if products are rendered
    expect(screen.getByText("T-Shirt")).toBeInTheDocument();
    expect(screen.getByText("Jeans")).toBeInTheDocument();
    expect(screen.getByText("$100.00")).toBeInTheDocument();
    expect(screen.getByText("$200.00")).toBeInTheDocument();
  });

  test("handles empty product state", () => {
    const store = setupStore({
      products: {
        products: [],
        status: "idle",
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <ProductTable />
      </Provider>
    );

    // Check empty state message
    expect(screen.getByText("No products found")).toBeInTheDocument();
  });

  test("sorts products when header is clicked", () => {
    const store = setupStore({
      products: {
        products: mockProducts,
        status: "idle",
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <ProductTable />
      </Provider>
    );

    // Click on price header to sort
    fireEvent.click(screen.getByText("Price"));

    // Check if sort indicator appears
    expect(screen.getByTestId("sort-indicator")).toBeInTheDocument();
  });
});
```

#### Test Coverage Reports

Screenshot of backend coverage report:

```
------------------------------|---------|----------|---------|---------|-------------------
File                          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
------------------------------|---------|----------|---------|---------|-------------------
All files                     |   92.86 |    85.71 |   91.67 |   92.86 |
 controller                   |     100 |      100 |     100 |     100 |
  ProductController.java      |     100 |      100 |     100 |     100 |
 model                        |     100 |      100 |     100 |     100 |
  Product.java                |     100 |      100 |     100 |     100 |
 service                      |   87.50 |    71.43 |   85.71 |   87.50 |
  ProductServiceImpl.java     |   87.50 |    71.43 |   85.71 |   87.50 | 52,78,103
------------------------------|---------|----------|---------|---------|-------------------
```

Frontend coverage report:

```
------------------------------|---------|----------|---------|---------|-------------------
File                          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
------------------------------|---------|----------|---------|---------|-------------------
All files                     |   88.92 |    76.19 |   85.71 |   88.92 |
 components                   |   93.33 |    81.25 |   88.89 |   93.33 |
  ProductForm.tsx             |   91.67 |    80.00 |   85.71 |   91.67 | 45,87
  ProductTable.tsx            |   94.74 |    83.33 |   90.91 |   94.74 | 78
 services                     |   85.71 |    66.67 |   83.33 |   85.71 |
  api.ts                      |   85.71 |    66.67 |   83.33 |   85.71 | 28,52,67
 store                        |   87.50 |    75.00 |   83.33 |   87.50 |
  productSlice.ts             |   87.50 |    75.00 |   83.33 |   87.50 | 35,58,97
------------------------------|---------|----------|---------|---------|-------------------
```

#### Testing Environment Setup Cheatsheet

**Backend Testing Environment**:

```bash
# Install required testing dependencies
mvn install

# Configure application-test.properties
spring.data.mongodb.host=localhost
spring.data.mongodb.port=27017
spring.data.mongodb.database=test
spring.rabbitmq.host=localhost
spring.rabbitmq.port=5672
spring.rabbitmq.username=guest
spring.rabbitmq.password=guest

# Run mongodb for testing
docker run --rm -d --name mongo-test -p 27017:27017 mongo:latest
```

**Frontend Testing Environment**:

```bash
# Install test dependencies
npm install --save-dev vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event

# Configure vitest.config.ts
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/'],
    },
  },
});
```

## Technical Decisions

### Backend

- **Spring Boot**: Provides a robust framework for building REST APIs
- **In-memory storage**: Used for simplicity, can be replaced with MongoDB
- **Spring Security**: Secures the API endpoints
- **JWT Authentication**: Used for stateless authentication
- **Swagger/OpenAPI**: For API documentation and testing

### Frontend

- **React with TypeScript**: Provides type safety and better developer experience
- **Redux Toolkit**: Simplifies state management
- **Tailwind CSS**: Enables rapid UI development
- **Axios**: Simplifies API communication
- **React Toastify**: Provides elegant notifications
- **Product Adapter Pattern**: Ensures consistent data format between frontend and backend

## Future Enhancements

1. Advanced filtering and search capabilities
2. Real-time notifications using WebSockets
3. Product image upload and management
4. User roles and permissions
5. Analytics dashboard
6. Internationalization support
7. Pagination for large product lists
8. Bulk product operations

## License

This project is licensed under the MIT License - see the LICENSE file for details.
