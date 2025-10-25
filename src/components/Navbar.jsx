import { useState, useContext, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import { useCart } from "../contexts/CartContext";
import { useChat } from '../contexts/ChatContext';
import { toast } from "react-toastify";
import CartIcon from "./CartIcon";
import {
  HomeIcon,
  ShoppingBagIcon,
  HeartIcon,
  ClipboardDocumentListIcon,
  ShoppingCartIcon,
  ArrowRightOnRectangleIcon,
  PhotoIcon,
  PlusCircleIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  InformationCircleIcon,
  PhoneIcon,
  CalendarIcon,
  CubeIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, mongoUser, logout, loading } = useContext(AuthContext);
  const { getTotalItems } = useCart();
  const { unreadCount, loading: chatLoading } = useChat();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const profileRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const totalCartItems = getTotalItems();

  // Get user role directly from MongoDB user data
  const userRole = mongoUser?.role || 'customer';
  const isAdmin = userRole === 'admin';

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('button[aria-label="Toggle menu"]')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get display name
  const getDisplayName = () => {
    if (mongoUser?.displayName) {
      return mongoUser.displayName;
    }
    if (user?.displayName) {
      return user.displayName;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return "User";
  };

  // Get photo URL
  const getPhotoURL = () => {
    if (mongoUser?.photoURL && mongoUser.photoURL.trim() !== '') {
      return mongoUser.photoURL;
    }
    if (user?.photoURL && user.photoURL.trim() !== '') {
      return user.photoURL;
    }
    return "/default-avatar.png";
  };

  const handleLogout = () => {
    logout()
      .then(() => {
        toast.success("Logged out successfully");
        navigate('/');
        setIsMenuOpen(false);
      })
      .catch((error) => {
        toast.error("Logout failed: " + error.message);
      });
    setIsProfileOpen(false);
  };

  // Common navigation for both roles
  const commonNavigation = [
    { name: "Home", path: "/", icon: HomeIcon },
    { name: "All Foods", path: "/all-foods", icon: ShoppingBagIcon },
    { name: "Gallery", path: "/gallery", icon: PhotoIcon },
    { name: "About", path: "/about", icon: InformationCircleIcon },
    { name: "Contact", path: "/contact", icon: PhoneIcon },
  ];

  // Customer specific navigation
  const customerNavigation = [
    { name: "Reservation", path: "/reservation", icon: CalendarIcon },
    { name: "My Orders", path: "/my-orders", icon: ClipboardDocumentListIcon },
    { name: "My Cart", path: "/cart", icon: ShoppingCartIcon, badge: totalCartItems },
    { name: "Checkout", path: "/checkout", icon: ShoppingBagIcon },
    { name: "My Favorite Foods", path: "/my-foods", icon: HeartIcon },
  ];

  // Admin specific navigation
  const adminNavigation = [
    { name: "Manage Orders", path: "/manage-orders", icon: UsersIcon },
    { name: "Add Food", path: "/add-food", icon: PlusCircleIcon },
    { name: "Manage Foods", path: "/my-foods", icon: CubeIcon },
  ];

  // Navigation link component
  const NavLinkItem = ({ item, onClick, isMobile = false, className = "" }) => {
    const baseClasses = isMobile
      ? "flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium"
      : "px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 text-sm font-medium";

    const activeClasses = isAdmin
      ? "bg-blue-500 text-white shadow-md"
      : "bg-amber-500 text-white shadow-md";

    const inactiveClasses = "text-gray-700 hover:bg-gray-100 hover:text-gray-900";

    return (
      <NavLink
        to={item.path}
        onClick={onClick}
        className={({ isActive }) =>
          `${baseClasses} ${isActive ? activeClasses : inactiveClasses} ${className}`
        }
      >
        <div className="flex items-center space-x-3">
          <item.icon className="w-5 h-5" />
          <span>{item.name}</span>
        </div>
        {item.badge && item.badge > 0 && (
          <span className={`px-2 py-1 text-xs rounded-full ${
            isAdmin ? 'bg-blue-500 text-white' : 'bg-amber-500 text-white'
          }`}>
            {item.badge}
          </span>
        )}
      </NavLink>
    );
  };

  // ======================== CUSTOMER NAVBAR ========================
  const CustomerNavbar = () => (
    <>
      {/* Desktop Menu - Customer */}
      <div className="hidden lg:flex items-center space-x-1">
        {commonNavigation.map((item) => (
          <NavLinkItem key={item.name} item={item} />
        ))}
        <NavLinkItem item={{ name: "Reservation", path: "/reservation", icon: CalendarIcon }} />
      </div>

      {/* Cart & User Section */}
      <div className="hidden lg:flex items-center space-x-4">
        {/* Cart Icon Component - Only for customers */}
        {user && <CartIcon />}

        {/* User Profile or Sign In */}
        {user ? (
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-gray-200 hover:border-gray-300"
              disabled={loading}
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-amber-400 bg-gray-100 flex items-center justify-center">
                {getPhotoURL() && getPhotoURL() !== "/default-avatar.png" ? (
                  <img
                    src={getPhotoURL()}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/default-avatar.png";
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold text-sm">
                    {getDisplayName().charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <span className="text-sm font-medium text-gray-700">
                  {getDisplayName()?.split(' ')[0] || "User"}
                </span>
              )}
              <ChevronDownIcon className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                isProfileOpen ? 'rotate-180' : ''
              }`} />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 top-12 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 max-h-80 overflow-y-auto">
                <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50">
                  <p className="text-sm font-semibold text-gray-800 truncate">{getDisplayName()}</p>
                  <p className="text-xs text-gray-500 truncate mt-1">{user.email}</p>
                  <div className="mt-1">
                    <span className="px-2 py-1 bg-amber-500 text-white text-xs rounded-full font-medium">
                      Customer
                    </span>
                  </div>
                </div>

                <div className="py-2">
                  <Link
                    to="/my-orders"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 transition-colors"
                  >
                    <ClipboardDocumentListIcon className="w-5 h-5" />
                    <span>My Orders</span>
                  </Link>
                  <Link
                    to="/cart"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 transition-colors"
                  >
                    <ShoppingCartIcon className="w-5 h-5" />
                    <span>My Cart ({totalCartItems})</span>
                  </Link>
                  <Link
                    to="/checkout"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 transition-colors"
                  >
                    <ShoppingBagIcon className="w-5 h-5" />
                    <span>Checkout</span>
                  </Link>
                  <Link
                    to="/my-foods"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 transition-colors"
                  >
                    <HeartIcon className="w-5 h-5" />
                    <span>My Favorite Foods</span>
                  </Link>
                </div>

                <div className="border-t border-gray-100 pt-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105 shadow-md"
          >
            Sign In
          </Link>
        )}
      </div>
    </>
  );

  // ======================== ADMIN NAVBAR ========================
  const AdminNavbar = () => (
    <>
      {/* Desktop Menu - Admin */}
      <div className="hidden lg:flex items-center space-x-1">
        {commonNavigation.map((item) => (
          <NavLinkItem key={item.name} item={item} />
        ))}
      </div>

      {/* Admin User Section */}
      <div className="hidden lg:flex items-center space-x-4">
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-blue-50 transition-all duration-200 border border-blue-200 hover:border-blue-300"
            disabled={loading}
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-blue-400 bg-gray-100 flex items-center justify-center">
                {getPhotoURL() && getPhotoURL() !== "/default-avatar.png" ? (
                  <img
                    src={getPhotoURL()}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/default-avatar.png";
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm">
                    {getDisplayName().charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
            </div>
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <span className="text-sm font-medium text-gray-700">
                {getDisplayName()?.split(' ')[0] || "Admin"}
              </span>
            )}
            <div className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full font-medium">
              Admin
            </div>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 top-12 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 max-h-80 overflow-y-auto">
              <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50">
                <p className="text-sm font-semibold text-gray-800 truncate">{getDisplayName()}</p>
                <p className="text-xs text-blue-600 font-medium">Administrator</p>
              </div>

              <div className="py-2">
                <Link
                  to="/manage-orders"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                >
                  <UsersIcon className="w-5 h-5" />
                  <span>Manage Orders</span>
                </Link>
                <Link
                  to="/add-food"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                >
                  <PlusCircleIcon className="w-5 h-5" />
                  <span>Add Food</span>
                </Link>
                <Link
                  to="/my-foods"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                >
                  <CubeIcon className="w-5 h-5" />
                  <span>Manage Foods</span>
                </Link>
                <Link
                  to="/admin/chat"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                >
                  <ChatBubbleLeftRightIcon className="w-5 h-5" />
                  <span className="flex items-center space-x-2">
                    <span>Customer Support</span>
                    {chatLoading ? (
                      <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : unreadCount > 0 ? (
                      <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-5 text-center">
                        {unreadCount}
                      </span>
                    ) : null}
                  </span>
                </Link>
              </div>

              <div className="border-t border-gray-100 pt-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );

  // ======================== MOBILE MENU ========================
  const MobileMenu = () => (
    <div
      ref={mobileMenuRef}
      className={`lg:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg transition-all duration-300 ${
        isMenuOpen ? 'max-h-screen opacity-100 overflow-y-auto' : 'max-h-0 opacity-0 overflow-hidden'
      }`}
      style={{ maxHeight: isMenuOpen ? 'calc(100vh - 4rem)' : '0' }}
    >
      <div className="container mx-auto px-4 py-6">
        {/* Common Navigation Links */}
        <div className="space-y-2 mb-6">
          <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Navigation
          </h3>
          {commonNavigation.map((item) => (
            <NavLinkItem
              key={item.name}
              item={item}
              isMobile={true}
              onClick={() => setIsMenuOpen(false)}
            />
          ))}
          {!isAdmin && (
            <NavLinkItem
              item={{ name: "Reservation", path: "/reservation", icon: CalendarIcon }}
              isMobile={true}
              onClick={() => setIsMenuOpen(false)}
            />
          )}
        </div>

        {/* User Specific Links */}
        {user ? (
          <>
            <div className="space-y-2 mb-6">
              <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {isAdmin ? 'Admin Panel' : 'My Account'}
              </h3>
              {(isAdmin ? adminNavigation : customerNavigation).map((item) => (
                <NavLinkItem
                  key={item.name}
                  item={item}
                  isMobile={true}
                  onClick={() => setIsMenuOpen(false)}
                />
              ))}
              
              {/* Admin Chat Link for Mobile */}
              {isAdmin && (
                <Link
                  to="/admin/chat"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  <div className="flex items-center space-x-3">
                    <ChatBubbleLeftRightIcon className="w-5 h-5" />
                    <span>Customer Support</span>
                  </div>
                  {chatLoading ? (
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : unreadCount > 0 ? (
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  ) : null}
                </Link>
              )}
            </div>

            {/* User Info Section */}
            <div className="border-t border-gray-200 pt-6 mb-4">
              <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg mb-4">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 bg-gray-100 flex items-center justify-center">
                  {getPhotoURL() && getPhotoURL() !== "/default-avatar.png" ? (
                    <img
                      src={getPhotoURL()}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/default-avatar.png";
                      }}
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center text-white font-semibold text-sm ${
                      isAdmin 
                        ? 'bg-gradient-to-br from-blue-400 to-cyan-500' 
                        : 'bg-gradient-to-br from-amber-400 to-orange-500'
                    }`}>
                      {getDisplayName().charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {getDisplayName()}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.email}
                  </p>
                  <div className="mt-1">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      isAdmin 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-amber-500 text-white'
                    }`}>
                      {isAdmin ? 'Admin' : 'Customer'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center justify-center space-x-3 w-full px-4 py-3 text-red-600 bg-red-50 rounded-lg font-medium hover:bg-red-100 transition-colors"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </>
        ) : (
          /* Sign In Button for Mobile */
          <div className="border-t border-gray-200 pt-6">
            <Link
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span>Sign In</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  // Show loading state
  if (loading) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="flex flex-col space-y-1">
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center space-x-3 group"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
            <span className="text-white font-bold text-sm">🍕</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              TasteHub
            </span>
            <span className="text-xs text-amber-600 font-medium">
              {isAdmin ? "Admin Panel" : "Food Delivery"}
            </span>
          </div>
        </NavLink>

        {/* Render appropriate navbar based on role */}
        {isAdmin ? <AdminNavbar /> : <CustomerNavbar />}

        {/* Mobile Hamburger */}
        <div className="lg:hidden flex items-center space-x-2">
          {/* Cart Icon for Mobile - Customer (only when logged in) */}
          {!isAdmin && user && <CartIcon />}

          {/* Sign In button for mobile when not logged in */}
          {!user && (
            <Link
              to="/login"
              className="px-4 py-2 bg-amber-500 text-white rounded-lg font-semibold text-sm hover:bg-amber-600 transition-colors"
            >
              Sign In
            </Link>
          )}

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg text-gray-600 hover:bg-amber-50 hover:text-amber-700 transition-colors border border-gray-200"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu />
    </nav>
  );
};

export default Navbar;