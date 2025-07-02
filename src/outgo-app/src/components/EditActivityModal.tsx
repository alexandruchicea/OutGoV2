import React from 'react';
import { Activity } from '@/app/admin/activities/page';

interface EditActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentActivity: Activity;
  setCurrentActivity: (activity: Activity) => void;
  handleUpdateActivity: (e: React.FormEvent) => void;
}

const EditActivityModal: React.FC<EditActivityModalProps> = ({
  isOpen,
  onClose,
  currentActivity,
  setCurrentActivity,
  handleUpdateActivity,
}) => {
  if (!isOpen || !currentActivity) return null;

  return (
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
            <button type="button" className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md mr-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">Update Activity</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditActivityModal;
