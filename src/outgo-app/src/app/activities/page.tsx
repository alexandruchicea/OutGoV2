'use client';

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import ActivityFilters from '../../components/ActivityFilters';

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

  const fetchActivities = useCallback(async (searchTerm: string, sortBy: string, latitude: number | null, longitude: number | null) => {
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
  }, []);

  useEffect(() => {
    fetchActivities('', '', null, null); // Initial fetch with no filters
  }, [fetchActivities]);

  const handleApplyFilters = (searchTerm: string, sortBy: string, latitude: number | null, longitude: number | null) => {
    fetchActivities(searchTerm, sortBy, latitude, longitude);
  };

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


      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 text-center">All Activities</h1>
          <a href="/activities/new" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            List Activity
          </a>
        </div>

        <ActivityFilters onApplyFilters={handleApplyFilters} />

        {/* Activity Listing Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <div key={activity.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Image src={activity.image_url || "/images/activity-placeholder.jpg"} alt={activity.name} width={192} height={192} className="w-full h-48 object-cover" />
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


    </div>
  );
}