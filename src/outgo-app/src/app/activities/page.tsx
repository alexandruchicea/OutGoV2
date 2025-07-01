'use client';

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

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

export default function Activities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      if (sortBy) {
        params.append('sortBy', sortBy);
      }
      if (latitude !== null && longitude !== null) {
        params.append('latitude', latitude.toString());
        params.append('longitude', longitude.toString());
      }
      const queryString = params.toString();
      const url = `/api/activities${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setActivities(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, sortBy, latitude, longitude]);

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setLocationError(null);
        },
        (err) => {
          console.error('Geolocation error:', err);
          setLocationError(err.message);
        }
      );
    } else {
      setLocationError('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">Loading activities...</p>
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
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">All Activities</h1>

        {/* Search and Filter Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search activities..."
              className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setSortBy(e.target.value)}
              value={sortBy}
            >
              <option value="">Sort By</option>
              <option value="name_asc">Name (A-Z)</option>
              <option value="name_desc">Name (Z-A)</option>
              <option value="price_asc">Price (Low to High)</option>
              <option value="price_desc">Price (High to Low)</option>
            </select>
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
              onClick={fetchActivities}
            >
              Apply Filters
            </button>
            <button
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
              onClick={requestLocation}
            >
              Use My Location
            </button>
          </div>
          {locationError && <p className="text-red-600 mt-2">Location Error: {locationError}</p>}
          {latitude !== null && longitude !== null && (
            <p className="text-gray-600 mt-2">Location: {latitude.toFixed(2)}, {longitude.toFixed(2)}</p>
          )}
        </div>

        {/* Activity Listing Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <div key={activity.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={activity.image_url || "/images/activity-placeholder.jpg"} alt={activity.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{activity.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{activity.summary}</p>
                <p className="text-gray-800 font-bold">{activity.currency} {activity.price}</p>
                <p className="text-gray-500 text-xs">Location: {activity.location} | Date: {new Date(activity.period_start).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
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