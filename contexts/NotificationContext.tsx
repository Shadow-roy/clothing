
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Order } from '../types';

export interface Notification {
    id: number;
    message: string;
    orderId: string;
    read: boolean;
    timestamp: string;
}

interface NotificationContextState {
  notifications: Notification[];
  unreadCount: number;
  isPanelOpen: boolean;
  addNotification: (order: Order) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  togglePanel: () => void;
  closePanel: () => void;
}

const NotificationContext = createContext<NotificationContextState | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    const addNotification = useCallback((order: Order) => {
        const newNotification: Notification = {
            id: Date.now(),
            message: `New order ${order.id} received from ${order.customer.fullName}.`,
            orderId: order.id,
            read: false,
            timestamp: new Date().toISOString(),
        };
        setNotifications(prev => [newNotification, ...prev]);
    }, []);

    const markAsRead = (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const togglePanel = () => setIsPanelOpen(prev => !prev);
    const closePanel = () => setIsPanelOpen(false);
    
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, isPanelOpen, addNotification, markAsRead, markAllAsRead, togglePanel, closePanel }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = (): NotificationContextState => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
