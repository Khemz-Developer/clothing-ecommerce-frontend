import { useState, useEffect } from "react";
import { productsAPI } from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    size: "",
    minPrice: "",
    maxPrice: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    totalPages: 1,
  });
  const [selectedSize, setSelectedSize] = useState({});
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [filters, pagination.page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      };
      const response = await productsAPI.getAll(params);
      setProducts(response.data.data);
      setPagination((prev) => ({
        ...prev,
        totalPages: response.data.pagination.pages,
      }));
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
    setPagination({ ...pagination, page: 1 });
  };

  const handleAddToCart = async (product) => {
    const size = selectedSize[product._id];
    if (!size) {
      alert("Please select a size");
      return;
    }

    if (!isAuthenticated) {
      alert("Please login to add items to cart");
      navigate("/login");
      return;
    }

    try {
      await addToCart(product._id, 1, size);
      alert("Added to cart!");
      setSelectedSize({ ...selectedSize, [product._id]: "" });
    } catch (error) {
      alert("Failed to add to cart");
    }
  };

  const handleSizeSelect = (productId, size) => {
    setSelectedSize({ ...selectedSize, [productId]: size });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            name="search"
            placeholder="Search products..."
            value={filters.search}
            onChange={handleFilterChange}
            className="px-3 py-2 border rounded"
          />

          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="px-3 py-2 border rounded"
          >
            <option value="">All Categories</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>

          <select
            name="size"
            value={filters.size}
            onChange={handleFilterChange}
            className="px-3 py-2 border rounded"
          >
            <option value="">All Sizes</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
          </select>

          <input
            type="number"
            name="minPrice"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={handleFilterChange}
            className="px-3 py-2 border rounded"
          />

          <input
            type="number"
            name="maxPrice"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            className="px-3 py-2 border rounded"
          />
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-8">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-8">No products found</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded shadow p-4">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded mb-4"
                />
                <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2">
                  {product.description}
                </p>
                <p className="text-xl font-bold text-green-600 mb-2">
                  ${product.price}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  Category: {product.category}
                </p>

                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">
                    Select Size:
                  </label>
                  <div className="flex gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => handleSizeSelect(product._id, size)}
                        className={`px-3 py-1 border rounded ${
                          selectedSize[product._id] === size
                            ? "bg-blue-600 text-white"
                            : "bg-white"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/products/${product._id}`)}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  page: Math.max(prev.page - 1, 1),
                }))
              }
              disabled={pagination.page === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-lg font-semibold">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  page: prev.page + 1,
                }))
              }
              disabled={pagination.page >= pagination.totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Products;
