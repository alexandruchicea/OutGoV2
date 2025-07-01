import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-800">OutGo Admin</div>
        <nav className="space-x-4">
          <Link href="/admin/dashboard" className="text-blue-600 font-semibold">Dashboard</Link>
          <Link href="/admin/merchants" className="text-gray-600 hover:text-blue-600">Merchants</Link>
          <Link href="/admin/activities" className="text-gray-600 hover:text-blue-600">Activities</Link>
          <Link href="/admin/users" className="text-gray-600 hover:text-blue-600">Users</Link>
        </nav>
        <div className="space-x-4">
          <Link href="/signin" className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition duration-300">Sign Out</Link>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Merchant Applications Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Merchant Applications</h2>
            <p className="text-gray-600 mb-4">Review and approve new merchant submissions.</p>
            <Link href="/admin/merchants" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300">
              View Applications
            </Link>
          </div>

          {/* Activity Listings Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Activity Listings</h2>
            <p className="text-gray-600 mb-4">Manage and edit all activity listings.</p>
            <Link href="/admin/activities" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300">
              Manage Activities
            </Link>
          </div>

          {/* User Management Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">User Management</h2>
            <p className="text-gray-600 mb-4">Oversee user accounts and roles.</p>
            <Link href="/admin/users" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300">
              Manage Users
            </Link>
          </div>
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
