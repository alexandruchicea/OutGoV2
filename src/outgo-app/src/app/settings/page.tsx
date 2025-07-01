import Link from 'next/link';
'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

interface Profile {
  id: string;
  name: string;
  preferences: string; // Stored as JSON string
  language: string;
}

export default function Settings() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [activityPreferences, setActivityPreferences] = useState({
    outdoors: false,
    arts: false,
    food: false,
  });

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (!user) {
          router.push('/signin');
          return;
        }

        const profileResponse = await fetch(`/api/profile?userId=${user.id}`);
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setProfile(profileData);
          setSelectedLanguage(profileData.language || 'en');
          try {
            setActivityPreferences(JSON.parse(profileData.preferences || '{}'));
          } catch (e) {
            console.error('Error parsing preferences:', e);
            setActivityPreferences({ outdoors: false, arts: false, food: false });
          }
        } else {
          console.error('Error fetching profile:', await profileResponse.text());
          setError('Failed to load profile.');
        }
      } catch (err: any) {
        console.error('Unexpected error:', err.message);
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [supabase, router]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value);
  };

  const handlePreferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActivityPreferences({
      ...activityPreferences,
      [e.target.name]: e.target.checked,
    });
  };

  const handleSaveSettings = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          language: selectedLanguage,
          preferences: JSON.stringify(activityPreferences),
        }),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        alert('Settings saved successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to save settings: ${errorData.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      alert(`An unexpected error occurred: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">Loading settings...</p>
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
        <p className="text-xl text-gray-700">Please sign in to view your settings.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-800">OutGo</div>
        <nav className="space-x-4">
          <Link href="/" className="text-gray-600 hover:text-blue-600">Home</Link>
          <Link href="/activities" className="text-gray-600 hover:text-blue-600">Activities</Link>
          <Link href="/profile" className="text-gray-600 hover:text-blue-600">Profile</Link>
          <Link href="/settings" className="text-blue-600 font-semibold">Settings</Link>
        </nav>
        <div className="space-x-4">
          <Link href="/signin" className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition duration-300">Sign In</Link>
          <Link href="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300">Sign Up</Link>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Settings</h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Language</h2>
          <div className="mb-4">
            <label htmlFor="language" className="block text-gray-700 text-sm font-bold mb-2">Select Language:</label>
            <select
              id="language"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={selectedLanguage}
              onChange={handleLanguageChange}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Activity Preferences</h2>
          <div className="space-y-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="outdoors"
                className="form-checkbox h-5 w-5 text-blue-600"
                checked={activityPreferences.outdoors}
                onChange={handlePreferenceChange}
              />
              <span className="ml-2 text-gray-700">Outdoors</span>
            </label>
            <label className="inline-flex items-center ml-4">
              <input
                type="checkbox"
                name="arts"
                className="form-checkbox h-5 w-5 text-blue-600"
                checked={activityPreferences.arts}
                onChange={handlePreferenceChange}
              />
              <span className="ml-2 text-gray-700">Arts & Culture</span>
            </label>
            <label className="inline-flex items-center ml-4">
              <input
                type="checkbox"
                name="food"
                className="form-checkbox h-5 w-5 text-blue-600"
                checked={activityPreferences.food}
                onChange={handlePreferenceChange}
              />
              <span className="ml-2 text-gray-700">Food & Drink</span>
            </label>
          </div>
        </div>

        <div className="text-center">
          <button
            className="px-8 py-3 bg-blue-600 text-white text-xl font-semibold rounded-md hover:bg-blue-700 transition duration-300"
            onClick={handleSaveSettings}
          >
            Save Settings
          </button>
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