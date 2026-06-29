import React, { createContext, useState, useEffect } from 'react';

// Create context
export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const storedWishlist = localStorage.getItem('velora_wishlist');
    if (storedWishlist) {
      try {
        setWishlistItems(JSON.parse(storedWishlist));
      } catch (err) {
        console.error("Could not parse wishlist from localStorage", err);
      }
    }
  }, []);

  // Save to localStorage when wishlist changes
  useEffect(() => {
    localStorage.setItem('velora_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (product) => {
    setWishlistItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev; // Already in wishlist
      } else {
        return [...prev, product];
      }
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems(prev => prev.filter(item => item.id !== productId));
  };
  
  const toggleWishlist = (product) => {
    setWishlistItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.filter(item => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist, wishlistCount }}>
      {children}
    </WishlistContext.Provider>
  );
};
