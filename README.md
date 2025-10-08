# E-Commerce Frontend Setup Guide

## Project Structure

```
ecommerce-frontend/
├── public/
├── src/
│   ├── components/
│   │   └── Navbar.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   ├── pages/
│   │   ├── Register.jsx
│   │   ├── Login.jsx
│   │   ├── Products.jsx
│   │   ├── Cart.jsx
│   │   └── Orders.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

---

## Running the Application

### Prerequisites
Make sure the backend server is running on `http://localhost:5000`

### Start Development Server
```bash
npm run dev
```

The app will run on `http://localhost:3000`

---

## Usage Flow

### 1. First Time Setup
1. Start the backend server
2. Seed demo products: `POST http://localhost:5000/api/products/seed`
3. Start the frontend

### 2. Register/Login
1. Go to Register page and create an account
2. Or Login with existing credentials

### 3. Browse Products
- View all products on the home page
- Use filters to search by:
  - Search term
  - Category (Men/Women/Kids)
  - Size (S/M/L/XL)
  - Price range

### 4. Add to Cart
1. Select a size for the product
2. Click "Add to Cart"
3. Cart count updates in navbar

### 5. View Cart
- Click "Cart" in navbar
- Update quantities
- Remove items
- See total price

### 6. Checkout
1. Click "Proceed to Checkout"
2. Order is created and saved
3. Cart is cleared
4. Confirmation email is sent
5. Redirected to Orders page

### 7. View Orders
- See all your past orders
- View order details, items, and status

---

## Features Implemented

✅ **Authentication**
- User registration with validation
- Login with JWT tokens
- Protected routes
- Persistent login (token in localStorage)

✅ **Global State Management**
- AuthContext for user authentication
- CartContext for shopping cart
- useContext hooks throughout the app

✅ **Product Browsing**
- Display all products
- Search functionality
- Multiple filters (category, size, price)
- Pagination support

✅ **Shopping Cart**
- Add items with size selection
- Update quantities
- Remove items
- Calculate totals
- Guest mode (can add without login)

✅ **Checkout**
- Create orders from cart
- Save to database
- Send confirmation email
- Clear cart after checkout

✅ **Order History**
- View all orders
- See order details
- Track order status

---

## Context API Implementation

### AuthContext
- Manages user authentication state
- Handles register/login/logout
- Stores JWT token
- Provides user data globally

### CartContext
- Manages shopping cart state
- Handles add/update/remove operations
- Calculates cart totals
- Syncs with backend

---

## API Integration

All API calls are centralized in `src/services/api.js`:
- Axios interceptors for JWT tokens
- Organized by feature (auth, products, cart, orders)
- Error handling

---

## Styling

- **Tailwind CSS** for all styling
- Simple, clean UI
- Responsive design
- No custom CSS needed

---


