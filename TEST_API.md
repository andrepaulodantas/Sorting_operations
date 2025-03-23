# Testing the Product API

This guide provides instructions for testing the Product API with curl commands.

## Prerequisites

- Docker and Docker Compose (for containerized testing)
- curl (for API requests)
- Python 3 (for JSON formatting)

## Running the API

You can run the API using Docker Compose:

```bash
# Start only the backend API for testing
docker-compose -f docker-compose.test.yml up --build
```

Or you can run it directly using Maven:

```bash
cd product-api
./run.sh run
```

The API will be available at http://localhost:8080.

## Testing with Curl

We've provided a test script that makes curl requests to all endpoints:

```bash
# Make the script executable
chmod +x test_api.sh

# Run the test script
./test_api.sh
```

## Manual Testing with Curl

If you prefer, you can test the endpoints manually:

### Get All Products

```bash
curl -s http://localhost:8080/products | python3 -m json.tool
```

Example response:

```json
[
  {
    "barcode": "74001755",
    "item": "Ball Gown",
    "category": "Full Body Outfits",
    "price": 3548,
    "discount": 7,
    "available": 1
  },
  {
    "barcode": "74002423",
    "item": "Shawl",
    "category": "Accessories",
    "price": 758,
    "discount": 12,
    "available": 1
  },
  ...
]
```

### Filter Products by Price Range

```bash
curl -s http://localhost:8080/filter/price/1000/3000 | python3 -m json.tool
```

Example response:

```json
[
  {
    "barcode": "74003512",
    "item": "Leather Jacket",
    "category": "Outerwear",
    "price": 2250,
    "discount": 5,
    "available": 1
  },
  {
    "barcode": "74005123",
    "item": "Denim Jeans",
    "category": "Bottoms",
    "price": 1200,
    "discount": 10,
    "available": 0
  }
]
```

### Sort Products by Price

```bash
curl -s http://localhost:8080/sort/price | python3 -m json.tool
```

Example response:

```json
[
  "Cotton T-Shirt",
  "Silk Scarf",
  "Shawl",
  "Denim Jeans",
  "Leather Jacket",
  "Ball Gown"
]
```

### Test Error Handling - Invalid Range

```bash
curl -s http://localhost:8080/filter/price/3000/1000
```

Example response:

```
Invalid price range
```

### Test Error Handling - Invalid Format

```bash
curl -s http://localhost:8080/filter/price/abc/xyz
```

Example response:

```
Invalid price range parameters
```

## Testing with the Frontend

After confirming the API is working correctly with curl, you can test the frontend application:

```bash
cd product-ui
npm install
npm run dev
```

The frontend will be available at http://localhost:3000.
