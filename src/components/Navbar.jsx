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
    <nav className="navbar shadow-md px-4 py-3 relative">
      <div className="navbar-start">
        <NavLink
          to="/"
          className="text-4xl font-extrabold tracking-wide text-green-600 hover:text-green-800 transition duration-300"
        >
          <span className="text-black">Re</span>
          <span className="text-yellow-400">sto</span>
        </NavLink>
      </div>

      {/* Desktop Menu */}
      <div className="navbar-center hidden md:flex">
        <ul className="menu menu-horizontal px-1 gap-4 font-semibold">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "text-yellow-400 font-bold" : "text-black"
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/all-foods"
              className={({ isActive }) =>
                isActive ? "text-yellow-400 font-bold" : "text-black"
              }
            >
              All Foods
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/gallery"
              className={({ isActive }) =>
                isActive ? "text-yellow-400 font-bold" : "text-black"
              }
            >
              Gallery
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Desktop User Menu */}
      <div className="navbar-end hidden md:flex gap-4 items-center">
        {user ? (
          <>
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full border">
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    title={user.displayName || "User"}
                  />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
              >
                <li>
                  <Link to="/my-foods" className="font-medium">
                    My Foods
                  </Link>
                </li>
                <li>
                  <Link to="/add-food" className="font-medium">
                    Add Food
                  </Link>
                </li>
                <li>
                  <Link to="/my-orders" className="font-medium">
                    My Orders
                  </Link>
                </li>
              </ul>
            </div>

            <button
              onClick={handleLogout}
              className="btn btn-sm btn-outline btn-error ml-2"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="btn btn-sm btn-primary">
            Login
          </Link>
        )}
      </div>

      {/* Mobile Hamburger Button */}
      <div className="navbar-end md:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="btn btn-square btn-ghost"
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

      {/* Mobile Menu (only show on small screens) */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-base-100 shadow-lg md:hidden z-10 px-4 py-4">
          <ul className="menu menu-vertical font-semibold gap-3">
            <li>
              <NavLink
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  isActive ? "text-yellow-400 font-bold" : "text-black"
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
                  isActive ? "text-yellow-400 font-bold" : "text-black"
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
                  isActive ? "text-yellow-400 font-bold" : "text-black"
                }
              >
                Gallery
              </NavLink>
            </li>

            {user ? (
              <>
                <li>
                  <Link
                    to="/my-foods"
                    onClick={() => setIsMenuOpen(false)}
                    className="font-medium"
                  >
                    My Foods
                  </Link>
                </li>
                <li>
                  <Link
                    to="/add-food"
                    onClick={() => setIsMenuOpen(false)}
                    className="font-medium"
                  >
                    Add Food
                  </Link>
                </li>
                <li>
                  <Link
                    to="/my-orders"
                    onClick={() => setIsMenuOpen(false)}
                    className="font-medium"
                  >
                    My Orders
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="btn btn-error w-full"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="btn btn-primary w-full"
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
