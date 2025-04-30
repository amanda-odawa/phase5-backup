import { useState } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

function DonationForm({ areaId }) {
  const [amount, setAmount] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!amount || parseFloat(amount) <= 0) {
      return 'Please enter a valid donation amount greater than 0.';
    }
    if (!cardName.trim()) {
      return 'Please enter the name on the card.';
    }
    if (!cardNumber || !/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
      return 'Please enter a valid 16-digit card number.';
    }
    if (!expiry || !/^(0[1-9]|1[0-2])\/\d{4}$/.test(expiry)) {
      return 'Please enter a valid expiry date (MM/YYYY).';
    }
    if (!cvv || !/^\d{3}$/.test(cvv)) {
      return 'Please enter a valid 3-digit CVV.';
    }
    return '';
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await api.post('/donations', { areaId, amount: parseFloat(amount), date: new Date().toISOString() });
      toast.success('Donation submitted successfully!');
      setAmount('');
      setCardName('');
      setCardNumber('');
      setExpiry('');
      setCvv('');
      setError('');
    } catch (error) {
      console.error('Error submitting donation:', error);
      toast.error('Failed to submit donation. Please try again.');
      setError('Failed to submit donation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-md card">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Make a Donation</h3>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter donation amount"
        className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Donation amount"
      />
      <input
        type="text"
        value={cardName}
        onChange={(e) => setCardName(e.target.value)}
        placeholder="Name on Card"
        className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Name on card"
      />
      <input
        type="text"
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
        placeholder="Card Number"
        className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Card number"
      />
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
          placeholder="MM/YYYY"
          className="w-1/2 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Expiry date"
        />
        <input
          type="text"
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
          placeholder="CVV"
          className="w-1/2 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="CVV"
        />
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button
        onClick={handleSubmit}
        className="btn-primary w-full p-3 text-white rounded-lg flex items-center justify-center"
        disabled={loading}
        aria-label="Donate"
      >
        {loading ? <div className="spinner mr-2"></div> : null}
        Donate
      </button>
    </div>
  );
}

export default DonationForm;