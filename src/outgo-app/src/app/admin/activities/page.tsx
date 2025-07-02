import Link from 'next/link';
'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import CreateActivityModal from '@/components/CreateActivityModal';
import EditActivityModal from '@/components/EditActivityModal';

export interface Activity {
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
    import { isAdmin } from '@/utils/auth/roles';
    if (!user || !isAdmin(user)) { // Admin check
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

      <CreateActivityModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        newActivity={newActivity}
        setNewActivity={setNewActivity}
        handleCreateActivity={handleCreateActivity}
      />

      <EditActivityModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        currentActivity={currentActivity}
        setCurrentActivity={setCurrentActivity}
        handleUpdateActivity={handleUpdateActivity}
      />

      
    </div>
  );
}
