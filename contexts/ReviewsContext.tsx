import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { Review } from '../types';

const REVIEWS_KEY = 'chicChariotReviews';

interface ReviewsContextState {
  reviews: Review[];
  getReviewsByItemId: (itemId: string) => Review[];
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  deleteReview: (id: string) => void;
  getAverageRating: (itemId: string) => { average: number; count: number };
}

const ReviewsContext = createContext<ReviewsContextState | undefined>(undefined);

export const ReviewsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const stored = localStorage.getItem(REVIEWS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
  }, [reviews]);

  const addReview = useCallback((reviewData: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...reviewData,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    setReviews(prev => [newReview, ...prev]);
  }, []);

  const deleteReview = useCallback((id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
  }, []);

  const getReviewsByItemId = useCallback((itemId: string) => {
    return reviews.filter(r => r.itemId === itemId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [reviews]);

  const getAverageRating = useCallback((itemId: string) => {
    const itemReviews = reviews.filter(r => r.itemId === itemId);
    if (itemReviews.length === 0) return { average: 0, count: 0 };
    
    const sum = itemReviews.reduce((acc, curr) => acc + curr.rating, 0);
    return {
        average: parseFloat((sum / itemReviews.length).toFixed(1)),
        count: itemReviews.length
    };
  }, [reviews]);

  return (
    <ReviewsContext.Provider value={{ reviews, getReviewsByItemId, addReview, deleteReview, getAverageRating }}>
      {children}
    </ReviewsContext.Provider>
  );
};

export const useReviews = (): ReviewsContextState => {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
};