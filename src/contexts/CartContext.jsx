import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Load cart from localStorage on component mount
  useEffect(() => {
    loadCartFromStorage();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    saveCartToStorage();
  }, [cartItems]);

  // Load cart from localStorage
  const loadCartFromStorage = () => {
    try {
      const savedCart = localStorage.getItem('tastehub-cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(Array.isArray(parsedCart) ? parsedCart : []);
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      setCartItems([]);
    }
  };

  // Save cart to localStorage
  const saveCartToStorage = () => {
    try {
      localStorage.setItem('tastehub-cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  };

  // Add item to cart (LOCAL STORAGE ONLY for now)
  const addToCart = async (foodItem, quantity = 1) => {
    // Validate stock
    if (foodItem.quantity < quantity) {
      throw new Error(`Only ${foodItem.quantity} items available`);
    }

    // For now, use only local storage (remove database calls)
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item._id === foodItem._id);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > foodItem.quantity) {
          throw new Error(`Only ${foodItem.quantity} items available`);
        }
        
        return prevItems.map(item =>
          item._id === foodItem._id
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        return [...prevItems, { 
          ...foodItem, 
          quantity,
          availableQuantity: foodItem.quantity // Add available quantity for validation
        }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    // Remove from local state only
    setCartItems(prevItems => prevItems.filter(item => item._id !== itemId));
  };

  // Update item quantity
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      await removeFromCart(itemId);
      return;
    }

    // Find the item to check stock
    const item = cartItems.find(item => item._id === itemId);
    if (item && newQuantity > item.availableQuantity) {
      throw new Error(`Only ${item.availableQuantity} items available`);
    }

    // Update in local state only
    setCartItems(prevItems =>
      prevItems.map(item =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Clear cart
  const clearCart = async () => {
    // Clear local state only
    setCartItems([]);
    localStorage.removeItem('tastehub-cart');
  };

  // Calculate total items count
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Calculate total price
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Check if item is in cart
  const isInCart = (itemId) => {
    return cartItems.some(item => item._id === itemId);
  };

  // Get item quantity in cart
  const getItemQuantity = (itemId) => {
    const item = cartItems.find(item => item._id === itemId);
    return item ? item.quantity : 0;
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isInCart,
    getItemQuantity,
    isLoading
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};