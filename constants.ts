// Fix: Populated constants file with initial data for the application.
import { GlossaryItem, User } from './types';

export const USERS_KEY = 'groceryGlossUsers';
export const CURRENT_USER_KEY = 'groceryGlossCurrentUser';

export const INITIAL_USERS: User[] = [
  {
    id: 'admin-1',
    username: 'sagar',
    password: '123',
    role: 'admin',
    provider: 'credentials',
  }
];

export const INITIAL_CATEGORIES: string[] = [
  'Fruits',
  'Vegetables',
  'Dairy & Eggs',
  'Bakery',
  'Meat & Seafood',
  'Pantry Staples',
  'Snacks',
  'Beverages',
];

export const INITIAL_ITEMS: GlossaryItem[] = [
  {
    id: '1',
    name: 'Organic Bananas',
    description: 'A bunch of fresh, organic bananas, rich in potassium.',
    price: 50,
    stock: 150,
    imageURL: 'https://images.unsplash.com/photo-1571771894824-c8fdc9cc92b5?auto=format&fit=crop&q=80&w=870',
    category: 'Fruits',
  },
  {
    id: '2',
    name: 'Whole Milk',
    description: '1L of fresh whole milk. Great for drinking, cereal, or cooking.',
    price: 60,
    stock: 80,
    imageURL: 'https://images.unsplash.com/photo-1620189507195-68309c04c4d5?auto=format&fit=crop&q=80&w=387',
    category: 'Dairy & Eggs',
  },
  {
    id: '3',
    name: 'Artisan Sourdough Bread',
    description: 'A freshly baked loaf of artisan sourdough bread with a crispy crust.',
    price: 150,
    stock: 40,
    imageURL: 'https://images.unsplash.com/photo-1533083328892-5f3b14a8aa3a?auto=format&fit=crop&q=80&w=870',
    category: 'Bakery',
  },
  {
    id: '4',
    name: 'Roma Tomatoes',
    description: '1kg of plump and juicy Roma tomatoes, ideal for sauces and salads.',
    price: 40,
    stock: 120,
    imageURL: 'https://images.unsplash.com/photo-1561155653-29f1b2124533?auto=format&fit=crop&q=80&w=870',
    category: 'Vegetables',
  },
  {
    id: '5',
    name: 'Free-Range Chicken Breast',
    description: '500g of lean and tender free-range chicken breast.',
    price: 250,
    stock: 50,
    imageURL: 'https://images.unsplash.com/photo-1604503468825-48a52985fc74?auto=format&fit=crop&q=80&w=870',
    category: 'Meat & Seafood',
  },
  {
    id: '6',
    name: 'Organic Avocado',
    description: 'A creamy and delicious organic Hass avocado, packed with healthy fats.',
    price: 120,
    stock: 200,
    imageURL: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&q=80&w=928',
    category: 'Fruits',
  },
  {
    id: '7',
    name: 'Quinoa',
    description: '1kg bag of organic white quinoa, a versatile and protein-rich grain.',
    price: 450,
    stock: 90,
    imageURL: 'https://images.unsplash.com/photo-1599819028247-c917b5488421?auto=format&fit=crop&q=80&w=870',
    category: 'Pantry Staples',
  },
  {
    id: '8',
    name: 'Cheddar Cheese Block',
    description: 'A 200g block of sharp cheddar cheese, perfect for slicing or shredding.',
    price: 200,
    stock: 75,
    imageURL: 'https://images.unsplash.com/photo-1619861099395-e23f035a4f54?auto=format&fit=crop&q=80&w=870',
    category: 'Dairy & Eggs',
  },
];
