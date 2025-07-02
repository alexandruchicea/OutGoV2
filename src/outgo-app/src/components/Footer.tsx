'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; 2025 OutGo. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-4">
          <Link href="#" className="text-gray-400 hover:text-white">About Us</Link>
          <Link href="#" className="text-gray-400 hover:text-white">Contact</Link>
          <Link href="#" className="text-gray-400 hover:text-white">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}