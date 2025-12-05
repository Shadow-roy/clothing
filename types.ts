// Fix: Created types for the application.

export interface GlossaryItem {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageURL: string;
  category: string;
}

export interface CartItem extends GlossaryItem {
  quantity: number;
}

export interface CustomerDetails {
  fullName: string;
  phone: string;
  address: string;
}

export interface Order {
  id: string;
  customer: CustomerDetails;
  items: CartItem[];
  total: number;
  subtotal: number;
  shipping: number;
  date: string;
  status: 'Pending' | 'Out for Delivery' | 'Delivered';
  paymentMethod: 'Phone Pay' | 'Cash on Delivery';
}

export type Page = 'store' | 'detail' | 'checkout' | 'confirmation' | 'admin' | 'login' | 'profile';

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error';
}

export interface User {
  id: string;
  username: string;
  password?: string;
  role: 'admin' | 'user';
  provider?: 'google' | 'credentials';
  customerDetails?: CustomerDetails;
}

export interface Review {
    id: string;
    itemId: string;
    userId: string;
    userName: string;
    rating: number; // 1 to 5
    comment: string;
    date: string;
}