import Link from 'next/link';
'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

interface Friend {
  id: string;
  name: string;
  email: string;
}

export default function Friends() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [friendEmail, setFriendEmail] = useState('');

  useEffect(() => {
    async function fetchFriends() {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (!user) {
          router.push('/signin');
          return;
        }

        // In a real app, you'd fetch friends from a 'friends' table
        // For now, let's simulate some friends
        setFriends([
          { id: 'friend1', name: 'Alice', email: 'alice@example.com' },
          { id: 'friend2', name: 'Bob', email: 'bob@example.com' },
        ]);

      } catch (err: any) {
        console.error('Unexpected error:', err.message);
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    }
    fetchFriends();
  }, [supabase, router]);

  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !friendEmail.trim()) {
      alert('Please enter a friend's email.');
      return;
    }
    alert(`Adding friend: ${friendEmail}`);
    setFriendEmail('');
    // In a real app, you'd send a friend request to the backend
  };

  const handleRemoveFriend = async (friendId: string) => {
    if (!confirm('Are you sure you want to remove this friend?')) {
      return;
    }
    alert(`Removing friend: ${friendId}`);
    // In a real app, you'd send a request to the backend to remove the friend
    setFriends(friends.filter(f => f.id !== friendId));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">Loading friends...</p>
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">Please sign in to view your friends.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">My Friends</h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add New Friend</h2>
          <form onSubmit={handleAddFriend} className="flex gap-4">
            <input
              type="email"
              placeholder="Friend's email address"
              className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={friendEmail}
              onChange={(e) => setFriendEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
            >
              Add Friend
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Friend List</h2>
          {friends.length === 0 ? (
            <p className="text-gray-600">You have no friends yet.</p>
          ) : (
            <ul className="space-y-4">
              {friends.map((friend) => (
                <li key={friend.id} className="flex justify-between items-center border border-gray-200 p-4 rounded-md">
                  <div>
                    <p className="font-semibold text-gray-800">{friend.name}</p>
                    <p className="text-gray-600 text-sm">{friend.email}</p>
                  </div>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                    onClick={() => handleRemoveFriend(friend.id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      
    </div>
  );
}
