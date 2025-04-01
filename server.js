const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Mock database files
const PRODUCTS_DB = path.join(__dirname, 'data', 'products.json');
const USERS_DB = path.join(__dirname, 'data', 'users.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
}

// Initialize mock databases if they don't exist
if (!fs.existsSync(PRODUCTS_DB)) {
    fs.writeFileSync(PRODUCTS_DB, JSON.stringify([
        {
            id: 1,
            name: "Wireless Bluetooth Earbuds",
            price: 29.99,
            originalPrice: 49.99,
            image: "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg",
            rating: 4.5,
            category: "electronics",
            description: "High-quality wireless earbuds with noise cancellation and 20hr battery life."
        },
        // More initial products...
    ], null, 2));
}

if (!fs.existsSync(USERS_DB)) {
    fs.writeFileSync(USERS_DB, JSON.stringify([], null, 2));
}

// API Routes

// Get all products
app.get('/api/products', (req, res) => {
    const { category } = req.query;
    const products = JSON.parse(fs.readFileSync(PRODUCTS_DB));
    
    if (category) {
        const filtered = products.filter(p => p.category === category);
        return res.json(filtered);
    }
    
    res.json(products);
});

// Get single product
app.get('/api/products/:id', (req, res) => {
    const products = JSON.parse(fs.readFileSync(PRODUCTS_DB));
    const product = products.find(p => p.id === parseInt(req.params.id));
    
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
});

// User authentication
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const users = JSON.parse(fs.readFileSync(USERS_DB));
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // In a real app, you would generate a JWT token here
    res.json({ 
        success: true,
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    });
});

app.post('/api/auth/register', (req, res) => {
    const { name, email, password } = req.body;
    const users = JSON.parse(fs.readFileSync(USERS_DB));
    
    if (users.some(u => u.email === email)) {
        return res.status(400).json({ error: 'Email already exists' });
    }
    
    const newUser = {
        id: users.length + 1,
        name,
        email,
        password, // In a real app, you would hash the password
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    fs.writeFileSync(USERS_DB, JSON.stringify(users, null, 2));
    
    res.json({ 
        success: true,
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        }
    });
});

// Cart operations
app.get('/api/cart', (req, res) => {
    // In a real app, this would be user-specific
    res.json([]);
});

// Serve frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});