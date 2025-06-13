import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar bg-base-100 shadow-md px-4 py-3">
      
      <div className="navbar-start">
        <NavLink to="/" className="text-3xl font-bold text-green-600">
           Resto
        </NavLink>
      </div>

      
      <div className="navbar-center hidden md:flex">
        <ul className="menu menu-horizontal px-1 gap-4 font-semibold">
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/all-foods">All Foods</NavLink></li>
          <li><NavLink to="/gallery">Gallery</NavLink></li>
        </ul>
      </div>

      
      <div className="navbar-end gap-4">
        
        <img
          src="https://i.pravatar.cc/40" 
          alt="Profile"
          className="w-10 h-10 rounded-full border hidden" 
        />

        
        <button className="btn btn-sm btn-primary">Login</button>

        
      </div>
    </nav>
  );
};

export default Navbar;