import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface Review {
  id: string;
  user_id: string;
  activity_id: string;
  rating: number;
  review_text: string;
  created_at: string;
}

export const useRatings = (activityId: string, userId: string | undefined) => {
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const supabase = createClientComponentClient();

  const fetchUserRating = async () => {
    if (!userId) return;
    try {
      const ratingResponse = await fetch(`/api/reviews?activity_id=${activityId}&user_id=${userId}`);
      if (ratingResponse.ok) {
        const data = await ratingResponse.json();
        if (data.length > 0) {
          setUserRating(data[0].rating);
          setReviewText(data[0].review_text || '');
        }
      } else {
        console.error('Failed to fetch user rating', await ratingResponse.text());
      }
    } catch (err) {
      console.error('Error fetching user rating:', err);
    }
  };

  const handleSubmitRating = async (rating: number) => {
    if (!userId) {
      alert('Please sign in to rate.');
      return;
    }

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, activity_id: activityId, rating, review_text: reviewText }),
      });

      if (response.ok) {
        setUserRating(rating);
        alert('Rating submitted successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to submit rating: ${errorData.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      alert(`An unexpected error occurred: ${err.message}`);
    }
  };

  useEffect(() => {
    if (activityId && userId) {
      fetchUserRating();
    }
  }, [activityId, userId]);

  return {
    userRating,
    reviewText,
    setReviewText,
    handleSubmitRating,
    fetchUserRating,
  };
};
