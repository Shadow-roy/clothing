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
  'Dresses',
  'Tops',
  'Skirts',
  'Pants',
  'Outerwear',
  'Accessories',
];

export const INITIAL_ITEMS: GlossaryItem[] = [
  {
    id: '1',
    name: 'Classic A-Line Midi Dress',
    description: 'A timeless piece with a flattering A-line silhouette, perfect for any occasion.',
    price: 4500,
    stock: 50,
    imageURL: 'https://images.unsplash.com/photo-1572804013427-4d7ca7268211?auto=format&fit=crop&q=80&w=870',
    category: 'Dresses',
  },
  {
    id: '2',
    name: 'Silk Button-Up Blouse',
    description: 'Luxurious and versatile, this silk blouse can be dressed up or down.',
    price: 2800,
    stock: 80,
    imageURL: 'https://images.unsplash.com/photo-1620799140408-edc6d5f9650d?auto=format&fit=crop&q=80&w=870',
    category: 'Tops',
  },
  {
    id: '3',
    name: 'High-Waisted Pleated Skirt',
    description: 'Flowy and chic, this pleated skirt adds a touch of elegance to your look.',
    price: 3200,
    stock: 60,
    imageURL: 'https://images.unsplash.com/photo-1594610199422-315606132402?auto=format&fit=crop&q=80&w=870',
    category: 'Skirts',
  },
  {
    id: '4',
    name: 'Tailored Wide-Leg Trousers',
    description: 'Sophisticated and comfortable, these trousers are a modern wardrobe essential.',
    price: 3800,
    stock: 70,
    imageURL: 'https://images.unsplash.com/photo-1594623930312-2a7053e6d16c?auto=format&fit=crop&q=80&w=870',
    category: 'Pants',
  },
  {
    id: '5',
    name: 'Cashmere Blend Cardigan',
    description: 'Stay cozy and stylish with our incredibly soft cashmere blend cardigan.',
    price: 6500,
    stock: 40,
    imageURL: 'https://images.unsplash.com/photo-1552902250-286c08521d92?auto=format&fit=crop&q=80&w=870',
    category: 'Outerwear',
  },
  {
    id: '6',
    name: 'Leather Crossbody Bag',
    description: 'A minimalist and functional crossbody bag, crafted from genuine leather.',
    price: 5500,
    stock: 90,
    imageURL: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&q=80&w=870',
    category: 'Accessories',
  },
  {
    id: '7',
    name: 'Floral Print Maxi Dress',
    description: 'Embrace the season with this stunning floral maxi dress, featuring a side slit.',
    price: 5200,
    stock: 45,
    imageURL: 'https://images.unsplash.com/photo-1604337424266-d4a9415842c2?auto=format&fit=crop&q=80&w=870',
    category: 'Dresses',
  },
  {
    id: '8',
    name: 'Puff Sleeve Bodysuit',
    description: 'A trendy and comfortable bodysuit with statement puff sleeves.',
    price: 2200,
    stock: 100,
    imageURL: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&q=80&w=870',
    category: 'Tops',
  },
];