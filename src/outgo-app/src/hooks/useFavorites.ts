import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const useFavorites = (activityId: string, userId: string | undefined) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const supabase = createClientComponentClient();

  const checkFavoriteStatus = async () => {
    if (!userId) return;
    try {
      const response = await fetch(`/api/favorites?activity_id=${activityId}&user_id=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setIsFavorite(data.isFavorite);
      } else {
        console.error('Failed to fetch favorite status', await response.text());
      }
    } catch (err) {
      console.error('Error checking favorite status:', err);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!userId) {
      alert('Please sign in to add to favorites.');
      return;
    }

    try {
      const method = isFavorite ? 'DELETE' : 'POST';
      const response = await fetch('/api/favorites', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, activity_id: activityId }),
      });

      if (response.ok) {
        setIsFavorite(!isFavorite);
      } else {
        const errorData = await response.json();
        alert(`Failed to toggle favorite status: ${errorData.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      alert(`An unexpected error occurred: ${err.message}`);
    }
  };

  useEffect(() => {
    if (activityId && userId) {
      checkFavoriteStatus();
    }
  }, [activityId, userId]);

  return {
    isFavorite,
    handleFavoriteToggle,
    checkFavoriteStatus,
  };
};
