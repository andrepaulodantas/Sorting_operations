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

## Frontend UI (product-ui)

The frontend application provides a modern UI built with:

- React 18 with TypeScript
- Redux for state management
- Tailwind CSS for styling
- React Router for navigation
- Axios for API communication

### Frontend Features

- Responsive design that works on mobile and desktop
- Product listing with filtering and sorting
- Authentication with login and registration
- Product management CRUD interface
- Dark mode theme

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

## Technical Decisions

### Backend

- **Spring Boot**: Provides a robust framework for building REST APIs
- **In-memory storage**: Used for simplicity, can be replaced with MongoDB
- **Spring Security**: Secures the API endpoints
- **JWT Authentication**: Used for stateless authentication

### Frontend

- **React with TypeScript**: Provides type safety and better developer experience
- **Redux Toolkit**: Simplifies state management
- **Tailwind CSS**: Enables rapid UI development
- **Axios**: Simplifies API communication

## Future Enhancements

1. Advanced filtering and search capabilities
2. Real-time notifications using WebSockets
3. Product image upload and management
4. User roles and permissions
5. Analytics dashboard
6. Internationalization support

## License

This project is licensed under the MIT License - see the LICENSE file for details.
