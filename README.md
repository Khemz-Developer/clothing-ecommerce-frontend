# E-Commerce Frontend Setup Guide

A modern, responsive e-commerce frontend built with React, Vite, and Tailwind CSS. This application provides a complete shopping experience with user authentication, product browsing, cart management, and order tracking.

Frontend: `http://localhost:3000`  
Backend API: `http://localhost:5000`

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

## 📦 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Backend API running** on `http://localhost:5000`
- **MongoDB** with seeded products


## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Khemz-Developer/clothing-ecommerce-frontend
cd clothing-ecommerce-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Verify Backend is Running

Backend should be accessible at: `http://localhost:5000`

### 4. Seed Demo Products (if not already done)

```bash
curl -X POST http://localhost:5000/api/products/seed
```

## 🚀 Running the Application

### Start Development Server
```bash
npm run dev
```

The app will run on `http://localhost:3000`

---

## ⚙️ Environment Configuration

The application uses Vite's proxy configuration (in `vite.config.js`) to forward API requests:

```javascript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true
    }
  }
}
```

## Usage Flow

### 1. First Time Setup
1. Start the backend server
2. Seed demo products: `POST http://localhost:5000/api/products/seed`
3. Start the frontend

### 2. Register/Login
1. Register with name, email, and password
2. Or Login with existing credentials
3. Persistent sessions (localStorage)

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

✅ **Guest Cart Persistence**
- Store guest cart in sessionStorage
- Merge with user cart on login

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

## 🚀 Future Improvements

### High Priority

1. **Enhanced Error Handling**
   ```javascript
   // Add toast notifications
   import toast from 'react-hot-toast';
   toast.success('Added to cart!');
   toast.error('Failed to add to cart');
   ```

2. **Form Validation**
   ```javascript
   // Use react-hook-form + zod
   import { useForm } from 'react-hook-form';
   import { z } from 'zod';
   ```

3. **Loading Skeletons**
   ```javascript
   // Replace loading text with skeletons
   <ProductCardSkeleton count={12} />
   ```



### Medium Priority

5. **Product Wishlist**
   - Save favorite products
   - Move to cart from wishlist

6. **Advanced Filters**
   - Sort by: price, name, date
   - Multi-select categories
   - Brand filter

7. **Product Reviews**
   - Star ratings
   - User comments
   - Helpful votes

8. **User Profile**
   - Edit account details
   - Change password
   - Profile picture

9. **Address Management**
   - Save multiple addresses
   - Default address selection
   - Address validation

10. **Order Tracking**
    - Real-time status updates
    - Estimated delivery date
    - Tracking number

### Low Priority

11. **Social Features**
    - Share products
    - Social login (Google, Facebook)

12. **Recommendations**
    - Related products
    - Recently viewed
    - Trending items

13. **Advanced Search**
    - Autocomplete
    - Search suggestions
    - Search history

14. **Internationalization**
    - Multiple languages
    - Currency conversion

15. **Dark Mode**
    - Theme toggle
    - Persistent preference

## 🧪 Testing Guidelines

### Manual Testing Checklist

- [ ] Register new user
- [ ] Login with credentials
- [ ] Browse products
- [ ] Apply filters (search, category, size, price)
- [ ] View product details
- [ ] Add items to cart with size selection
- [ ] Update cart quantities
- [ ] Remove cart items
- [ ] Complete checkout
- [ ] View order history
- [ ] Logout and verify state cleared

