'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
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

interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
}

interface Review {
  id: string;
  user_id: string;
  rating: number;
  review_text: string;
  created_at: string;
}

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

  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [likesCount, setLikesCount] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  const fetchComments = async (activityId: string) => {
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

  const fetchLikesAndRating = async (activityId: string, userId: string) => {
    try {
      // Fetch likes count
      const likesResponse = await fetch(`/api/likes?activity_id=${activityId}`);
      if (likesResponse.ok) {
        const data = await likesResponse.json();
        setLikesCount(data.count);
        setUserLiked(data.userLiked);
      } else {
        console.error('Failed to fetch likes', await likesResponse.text());
      }

      // Fetch user rating
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
      console.error('Error fetching likes/rating:', err);
    }
  };

  const checkFavoriteStatus = async (activityId: string, userId: string) => {
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

        if (user) {
          fetchComments(fetchedActivity.id);
          fetchLikesAndRating(fetchedActivity.id, user.id);
          checkFavoriteStatus(fetchedActivity.id, user.id);
        }

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params.id, supabase]);

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
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-800">OutGo</div>
        <nav className="space-x-4">
          <Link href="/" className="text-gray-600 hover:text-blue-600">Home</Link>
          <Link href="/activities" className="text-blue-600 font-semibold">Activities</Link>
          <Link href="/profile" className="text-gray-600 hover:text-blue-600">Profile</Link>
        </nav>
        <div className="space-x-4">
          <Link href="/signin" className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition duration-300">Sign In</Link>
          <Link href="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300">Sign Up</Link>
        </div>
      </header>

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
              onClick={handleSubmitComment}
            >
              Submit Comment
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 OutGo. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-4">
            <Link href="#" className="text-gray-400 hover:text-white">About Us</Link>
            <Link href="#" className="text-gray-400 hover:text-white">Contact</Link>
            <Link href="#" className="text-gray-400 hover:text-white">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}