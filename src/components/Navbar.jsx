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
          <span className="text-yellow-400">sto</span>
        </NavLink>
      </div>


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

      <div className="navbar-end gap-4 items-center">
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
                  <Link to="/my-foods" className="font-medium">My Foods</Link>
                </li>
                <li>
                  <Link to="/add-food" className="font-medium">Add Food</Link>
                </li>
                <li>
                  <Link to="/my-orders" className="font-medium">My Orders</Link>
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
    </nav>
  );
};

export default Navbar;
