// API Configuration
const API_BASE_URL = 'http://localhost:8001/api';

// Fetch products from API
async function fetchProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

// Product data (will be populated from API)
let products = [];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Load products and initialize page
document.addEventListener('DOMContentLoaded', async () => {
    // Try to load products from API first
    products = await fetchProducts();
    
    // Fallback to mock data if API fails
    if (products.length === 0) {
        products = [
            {
                id: 1,
                name: "Wireless Bluetooth Earbuds",
                price: 29.99,
                originalPrice: 49.99,
                image: "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg",
                rating: 4.5,
                category: "electronics"
            },
            {
                id: 2,
                name: "Smart Watch Fitness Tracker",
                price: 59.99,
                originalPrice: 79.99,
                image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg",
                rating: 4.2,
                category: "electronics"
            },
            {
                id: 3,
                name: "Men's Casual T-Shirt",
                price: 12.99,
                originalPrice: 19.99,
                image: "https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg",
                rating: 4.0,
                category: "fashion"
            },
            {
                id: 4,
                name: "Women's Running Shoes",
                price: 45.99,
                originalPrice: 65.99,
                image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg",
                rating: 4.7,
                category: "fashion"
            },
            {
                id: 5,
                name: "Non-Stick Cooking Pan Set",
                price: 39.99,
                originalPrice: 59.99,
                image: "https://images.pexels.com/photos/6606354/pexels-photo-6606354.jpeg",
                rating: 4.3,
                category: "home"
            },
            {
                id: 6,
                name: "Organic Face Cream",
                price: 19.99,
                originalPrice: 29.99,
                image: "https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg",
                rating: 4.1,
                category: "beauty"
            }
        ];
    }

    // Initialize featured products
    const featuredProductsContainer = document.getElementById('featured-products');
    if (featuredProductsContainer) {
        featuredProductsContainer.innerHTML = '';
        products.slice(0, 4).forEach(product => {
            featuredProductsContainer.innerHTML += `
                <div class="product-card fade-in">
                    <a href="/product-detail.html?id=${product.id}">
                        <img src="${product.image}" alt="${product.name}">
                        <div class="p-4">
                            <h3 class="text-gray-800 mb-1">${product.name}</h3>
                            <div class="flex items-center mb-2">
                                ${renderRatingStars(product.rating)}
                                <span class="text-gray-500 text-sm ml-1">(${product.rating})</span>
                            </div>
                            <div class="price">$${product.price.toFixed(2)}</div>
                            <div class="original-price">$${product.originalPrice.toFixed(2)}</div>
                            <button class="btn-primary w-full mt-3 add-to-cart" data-id="${product.id}">
                                Add to Cart
                            </button>
                        </div>
                    </a>
                </div>
            `;
        });

        // Add event listeners for add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = parseInt(button.dataset.id);
                addToCart(productId);
            });
        });
    }
});

function renderRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star text-yellow-400"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt text-yellow-400"></i>';
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star text-yellow-400"></i>';
    }
    
    return stars;
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
}

// Utility function to get URL parameters
function getUrlParameter(name) {
    name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}