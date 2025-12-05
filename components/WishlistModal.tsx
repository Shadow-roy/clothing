import React from 'react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useToasts } from '../contexts/ToastContext';
import { GlossaryItem } from '../types';
import { XMarkIcon } from './icons/XMarkIcon';
import { TrashIcon } from './icons/TrashIcon';
import { HeartIcon } from './icons/HeartIcon';
import { CartAddIcon } from './icons/CartAddIcon';

const WishlistModal: React.FC = () => {
  const { isWishlistOpen, closeWishlist, wishlistItems, removeFromWishlist, wishlistItemCount } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToasts();

  const handleAddToCart = (item: GlossaryItem) => {
    if (item.stock > 0) {
      addToCart(item);
      removeFromWishlist(item.id);
      showToast(`${item.name} moved to cart`, 'success');
    } else {
      showToast(`${item.name} is out of stock`, 'error');
    }
  };
  
  const handleRemove = (id: string, name: string) => {
    removeFromWishlist(id);
    showToast(`${name} removed from wishlist`, 'success');
  }

  if (!isWishlistOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50" aria-modal="true" role="dialog">
      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white dark:bg-stone-800 shadow-xl flex flex-col text-stone-800 dark:text-stone-100">
        <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-700">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-white">Your Wishlist ({wishlistItemCount})</h2>
          <button onClick={closeWishlist} className="text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-white" aria-label="Close wishlist">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {wishlistItems.length > 0 ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {wishlistItems.map(item => (
              <div key={item.id} className="flex items-start gap-4">
                <img src={item.imageURL} alt={item.name} className="w-20 h-20 rounded-md object-cover" />
                <div className="flex-1">
                  <p className="font-semibold text-stone-900 dark:text-stone-100">{item.name}</p>
                  <p className="text-sm text-stone-700 dark:text-stone-200 font-bold mt-1">₹{item.price.toFixed(2)}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <button
                        onClick={() => handleAddToCart(item)}
                        disabled={item.stock <= 0}
                        className="flex items-center gap-1.5 text-sm bg-rose-600 text-white px-3 py-1.5 rounded-md font-semibold transition hover:bg-rose-700 disabled:bg-stone-400"
                        aria-label={`Move ${item.name} to cart`}
                    >
                       <CartAddIcon className="w-4 h-4" /> Move to Cart
                    </button>
                    <button
                        onClick={() => handleRemove(item.id, item.name)}
                        className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400 p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/50"
                        aria-label={`Remove ${item.name} from wishlist`}
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <HeartIcon className="w-16 h-16 text-stone-300 dark:text-stone-600" />
            <h3 className="mt-4 text-xl font-semibold text-stone-800 dark:text-stone-200">Your wishlist is empty</h3>
            <p className="mt-2 text-stone-500 dark:text-stone-400">Save your favorite items here to shop for them later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistModal;