#!/bin/bash

# Terminal colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

HOST="http://localhost:8080"

echo -e "${BLUE}=== Authentication API Testing Script ===${NC}\n"

# Test user credentials
TEST_USERNAME="testuser"
TEST_PASSWORD="Test@123"

# Test 1: User Registration
echo -e "${GREEN}Test 1: User Registration${NC}"
echo "Endpoint: POST /api/auth/register"
echo "Command: curl -s -X POST -H \"Content-Type: application/json\" -d '{\"username\":\"$TEST_USERNAME\",\"password\":\"$TEST_PASSWORD\"}' $HOST/api/auth/register"
echo "Expected result: User registration confirmation"
echo -e "Response:\n"
REGISTER_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d "{\"username\":\"$TEST_USERNAME\",\"password\":\"$TEST_PASSWORD\"}" $HOST/api/auth/register)
echo $REGISTER_RESPONSE | python3 -m json.tool || echo "$REGISTER_RESPONSE"
echo -e "\n"

# Test 2: User Login
echo -e "${GREEN}Test 2: User Login${NC}"
echo "Endpoint: POST /api/auth/login"
echo "Command: curl -s -X POST -H \"Content-Type: application/json\" -d '{\"username\":\"$TEST_USERNAME\",\"password\":\"$TEST_PASSWORD\"}' $HOST/api/auth/login"
echo "Expected result: Authentication token"
echo -e "Response:\n"
LOGIN_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d "{\"username\":\"$TEST_USERNAME\",\"password\":\"$TEST_PASSWORD\"}" $HOST/api/auth/login)
echo $LOGIN_RESPONSE | python3 -m json.tool || echo "$LOGIN_RESPONSE"
echo -e "\n"

# Extract token if available
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
    echo -e "${YELLOW}Authentication token received: ${TOKEN}${NC}\n"
    
    # Test 3: Access Protected Resource with Token
    echo -e "${GREEN}Test 3: Access Protected Resource with Token${NC}"
    echo "Endpoint: GET /api/user/profile"
    echo "Command: curl -s -H \"Authorization: Bearer $TOKEN\" $HOST/api/user/profile"
    echo "Expected result: User profile information"
    echo -e "Response:\n"
    curl -s -H "Authorization: Bearer $TOKEN" $HOST/api/user/profile | python3 -m json.tool || echo -e "${RED}Request failed${NC}"
    echo -e "\n"
    
    # Test 4: Invalid Token
    echo -e "${GREEN}Test 4: Invalid Token Access${NC}"
    echo "Endpoint: GET /api/user/profile"
    echo "Command: curl -s -H \"Authorization: Bearer invalid_token\" $HOST/api/user/profile"
    echo "Expected result: Unauthorized error"
    echo -e "Response:\n"
    curl -s -H "Authorization: Bearer invalid_token" $HOST/api/user/profile || echo -e "${YELLOW}Expected unauthorized error${NC}"
    echo -e "\n"
    
    # Test 5: Logout
    echo -e "${GREEN}Test 5: User Logout${NC}"
    echo "Endpoint: POST /api/auth/logout"
    echo "Command: curl -s -X POST -H \"Authorization: Bearer $TOKEN\" $HOST/api/auth/logout"
    echo "Expected result: Logout confirmation"
    echo -e "Response:\n"
    curl -s -X POST -H "Authorization: Bearer $TOKEN" $HOST/api/auth/logout | python3 -m json.tool || echo -e "${RED}Request failed${NC}"
    echo -e "\n"
else
    echo -e "${RED}No token received from login. Skipping token-based tests.${NC}\n"
fi

# Test 6: Login with Invalid Credentials
echo -e "${GREEN}Test 6: Login with Invalid Credentials${NC}"
echo "Endpoint: POST /api/auth/login"
echo "Command: curl -s -X POST -H \"Content-Type: application/json\" -d '{\"username\":\"wrong_user\",\"password\":\"wrong_pass\"}' $HOST/api/auth/login"
echo "Expected result: Authentication error"
echo -e "Response:\n"
curl -s -X POST -H "Content-Type: application/json" -d '{"username":"wrong_user","password":"wrong_pass"}' $HOST/api/auth/login || echo -e "${YELLOW}Expected authentication error${NC}"
echo -e "\n"

echo -e "${BLUE}=== Authentication tests completed ===${NC}\n" 