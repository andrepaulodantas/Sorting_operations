// This script will run when MongoDB container starts for the first time
// It creates the root user and initializes the product database

print("Starting MongoDB initialization...");

// Drop the database if it exists to avoid index conflicts
db = db.getSiblingDB('productdb');
db.dropDatabase();

// Create a new database and collections
db = db.getSiblingDB('productdb');

// Create the collections
db.createCollection('products');
db.createCollection('users');
db.createCollection('conversations');
db.createCollection('messages');

// Create a user for authentication
db.createUser({
  user: 'root',
  pwd: 'example',
  roles: [
    { role: 'readWrite', db: 'productdb' },
    { role: 'dbAdmin', db: 'productdb' }
  ]
});

// Insert some initial data
db.products.insertMany([
  {
    barcode: "74001755",
    name: "Ball Gown",
    category: "Full Body Outfits",
    price: 3548,
    discount: 7,
    available: 1
  },
  {
    barcode: "74001756",
    name: "Summer Dress",
    category: "Full Body Outfits",
    price: 2500,
    discount: 5,
    available: 3
  },
  {
    barcode: "74001757",
    name: "Winter Coat",
    category: "Outerwear",
    price: 4000,
    discount: 10,
    available: 5
  }
]);

print("MongoDB initialization complete!");
