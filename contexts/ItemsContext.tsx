import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { GlossaryItem } from '../types';
import { INITIAL_ITEMS, INITIAL_CATEGORIES } from '../constants';

interface ItemsContextState {
  items: GlossaryItem[];
  categories: string[];
  addItem: (item: Omit<GlossaryItem, 'id'>) => void;
  updateItem: (updatedItem: GlossaryItem) => void;
  deleteItem: (id: string) => void;
  addCategory: (category: string) => { success: boolean; message?: string };
  updateCategory: (oldName: string, newName: string) => { success: boolean; message?: string };
  deleteCategory: (category: string) => void;
}

const ItemsContext = createContext<ItemsContextState | undefined>(undefined);

export const ItemsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<GlossaryItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const storedItems = localStorage.getItem('glossaryItems');
    const storedCategories = localStorage.getItem('glossaryCategories');

    if (storedItems && storedCategories) {
      setItems(JSON.parse(storedItems));
      setCategories(JSON.parse(storedCategories));
    } else {
      setItems(INITIAL_ITEMS);
      setCategories(INITIAL_CATEGORIES);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('glossaryItems', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('glossaryCategories', JSON.stringify(categories));
  }, [categories]);

  const addItem = (item: Omit<GlossaryItem, 'id'>) => {
    const newItem: GlossaryItem = { ...item, id: Date.now().toString() };
    setItems(prev => [...prev, newItem]);
  };

  const updateItem = (updatedItem: GlossaryItem) => {
    setItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const addCategory = (category: string): { success: boolean; message?: string } => {
    const trimmedCategory = category.trim();
    if (!trimmedCategory) {
      return { success: false, message: 'Category name cannot be empty.' };
    }

    const categoryExists = categories.some(
      (c) => c.toLowerCase() === trimmedCategory.toLowerCase()
    );

    if (categoryExists) {
      return { success: false, message: `Category "${trimmedCategory}" already exists.` };
    }

    setCategories((prev) => [...prev, trimmedCategory]);
    return { success: true };
  };


  const updateCategory = (oldName: string, newName: string): { success: boolean; message?: string } => {
    const trimmedNewName = newName.trim();
    if (!trimmedNewName) {
        return { success: false, message: 'Category name cannot be empty.' };
    }
    
    const categoryExists = categories.some(
      (c) => c.toLowerCase() === trimmedNewName.toLowerCase() && c.toLowerCase() !== oldName.toLowerCase()
    );

    if (categoryExists) {
      return { success: false, message: `Category "${trimmedNewName}" already exists.` };
    }
    
    setCategories(prev => prev.map(c => c === oldName ? trimmedNewName : c));
    setItems(prev => prev.map(item => item.category === oldName ? { ...item, category: trimmedNewName } : item));
    return { success: true };
  };

  const deleteCategory = (category: string) => {
    setCategories(prev => prev.filter(c => c !== category));
  };

  return (
    <ItemsContext.Provider value={{ items, categories, addItem, updateItem, deleteItem, addCategory, updateCategory, deleteCategory }}>
      {children}
    </ItemsContext.Provider>
  );
};

export const useItems = (): ItemsContextState => {
  const context = useContext(ItemsContext);
  if (!context) {
    throw new Error('useItems must be used within an ItemsProvider');
  }
  return context;
};