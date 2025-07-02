import React from 'react';
import { Activity } from '@/app/admin/activities/page';

interface CreateActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  newActivity: Omit<Activity, 'id' | 'created_at' | 'updated_at'>;
  setNewActivity: (activity: Omit<Activity, 'id' | 'created_at' | 'updated_at'>) => void;
  handleCreateActivity: (e: React.FormEvent) => void;
}

const CreateActivityModal: React.FC<CreateActivityModalProps> = ({
  isOpen,
  onClose,
  newActivity,
  setNewActivity,
  handleCreateActivity,
}) => {
  if (!isOpen) return null;

  return (
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
            <button type="button" className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md mr-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">Create Activity</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateActivityModal;
