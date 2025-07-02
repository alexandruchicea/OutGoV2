'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';

import { useState, useEffect } from 'react';
import BookingCalendar from '../../../../components/BookingCalendar';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface Activity {
  id: string;
  name: string;
  firm: string;
  summary: string;
  description: string;
  period_start: string;
  period_end: string;
  price: number;
  currency: string;
  location: string;
  image_url: string;
  merchant_id: string;
  status: string;
}

import { useComments } from '@/hooks/useComments';
import { useLikes } from '@/hooks/useLikes';
import { useFavorites } from '@/hooks/useFavorites';
import { useRatings } from '@/hooks/useRatings';

async function getActivity(id: string): Promise<Activity | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/activities/${id}`, {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Activity not found
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching activity:', error);
    return null;
  }
}

export default function ActivityDetailPage({ params }: { params: { id: string } }) {
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [user, setUser] = useState<any>(null);
  const supabase = createClientComponentClient();

  

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const fetchedActivity = await getActivity(params.id);
        if (!fetchedActivity) {
          notFound();
          return;
        }
        setActivity(fetchedActivity);

        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params.id, supabase]);

  const { comments, newCommentText, setNewCommentText, handleSubmitComment } = useComments(activity?.id || '', user?.id);
  const { likesCount, userLiked, handleLikeToggle } = useLikes(activity?.id || '', user?.id);
  const { isFavorite, handleFavoriteToggle } = useFavorites(activity?.id || '', user?.id);
  const { userRating, reviewText, setReviewText, handleSubmitRating } = useRatings(activity?.id || '', user?.id);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleBookNow = async () => {
    if (!user) {
      alert('Please sign in to book an activity.');
      return;
    }
    if (!selectedDate) {
      alert('Please select a date to book.');
      return;
    }
    if (!activity) {
      alert('Activity data not loaded.');
      return;
    }

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          activity_id: activity.id,
          booking_date: selectedDate.toISOString().split('T')[0],
          booking_time: '09:00:00+00', // Placeholder for now, will be dynamic later
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create booking');
      }

      alert('Booking successful!');
      // Optionally, redirect to profile or booking confirmation page
    } catch (err: any) {
      alert(`Booking failed: ${err.message}`);
    }
  };

  const handleLikeToggle = async () => {
    if (!user) {
      alert('Please sign in to like an activity.');
      return;
    }
    if (!activity) return;

    try {
      const method = userLiked ? 'DELETE' : 'POST';
      const response = await fetch('/api/likes', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, activity_id: activity.id }),
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

  const handleSubmitComment = async () => {
    if (!user) {
      alert('Please sign in to comment.');
      return;
    }
    if (!activity || !newCommentText.trim()) {
      alert('Comment cannot be empty.');
      return;
    }

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, activity_id: activity.id, content: newCommentText }),
      });

      if (response.ok) {
        setNewCommentText('');
        fetchComments(activity.id);
      } else {
        const errorData = await response.json();
        alert(`Failed to submit comment: ${errorData.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      alert(`An unexpected error occurred: ${err.message}`);
    }
  };

  const handleSubmitRating = async (rating: number) => {
    if (!user) {
      alert('Please sign in to rate.');
      return;
    }
    if (!activity) return;

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, activity_id: activity.id, rating, review_text: reviewText }),
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

  const handleFavoriteToggle = async () => {
    if (!user) {
      alert('Please sign in to add to favorites.');
      return;
    }
    if (!activity) return;

    try {
      const method = isFavorite ? 'DELETE' : 'POST';
      const response = await fetch('/api/favorites', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, activity_id: activity.id }),
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">Loading activity details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!activity) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
          <div className="relative w-full h-96 mb-6">
            <Image
              src={activity.image_url || "/images/activity-placeholder.jpg"}
              alt={activity.name}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-md"
            />
          </div>

          <h1 className="text-4xl font-bold text-gray-800 mb-4">{activity.name}</h1>
          <p className="text-gray-600 text-lg mb-2">{activity.summary}</p>
          <p className="text-gray-700 mb-4">By: {activity.firm}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Details</h2>
              <p className="text-gray-700 mb-2"><strong>Location:</strong> {activity.location}</p>
              <p className="text-gray-700 mb-2"><strong>Price:</strong> {activity.currency} {activity.price}</p>
              <p className="text-gray-700 mb-2"><strong>Period:</strong> {new Date(activity.period_start).toLocaleDateString()} - {new Date(activity.period_end).toLocaleDateString()}</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Description</h2>
              <p className="text-gray-700 leading-relaxed">{activity.description}</p>
            </div>
          </div>

          <div className="mt-6">
            <BookingCalendar onDateSelect={handleDateSelect} />
          </div>

          <div className="mt-6 text-center">
            <button
              className="px-8 py-3 bg-blue-600 text-white text-xl font-semibold rounded-md hover:bg-blue-700 transition duration-300"
              onClick={handleBookNow}
            >
              Book Now
            </button>
          </div>

          {/* Social Interaction Section */}
          <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">User Interactions</h2>

            {/* Likes/Ratings */}
            <div className="flex items-center space-x-4 mb-6">
              <button
                className={`flex items-center px-4 py-2 rounded-md transition duration-300 ${userLiked ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                onClick={handleLikeToggle}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18H15a2 2 0 002-2V7.962a2 2 0 00-.166-1.031l-1.582-2.99a1.5 1.5 0 00-1.249-.884H9.5a1.5 1.5 0 00-1.5 1.5v.712A2.002 2.002 0 017 10.333z" />
                </svg>
                Like ({likesCount})
              </button>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`cursor-pointer text-xl ${star <= userRating ? 'text-yellow-500' : 'text-gray-400'}`}
                    onClick={() => handleSubmitRating(star)}
                  >
                    ★
                  </span>
                ))}
                <span className="ml-2 text-gray-700">({userRating}/5)</span>
              </div>
            </div>

            {/* Add to Favorites Button */}
            <button
              className={`flex items-center px-4 py-2 rounded-md transition duration-300 ${isFavorite ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              onClick={handleFavoriteToggle}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18.35l-1.45-1.32C3.75 12.25 1 9.75 1 6.5 1 4.02 3.02 2 5.5 2c1.74 0 3.41.81 4.5 2.09C11.09 2.81 12.76 2 14.5 2 16.98 2 19 4.02 19 6.5c0 3.25-2.75 5.75-7.55 10.53L10 18.35z" clipRule="evenodd" />
              </svg>
              {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>

            {/* Comments Section */}
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Comments</h3>
            <div className="space-y-4 mb-6">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <p className="font-semibold text-gray-800">{comment.user_id}</p>
                    <p className="text-gray-700 text-sm">{comment.content}</p>
                    <p className="text-gray-500 text-xs mt-1">{new Date(comment.created_at).toLocaleDateString()}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No comments yet.</p>
              )}
            </div>

            {/* Add Comment Form */}
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Add a Comment</h3>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              rows={4}
              placeholder="Write your comment here..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
            ></textarea>
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
              onClick={() => handleSubmitComment(user)}
            >
              Submit Comment
            </button>
          </div>
        </div>
      </main>

      
    </div>
  );
}