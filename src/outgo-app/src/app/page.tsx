'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
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

interface UserProfile {
  id: string;
  name: string;
  preferences: string; // Stored as JSON string
  language: string;
}

export default function Home() {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [featuredActivities, setFeaturedActivities] = useState<Activity[]>([]);
  const [recommendedActivities, setRecommendedActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeaturedActivities = useCallback(async (preferences: any = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      // Add preferences as filters
      if (preferences.outdoors) params.append('category', 'outdoors');
      if (preferences.arts) params.append('category', 'arts');
      if (preferences.food) params.append('category', 'food');

      const queryString = params.toString();
      const url = `/api/activities${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setFeaturedActivities(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRecommendedActivities = useCallback(async (userId: string) => {
    try {
      const response = await fetch(`/api/recommendations?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setRecommendedActivities(data);
      } else {
        console.error('Failed to fetch recommendations', await response.text());
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    }
  }, []);

  useEffect(() => {
    async function loadUserDataAndActivities() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        let userPreferences = {};
        if (user) {
          const profileResponse = await fetch(`/api/profile?userId=${user.id}`);
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            setProfile(profileData);
            try {
              userPreferences = JSON.parse(profileData.preferences || '{}');
            } catch (e) {
              console.error('Error parsing preferences:', e);
            }
          } else {
            console.error('Error fetching profile:', await profileResponse.text());
          }
          fetchRecommendedActivities(user.id);
        }
        fetchFeaturedActivities(userPreferences);
      } catch (err: any) {
        console.error('Unexpected error:', err.message);
        setError('An unexpected error occurred.');
      }
    }
    loadUserDataAndActivities();
  }, [supabase, fetchFeaturedActivities, fetchRecommendedActivities]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">Loading homepage...</p>
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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-800">OutGo</div>
        <nav className="space-x-4">
          <Link href="/" className="text-gray-600 hover:text-blue-600">Home</Link>
          <Link href="/activities" className="text-gray-600 hover:text-blue-600">Activities</Link>
          <Link href="/profile" className="text-gray-600 hover:text-blue-600">Profile</Link>
          <Link href="/settings" className="text-gray-600 hover:text-blue-600">Settings</Link>
        </nav>
        <div className="space-x-4">
          <Link href="/signin" className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition duration-300">Sign In</Link>
          <Link href="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300">Sign Up</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gray-800 text-white h-96 flex items-center justify-center">
        <img src="/images/hero-bg.jpg" alt="Hero Background" className="absolute inset-0 w-full h-full object-cover opacity-50" />
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold mb-4">Discover Your Next Adventure</h1>
          <p className="text-xl mb-8">Explore unique activities and experiences near you.</p>
          <Link href="/activities" className="px-8 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300">Explore Activities</Link>
        </div>
      </section>

      {/* Recommended Activities Section */}
      {user && recommendedActivities.length > 0 && (
        <section className="py-12 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Recommended for You</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recommendedActivities.map((activity) => (
                <div key={activity.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img src={activity.image_url || "/images/activity-placeholder.jpg"} alt={activity.name} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{activity.name}</h3>
                    <p className="text-gray-600">{activity.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Activities Section */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Featured Activities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredActivities.length > 0 ? (
              featuredActivities.map((activity) => (
                <div key={activity.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img src={activity.image_url || "/images/activity-placeholder.jpg"} alt={activity.name} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{activity.name}</h3>
                    <p className="text-gray-600">{activity.summary}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center">No featured activities found.</p>
            )}
          </div>
        </div>
      </section>

      {/* Categories Section (Placeholder) */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Explore by Category</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full hover:bg-blue-600 hover:text-white transition duration-300">Outdoors</button>
            <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full hover:bg-blue-600 hover:text-white transition duration-300">Arts & Culture</button>
            <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full hover:bg-blue-600 hover:text-white transition duration-300">Food & Drink</button>
            <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full hover:bg-blue-600 hover:text-white transition duration-300">Workshops</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
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