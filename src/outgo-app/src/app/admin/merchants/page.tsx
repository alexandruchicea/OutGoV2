import Link from 'next/link';
'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

interface Merchant {
  id: string;
  name: string;
  contact_email: string;
  description: string;
  status: string;
  created_at: string;
}

export default function AdminMerchants() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== 'admin@example.com') { // Placeholder for admin check
      router.push('/signin');
      return false;
    }
    return true;
  };

  const fetchMerchants = async () => {
    if (!(await checkAdmin())) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/merchants');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMerchants(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchants();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    if (!confirm(`Are you sure you want to ${newStatus} this merchant?`)) {
      return;
    }
    try {
      const response = await fetch(`/api/admin/merchants/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update merchant status');
      }

      fetchMerchants(); // Re-fetch merchants to update the list
    } catch (err: any) {
      alert(`Error updating status: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">Loading merchants...</p>
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
        <div className="text-2xl font-bold text-gray-800">OutGo Admin</div>
        <nav className="space-x-4">
          <Link href="/admin/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</Link>
          <Link href="/admin/merchants" className="text-blue-600 font-semibold">Merchants</Link>
          <Link href="/admin/activities" className="text-gray-600 hover:text-blue-600">Activities</Link>
          <Link href="/admin/users" className="text-gray-600 hover:text-blue-600">Users</Link>
        </nav>
        <div className="space-x-4">
          <Link href="/signin" className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition duration-300">Sign Out</Link>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Merchant Applications</h1>

        <div className="bg-white p-6 rounded-lg shadow-md">
          {merchants.length === 0 ? (
            <p className="text-gray-600">No merchant applications found.</p>
          ) : (
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Business Name</th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Contact Email</th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Description</th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Status</th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {merchants.map((merchant) => (
                  <tr key={merchant.id}>
                    <td className="py-2 px-4 border-b border-gray-200">{merchant.name}</td>
                    <td className="py-2 px-4 border-b border-gray-200">{merchant.contact_email}</td>
                    <td className="py-2 px-4 border-b border-gray-200">{merchant.description}</td>
                    <td className="py-2 px-4 border-b border-gray-200">{merchant.status}</td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {merchant.status === 'pending' && (
                        <>
                          <button
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm mr-2"
                            onClick={() => handleStatusChange(merchant.id, 'approved')}
                          >
                            Approve
                          </button>
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                            onClick={() => handleStatusChange(merchant.id, 'rejected')}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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