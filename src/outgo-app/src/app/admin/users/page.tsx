import Link from 'next/link';
'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

interface UserProfile {
  id: string;
  name: string;
  preferences: string;
  email: string; // Assuming email can be fetched or is part of the profile
}

export default function AdminUsers() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    import { isAdmin } from '@/utils/auth/roles';

if (!user || !isAdmin(user)) { // Admin check
      router.push('/signin');
      return false;
    }
    return true;
  };

  const fetchUsers = async () => {
    if (!(await checkAdmin())) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/users');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete user');
      }

      alert('User deleted successfully!');
      fetchUsers(); // Re-fetch users to update the list
    } catch (err: any) {
      alert(`Error deleting user: ${err.message}`);
    }
  };

  const handleEditClick = (user: UserProfile) => {
    setCurrentUser(user);
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      const response = await fetch(`/api/admin/users/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: currentUser.name, preferences: currentUser.preferences }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user');
      }

      alert('User updated successfully!');
      setShowEditModal(false);
      setCurrentUser(null);
      fetchUsers();
    } catch (err: any) {
      alert(`Error updating user: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">Loading users...</p>
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
          <Link href="/admin/activities" className="text-gray-600 hover:text-blue-600">Activities</Link>
          <Link href="/admin/users" className="text-blue-600 font-semibold">Users</Link>
        </nav>
        <div className="space-x-4">
          <Link href="/signin" className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition duration-300">Sign Out</Link>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Manage Users</h1>

        <div className="bg-white p-6 rounded-lg shadow-md">
          {users.length === 0 ? (
            <p className="text-gray-600">No users found.</p>
          ) : (
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Name</th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Email</th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Preferences</th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="py-2 px-4 border-b border-gray-200">{user.name || 'N/A'}</td>
                    <td className="py-2 px-4 border-b border-gray-200">{user.email || 'N/A'}</td>
                    <td className="py-2 px-4 border-b border-gray-200">{user.preferences || 'N/A'}</td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm mr-2"
                        onClick={() => handleEditClick(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                        onClick={() => handleDelete(user.id)}
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

      {/* Edit User Modal */}
      {showEditModal && currentUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Edit User</h2>
            <form onSubmit={handleUpdateUser}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={currentUser.name || ''} onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })} />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Preferences:</label>
                <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={currentUser.preferences || ''} onChange={(e) => setCurrentUser({ ...currentUser, preferences: e.target.value })} />
              </div>
              <div className="flex justify-end">
                <button type="button" className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md mr-2" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">Update User</button>
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
