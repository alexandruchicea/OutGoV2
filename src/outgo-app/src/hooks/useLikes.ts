import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const useLikes = (activityId: string, userId: string | undefined) => {
  const [likesCount, setLikesCount] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const supabase = createClientComponentClient();

  const fetchLikes = async () => {
    try {
      const likesResponse = await fetch(`/api/likes?activity_id=${activityId}`);
      if (likesResponse.ok) {
        const data = await likesResponse.json();
        setLikesCount(data.count);
        if (userId) {
          setUserLiked(data.userLiked);
        }
      } else {
        console.error('Failed to fetch likes', await likesResponse.text());
      }
    } catch (err) {
      console.error('Error fetching likes:', err);
    }
  };

  const handleLikeToggle = async () => {
    if (!userId) {
      alert('Please sign in to like an activity.');
      return;
    }

    try {
      const method = userLiked ? 'DELETE' : 'POST';
      const response = await fetch('/api/likes', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, activity_id: activityId }),
      });

      if (response.ok) {
        setUserLiked(!userLiked);
        setLikesCount(prevCount => (userLiked ? prevCount - 1 : prevCount + 1));
      } else {
        const errorData = await response.json();
        alert(`Failed to toggle like: ${errorData.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      alert(`An unexpected error occurred: ${err.message}`);
    }
  };

  useEffect(() => {
    if (activityId) {
      fetchLikes();
    }
  }, [activityId, userId]);

  return {
    likesCount,
    userLiked,
    handleLikeToggle,
    fetchLikes,
  };
};
