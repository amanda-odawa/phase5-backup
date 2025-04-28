import { useState } from 'react';
import api from '../utils/api';

function DonationForm({ areaId }) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid donation amount greater than 0.');
      return;
    }

    try {
      await api.post('/donations', { areaId, amount: parseFloat(amount), date: new Date().toISOString() });
      alert('Donation submitted successfully!');
      setAmount('');
      setError('');
    } catch (error) {
      console.error('Error submitting donation:', error);
      setError('Failed to submit donation. Please try again.');
    }
  };

  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Make a Donation</h3>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter donation amount"
        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      />
      {error && <p className="text-danger mt-2">{error}</p>}
      <button
        onClick={handleSubmit}
        className="mt-4 bg-secondary text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Donate
      </button>
    </div>
  );
}

export default DonationForm;