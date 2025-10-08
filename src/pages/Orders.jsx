import { useState, useEffect } from 'react';
import { ordersAPI } from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getAll();
      setOrders(response.data.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading orders...</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>
        <div className="text-center py-8 bg-white rounded shadow">
          <p className="text-xl">No orders yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg">Order #{order._id}</h3>
                <p className="text-gray-600">
                  {new Date(order.orderDate).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">
                  ${order.totalPrice.toFixed(2)}
                </p>
                <span className="inline-block bg-yellow-200 text-yellow-800 px-3 py-1 rounded text-sm">
                  {order.status}
                </span>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Items:</h4>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-gray-50 p-3 rounded"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Size: {item.size} | Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold">${item.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;