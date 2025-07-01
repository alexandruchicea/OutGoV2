'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

interface Profile {
  id: string;
  name: string;
  preferences: string;
}

interface Booking {
  id: string;
  activity_id: string;
  booking_date: string;
  booking_time: string;
  status: string;
  activities: {
    name: string;
    price: number;
    currency: string;
  };
}

interface Favorite {
  id: string;
  activity_id: string;
  activities: {
    name: string;
    image_url: string;
    summary: string;
  };
}

export default function Profile() {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedPreferences, setEditedPreferences] = useState('');

  useEffect(() => {
    async function getProfileAndBookingsAndFavorites() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          // Fetch profile
          const profileResponse = await fetch(`/api/profile?userId=${user.id}`);
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            setProfile(profileData);
            setEditedName(profileData.name || '');
            setEditedPreferences(profileData.preferences || '');
          } else {
            console.error('Error fetching profile:', await profileResponse.text());
            setError('Failed to load profile.');
          }

          // Fetch bookings
          const bookingsResponse = await fetch(`/api/user/${user.id}/bookings`);
          if (bookingsResponse.ok) {
            const bookingsData = await bookingsResponse.json();
            setBookings(bookingsData);
          } else {
            console.error('Error fetching bookings:', await bookingsResponse.text());
            setError('Failed to load bookings.');
          }

          // Fetch favorites
          const favoritesResponse = await fetch(`/api/user/${user.id}/favorites`);
          if (favoritesResponse.ok) {
            const favoritesData = await favoritesResponse.json();
            setFavorites(favoritesData);
          } else {
            console.error('Error fetching favorites:', await favoritesResponse.text());
            setError('Failed to load favorites.');
          }
        }
      } catch (err: any) {
        console.error('Unexpected error:', err.message);
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    }

    getProfileAndBookingsAndFavorites();
  }, [supabase]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, name: editedName, preferences: editedPreferences }),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setIsEditing(false);
      } else {
        console.error('Error saving profile:', await response.text());
        setError('Failed to save profile.');
      }
    } catch (err: any) {
      console.error('Unexpected error:', err.message);
      setError('An unexpected error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Booking cancelled successfully!');
        // Refresh bookings
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const bookingsResponse = await fetch(`/api/user/${user.id}/bookings`);
          if (bookingsResponse.ok) {
            const bookingsData = await bookingsResponse.json();
            setBookings(bookingsData);
          }
        }
      } else {
        const errorData = await response.json();
        alert(`Cancellation failed: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error: any) {
      alert(`An unexpected error occurred: ${error.message}`);
    }
  };

  const handleRescheduleBooking = async (bookingId: string) => {
    const newDate = prompt('Enter new date (YYYY-MM-DD):');
    const newTime = prompt('Enter new time (HH:MM:SS):');

    if (!newDate || !newTime) {
      alert('Date and time are required for rescheduling.');
      return;
    }

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_date: newDate, booking_time: newTime }),
      });

      if (response.ok) {
        alert('Booking rescheduled successfully!');
        // Refresh bookings
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const bookingsResponse = await fetch(`/api/user/${user.id}/bookings`);
          if (bookingsResponse.ok) {
            const bookingsData = await bookingsResponse.json();
            setBookings(bookingsData);
          }
        }
      } else {
        const errorData = await response.json();
        alert(`Rescheduling failed: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error: any) {
      alert(`An unexpected error occurred: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">Loading profile...</p>
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-800">OutGo</div>
        <nav className="space-x-4">
          <Link href="/" className="text-gray-600 hover:text-blue-600">Home</Link>
          <Link href="/activities" className="text-gray-600 hover:text-blue-600">Activities</Link>
          <Link href="/profile" className="text-blue-600 font-semibold">Profile</Link>
        </nav>
        <div className="space-x-4">
          <Link href="/signin" className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition duration-300">Sign In</Link>
          <Link href="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300">Sign Up</Link>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">User Profile</h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Personal Information</h2>
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                <input
                  type="text"
                  id="name"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="preferences" className="block text-gray-700 text-sm font-bold mb-2">Preferences:</label>
                <input
                  type="text"
                  id="preferences"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editedPreferences}
                  onChange={(e) => setEditedPreferences(e.target.value)}
                />
              </div>
              <div className="md:col-span-2 mt-4 text-right">
                <button
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 mr-2"
                  onClick={handleSaveProfile}
                >
                  Save
                </button>
                <button
                  className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-300"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600"><strong>Name:</strong> {profile?.name || 'N/A'}</p>
                <p className="text-gray-600"><strong>Email:</strong> {user.email}</p>
              </div>
              <div>
                <p className="text-gray-600"><strong>Preferences:</strong> {profile?.preferences || 'N/A'}</p>
              </div>
              <div className="md:col-span-2 mt-6 text-right">
                <button
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Booking History</h2>
          <div className="space-y-4">
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <div key={booking.id} className="border border-gray-200 p-4 rounded-md">
                  <h3 className="text-xl font-semibold text-gray-800">{booking.activities?.name || 'Unknown Activity'}</h3>
                  <p className="text-gray-600">Date: {new Date(booking.booking_date).toLocaleDateString()} | Time: {booking.booking_time} | Status: {booking.status}</p>
                  <div className="mt-2 space-x-2">
                    {booking.status === 'confirmed' && (
                      <button
                        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 text-sm"
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        Cancel
                      </button>
                    )}
                    {(booking.status === 'confirmed' || booking.status === 'rescheduled') && (
                      <button
                        className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-300 text-sm"
                        onClick={() => handleRescheduleBooking(booking.id)}
                      >
                        Reschedule
                      </button>
                    )}
                  </div>
                  <p className="text-gray-600">Price: {booking.activities?.currency} {booking.activities?.price}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No bookings found.</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Favorite Activities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.length > 0 ? (
              favorites.map((favorite) => (
                <div key={favorite.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img src={favorite.activities?.image_url || "/images/activity-placeholder.jpg"} alt={favorite.activities?.name} className="w-full h-32 object-cover" />
                  <div className="p-3">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{favorite.activities?.name || 'Unknown Activity'}</h3>
                    <p className="text-gray-600 text-sm">{favorite.activities?.summary}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No favorite activities found.</p>
            )}
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
