'use client';

import Link from 'next/link';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh(); // Force a re-render to update session status
  };

  return (
    <header className="bg-gray-800 text-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">OutGo</Link>
        <nav>
          <ul className="flex space-x-4">
            <li><Link href="/activities" className="hover:text-gray-300">Activities</Link></li>
            {session ? (
              <>
                <li><Link href="/profile" className="hover:text-gray-300">Profile</Link></li>
                <li>
                  <button onClick={handleSignOut} className="hover:text-gray-300 focus:outline-none">
                    Log Out
                  </button>
                </li>
              </>
            ) : (
              <li><Link href="/signin" className="hover:text-gray-300">Sign In</Link></li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}