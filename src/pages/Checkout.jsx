import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../providers/AuthProvider';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const Checkout = () => {
  const { cartItems, clearCart, getTotalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [checkoutData, setCheckoutData] = useState({
    deliveryAddress: '',
    specialInstructions: '',
    paymentMethod: 'card',
    contactNumber: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e) => {
    setCheckoutData({
      ...checkoutData,
      [e.target.name]: e.target.value
    });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    
    if (!checkoutData.deliveryAddress.trim()) {
      toast.error('Please enter delivery address');
      return;
    }

    if (!checkoutData.contactNumber.trim()) {
      toast.error('Please enter contact number');
      return;
    }

    setIsProcessing(true);

    try {
      // Process each item in cart as individual orders
      const results = await Promise.allSettled(
        cartItems.map(async (item) => {
          const order = {
            foodId: item._id,
            foodName: item.foodName,
            foodImage: item.foodImage,
            price: item.price,
            quantity: item.quantity,
            totalPrice: item.price * item.quantity,
            buyerName: user.displayName,
            buyerEmail: user.email,
            buyerPhoto: user.photoURL,
            deliveryAddress: checkoutData.deliveryAddress,
            contactNumber: checkoutData.contactNumber,
            specialInstructions: checkoutData.specialInstructions,
            paymentMethod: checkoutData.paymentMethod,
            date: new Date(),
            status: 'pending'
          };

          console.log('🛒 Creating purchase for:', item.foodName);

          // FIXED: Use correct endpoint without /api
          const purchaseRes = await fetch("http://localhost:5000/purchase", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(order),
          });

          if (!purchaseRes.ok) {
            const errorText = await purchaseRes.text();
            let errorMessage = `Failed to order ${item.foodName}`;
            
            try {
              const errorData = JSON.parse(errorText);
              errorMessage = errorData.error || errorMessage;
            } catch {
              errorMessage = errorText || errorMessage;
            }
            
            throw new Error(errorMessage);
          }

          const purchaseResult = await purchaseRes.json();
          console.log('✅ Purchase created:', purchaseResult);

          // FIXED: Use correct endpoint without /api
          const updateRes = await fetch(`http://localhost:5000/foods/${item._id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              quantity: item.availableQuantity - item.quantity,
              purchaseCount: (item.purchaseCount || 0) + item.quantity
            })
          });

          if (!updateRes.ok) {
            console.warn(`⚠️ Failed to update quantity for ${item.foodName}, but order was placed`);
          } else {
            console.log('✅ Food quantity updated for:', item.foodName);
          }

          return purchaseResult;
        })
      );

      // Check if any orders failed
      const failedOrders = results.filter(result => result.status === 'rejected');
      
      if (failedOrders.length > 0) {
        console.error('❌ Some orders failed:', failedOrders);
        const errorMessages = failedOrders.map(failed => failed.reason?.message || 'Unknown error');
        throw new Error(`Some items failed to order: ${errorMessages.join(', ')}`);
      }

      // All orders successful
      toast.success('🎉 Order placed successfully!');
      await clearCart();
      navigate('/my-orders');
      
    } catch (error) {
      console.error("❌ Checkout error:", error);
      toast.error(error.message || "Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.1;
  const deliveryFee = 0;
  const total = subtotal + tax + deliveryFee;

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
            <span className="text-amber-700 text-sm font-semibold">💰 Checkout</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Complete Your <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Order</span>
          </h1>
          <p className="text-gray-600">Review your order and enter delivery details</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Delivery Information</h2>
              
              <form onSubmit={handleCheckout} className="space-y-4">
                {/* Delivery Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Address *
                  </label>
                  <textarea
                    name="deliveryAddress"
                    value={checkoutData.deliveryAddress}
                    onChange={handleInputChange}
                    placeholder="Enter your complete delivery address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                    rows="3"
                    required
                  />
                </div>

                {/* Contact Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={checkoutData.contactNumber}
                    onChange={handleInputChange}
                    placeholder="Your phone number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                    required
                  />
                </div>

                {/* Special Instructions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Instructions
                  </label>
                  <textarea
                    name="specialInstructions"
                    value={checkoutData.specialInstructions}
                    onChange={handleInputChange}
                    placeholder="Any special delivery instructions..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                    rows="2"
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <select
                    name="paymentMethod"
                    value={checkoutData.paymentMethod}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  >
                    <option value="card">Credit/Debit Card</option>
                    <option value="cash">Cash on Delivery</option>
                    <option value="digital">Digital Wallet</option>
                  </select>
                </div>

                {/* User Info (Readonly) */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={user?.displayName || 'User'}
                      readOnly
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Email
                    </label>
                    <input
                      type="email"
                      value={user?.email}
                      readOnly
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-600"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isProcessing || cartItems.length === 0}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-amber-500/25 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-6"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing Order...</span>
                    </span>
                  ) : (
                    `Place Order - $${total.toFixed(2)}`
                  )}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6 sticky top-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
              
              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center space-x-4 pb-4 border-b border-gray-100">
                    <img
                      src={item.foodImage}
                      alt={item.foodName}
                      className="w-16 h-16 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{item.foodName}</h3>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-amber-600">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-800">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Back to Cart */}
              <button
                onClick={() => navigate('/cart')}
                className="w-full py-3 border-2 border-amber-500 text-amber-600 font-semibold rounded-xl hover:bg-amber-50 transition-all duration-300"
              >
                Back to Cart
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;