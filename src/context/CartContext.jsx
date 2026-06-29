import React, { createContext, useState, useEffect } from 'react';

// Create context
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('shopping_cart');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (err) {
        console.error("Could not parse cart from localStorage", err);
      }
    }
  }, []);

  // Save to localStorage when cart changes
  useEffect(() => {
    localStorage.setItem('shopping_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        // Increment quantity if exists
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Create new item with quantity 1
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    setCartItems(prev => prev.map(item => 
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, cartCount, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
