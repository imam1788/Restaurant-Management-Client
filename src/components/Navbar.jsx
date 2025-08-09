import { useState, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import { toast } from "react-toastify";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout()
      .then(() => {
        toast.success("Logged out successfully");
      })
      .catch((error) => {
        toast.error("Logout failed: " + error.message);
      });
    setIsMenuOpen(false);
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 shadow-md"
      style={{ backgroundColor: "#2C3E50" }} // Example: dark blue/navy primary color, replace with your brand color
    >
      {/* Container to align content with rest of page and add horizontal padding */}
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <NavLink
          to="/"
          className="text-3xl font-extrabold tracking-wide text-yellow-400 hover:text-yellow-300 transition duration-300"
        >
          <span>Re</span>
          <span className="text-white">sto</span>
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 font-semibold text-white">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-yellow-400 font-bold" : "hover:text-yellow-300"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/all-foods"
            className={({ isActive }) =>
              isActive ? "text-yellow-400 font-bold" : "hover:text-yellow-300"
            }
          >
            All Foods
          </NavLink>
          <NavLink
            to="/gallery"
            className={({ isActive }) =>
              isActive ? "text-yellow-400 font-bold" : "hover:text-yellow-300"
            }
          >
            Gallery
          </NavLink>
          {/* Protected routes for logged in users */}
          {user && (
            <>
              <NavLink
                to="/my-foods"
                className={({ isActive }) =>
                  isActive ? "text-yellow-400 font-bold" : "hover:text-yellow-300"
                }
              >
                My Foods
              </NavLink>
              <NavLink
                to="/add-food"
                className={({ isActive }) =>
                  isActive ? "text-yellow-400 font-bold" : "hover:text-yellow-300"
                }
              >
                Add Food
              </NavLink>
              <NavLink
                to="/my-orders"
                className={({ isActive }) =>
                  isActive ? "text-yellow-400 font-bold" : "hover:text-yellow-300"
                }
              >
                My Orders
              </NavLink>
            </>
          )}
        </div>

        {/* User actions */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <div className="w-10 h-10 rounded-full border border-yellow-400 overflow-hidden">
                <img
                  src={user.photoURL}
                  alt="Profile"
                  title={user.displayName || "User"}
                  className="w-full h-full object-cover"
                />
              </div>

              <button
                onClick={handleLogout}
                className="btn btn-sm bg-yellow-400 hover:bg-yellow-500 border-none"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="btn btn-sm bg-yellow-400 hover:bg-yellow-500 border-none"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="btn btn-square btn-ghost text-white"
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="inline-block w-6 h-6 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#2C3E50] px-6 py-4 shadow-lg">
          <ul className="space-y-4 font-semibold text-white">
            <li>
              <NavLink
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  isActive ? "text-yellow-400 font-bold" : "hover:text-yellow-300"
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/all-foods"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  isActive ? "text-yellow-400 font-bold" : "hover:text-yellow-300"
                }
              >
                All Foods
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/gallery"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  isActive ? "text-yellow-400 font-bold" : "hover:text-yellow-300"
                }
              >
                Gallery
              </NavLink>
            </li>
            {user && (
              <>
                <li>
                  <Link
                    to="/my-foods"
                    onClick={() => setIsMenuOpen(false)}
                    className="hover:text-yellow-300"
                  >
                    My Foods
                  </Link>
                </li>
                <li>
                  <Link
                    to="/add-food"
                    onClick={() => setIsMenuOpen(false)}
                    className="hover:text-yellow-300"
                  >
                    Add Food
                  </Link>
                </li>
                <li>
                  <Link
                    to="/my-orders"
                    onClick={() => setIsMenuOpen(false)}
                    className="hover:text-yellow-300"
                  >
                    My Orders
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="btn btn-yellow-400 btn-filled w-30"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
            {!user && (
              <li>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="btn btn-yellow-400 btn-filled w-30"
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
