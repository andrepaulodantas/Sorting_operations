# Testing Guide for Product Management System

This document provides detailed instructions for testing both the backend API and frontend UI of the Product Management System.

## Overview

The testing is divided into three main sections:

1. **API Testing**: Testing the backend REST API endpoints with curl commands
2. **Frontend Testing**: Testing the React UI components
3. **Integration Testing**: Testing the interaction between frontend and backend

## Prerequisites

- Docker and Docker Compose
- Node.js and npm
- curl
- Python 3 (for JSON formatting)

## Backend API Testing

### Using the Test Script

We've provided a script that tests all API endpoints:

```bash
# Navigate to the Java directory
cd Java

# Make the script executable
chmod +x test_api.sh

# Run the tests
./test_api.sh
```

This script will:

- Test getting all products
- Test filtering products by price range
- Test sorting products by price
- Test error handling with invalid inputs

### Manual API Testing

You can also manually test the API endpoints using curl:

```bash
# Get all products
curl -s http://localhost:8080/products | python3 -m json.tool

# Filter products by price range (between $10 and $30)
curl -s http://localhost:8080/filter/price/1000/3000 | python3 -m json.tool

# Sort products by price
curl -s http://localhost:8080/sort/price | python3 -m json.tool
```

## Frontend Testing

### Unit Tests

The frontend includes unit tests for components:

```bash
# Navigate to the product-ui directory
cd Java/product-ui

# Install dependencies
npm install

# Run tests
npm test
```

Key components with tests:

- ProductTable - tests rendering with or without data
- PriceFilter - tests validation logic
- FilterPage - tests interaction with Redux store

### Manual UI Testing

To test the UI manually:

```bash
# Navigate to the product-ui directory
cd Java/product-ui

# Install dependencies
npm install

# Start development server
npm run dev
```

Testing checklist:

- View the product catalog on the homepage
- Try filtering products by different price ranges
- View products sorted by price
- Test mobile responsiveness by resizing the browser
- Verify error handling by disconnecting from the API

## Integration Testing

The integration test script starts the backend and guides you through testing the frontend:

```bash
# Navigate to the Java directory
cd Java

# Make the script executable
chmod +x test_integration.sh

# Run the integration test
./test_integration.sh
```

This script will:

1. Start the backend API using Docker
2. Test the API endpoints are working
3. Guide you through starting and testing the frontend

## Troubleshooting

### API Issues

- If the API isn't responding, check if the Docker container is running:
  ```bash
  docker ps | grep product-api
  ```
- View logs from the API container:
  ```bash
  docker-compose -f docker-compose.test.yml logs backend
  ```

### Frontend Issues

- Check console errors in the browser's developer tools
- Verify API endpoints are accessible from the browser
- Check for network issues in the Network tab
- Try clearing browser cache and reloading

## Continuous Integration

For automated testing, you can add these scripts to your CI pipeline:

```yaml
# Example CI step
test:
  script:
    - cd Java
    - docker-compose -f docker-compose.test.yml up -d
    - sleep 10 # Wait for API to start
    - ./test_api.sh
    - cd product-ui
    - npm install
    - npm test
    - docker-compose -f ../docker-compose.test.yml down
```

## Additional Testing Resources

- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Redux Testing](https://redux.js.org/usage/writing-tests)
- [curl Documentation](https://curl.se/docs/manpage.html)
