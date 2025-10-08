import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ordersAPI } from '../services/api';
import { useState } from 'react';

const Cart = () => {
  const { cart, cartTotal, updateCartItem, removeFromCart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(itemId, newQuantity);
    } catch (error) {
      alert('Failed to update quantity');
    }
  };

  const handleRemove = async (itemId) => {
    if (window.confirm('Remove this item from cart?')) {
      try {
        await removeFromCart(itemId);
      } catch (error) {
        alert('Failed to remove item');
      }
    }
  };

const handleCheckout = async () => {
  if (cart.length === 0) {
    alert('Cart is empty');
    return;
  }

  if (window.confirm('Proceed to checkout?')) {
    try {
      setLoading(true);
      await ordersAPI.create(); // create order
      clearCart(); // <-- clear the cart in context
      alert('Order placed successfully! Check your email for confirmation.');
      navigate('/orders');
    } catch (error) {
      alert('Checkout failed: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  }
};

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
        <div className="text-center py-8 bg-white rounded shadow">
          <p className="text-xl mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded shadow">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 p-4 border-b last:border-b-0"
              >
                <img
                  src={item.product?.imageUrl}
                  alt={item.product?.name}
                  className="w-24 h-24 object-cover rounded"
                />

                <div className="flex-1">
                  <h3 className="font-bold text-lg">{item.product?.name}</h3>
                  <p className="text-gray-600">Size: {item.size}</p>
                  <p className="text-green-600 font-bold">
                    ${item.product?.price}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="px-4">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>

                <div className="font-bold">
                  ${(item.product?.price * item.quantity).toFixed(2)}
                </div>

                <button
                  onClick={() => handleRemove(item._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <hr />
              <div className="flex justify-between text-xl font-bold">
                <span>Total:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 mb-2 disabled:bg-gray-400"
            >
              {loading ? 'Processing...' : 'Proceed to Checkout'}
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;