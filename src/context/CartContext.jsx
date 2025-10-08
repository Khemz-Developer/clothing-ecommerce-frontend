import { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.get();
      setCart(response.data.data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity, size) => {
    try {
      const data = {
        productId,
        quantity,
        size,
        userId: user?.userId
      };
      const response = await cartAPI.add(data);
      if (isAuthenticated) {
        setCart(response.data.data);
      }
      return response.data;
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      const response = await cartAPI.update(itemId, { quantity });
      setCart(response.data.data);
      return response.data;
    } catch (error) {
      console.error('Failed to update cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const response = await cartAPI.remove(itemId);
      setCart(response.data.data);
      return response.data;
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clear();
      setCart([]);
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    }
  };

  const cartTotal = cart.reduce((total, item) => {
    return total + (item.product?.price || 0) * item.quantity;
  }, 0);

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
    refreshCart: fetchCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

