import React, { useState } from 'react';
import { GlossaryItem } from '../types';
import { useCart } from '../contexts/CartContext';
import { useNavigation } from '../contexts/NavigationContext';
import { useToasts } from '../contexts/ToastContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useReviews } from '../contexts/ReviewsContext';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { PlusIcon } from './icons/PlusIcon';
import { MinusIcon } from './icons/MinusIcon';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { HeartIcon } from './icons/HeartIcon';
import { HeartOutlineIcon } from './icons/HeartOutlineIcon';
import { UserIcon } from './icons/UserIcon';
import StarRating from './StarRating';

interface ItemDetailProps {
  item: GlossaryItem;
}

const ItemDetail: React.FC<ItemDetailProps> = ({ item }) => {
  const { addToCart, cartItems } = useCart();
  const { navigate } = useNavigation();
  const { showToast } = useToasts();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { getReviewsByItemId, addReview, getAverageRating } = useReviews();
  const { currentUser, isLoggedIn } = useAuth();
  
  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');

  const cartItem = cartItems.find(ci => ci.id === item.id);
  const stockAvailableForPurchase = item.stock - (cartItem?.quantity || 0);

  const itemInWishlist = isInWishlist(item.id);
  const reviews = getReviewsByItemId(item.id);
  const { average, count } = getAverageRating(item.id);

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
  
  const handleSubmitReview = (e: React.FormEvent) => {
      e.preventDefault();
      setReviewError('');
      
      if(!isLoggedIn || !currentUser) {
          setReviewError('You must be logged in to leave a review.');
          return;
      }
      if(reviewRating === 0) {
          setReviewError('Please select a rating.');
          return;
      }
      if(!reviewComment.trim()) {
          setReviewError('Please write a comment.');
          return;
      }
      
      addReview({
          itemId: item.id,
          userId: currentUser.id,
          userName: currentUser.username,
          rating: reviewRating,
          comment: reviewComment,
      });
      
      setReviewRating(0);
      setReviewComment('');
      showToast('Review submitted successfully!', 'success');
  };

  return (
    <div className="space-y-8">
    <div className="bg-white/70 dark:bg-stone-900/60 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-10 max-w-5xl mx-auto border border-white/40 dark:border-stone-700/40">
      <button 
        onClick={() => navigate('store')}
        className="group flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white mb-8 transition-colors"
      >
        <div className="p-1 rounded-full bg-white/50 dark:bg-stone-800/50 group-hover:bg-rose-100 dark:group-hover:bg-rose-900/30 transition-colors">
            <ArrowLeftIcon className="w-5 h-5" />
        </div>
        Back to Store
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        <div className="space-y-4">
            <div className="aspect-square w-full overflow-hidden rounded-2xl bg-stone-100 dark:bg-stone-800/50 shadow-inner">
                <img src={item.imageURL} alt={item.name} className="w-full h-full object-cover" />
            </div>
        </div>
        
        <div className="flex flex-col justify-center">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-rose-600 dark:text-rose-400 tracking-wider uppercase">{item.category}</span>
            <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-lg border border-yellow-200 dark:border-yellow-800/50">
                <StarRating rating={average} size="sm" readonly />
                <span className="text-xs font-medium text-yellow-800 dark:text-yellow-500">{average} ({count})</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 dark:text-stone-50 mb-6 leading-tight drop-shadow-sm">{item.name}</h1>
          <p className="text-lg text-stone-600 dark:text-stone-300 leading-relaxed font-light">{item.description}</p>
          
          <div className="mt-10 flex items-end gap-4 pb-8 border-b border-stone-200/50 dark:border-stone-700/50">
            <p className="text-4xl font-serif font-medium text-stone-900 dark:text-stone-100">₹{item.price.toFixed(2)}</p>
            <div className="pb-2">
                {item.stock > 0 ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100/80 text-green-800 dark:bg-green-900/40 dark:text-green-300 backdrop-blur-sm">
                        {item.stock} In Stock
                    </span>
                ) : (
                     <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100/80 text-red-800 dark:bg-red-900/40 dark:text-red-300 backdrop-blur-sm">
                        Out of Stock
                    </span>
                )}
            </div>
          </div>
          
          {item.stock > 0 ? (
            <div className="mt-8 space-y-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex items-center border border-stone-300/60 dark:border-stone-600/60 rounded-full w-max bg-white/30 dark:bg-stone-800/30">
                  <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1} className="p-4 text-stone-600 hover:text-rose-600 dark:text-stone-300 dark:hover:text-rose-400 disabled:opacity-30 transition-colors" aria-label="Decrease quantity">
                    <MinusIcon className="w-5 h-5" />
                  </button>
                  <span className="w-12 text-center font-semibold text-lg text-stone-800 dark:text-stone-100" aria-live="polite">{quantity}</span>
                  <button onClick={() => handleQuantityChange(1)} disabled={quantity >= stockAvailableForPurchase} className="p-4 text-stone-600 hover:text-rose-600 dark:text-stone-300 dark:hover:text-rose-400 disabled:opacity-30 transition-colors" aria-label="Increase quantity">
                    <PlusIcon className="w-5 h-5" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={stockAvailableForPurchase <= 0}
                  className="flex-1 flex items-center justify-center gap-3 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-lg font-semibold py-4 px-8 rounded-full hover:bg-rose-600 dark:hover:bg-rose-500 dark:hover:text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-300 disabled:bg-stone-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                >
                  <ShoppingCartIcon className="w-6 h-6" />
                  Add to Cart
                </button>
              </div>
               <button
                onClick={handleToggleWishlist}
                className="flex items-center justify-center gap-2 w-full text-sm font-medium text-stone-600 dark:text-stone-300 border border-stone-300 dark:border-stone-600 py-4 px-6 rounded-full hover:bg-white/50 dark:hover:bg-stone-700/50 hover:text-stone-900 dark:hover:text-white hover:border-stone-400 dark:hover:border-stone-500 transition-all duration-200 active:scale-[0.98]"
              >
                {itemInWishlist ? <HeartIcon className="w-5 h-5 text-rose-500" /> : <HeartOutlineIcon className="w-5 h-5" />}
                {itemInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>
            </div>
          ) : (
            <div className="mt-8 p-6 bg-stone-100/50 dark:bg-stone-800/30 rounded-xl text-stone-500 dark:text-stone-400 text-center border border-dashed border-stone-300 dark:border-stone-700">
              This item is currently unavailable.
            </div>
          )}
           {stockAvailableForPurchase < quantity && stockAvailableForPurchase > 0 &&
                <p className="text-sm text-red-600 dark:text-red-400 mt-3 font-medium bg-red-50 dark:bg-red-900/10 p-2 rounded-lg inline-block">Maximum available quantity is {stockAvailableForPurchase}.</p>
            }
        </div>
      </div>
    </div>
    
    {/* Reviews Section */}
    <div className="max-w-5xl mx-auto space-y-6">
        <h2 className="text-3xl font-serif font-bold text-stone-900 dark:text-white pl-2">Customer Reviews</h2>
        
        {/* Write a Review */}
        <div className="bg-white/70 dark:bg-stone-900/60 backdrop-blur-xl rounded-2xl p-6 border border-white/40 dark:border-stone-700/40 shadow-md">
            {isLoggedIn ? (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                    <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-200">Write a Review</h3>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-stone-600 dark:text-stone-400">Rating</label>
                        <StarRating rating={reviewRating} onRatingChange={setReviewRating} size="lg" />
                    </div>
                    <div>
                        <label htmlFor="comment" className="block text-sm font-medium text-stone-600 dark:text-stone-400 mb-1">Comment</label>
                        <textarea
                            id="comment"
                            rows={3}
                            className="w-full rounded-xl border-stone-300 dark:border-stone-600 bg-white/50 dark:bg-stone-800/50 p-3 text-stone-900 dark:text-white placeholder-stone-400 focus:ring-rose-500 focus:border-rose-500"
                            placeholder="Share your thoughts about this product..."
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                        />
                    </div>
                    {reviewError && <p className="text-red-500 text-sm">{reviewError}</p>}
                    <button type="submit" className="bg-rose-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-rose-700 transition-colors shadow-lg shadow-rose-900/20">
                        Submit Review
                    </button>
                </form>
            ) : (
                <div className="text-center py-6">
                    <p className="text-stone-600 dark:text-stone-400 mb-4">Please log in to write a review.</p>
                    <button onClick={() => navigate('login')} className="bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-900 px-6 py-2 rounded-lg font-medium hover:bg-stone-900 dark:hover:bg-white transition-colors">
                        Login
                    </button>
                </div>
            )}
        </div>

        {/* Review List */}
        <div className="space-y-4">
            {reviews.length > 0 ? (
                reviews.map(review => (
                    <div key={review.id} className="bg-white/60 dark:bg-stone-800/40 backdrop-blur-md rounded-2xl p-6 border border-white/50 dark:border-stone-700/50 shadow-sm">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center text-stone-500 dark:text-stone-400">
                                    <UserIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-semibold text-stone-900 dark:text-stone-100">{review.userName}</p>
                                    <p className="text-xs text-stone-500 dark:text-stone-500">{new Date(review.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <StarRating rating={review.rating} size="sm" readonly />
                        </div>
                        <p className="mt-4 text-stone-700 dark:text-stone-300 leading-relaxed">{review.comment}</p>
                    </div>
                ))
            ) : (
                <div className="text-center py-12 text-stone-500 dark:text-stone-400 italic">
                    No reviews yet. Be the first to review this product!
                </div>
            )}
        </div>
    </div>
    </div>
  );
};

export default ItemDetail;