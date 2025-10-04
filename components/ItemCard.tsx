
import React from 'react';
import { GlossaryItem } from '../types';
import { useCart } from '../contexts/CartContext';
import { useNavigation } from '../contexts/NavigationContext';
import { useToasts } from '../contexts/ToastContext';
import { CartAddIcon } from './icons/CartAddIcon';

interface ItemCardProps {
  item: GlossaryItem;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const { addToCart } = useCart();
  const { navigate } = useNavigation();
  const { showToast } = useToasts();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.stock > 0) {
      addToCart(item);
      showToast(`${item.name} added to cart`, 'success');
    }
  };

  const handleViewDetails = () => {
    navigate('detail', { item });
  };

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-shadow hover:shadow-lg flex flex-col cursor-pointer group"
      onClick={handleViewDetails}
      onKeyDown={(e) => e.key === 'Enter' && handleViewDetails()}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${item.name}`}
    >
      <div className="relative h-40 w-full">
        <img src={item.imageURL} alt={item.name} className="w-full h-full object-cover" />
         {item.stock <= 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg bg-red-600 px-3 py-1 rounded">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-800 truncate">{item.name}</h3>
        <p className="text-sm text-gray-600 mt-1 flex-grow min-h-[40px]">{item.description.substring(0, 60)}...</p>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-xl font-bold text-teal-600">₹{item.price.toFixed(2)}</p>
          <button
            onClick={handleAddToCart}
            disabled={item.stock <= 0}
            className={`flex items-center justify-center gap-2 w-28 text-white px-4 py-2 rounded-full font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500
              bg-teal-500 hover:bg-teal-600
              disabled:bg-gray-300 disabled:cursor-not-allowed
            `}
            aria-label={`Add ${item.name} to cart`}
          >
            <CartAddIcon className="w-5 h-5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
