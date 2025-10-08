
import { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI, productsAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // ✅ Load cart from localStorage or backend when auth changes
  useEffect(() => {
    if (isAuthenticated) {
      syncGuestCartWithUser();
    } else {
      const savedCart = JSON.parse(localStorage.getItem('guestCart')) || [];
      setCart(savedCart);
    }
  }, [isAuthenticated]);

  // ✅ Save guest cart to localStorage whenever it changes (only if not logged in)
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('guestCart', JSON.stringify(cart));
    }
  }, [cart, isAuthenticated]);

  // ✅ Fetch single product details - FIXED to return clean product data
  const getProductDetails = async (productId) => {
    try {
      const response = await productsAPI.getById(productId);
      // Extract just the product data, not the wrapper
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Failed to fetch product details:', error);
      return null;
    }
  };

  // 🔹 Fetch user cart from backend
  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.get();
      setCart(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Sync guest cart with user cart when logging in
  const syncGuestCartWithUser = async () => {
    const guestCart = JSON.parse(localStorage.getItem('guestCart')) || [];
    if (guestCart.length === 0) {
      await fetchCart();
      return;
    }

    try {
      for (const item of guestCart) {
        await cartAPI.add({
          productId: item.product._id,
          quantity: item.quantity,
          size: item.size,
          userId: user?.userId,
        });
      }
      localStorage.removeItem('guestCart');
      await fetchCart();
    } catch (error) {
      console.error('Failed to sync guest cart:', error);
    }
  };

  // ✅ Add item to cart (guest or user) - FIXED
  const addToCart = async (productId, quantity, size) => {
    if (isAuthenticated) {
      try {
        const response = await cartAPI.add({
          productId,
          quantity,
          size,
          userId: user?.userId,
        });
        setCart(response.data.data);
        return response.data;
      } catch (error) {
        console.error('Failed to add to cart:', error);
        throw error;
      }
    } else {
      // Guest mode - FIXED duplicate detection and product structure
      const existingItemIndex = cart.findIndex(
        (item) => item.product?._id === productId && item.size === size
      );

      if (existingItemIndex > -1) {
        // ✅ Item exists, increase quantity
        const updated = [...cart];
        updated[existingItemIndex].quantity += quantity;
        setCart(updated);
      } else {
        // ✅ Fetch product details (image, name, price)
        const productDetails = await getProductDetails(productId);
        if (!productDetails) {
          throw new Error('Failed to fetch product details');
        }

        // Store clean product data without wrapper
        const newItem = {
          product: productDetails, // This should be the actual product object
          size,
          quantity,
        };

        const updated = [...cart, newItem];
        setCart(updated);
      }
    }
  };

  // ✅ Update item quantity - FIXED
  const updateCartItem = async (productId, size, quantity) => {
    if (isAuthenticated) {
      // For authenticated users, find the cart item by productId
      const user = await cartAPI.get();
      const cartItem = user.data.data.find(
        item => item.product._id === productId && item.size === size
      );
      
      if (cartItem) {
        const response = await cartAPI.update(cartItem._id, { quantity });
        setCart(response.data.data);
        return response.data;
      }
    } else {
      // Guest mode - find by productId and size - FIXED
      const updated = cart.map((item) =>
        item.product?._id === productId && item.size === size
          ? { ...item, quantity }
          : item
      );
      setCart(updated);
    }
  };

  // ✅ Remove item - FIXED
  const removeFromCart = async (productId, size) => {
    if (isAuthenticated) {
      // For authenticated users, find the cart item by productId
      const user = await cartAPI.get();
      const cartItem = user.data.data.find(
        item => item.product._id === productId && item.size === size
      );
      
      if (cartItem) {
        const response = await cartAPI.remove(cartItem._id);
        setCart(response.data.data);
        return response.data;
      }
    } else {
      // Guest mode - filter by productId and size - FIXED
      const updated = cart.filter(
        (item) => !(item.product?._id === productId && item.size === size)
      );
      setCart(updated);
    }
  };

  // ✅ Clear cart
  const clearCart = async () => {
    if (isAuthenticated) {
      await cartAPI.clear();
    }
    setCart([]);
    localStorage.removeItem('guestCart');
  };

  // ✅ Derived values
  const cartTotal = cart.reduce(
    (total, item) => total + (item.product?.price || 0) * item.quantity,
    0
  );

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const value = {
    cart,
    loading,
    cartTotal,
    cartCount,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart: fetchCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};