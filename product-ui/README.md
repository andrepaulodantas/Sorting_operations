# Product UI

This is the frontend component of the Product Management System, built with React, TypeScript, and Tailwind CSS. It provides a modern, responsive user interface for managing products.

## Features

- View all products in a stylish, responsive table
- Filter products by price range
- View products sorted by price
- Modern dark mode UI
- Mock authentication system
- Toast notifications for user feedback
- Responsive design for all device sizes

## Project Structure

```
product-ui/
├── public/                    # Static assets
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── Layout.tsx         # Main layout component
│   │   ├── LoadingSpinner.tsx # Loading indicator
│   │   ├── PriceFilter.tsx    # Price filter form
│   │   ├── ProductForm.tsx    # Product creation/edit form
│   │   ├── ProductTable.tsx   # Table for displaying products
│   │   ├── ProtectedRoute.tsx # Authentication route guard
│   │   └── SortedProductList.tsx # Sorted products view
│   ├── context/
│   │   └── AuthContext.tsx    # Authentication context
│   ├── pages/                 # Page components
│   │   ├── FilterPage.tsx     # Price filtering page
│   │   ├── HomePage.tsx       # Main product listing
│   │   ├── LoginPage.tsx      # User login
│   │   ├── ManageProductsPage.tsx # Product management
│   │   ├── NotFoundPage.tsx   # 404 page
│   │   ├── RegisterPage.tsx   # User registration
│   │   └── SortedPage.tsx     # Price-sorted listing
│   ├── services/
│   │   └── api.ts             # API service with Axios
│   ├── store/                 # Redux store
│   │   ├── index.ts           # Store configuration
│   │   └── productSlice.ts    # Product state management
│   ├── types/                 # TypeScript type definitions
│   │   └── index.ts           # Common types
│   ├── utils/
│   │   └── productAdapter.ts  # Data format adapter
│   ├── App.tsx                # Main application component
│   ├── index.css              # Global styles
│   └── main.tsx               # Application entry point
├── Dockerfile                 # Container definition
├── nginx.conf                 # Nginx configuration
├── package.json               # Dependencies and scripts
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── vite.config.ts             # Vite bundler configuration
```

## Technical Implementation

### State Management

The application uses Redux Toolkit for state management, with the following structure:

- **Store**: Central state container
- **Slices**: Feature-based state segments
- **Thunks**: Async action creators for API calls

### Authentication

A mock authentication system is implemented using:

- **AuthContext**: Provides auth state and methods
- **Protected Routes**: Guards authenticated routes
- **LocalStorage**: Persists user session between refreshes

### API Communication

Communication with the backend is handled through:

- **Axios**: HTTP client for API requests
- **Interceptors**: Adds authentication headers
- **Error Handling**: Consistent error management
- **Adapters**: Converts between API and UI data formats

### UI Components

The UI is built with these key components:

- **Layout**: App shell with navigation
- **ProductTable**: Displays product data in tabular format
- **PriceFilter**: Form for filtering by price range
- **ProductForm**: Form for creating/editing products
- **LoadingSpinner**: Loading indicator
- **Toast Notifications**: User feedback system

## Building and Running

### Prerequisites

- Node.js 16+ and npm
- Internet connection for package installation

### Development Mode

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The development server will start at http://localhost:3000

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Using Docker

```bash
# Build the Docker image
docker build -t product-ui .

# Run the container
docker run -p 80:80 product-ui
```

## Environment Configuration

The application can be configured through Vite's environment variables:

- `VITE_API_URL`: Base URL for the backend API (default: http://localhost:8080)
- `VITE_APP_TITLE`: Application title

Create a `.env` file in the project root to set these variables:

```
VITE_API_URL=http://your-api-server:8080
VITE_APP_TITLE=My Product Manager
```

## Styling

The UI is styled using:

- **Tailwind CSS**: Utility-first CSS framework
- **Custom Components**: Consistent styling system
- **Dark Mode**: Dark theme for better user experience
- **Responsive Design**: Adapts to different screen sizes

## API Integration

The frontend integrates with these backend endpoints:

### Products

- `GET /products`: Fetch all products
- `GET /products/{barcode}`: Fetch a specific product
- `POST /products`: Create a new product
- `PUT /products/{barcode}`: Update a product
- `DELETE /products/{barcode}`: Delete a product

### Filtering and Sorting

- `GET /filter/price/{min}/{max}`: Filter products by price range
- `GET /sort/price`: Get products sorted by price

## Authentication Flow

The authentication flow includes:

1. **Registration**: Create new user account (mocked)
2. **Login**: Authenticate user and get token (mocked)
3. **Session**: Store user data and token in localStorage
4. **Protected Routes**: Redirect unauthenticated users to login
5. **Logout**: Clear user session

## Error Handling

Errors are handled through:

- **Try/Catch Blocks**: Around API calls
- **Toast Notifications**: Display error messages to users
- **Fallback UI**: Show friendly messages on error

## Extending the UI

To add new features to the UI:

1. Add new components in `/src/components`
2. Create new pages in `/src/pages`
3. Add new API methods in `/src/services/api.ts`
4. Update Redux store in `/src/store` if needed
5. Add new routes in `App.tsx`
