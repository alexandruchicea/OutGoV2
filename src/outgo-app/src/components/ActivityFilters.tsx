'use client';

import React, { useState } from 'react';

interface ActivityFiltersProps {
  onApplyFilters: (searchTerm: string, sortBy: string, latitude: number | null, longitude: number | null) => void;
}

const ActivityFilters: React.FC<ActivityFiltersProps> = ({ onApplyFilters }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyFilters(searchTerm, sortBy, latitude, longitude);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Filter Activities</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700">Search Term</label>
          <input
            type="text"
            id="searchTerm"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="e.g., hiking, cooking class"
          />
        </div>
        <div>
          <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700">Sort By</label>
          <select
            id="sortBy"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">None</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="date_asc">Date: Soonest</option>
            <option value="date_desc">Date: Latest</option>
          </select>
        </div>
        {/* Add more filter options here, e.g., location, date range */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Apply Filters
        </button>
      </form>
    </div>
  );
};

export default ActivityFilters;