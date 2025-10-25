import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useAuth } from '../providers/AuthProvider';

const AddToCartButton = ({ 
  food, 
  size = 'medium', 
  showQuantity = false,
  className = '' 
}) => {
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const isOutOfStock = food.quantity === 0;
  const currentQuantity = getItemQuantity(food._id);
  const maxQuantity = Math.min(food.quantity, 20);

  const handleAddToCart = async () => {
    if (isOutOfStock) {
      toast.error('😔 This item is currently out of stock');
      return;
    }

    if (quantity > maxQuantity) {
      toast.error(`🚫 Maximum ${maxQuantity} items allowed`);
      return;
    }

    setIsAdding(true);
    
    try {
      await addToCart(food, quantity);
      toast.success(
        `🛒 Added ${quantity} ${food.foodName} to cart!`,
        { position: "top-center", autoClose: 2000 }
      );
      setQuantity(1);
    } catch (error) {
      toast.error(`❌ ${error.message}`);
    } finally {
      setIsAdding(false);
    }
  };

  // Size styles
  const sizeStyles = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-3 text-base', 
    large: 'px-6 py-4 text-lg'
  };

  return (
    <div className={`flex flex-col space-y-3 ${className}`}>
      {/* Quantity Selector */}
      {showQuantity && !isOutOfStock && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Quantity:</label>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1 || isAdding}
              className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center hover:bg-amber-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              −
            </button>
            <span className="w-8 text-center font-semibold text-gray-800">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
              disabled={quantity >= maxQuantity || isAdding}
              className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center hover:bg-amber-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* Stock Status */}
      {isOutOfStock ? (
        <div className="w-full px-4 py-3 bg-gray-100 text-gray-500 rounded-xl text-center font-medium cursor-not-allowed">
          ⚠️ Out of Stock
        </div>
      ) : (
        <motion.button
          onClick={handleAddToCart}
          disabled={isAdding || isOutOfStock}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            w-full ${sizeStyles[size]} font-semibold rounded-xl shadow-lg
            transition-all duration-300 flex items-center justify-center space-x-2
            ${isAdding || isOutOfStock
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-amber-500/25'
            }
          `}
        >
          {isAdding ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Adding...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>
                {isInCart(food._id) ? `Add More (${currentQuantity} in cart)` : 'Add to Cart'}
              </span>
            </>
          )}
        </motion.button>
      )}

      {/* Cart Status */}
      {currentQuantity > 0 && !isOutOfStock && (
        <div className="text-center">
          <p className="text-sm text-amber-600 font-medium">
            ✅ {currentQuantity} in your cart
          </p>
          <p className="text-xs text-gray-500">
            {food.quantity - currentQuantity} available
          </p>
        </div>
      )}

      {/* Guest User Notice */}
      {!user && !isOutOfStock && (
        <p className="text-xs text-gray-500 text-center">
          💡 Sign in to save your cart across devices
        </p>
      )}
    </div>
  );
};

export default AddToCartButton;