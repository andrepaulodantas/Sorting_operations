#!/bin/bash

# Color codes for output formatting
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}====== Running comprehensive test suite for Product Application ======${NC}"

# Function to print section headers
print_header() {
  echo -e "\n${YELLOW}====== $1 ======${NC}\n"
}

# Run Backend Tests
print_header "Running Backend Tests (Product API)"
cd product-api || { echo -e "${RED}Failed to find product-api directory${NC}"; exit 1; }

echo "Maven test with coverage reporting..."
mvn clean test jacoco:report

if [ $? -eq 0 ]; then
  echo -e "${GREEN}Backend tests completed successfully!${NC}"
  echo "Test coverage report available at: ./target/site/jacoco/index.html"
else
  echo -e "${RED}Backend tests failed!${NC}"
  backend_failed=true
fi

# Return to parent directory
cd ..

# Run Frontend Tests
print_header "Running Frontend Tests (Product UI)"
cd product-ui || { echo -e "${RED}Failed to find product-ui directory${NC}"; exit 1; }

echo "Installing dependencies if needed..."
npm install --silent

echo "Running frontend tests with coverage..."
npm test

if [ $? -eq 0 ]; then
  echo -e "${GREEN}Frontend tests completed successfully!${NC}"
  echo "Running coverage report..."
  npm run test:coverage
  echo "Test coverage report available at: ./coverage/index.html"
else
  echo -e "${RED}Frontend tests failed!${NC}"
  frontend_failed=true
fi

# Return to parent directory
cd ..

# Summary
print_header "Test Suite Summary"

if [ "$backend_failed" = true ] || [ "$frontend_failed" = true ]; then
  echo -e "${RED}Some tests failed. Please check the logs above for details.${NC}"
  
  if [ "$backend_failed" = true ]; then
    echo -e "${RED}- Backend tests failed${NC}"
  else
    echo -e "${GREEN}- Backend tests passed${NC}"
  fi
  
  if [ "$frontend_failed" = true ]; then
    echo -e "${RED}- Frontend tests failed${NC}"
  else
    echo -e "${GREEN}- Frontend tests passed${NC}"
  fi
  
  exit 1
else
  echo -e "${GREEN}All tests passed successfully!${NC}"
  echo "Test reports are available in their respective directories."
  exit 0
fi 