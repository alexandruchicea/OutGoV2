import MerchantRegistrationForm from './MerchantRegistrationForm';

export default function MerchantRegistrationPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Merchant Registration</h1>
        <MerchantRegistrationForm />
      </div>
    </div>
  );
}