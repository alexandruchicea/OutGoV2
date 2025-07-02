'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function MerchantRegister() {
  const [businessName, setBusinessName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [description, setDescription] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const response = await fetch('/api/merchant/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: businessName,
          contact_email: contactEmail,
          description: description,
        }),
      });

      if (response.ok) {
        setStatusMessage('Business submitted successfully for approval!');
        setBusinessName('');
        setContactEmail('');
        setDescription('');
      } else {
        const errorData = await response.json();
        setStatusMessage(`Submission failed: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error: any) {
      setStatusMessage(`An unexpected error occurred: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      

      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Register Your Business</h1>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="businessName" className="block text-gray-700 text-sm font-bold mb-2">Business Name</label>
              <input
                type="text"
                id="businessName"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Your Business Name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="contactEmail" className="block text-gray-700 text-sm font-bold mb-2">Contact Email</label>
              <input
                type="email"
                id="contactEmail"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="contact@example.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Business Description</label>
              <textarea
                id="description"
                rows={4}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Tell us about your business..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
              </button>
            </div>
            {statusMessage && (
              <p className="mt-4 text-center text-sm font-semibold"
                style={{ color: statusMessage.includes('failed') ? 'red' : 'green' }}>
                {statusMessage}
              </p>
            )}
          </form>
        </div>
      </main>

      
    </div>
  );
}
