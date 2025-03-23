#!/bin/bash

# Terminal colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

HOST="http://localhost:8080"

echo -e "${BLUE}=== Product API Testing Script ===${NC}\n"

# Test 1: Get all products
echo -e "${GREEN}Test 1: Getting all products${NC}"
echo "Endpoint: GET /products"
echo "Command: curl -s $HOST/products"
echo "Expected result: List of all products"
echo -e "Response:\n"
curl -s $HOST/products | python3 -m json.tool || echo -e "${RED}Request failed${NC}"
echo -e "\n"

# Test 2: Filter products by price range
echo -e "${GREEN}Test 2: Filtering products by price range${NC}"
echo "Endpoint: GET /filter/price/{initial_range}/{final_range}"
echo "Command: curl -s $HOST/filter/price/1000/3000"
echo "Expected result: Products with price between $10 and $30"
echo -e "Response:\n"
curl -s $HOST/filter/price/1000/3000 | python3 -m json.tool || echo -e "${RED}Request failed${NC}"
echo -e "\n"

# Test 3: Sort products by price
echo -e "${GREEN}Test 3: Getting products sorted by price${NC}"
echo "Endpoint: GET /sort/price"
echo "Command: curl -s $HOST/sort/price"
echo "Expected result: Product names sorted by price (ascending)"
echo -e "Response:\n"
curl -s $HOST/sort/price | python3 -m json.tool || echo -e "${RED}Request failed${NC}"
echo -e "\n"

# Test 4: Invalid price range
echo -e "${GREEN}Test 4: Testing error handling - invalid price range${NC}"
echo "Endpoint: GET /filter/price/{initial_range}/{final_range}"
echo "Command: curl -s $HOST/filter/price/3000/1000"
echo "Expected result: Error message about invalid price range"
echo -e "Response:\n"
curl -s $HOST/filter/price/3000/1000 || echo -e "${RED}Request failed${NC}"
echo -e "\n"

# Test 5: Invalid price format
echo -e "${GREEN}Test 5: Testing error handling - invalid price format${NC}"
echo "Endpoint: GET /filter/price/{initial_range}/{final_range}"
echo "Command: curl -s $HOST/filter/price/abc/xyz"
echo "Expected result: Error message about invalid parameters"
echo -e "Response:\n"
curl -s $HOST/filter/price/abc/xyz || echo -e "${RED}Request failed${NC}"
echo -e "\n"

echo -e "${BLUE}=== Test completed ===${NC}\n" 