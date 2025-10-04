import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { GlossaryItem, CartItem } from '../types';

interface CartContextState {
  cartItems: CartItem[];
  isCartOpen: boolean;
  cartItemCount: number;
  addToCart: (item: GlossaryItem) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextState | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (item: GlossaryItem) => {
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        const newQuantity = Math.min(existingItem.quantity + 1, item.stock);
        return prev.map(cartItem => cartItem.id === item.id ? { ...cartItem, quantity: newQuantity } : cartItem);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCartItems(prev => prev.map(item => {
        if(item.id === id) {
            // Ensure quantity does not exceed stock
            const newQuantity = Math.min(quantity, item.stock);
            return { ...item, quantity: newQuantity };
        }
        return item;
      }));
    }
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };
  
  const clearCart = () => {
    setCartItems([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const cartItemCount = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);

  return (
    <CartContext.Provider value={{ cartItems, isCartOpen, cartItemCount, addToCart, updateCartQuantity, removeFromCart, openCart, closeCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextState => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
