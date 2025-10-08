import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <nav className="bg-gray-800 text-white">
      {" "}
      <div className="container mx-auto px-4 py-4">
        {" "}
        <div className="flex justify-between items-center">
          {" "}
          <Link to="/" className="text-2xl font-bold">
            {" "}
            E-Commerce{" "}
          </Link>{" "}
          <div className="flex items-center gap-6">
            {" "}
            <Link to="/" className="hover:text-gray-300">
              {" "}
              Products{" "}
            </Link>{" "}
            <Link to="/cart" className="hover:text-gray-300 relative">
              {" "}
              Cart{" "}
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {" "}
                  {cartCount}{" "}
                </span>
              )}{" "}
            </Link>{" "}
            {isAuthenticated ? (
              <>
                {/* {" "}
                <Link to="/cart" className="hover:text-gray-300 relative">
                  {" "}
                  Cart{" "}
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {" "}
                      {cartCount}{" "}
                    </span>
                  )}{" "}
                </Link>{" "} */}
                <Link to="/orders" className="hover:text-gray-300">
                  {" "}
                  Orders{" "}
                </Link>{" "}
                <span className="text-gray-300">Hi, {user?.name}</span>{" "}
                <button
                  onClick={handleLogout}
                  className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
                >
                  {" "}
                  Logout{" "}
                </button>{" "}
              </>
            ) : (
              <>
                {" "}
                <Link
                  to="/login"
                  className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                >
                  {" "}
                  Login{" "}
                </Link>{" "}
                <Link
                  to="/register"
                  className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
                >
                  {" "}
                  Register{" "}
                </Link>{" "}
              </>
            )}{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </nav>
  );
};
export default Navbar;
