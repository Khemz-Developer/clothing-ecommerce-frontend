import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getById(id);
      setProduct(response.data.data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      alert('Product not found');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      navigate('/login');
      return;
    }

    try {
      await addToCart(product._id, quantity, selectedSize);
      alert('Added to cart!');
      setSelectedSize('');
      setQuantity(1);
    } catch (error) {
      alert('Failed to add to cart');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Product not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/')}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back to Products
      </button>

      <div className="bg-white rounded shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div>
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-96 object-cover rounded"
            />
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            
            <div className="mb-4">
              <span className="inline-block bg-gray-200 px-3 py-1 rounded text-sm">
                {product.category}
              </span>
            </div>

            <p className="text-3xl font-bold text-green-600 mb-6">
              ${product.price}
            </p>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-700">{product.description}</p>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Available Sizes</h3>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded ${
                      selectedSize === size
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white border-gray-300 hover:border-blue-600'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Quantity</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  -
                </button>
                <span className="text-xl font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-600">
                Stock: <span className="font-semibold">{product.stock} available</span>
              </p>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-blue-600 text-white py-3 rounded text-lg font-semibold hover:bg-blue-700"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;