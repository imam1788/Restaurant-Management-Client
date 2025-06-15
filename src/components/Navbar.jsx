import { Link, NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { toast } from "react-toastify";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout()
      .then(() => {
        toast.success("Logged out successfully");
      })
      .catch((error) => {
        toast.error("Logout failed: " + error.message);
      });
  };

  return (
    <nav className="navbar shadow-md px-4 py-3">
      <div className="navbar-start">
        <NavLink
          to="/"
          className="text-4xl font-extrabold tracking-wide text-green-600 hover:text-green-800 transition duration-300"
        >
          <span className="text-black">Re</span>
          <span className="text-green-600">sto</span>
        </NavLink>
      </div>


      <div className="navbar-center hidden md:flex">
        <ul className="menu menu-horizontal px-1 gap-4 font-semibold">
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/all-foods">All Foods</NavLink></li>
          <li><NavLink to="/gallery">Gallery</NavLink></li>
        </ul>
      </div>

      <div className="navbar-end gap-4 items-center">
        {user ? (
          <>
            {/* Show profile image if available */}
            <img
              src={user.photoURL || "https://i.pravatar.cc/40"} // fallback avatar
              alt="Profile"
              title={user.displayName || "User"}
              className="w-10 h-10 rounded-full border"
            />
            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="btn btn-sm btn-outline btn-error"
            >
              Logout
            </button>
          </>
        ) : (
          // Show login button if not logged in
          <Link to="/login" className="btn btn-sm btn-primary">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
