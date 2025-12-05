import React, { useState } from 'react';
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
      className="group relative h-full flex flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer
      bg-white/60 dark:bg-stone-800/40 backdrop-blur-md border border-white/50 dark:border-stone-700/50 shadow-sm hover:shadow-xl hover:shadow-rose-900/5 dark:hover:shadow-black/30"
      onClick={handleViewDetails}
      onKeyDown={(e) => e.key === 'Enter' && handleViewDetails()}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${item.name}`}
    >
      <div className="relative h-72 w-full overflow-hidden">
        <img src={item.imageURL} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
         {item.stock <= 0 && (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-white font-bold text-sm uppercase tracking-widest border border-white/50 px-4 py-2">Out of Stock</span>
          </div>
        )}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 bg-white/70 dark:bg-black/40 backdrop-blur-md p-2.5 rounded-full text-rose-500 hover:text-rose-600 hover:bg-white dark:hover:bg-black/60 transition-all duration-300 shadow-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
          aria-label={itemInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {itemInWishlist ? <HeartIcon className="w-5 h-5"/> : <HeartOutlineIcon className="w-5 h-5"/>}
        </button>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-2">
            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest">{item.category}</span>
            <h3 className="text-lg font-serif font-medium text-stone-800 dark:text-stone-100 leading-snug mt-1 group-hover:text-rose-700 dark:group-hover:text-rose-300 transition-colors">{item.name}</h3>
        </div>
        
        <p className="text-sm text-stone-500 dark:text-stone-400 line-clamp-2 flex-grow font-light leading-relaxed">{item.description}</p>
        
        <div className="mt-5 flex justify-between items-center pt-4 border-t border-stone-200/50 dark:border-stone-700/50">
          <p className="text-xl font-serif font-medium text-stone-800 dark:text-stone-200">₹{item.price.toFixed(2)}</p>
          <button
            onClick={handleAddToCart}
            disabled={item.stock <= 0}
            className={`flex items-center justify-center gap-2 w-auto text-white px-5 py-2 rounded-full font-medium text-sm transition-all duration-200 
              bg-stone-800 dark:bg-stone-700 hover:bg-rose-600 dark:hover:bg-rose-600 shadow-md hover:shadow-lg hover:shadow-rose-500/20 active:scale-95
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500
              disabled:bg-stone-300 dark:disabled:bg-stone-800 disabled:cursor-not-allowed disabled:shadow-none disabled:active:scale-100
            `}
            aria-label={`Add ${item.name} to cart`}
          >
            <CartAddIcon className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;