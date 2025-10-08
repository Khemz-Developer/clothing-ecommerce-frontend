
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ordersAPI } from '../services/api';
import { useState } from 'react';

const Cart = () => {
  const { cart, cartTotal, updateCartItem, removeFromCart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleQuantityChange = async (productId, size, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(productId, size, newQuantity);
    } catch (error) {
      alert('Failed to update quantity');
    }
  };

  const handleRemove = async (productId, size) => {
    if (window.confirm('Remove this item from cart?')) {
      try {
        await removeFromCart(productId, size);
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
        await ordersAPI.create();
        clearCart();
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
      <div className="container px-4 py-8 mx-auto">
        <h1 className="mb-6 text-3xl font-bold">Shopping Cart</h1>
        <div className="py-8 text-center bg-white rounded shadow">
          <p className="mb-4 text-xl">Your cart is empty</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Shopping Cart</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="bg-white rounded shadow">
            {cart.map((item, index) => (
              <div
                key={`${item.product?._id}-${item.size}-${index}`}
                className="flex items-center gap-4 p-4 border-b last:border-b-0"
              >
                <img
                  src={item.product?.imageUrl}
                  alt={item.product?.name}
                  className="object-cover w-24 h-24 rounded"
                />

                <div className="flex-1">
                  <h3 className="text-lg font-bold">{item.product?.name}</h3>
                  <p className="text-gray-600">Size: {item.size}</p>
                  <p className="font-bold text-green-600">
                    ${item.product?.price?.toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuantityChange(item.product._id, item.size, item.quantity - 1)}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="px-4">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.product._id, item.size, item.quantity + 1)}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>

                <div className="font-bold">
                  ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                </div>

                <button
                  onClick={() => handleRemove(item.product._id, item.size)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="p-6 bg-white rounded shadow">
            <h2 className="mb-4 text-2xl font-bold">Order Summary</h2>
            
            <div className="mb-4 space-y-2">
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
              className="w-full py-3 mb-2 text-white bg-green-600 rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? 'Processing...' : 'Proceed to Checkout'}
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full py-2 text-gray-800 bg-gray-200 rounded hover:bg-gray-300"
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