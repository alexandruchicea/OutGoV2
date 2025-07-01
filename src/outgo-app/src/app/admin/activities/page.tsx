import Link from 'next/link';
'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

interface Activity {
  id: string;
  name: string;
  firm: string;
  summary: string;
  price: number;
  status: string;
  description: string;
  period_start: string;
  period_end: string;
  currency: string;
  location: string;
  image_url: string;
  merchant_id: string;
}

export default function AdminActivities() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);

  const [newActivity, setNewActivity] = useState<Omit<Activity, 'id' | 'created_at' | 'updated_at'>>({
    name: '',
    firm: '',
    summary: '',
    description: '',
    period_start: '',
    period_end: '',
    price: 0,
    currency: '',
    location: '',
    image_url: '',
    merchant_id: '',
    status: 'active',
  });

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== 'admin@example.com') { // Placeholder for admin check
      router.push('/signin');
      return false;
    }
    return true;
  };

  const fetchActivities = async () => {
    if (!(await checkAdmin())) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/activities');
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
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this activity?')) {
      return;
    }
    try {
      const response = await fetch(`/api/admin/activities/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete activity');
      }

      fetchActivities(); // Re-fetch activities to update the list
    } catch (err: any) {
      alert(`Error deleting activity: ${err.message}`);
    }
  };

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newActivity),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create activity');
      }

      alert('Activity created successfully!');
      setShowCreateModal(false);
      setNewActivity({
        name: '',
        firm: '',
        summary: '',
        description: '',
        period_start: '',
        period_end: '',
        price: 0,
        currency: '',
        location: '',
        image_url: '',
        merchant_id: '',
        status: 'active',
      });
      fetchActivities();
    } catch (err: any) {
      alert(`Error creating activity: ${err.message}`);
    }
  };

  const handleEditClick = (activity: Activity) => {
    setCurrentActivity(activity);
    setShowEditModal(true);
  };

  const handleUpdateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentActivity) return;

    try {
      const response = await fetch(`/api/admin/activities/${currentActivity.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentActivity),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update activity');
      }

      alert('Activity updated successfully!');
      setShowEditModal(false);
      setCurrentActivity(null);
      fetchActivities();
    } catch (err: any) {
      alert(`Error updating activity: ${err.message}`);
    }
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
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-800">OutGo Admin</div>
        <nav className="space-x-4">
          <Link href="/admin/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</Link>
          <Link href="/admin/merchants" className="text-gray-600 hover:text-blue-600">Merchants</Link>
          <Link href="/admin/activities" className="text-blue-600 font-semibold">Activities</Link>
          <Link href="/admin/users" className="text-gray-600 hover:text-blue-600">Users</Link>
        </nav>
        <div className="space-x-4">
          <Link href="/signin" className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition duration-300">Sign Out</Link>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Manage Activities</h1>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 mb-4"
            onClick={() => setShowCreateModal(true)}
          >
            Add New Activity
          </button>
          {activities.length === 0 ? (
            <p className="text-gray-600">No activities found.</p>
          ) : (
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Name</th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Firm</th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Summary</th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Price</th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Status</th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => (
                  <tr key={activity.id}>
                    <td className="py-2 px-4 border-b border-gray-200">{activity.name}</td>
                    <td className="py-2 px-4 border-b border-gray-200">{activity.firm}</td>
                    <td className="py-2 px-4 border-b border-gray-200">{activity.summary}</td>
                    <td className="py-2 px-4 border-b border-gray-200">{activity.price}</td>
                    <td className="py-2 px-4 border-b border-gray-200">{activity.status}</td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm mr-2"
                        onClick={() => handleEditClick(activity)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                        onClick={() => handleDelete(activity.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Create Activity Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Add New Activity</h2>
            <form onSubmit={handleCreateActivity}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={newActivity.name} onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })} required />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Firm:</label>
                <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={newActivity.firm} onChange={(e) => setNewActivity({ ...newActivity, firm: e.target.value })} />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Summary:</label>
                <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={newActivity.summary} onChange={(e) => setNewActivity({ ...newActivity, summary: e.target.value })} />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
                <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={newActivity.description} onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })} />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Period Start:</label>
                <input type="datetime-local" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={newActivity.period_start} onChange={(e) => setNewActivity({ ...newActivity, period_start: e.target.value })} />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Period End:</label>
                <input type="datetime-local" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={newActivity.period_end} onChange={(e) => setNewActivity({ ...newActivity, period_end: e.target.value })} />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Price:</label>
                <input type="number" step="0.01" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={newActivity.price} onChange={(e) => setNewActivity({ ...newActivity, price: parseFloat(e.target.value) })} />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Currency:</label>
                <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={newActivity.currency} onChange={(e) => setNewActivity({ ...newActivity, currency: e.target.value })} />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Location:</label>
                <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={newActivity.location} onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })} />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Image URL:</label>
                <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={newActivity.image_url} onChange={(e) => setNewActivity({ ...newActivity, image_url: e.target.value })} />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Merchant ID:</label>
                <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={newActivity.merchant_id} onChange={(e) => setNewActivity({ ...newActivity, merchant_id: e.target.value })} required />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Status:</label>
                <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={newActivity.status} onChange={(e) => setNewActivity({ ...newActivity, status: e.target.value })} >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button type="button" className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md mr-2" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">Create Activity</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Activity Modal */}
      {showEditModal && currentActivity && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Edit Activity</h2>
            <form onSubmit={handleUpdateActivity}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={currentActivity.name} onChange={(e) => setCurrentActivity({ ...currentActivity, name: e.target.value })} required />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Firm:</label>
                <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={currentActivity.firm} onChange={(e) => setCurrentActivity({ ...currentActivity, firm: e.target.value })} />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Summary:</label>
                <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={currentActivity.summary} onChange={(e) => setCurrentActivity({ ...currentActivity, summary: e.target.value })} />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
                <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={currentActivity.description} onChange={(e) => setCurrentActivity({ ...currentActivity, description: e.target.value })} />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Period Start:</label>
                <input type="datetime-local" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={currentActivity.period_start} onChange={(e) => setCurrentActivity({ ...currentActivity, period_start: e.target.value })} />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Period End:</label>
                <input type="datetime-local" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={currentActivity.period_end} onChange={(e) => setCurrentActivity({ ...currentActivity, period_end: e.target.value })} />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Price:</label>
                <input type="number" step="0.01" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={currentActivity.price} onChange={(e) => setCurrentActivity({ ...currentActivity, price: parseFloat(e.target.value) })} />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Currency:</label>
                <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={currentActivity.currency} onChange={(e) => setCurrentActivity({ ...currentActivity, currency: e.target.value })} />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Location:</label>
                <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={currentActivity.location} onChange={(e) => setCurrentActivity({ ...currentActivity, location: e.target.value })} />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Image URL:</label>
                <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={currentActivity.image_url} onChange={(e) => setCurrentActivity({ ...currentActivity, image_url: e.target.value })} />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Merchant ID:</label>
                <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={currentActivity.merchant_id} onChange={(e) => setCurrentActivity({ ...currentActivity, merchant_id: e.target.value })} required />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Status:</label>
                <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={currentActivity.status} onChange={(e) => setCurrentActivity({ ...currentActivity, status: e.target.value })} >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button type="button" className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md mr-2" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">Update Activity</button>
              </div>
            </form>
          </div>
        </div>
      )}

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
