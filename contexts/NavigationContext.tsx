import React, { createContext, useState, useContext, ReactNode } from 'react';
import { GlossaryItem, Order, Page } from '../types';

interface NavigationParams {
  item?: GlossaryItem;
  order?: Order;
}

interface NavigationContextState {
  page: Page;
  params: NavigationParams;
  navigate: (page: Page, params?: NavigationParams) => void;
}

const NavigationContext = createContext<NavigationContextState | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [page, setPage] = useState<Page>('store');
  const [params, setParams] = useState<NavigationParams>({});

  const navigate = (newPage: Page, newParams: NavigationParams = {}) => {
    setPage(newPage);
    setParams(newParams);
    window.scrollTo(0, 0); // Scroll to top on page change
  };

  return (
    <NavigationContext.Provider value={{ page, params, navigate }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextState => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
