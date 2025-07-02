import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export const useComments = (activityId: string, userId: string | undefined) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const supabase = createClientComponentClient();

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?activity_id=${activityId}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      } else {
        console.error('Failed to fetch comments', await response.text());
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const handleSubmitComment = async () => {
    if (!userId) {
      alert('Please sign in to comment.');
      return;
    }
    if (!newCommentText.trim()) {
      alert('Comment cannot be empty.');
      return;
    }

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, activity_id: activityId, content: newCommentText }),
      });

      if (response.ok) {
        setNewCommentText('');
        fetchComments();
      } else {
        const errorData = await response.json();
        alert(`Failed to submit comment: ${errorData.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      alert(`An unexpected error occurred: ${err.message}`);
    }
  };

  useEffect(() => {
    if (activityId) {
      fetchComments();
    }
  }, [activityId]);

  return {
    comments,
    newCommentText,
    setNewCommentText,
    handleSubmitComment,
    fetchComments, // Expose fetchComments if needed for re-fetching from parent
  };
};
