"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function NewActivityForm() {
  const [name, setName] = useState('');
  const [firm, setFirm] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setMessage('You must be logged in to list an activity.');
        setLoading(false);
        return;
      }

      // Fetch the merchant ID associated with the current user
      const { data: merchantData, error: merchantError } = await supabase
        .from('merchants')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (merchantError || !merchantData) {
        setMessage('You must be registered as a merchant to list an activity.');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.from('activities').insert([
        {
          name,
          firm,
          summary,
          description,
          period_start: periodStart,
          period_end: periodEnd,
          price: parseFloat(price),
          currency,
          location,
          image_url: imageUrl,
          merchant_id: merchantData.id, // Use the fetched merchant ID
          status: 'pending', // Or 'active', depending on your workflow
        },
      ]);

      if (error) {
        throw error;
      }

      setMessage('Activity listed successfully!');
      router.push('/activities'); // Redirect to activities page after successful listing
    } catch (error: any) {
      setMessage(`Error listing activity: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Activity Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="firm" className="block text-sm font-medium text-gray-700">Firm</label>
        <input
          type="text"
          id="firm"
          value={firm}
          onChange={(e) => setFirm(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="summary" className="block text-sm font-medium text-gray-700">Summary</label>
        <textarea
          id="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          required
          rows={3}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        ></textarea>
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={5}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        ></textarea>
      </div>
      <div>
        <label htmlFor="periodStart" className="block text-sm font-medium text-gray-700">Period Start</label>
        <input
          type="date"
          id="periodStart"
          value={periodStart}
          onChange={(e) => setPeriodStart(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="periodEnd" className="block text-sm font-medium text-gray-700">Period End</label>
        <input
          type="date"
          id="periodEnd"
          value={periodEnd}
          onChange={(e) => setPeriodEnd(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          step="0.01"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Currency</label>
        <input
          type="text"
          id="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
        <input
          type="url"
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {loading ? 'Listing...' : 'List Activity'}
      </button>
      {message && <p className="mt-4 text-center text-sm text-gray-600">{message}</p>}
    </form>
  );
}
