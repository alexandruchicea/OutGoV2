'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

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

interface ActivityFiltersProps {
  initialActivities: Activity[];
}

export default function ActivityFilters({ initialActivities }: ActivityFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activities, setActivities] = useState(initialActivities);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || '');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    const params = new URLSearchParams();
    if (searchTerm) {
      params.set('search', searchTerm);
    }
    if (sortBy) {
      params.set('sortBy', sortBy);
    }
    if (latitude !== null && longitude !== null) {
      params.set('latitude', latitude.toString());
      params.set('longitude', longitude.toString());
    }
    router.push(`/activities?${params.toString()}`);
  }, [searchTerm, sortBy, latitude, longitude, router]);

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
    setActivities(initialActivities);
  }, [initialActivities]);

  return (
    <div>
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
    </div>
  );
}
