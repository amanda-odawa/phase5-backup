import { useState } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

const presetAmounts = [10, 25, 50];
const regions = [
  'All regions', 'Africa', 'Asia', 'Australia', 'Europe', 'North America', 'South America', 'Oceania'
];

function Donation() {
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All regions');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAmountSelect = (value) => {
    setAmount(value.toString());
    setCustomAmount('');
  };

  const validateForm = () => {
    const donationAmount = customAmount || amount;
    if (!donationAmount || parseFloat(donationAmount) <= 0) return 'Please enter a valid donation amount.';
    if (!cardName.trim()) return 'Please enter the name on the card.';
    if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) return 'Card number must be 16 digits.';
    if (!/^(0[1-9]|1[0-2])\/\d{4}$/.test(expiry)) return 'Enter expiry as MM/YYYY.';
    if (!/^\d{3}$/.test(cvv)) return 'CVV must be 3 digits.';
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
      await api.post('/donations', {
        amount: parseFloat(customAmount || amount),
        region: selectedRegion,
        date: new Date().toISOString()
      });
      toast.success('Donation submitted successfully!');
      setAmount('');
      setCustomAmount('');
      setSelectedRegion('All regions');
      setCardName('');
      setCardNumber('');
      setExpiry('');
      setCvv('');
      setError('');
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit donation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-semibold mb-2">Make a Donation</h1>
        <p className="mt-2 text-sm text-gray-600">
          Your support helps us combat communicable diseases worldwide
        </p>
      </div>

      <div className="bg-gray-100 p-8 rounded-lg w-full max-w-lg shadow-sm">
        <div className="mb-6">
          <label className="block text-gray-800 mb-2 font-medium">Select Amount</label>
          <div className="flex space-x-4 mb-4">
            {presetAmounts.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => handleAmountSelect(amt)}
                className={`flex-1 py-2 border rounded-md text-center ${
                  amount === amt.toString() ? 'bg-gray-300 border-gray-600' : 'border-gray-400'
                }`}
              >
                ${amt}
              </button>
            ))}
          </div>
          <input
            type="number"
            min="1"
            placeholder="Custom amount"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setAmount('');
            }}
            className="w-full px-4 py-2 border border-gray-400 rounded-md"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-800 mb-2 font-medium">Select Region</label>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="w-full px-4 py-2 border border-gray-400 rounded-md"
          >
            {regions.map((region) => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <h4 className="text-gray-800 font-medium mb-3">Card Payment Details</h4>
          <input
            type="text"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            placeholder="Name on Card"
            className="w-full p-3 mb-3 border border-gray-400 rounded-md"
          />
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            placeholder="Card Number (16 digits)"
            className="w-full p-3 mb-3 border border-gray-400 rounded-md"
          />
          <div className="flex gap-4">
            <input
              type="text"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              placeholder="MM/YYYY"
              className="w-1/2 p-3 border border-gray-400 rounded-md"
            />
            <input
              type="text"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              placeholder="CVV"
              className="w-1/2 p-3 border border-gray-400 rounded-md"
            />
          </div>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-cyan-600 text-white py-3 rounded-md shadow-md hover:bg-cyan-700 transition-colors"
        >
          {loading ? 'Processing...' : 'Complete Donation'}
        </button>
      </div>
    </div>
  );
}

export default Donation;
