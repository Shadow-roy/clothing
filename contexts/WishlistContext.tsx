import React, { createContext, useState, useEffect, useContext, ReactNode, useMemo, useCallback } from 'react';
import { GlossaryItem } from '../types';

const WISHLIST_KEY = 'chicChariotWishlist';

interface WishlistContextState {
  wishlistItems: GlossaryItem[];
  isWishlistOpen: boolean;
  wishlistItemCount: number;
  addToWishlist: (item: GlossaryItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextState | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<GlossaryItem[]>(() => {
    try {
      const storedWishlist = localStorage.getItem(WISHLIST_KEY);
      return storedWishlist ? JSON.parse(storedWishlist) : [];
    } catch {
      return [];
    }
  });
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = useCallback((item: GlossaryItem) => {
    setWishlistItems(prev => {
      if (prev.some(i => i.id === item.id)) {
        return prev;
      }
      return [...prev, item];
    });
  }, []);

  const removeFromWishlist = useCallback((id: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const isInWishlist = useCallback((id: string) => {
    return wishlistItems.some(item => item.id === id);
  }, [wishlistItems]);

  const openWishlist = () => setIsWishlistOpen(true);
  const closeWishlist = () => setIsWishlistOpen(false);

  const wishlistItemCount = useMemo(() => wishlistItems.length, [wishlistItems]);

  return (
    <WishlistContext.Provider value={{ wishlistItems, isWishlistOpen, wishlistItemCount, addToWishlist, removeFromWishlist, isInWishlist, openWishlist, closeWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextState => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};