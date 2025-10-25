import React from 'react';
import { useCart } from '../contexts/CartContext'; 
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CartIcon = () => {
  const { getTotalItems } = useCart();

  return (
    <Link to="/cart" className="relative">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative p-2 text-gray-700 hover:text-amber-600 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21" />
        </svg>
        
        {getTotalItems() > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
          >
            {getTotalItems() > 99 ? '99+' : getTotalItems()}
          </motion.span>
        )}
      </motion.div>
    </Link>
  );
};

export default CartIcon;