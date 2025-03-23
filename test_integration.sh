#!/bin/bash

# Terminal colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Product API Integration Testing ===${NC}\n"

# Check if Docker is running
echo -e "${YELLOW}Checking if Docker is running...${NC}"
if ! docker info > /dev/null 2>&1; then
  echo -e "${RED}Docker is not running. Please start Docker first.${NC}"
  exit 1
fi

# Start the backend API
echo -e "${YELLOW}Starting backend API...${NC}"
docker-compose -f docker-compose.test.yml up -d --build

# Wait for the API to be ready
echo -e "${YELLOW}Waiting for API to be ready...${NC}"
attempt=1
max_attempts=30
until curl -s http://localhost:8080/products > /dev/null || [ $attempt -eq $max_attempts ]; do
  echo "Attempt $attempt of $max_attempts: Waiting for API to start..."
  sleep 2
  ((attempt++))
done

if [ $attempt -eq $max_attempts ]; then
  echo -e "${RED}API did not start in the expected time. Please check logs with 'docker-compose -f docker-compose.test.yml logs backend'${NC}"
  exit 1
fi

echo -e "${GREEN}API is ready!${NC}\n"

# Verify API endpoints are working
echo -e "${YELLOW}Testing API endpoints...${NC}"
./test_api.sh

echo -e "\n${YELLOW}Starting frontend development server...${NC}"
echo -e "${YELLOW}Please follow these instructions:${NC}"
echo -e "1. Open a new terminal"
echo -e "2. Navigate to the product-ui directory: ${GREEN}cd product-ui${NC}"
echo -e "3. Install dependencies: ${GREEN}npm install${NC}"
echo -e "4. Start the development server: ${GREEN}npm run dev${NC}"
echo -e "5. Open your browser at: ${GREEN}http://localhost:3000${NC}"
echo -e "\n${YELLOW}When you're done testing, come back to this terminal and press any key to stop the API server.${NC}"

# Wait for user input
read -n 1 -s -r -p "Press any key to stop the API server..."
echo ""

# Stop the backend API
echo -e "\n${YELLOW}Stopping backend API...${NC}"
docker-compose -f docker-compose.test.yml down

echo -e "\n${BLUE}=== Testing completed ===${NC}" 