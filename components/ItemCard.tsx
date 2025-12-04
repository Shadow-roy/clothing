import React from 'react';
import { GlossaryItem } from '../types';
import { useCart } from '../contexts/CartContext';
import { useNavigation } from '../contexts/NavigationContext';
import { useToasts } from '../contexts/ToastContext';
import { useWishlist } from '../contexts/WishlistContext';
import { CartAddIcon } from './icons/CartAddIcon';
import { HeartIcon } from './icons/HeartIcon';
import { HeartOutlineIcon } from './icons/HeartOutlineIcon';

interface ItemCardProps {
  item: GlossaryItem;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const { addToCart } = useCart();
  const { navigate } = useNavigation();
  const { showToast } = useToasts();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const itemInWishlist = isInWishlist(item.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.stock > 0) {
      addToCart(item);
      showToast(`${item.name} added to cart`, 'success');
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (itemInWishlist) {
      removeFromWishlist(item.id);
      showToast(`${item.name} removed from wishlist`, 'success');
    } else {
      addToWishlist(item);
      showToast(`${item.name} added to wishlist`, 'success');
    }
  };

  const handleViewDetails = () => {
    navigate('detail', { item });
  };

  return (
    <div 
      className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-500 flex flex-col cursor-pointer group"
      onClick={handleViewDetails}
      onKeyDown={(e) => e.key === 'Enter' && handleViewDetails()}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${item.name}`}
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img src={item.imageURL} alt={item.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
         {item.stock <= 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg bg-red-600 px-3 py-1 rounded">Out of Stock</span>
          </div>
        )}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-2 right-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm p-2 rounded-full text-red-500 hover:text-red-600 hover:bg-white dark:hover:bg-slate-700 transition-all duration-200 opacity-0 group-hover:opacity-100"
          aria-label={itemInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {itemInWishlist ? <HeartIcon className="w-5 h-5"/> : <HeartOutlineIcon className="w-5 h-5"/>}
        </button>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 truncate">{item.name}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 flex-grow min-h-[40px]">{item.description.substring(0, 60)}...</p>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-xl font-bold text-slate-700 dark:text-slate-200">₹{item.price.toFixed(2)}</p>
          <button
            onClick={handleAddToCart}
            disabled={item.stock <= 0}
            className={`flex items-center justify-center gap-2 w-auto text-white px-4 py-2 rounded-md font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
              bg-indigo-600 hover:bg-indigo-700
              disabled:bg-gray-400 disabled:cursor-not-allowed
            `}
            aria-label={`Add ${item.name} to cart`}
          >
            <CartAddIcon className="w-5 h-5" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;