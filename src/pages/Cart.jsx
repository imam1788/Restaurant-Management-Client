import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../providers/AuthProvider';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const Cart = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getTotalPrice,
    getTotalItems 
  } = useCart();
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      toast.info('Please login to proceed with checkout');
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Navigate to checkout page (we'll create this next)
    navigate('/checkout');
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    try {
      await updateQuantity(itemId, newQuantity);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRemoveItem = async (itemId, itemName) => {
    try {
      await removeFromCart(itemId);
      toast.success(`Removed ${itemName} from cart`);
    } catch (error) {
      toast.error('Failed to remove item from cart');
    }
  };

  const handleClearCart = async () => {
    if (cartItems.length === 0) return;
    
    try {
      await clearCart();
      toast.success('Cart cleared successfully');
    } catch (error) {
      toast.error('Failed to clear cart');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🛒</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any delicious foods to your cart yet. 
              Explore our menu and find something tasty!
            </p>
            <Link
              to="/all-foods"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-amber-500/25 transition-all duration-300"
            >
              <span>Browse Foods</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center px-6 py-2 bg-amber-100 rounded-full border border-amber-200 mb-6">
            <span className="text-amber-700 text-sm font-semibold">🛒 Shopping Cart</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Your <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Cart</span>
          </h1>
          <p className="text-gray-600">
            Review your items and proceed to checkout
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-4"
          >
            {/* Cart Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Cart Items ({getTotalItems()})
              </h2>
              {cartItems.length > 0 && (
                <button
                  onClick={handleClearCart}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors text-sm font-medium"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Cart Items List */}
            {cartItems.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                  {/* Food Image */}
                  <img
                    src={item.foodImage}
                    alt={item.foodName}
                    className="w-20 h-20 object-cover rounded-xl shadow-sm flex-shrink-0"
                  />
                  
                  {/* Food Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-lg mb-1">
                      {item.foodName}
                    </h3>
                    <p className="text-amber-600 font-semibold text-xl mb-2">
                      ${item.price}
                    </p>
                    <p className="text-sm text-gray-600">
                      {item.category} • {item.quantity} in stock
                    </p>
                  </div>

                  {/* Quantity Controls and Price */}
                  <div className="flex items-center space-x-6 w-full sm:w-auto justify-between sm:justify-start">
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center hover:bg-amber-200 disabled:opacity-50 transition-colors"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-semibold text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        disabled={item.quantity >= item.availableQuantity}
                        className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center hover:bg-amber-200 disabled:opacity-50 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <p className="font-bold text-gray-800 text-lg">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item._id, item.foodName)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove item"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
              
              {/* Order Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Items ({getTotalItems()})</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>${(getTotalPrice() * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-800">
                    <span>Total</span>
                    <span>${(getTotalPrice() * 1.1).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-amber-500/25 transform hover:scale-105 transition-all duration-300 mb-4"
              >
                Proceed to Checkout
              </button>

              {/* Continue Shopping */}
              <Link
                to="/all-foods"
                className="block w-full text-center py-3 border-2 border-amber-500 text-amber-600 font-semibold rounded-xl hover:bg-amber-50 transition-all duration-300"
              >
                Continue Shopping
              </Link>

              {/* Security Badge */}
              <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-xl text-center">
                <div className="flex items-center justify-center space-x-2 text-green-700 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Secure Checkout • 100% Safe</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Cart;