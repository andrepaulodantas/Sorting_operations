// This script will run when MongoDB container starts for the first time
// It creates the root user and initializes the product database

print("Starting MongoDB initialization...");

// Drop the database if it exists to avoid index conflicts
db = db.getSiblingDB("productdb");
db.dropDatabase();

// Create a new database and collections
db = db.getSiblingDB("productdb");

// Create the collections
db.createCollection("products");
db.createCollection("users");
db.createCollection("conversations");
db.createCollection("messages");

// Create a user for authentication
db.createUser({
  user: "root",
  pwd: "example",
  roles: [
    { role: "readWrite", db: "productdb" },
    { role: "dbAdmin", db: "productdb" },
  ],
});

// Insert some initial data
db.products.insertMany([
  {
    barcode: "74001755",
    item: "Ball Gown",
    category: "Full Body Outfits",
    price: 3548,
    discount: 7,
    available: 1,
  },
  {
    barcode: "74001756",
    item: "Summer Dress",
    category: "Full Body Outfits",
    price: 2500,
    discount: 5,
    available: 1,
  },
  {
    barcode: "74001757",
    item: "Winter Coat",
    category: "Outerwear",
    price: 4000,
    discount: 10,
    available: 1,
  },
  {
    barcode: "74002423",
    item: "Silk Scarf",
    category: "Accessories",
    price: 890,
    discount: 15,
    available: 1,
  },
  {
    barcode: "74003512",
    item: "Leather Jacket",
    category: "Outerwear",
    price: 2250,
    discount: 5,
    available: 1,
  },
  {
    barcode: "74004298",
    item: "Cotton T-Shirt",
    category: "Casual Wear",
    price: 450,
    discount: 0,
    available: 1,
  },
  {
    barcode: "74005123",
    item: "Denim Jeans",
    category: "Casual Wear",
    price: 1200,
    discount: 10,
    available: 0,
  },
  {
    barcode: "74006789",
    item: "Wool Sweater",
    category: "Winter Collection",
    price: 1750,
    discount: 12,
    available: 0,
  },
  {
    barcode: "74007890",
    item: "Designer Sunglasses",
    category: "Accessories",
    price: 1580,
    discount: 8,
    available: 0,
  },
]);

print("MongoDB initialization complete!");
