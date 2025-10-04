
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { ToastMessage } from '../types';

interface ToastContextState {
  showToast: (message: string, type: ToastMessage['type']) => void;
}

const ToastContext = createContext<ToastContextState | undefined>(undefined);
export const ToastStateContext = createContext<ToastMessage[]>([]);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastMessage['type']) => {
    const id = Date.now();
    setToasts(currentToasts => [...currentToasts, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      <ToastStateContext.Provider value={toasts}>
        {children}
      </ToastStateContext.Provider>
    </ToastContext.Provider>
  );
};

export const useToasts = (): ToastContextState => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToasts must be used within a ToastProvider');
  }
  return context;
};
