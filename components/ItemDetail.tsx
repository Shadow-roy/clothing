
// Fix: Implemented the ItemDetail component.
import React, { useState } from 'react';
import { GlossaryItem } from '../types';
import { useCart } from '../contexts/CartContext';
import { useNavigation } from '../contexts/NavigationContext';
import { useToasts } from '../contexts/ToastContext';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { PlusIcon } from './icons/PlusIcon';
import { MinusIcon } from './icons/MinusIcon';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';

interface ItemDetailProps {
  item: GlossaryItem;
}

const ItemDetail: React.FC<ItemDetailProps> = ({ item }) => {
  const { addToCart, cartItems } = useCart();
  const { navigate } = useNavigation();
  const { showToast } = useToasts();
  const [quantity, setQuantity] = useState(1);

  const cartItem = cartItems.find(ci => ci.id === item.id);
  const stockAvailableForPurchase = item.stock - (cartItem?.quantity || 0);

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => {
      const newQuantity = prev + amount;
      if (newQuantity < 1) return 1;
      if (newQuantity > stockAvailableForPurchase) return stockAvailableForPurchase;
      return newQuantity;
    });
  };

  const handleAddToCart = () => {
    if (quantity > 0 && stockAvailableForPurchase > 0) {
        for (let i = 0; i < quantity; i++) {
            addToCart(item);
        }
        showToast(`${quantity} x ${item.name} added to cart`, 'success');
        setQuantity(1); // Reset quantity after adding
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-4 sm:p-8 max-w-4xl mx-auto">
      <button 
        onClick={() => navigate('store')}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        Back to Store
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img src={item.imageURL} alt={item.name} className="w-full h-auto object-cover rounded-lg shadow-md" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full self-start">{item.category}</span>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">{item.name}</h1>
          <p className="text-gray-600 mt-2 flex-grow">{item.description}</p>
          
          <div className="mt-6">
            <p className="text-3xl font-extrabold text-gray-900">₹{item.price.toFixed(2)}</p>
            <p className="text-sm mt-1 text-gray-500">{item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}</p>
          </div>
          
          {item.stock > 0 ? (
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <div className="flex items-center border border-gray-300 rounded-full">
                <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1} className="p-3 text-gray-600 hover:text-gray-900 disabled:opacity-50" aria-label="Decrease quantity">
                  <MinusIcon className="w-5 h-5" />
                </button>
                <span className="w-12 text-center font-semibold" aria-live="polite">{quantity}</span>
                <button onClick={() => handleQuantityChange(1)} disabled={quantity >= stockAvailableForPurchase} className="p-3 text-gray-600 hover:text-gray-900 disabled:opacity-50" aria-label="Increase quantity">
                  <PlusIcon className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={stockAvailableForPurchase <= 0}
                className="flex-1 flex items-center justify-center gap-3 bg-emerald-600 text-white font-semibold py-3 px-6 rounded-full hover:bg-emerald-700 disabled:bg-gray-400 transition-colors"
              >
                <ShoppingCartIcon className="w-6 h-6" />
                Add to Cart
              </button>
            </div>
          ) : (
            <div className="mt-8 text-center p-4 bg-red-100 text-red-700 rounded-lg">
              This item is currently out of stock.
            </div>
          )}
           {stockAvailableForPurchase < quantity && stockAvailableForPurchase > 0 &&
                <p className="text-sm text-red-500 mt-2 text-center">Only {stockAvailableForPurchase} more can be added to the cart.</p>
            }
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
