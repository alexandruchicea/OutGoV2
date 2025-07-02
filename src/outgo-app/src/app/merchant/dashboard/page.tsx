'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

interface MerchantMetrics {
  totalActivities: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  revenue: number;
  averageRating: number;
  conversionRate: number;
}

interface Booking {
  id: string;
  booking_date: string;
  booking_time: string;
  status: string;
  activities: {
    name: string;
  };
}

export default function MerchantDashboard() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<MerchantMetrics | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getMerchantData() {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/signin');
          return;
        }

        const merchantIdResponse = await fetch('/api/merchant/get-id');
        if (!merchantIdResponse.ok) {
          throw new Error('Failed to fetch merchant ID');
        }
        const { merchantId } = await merchantIdResponse.json();
        setMerchantId(merchantId);

        // Fetch metrics
        const metricsResponse = await fetch(`/api/merchant/${merchantId}/metrics`);
        if (metricsResponse.ok) {
          const metricsData = await metricsResponse.json();
          setMetrics(metricsData);
        } else {
          console.error('Error fetching metrics:', await metricsResponse.text());
          setError('Failed to load metrics.');
        }

        // Fetch bookings
        const bookingsResponse = await fetch(`/api/merchant/${merchantId}/bookings`);
        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json();
          setBookings(bookingsData);
        } else {
          console.error('Error fetching bookings:', await bookingsResponse.text());
          setError('Failed to load bookings.');
        }

      } catch (err: any) {
        console.error('Unexpected error:', err.message);
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    }

    getMerchantData();
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">Loading merchant dashboard...</p>
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
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Merchant Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Overview Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Overview</h2>
            <p className="text-gray-600 mb-2">Total Activities: <strong>{metrics?.totalActivities ?? 'N/A'}</strong></p>
            <p className="text-gray-600 mb-2">Total Bookings: <strong>{metrics?.totalBookings ?? 'N/A'}</strong></p>
            <p className="text-gray-600 mb-2">Pending Bookings: <strong>{metrics?.pendingBookings ?? 'N/A'}</strong></p>
            <p className="text-gray-600">Confirmed Bookings: <strong>{metrics?.confirmedBookings ?? 'N/A'}</strong></p>
          </div>

          {/* Performance Metrics Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Performance Metrics</h2>
            <p className="text-gray-600 mb-2">Revenue (Last 30 days): <strong>${metrics?.revenue.toFixed(2) ?? 'N/A'}</strong></p>
            <p className="text-gray-600 mb-2">Average Rating: <strong>{metrics?.averageRating ?? 'N/A'}/5</strong></p>
            <p className="text-gray-600">Conversion Rate: <strong>{(metrics?.conversionRate * 100).toFixed(2) ?? 'N/A'}%</strong></p>
          </div>

          {/* Upcoming Schedule Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upcoming Schedule</h2>
            <ul className="space-y-2">
              {bookings.length > 0 ? (
                bookings.filter(b => b.status === 'confirmed' && new Date(b.booking_date) >= new Date())
                  .sort((a, b) => new Date(a.booking_date).getTime() - new Date(b.booking_date).getTime())
                  .map(booking => (
                    <li key={booking.id} className="text-gray-700">
                      {new Date(booking.booking_date).toLocaleDateString()}: {booking.activities?.name} ({booking.booking_time})
                    </li>
                  ))
              ) : (
                <li className="text-gray-600">No upcoming bookings.</li>
              )}
            </ul>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Bookings</h2>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Activity</th>
                <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Date</th>
                <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Time</th>
                <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? (
                bookings.sort((a, b) => new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime())
                  .map(booking => (
                    <tr key={booking.id}>
                      <td className="py-2 px-4 border-b border-gray-200">{booking.activities?.name || 'N/A'}</td>
                      <td className="py-2 px-4 border-b border-gray-200">{new Date(booking.booking_date).toLocaleDateString()}</td>
                      <td className="py-2 px-4 border-b border-gray-200">{booking.booking_time}</td>
                      <td className="py-2 px-4 border-b border-gray-200">{booking.status}</td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-600">No recent bookings found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      
    </div>
  );
}