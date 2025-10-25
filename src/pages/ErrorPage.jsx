import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ErrorPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center px-4 py-8">
      <div className="container max-w-4xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-6 py-2 bg-amber-100 rounded-full border border-amber-200 mb-6">
            <span className="text-amber-700 text-sm font-semibold">🚧 Page Not Found</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Oops! <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Page Missing</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Looks like this recipe got lost in the kitchen!
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - 404 Illustration */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            <div className="relative">
              {/* Plate */}
              <div className="w-64 h-64 mx-auto bg-gradient-to-br from-amber-100 to-orange-100 rounded-full border-8 border-amber-200 shadow-2xl flex items-center justify-center">
                {/* Broken Utensils */}
                <div className="text-8xl mb-4">🍽️</div>
              </div>
              
              {/* Error Number */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
                className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl"
              >
                <span className="text-6xl font-bold text-white">404</span>
              </motion.div>

              {/* Floating Food Icons */}
              <motion.div
                className="absolute -top-2 -left-2 text-4xl"
                animate={{ y: [0, -10, 0], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                🍕
              </motion.div>
              <motion.div
                className="absolute -bottom-2 -right-2 text-4xl"
                animate={{ y: [0, -15, 0], rotate: [0, -15, 15, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                🍔
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Message & Actions */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg border border-amber-200 p-8"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl text-red-500">❌</span>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Page Not Found
              </h2>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                The page you're looking for seems to have wandered off from our menu. 
                It might have been moved, deleted, or perhaps it never existed.
              </p>

              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 mb-6">
                <h3 className="font-semibold text-amber-800 mb-2">What you can do:</h3>
                <ul className="text-sm text-amber-700 space-y-1 text-left">
                  <li>• Check the URL for typos</li>
                  <li>• Go back to the homepage</li>
                  <li>• Browse our delicious menu instead</li>
                  <li>• Contact us if you need help</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-amber-500/25 transition-all duration-300 text-center"
                >
                  🏠 Back to Home
                </Link>
                <Link
                  to="/all-foods"
                  className="flex-1 px-6 py-3 border-2 border-amber-500 text-amber-600 font-semibold rounded-xl hover:bg-amber-50 transition-all duration-300 text-center"
                >
                  🍽️ Browse Menu
                </Link>
              </div>

              {/* Quick Links */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">Quick Links:</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {["Home", "Menu", "About", "Contact"].map((link, index) => (
                    <Link
                      key={index}
                      to={link === "Home" ? "/" : `/${link.toLowerCase()}`}
                      className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full hover:bg-amber-200 transition-colors duration-200"
                    >
                      {link}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Decoration */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-12"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-amber-800 mb-3">
              Still Can't Find What You're Looking For?
            </h3>
            <p className="text-gray-600 mb-4">
              Our team is here to help you navigate through TasteHub!
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center space-x-2 px-6 py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors duration-200"
            >
              <span>📞</span>
              <span>Contact Support</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ErrorPage;