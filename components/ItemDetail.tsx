// Fix: Implemented the ItemDetail component.
import React, { useState } from 'react';
import { GlossaryItem } from '../types';
import { useCart } from '../contexts/CartContext';
import { useNavigation } from '../contexts/NavigationContext';
import { useToasts } from '../contexts/ToastContext';
import { useWishlist } from '../contexts/WishlistContext';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { PlusIcon } from './icons/PlusIcon';
import { MinusIcon } from './icons/MinusIcon';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { HeartIcon } from './icons/HeartIcon';
import { HeartOutlineIcon } from './icons/HeartOutlineIcon';

interface ItemDetailProps {
  item: GlossaryItem;
}

const ItemDetail: React.FC<ItemDetailProps> = ({ item }) => {
  const { addToCart, cartItems } = useCart();
  const { navigate } = useNavigation();
  const { showToast } = useToasts();
  const [quantity, setQuantity] = useState(1);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const cartItem = cartItems.find(ci => ci.id === item.id);
  const stockAvailableForPurchase = item.stock - (cartItem?.quantity || 0);

  const itemInWishlist = isInWishlist(item.id);

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

  const handleToggleWishlist = () => {
    if (itemInWishlist) {
      removeFromWishlist(item.id);
      showToast(`${item.name} removed from wishlist`, 'success');
    } else {
      addToWishlist(item);
      showToast(`${item.name} added to wishlist`, 'success');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-4 sm:p-8 max-w-4xl mx-auto">
      <button 
        onClick={() => navigate('store')}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white mb-6"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        Back to Store
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img src={item.imageURL} alt={item.name} className="w-full h-auto object-cover rounded-lg shadow-md" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-indigo-800 bg-indigo-100 dark:text-indigo-200 dark:bg-indigo-900/50 px-3 py-1 rounded-full self-start">{item.category}</span>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-4">{item.name}</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 flex-grow">{item.description}</p>
          
          <div className="mt-6">
            <p className="text-3xl font-extrabold text-slate-700 dark:text-slate-200">₹{item.price.toFixed(2)}</p>
            <p className="text-sm mt-1 text-slate-500 dark:text-slate-400">{item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}</p>
          </div>
          
          {item.stock > 0 ? (
            <div className="mt-8 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-full">
                  <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1} className="p-3 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white disabled:opacity-50" aria-label="Decrease quantity">
                    <MinusIcon className="w-5 h-5" />
                  </button>
                  <span className="w-12 text-center font-semibold text-slate-800 dark:text-slate-100" aria-live="polite">{quantity}</span>
                  <button onClick={() => handleQuantityChange(1)} disabled={quantity >= stockAvailableForPurchase} className="p-3 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white disabled:opacity-50" aria-label="Increase quantity">
                    <PlusIcon className="w-5 h-5" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={stockAvailableForPurchase <= 0}
                  className="flex-1 flex items-center justify-center gap-3 bg-indigo-600 text-white font-semibold py-3 px-6 rounded-full hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
                >
                  <ShoppingCartIcon className="w-6 h-6" />
                  Add to Cart
                </button>
              </div>
               <button
                onClick={handleToggleWishlist}
                className="flex items-center justify-center gap-2 w-full text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 py-3 px-6 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
              >
                {itemInWishlist ? <HeartIcon className="w-5 h-5 text-red-500" /> : <HeartOutlineIcon className="w-5 h-5" />}
                {itemInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>
            </div>
          ) : (
            <div className="mt-8 text-center p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
              This item is currently out of stock.
            </div>
          )}
           {stockAvailableForPurchase < quantity && stockAvailableForPurchase > 0 &&
                <p className="text-sm text-red-600 dark:text-red-400 mt-2 text-center">Only {stockAvailableForPurchase} more can be added to the cart.</p>
            }
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;