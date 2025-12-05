import React, { useState } from 'react';
import { StarIcon } from './icons/StarIcon';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  onRatingChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  maxRating = 5, 
  onRatingChange, 
  size = 'md',
  readonly = false 
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }[size];

  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHoverRating(0)}>
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = (hoverRating || rating) >= starValue;
        
        return (
          <button
            key={index}
            type="button"
            className={`${sizeClass} ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform focus:outline-none`}
            onClick={() => !readonly && onRatingChange?.(starValue)}
            onMouseEnter={() => !readonly && setHoverRating(starValue)}
            disabled={readonly}
            aria-label={`Rate ${starValue} stars`}
          >
            <StarIcon 
                className={`${sizeClass} ${isFilled ? 'text-yellow-400' : 'text-stone-300 dark:text-stone-600'}`} 
                filled={isFilled} 
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;