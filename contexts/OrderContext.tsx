
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Order, CartItem, CustomerDetails } from '../types';

interface OrderContextState {
  orders: Order[];
  isHistoryOpen: boolean;
  addOrder: (items: CartItem[], customer: CustomerDetails, paymentMethod: Order['paymentMethod'], paymentProof?: string) => Order;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  openHistory: () => void;
  closeHistory: () => void;
}

const OrderContext = createContext<OrderContextState | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    const storedOrders = localStorage.getItem('glossaryOrders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('glossaryOrders', JSON.stringify(orders));
  }, [orders]);

  const addOrder = (items: CartItem[], customer: CustomerDetails, paymentMethod: Order['paymentMethod'], paymentProof?: string): Order => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 40; // Assuming a fixed shipping cost
    const total = subtotal + shipping;

    const newOrder: Order = {
      id: `#${Date.now().toString().slice(-6)}`,
      customer,
      items,
      total,
      subtotal,
      shipping,
      date: new Date().toISOString(),
      status: 'Pending',
      paymentMethod,
      paymentProof,
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(order => order.id === id ? { ...order, status } : order));
  };

  const openHistory = () => setIsHistoryOpen(true);
  const closeHistory = () => setIsHistoryOpen(false);

  return (
    <OrderContext.Provider value={{ orders, isHistoryOpen, addOrder, updateOrderStatus, openHistory, closeHistory }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = (): OrderContextState => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};