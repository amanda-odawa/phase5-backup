import { useState } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

const presetAmounts = [10, 25, 50, 75];
const regions = [
  'All regions', 'Africa', 'Asia', 'Australia', 'Europe', 'North America', 'South America', 'Oceania'
];

function DonationForm({ areaId }) {
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
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      return 'Please enter a valid donation amount.';
    }
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
        areaId,
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
    <div className="max-w-xl mx-auto p-6 bg-white rounded-md shadow">
      {/* Header outside of the form */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">Make a Donation</h2>
        <p className="text-gray-600 mb-6">Your support helps us combat communicable diseases worldwide</p>
      </div>

      {/* Form */}
      <div>
        {/* Amount */}
        <div className="mb-4">
          <label className="block font-medium text-gray-800 mb-2">Select Amount</label>
          <div className="flex space-x-4 mb-3">
            {presetAmounts.map((amt) => (
              <button
                key={amt}
                onClick={() => handleAmountSelect(amt)}
                className={`px-11 py-2 border rounded-md ${amount === amt.toString() ? 'bg-gray-200 border-gray-600' : 'border-gray-300'}`}
              >
                ${amt}
              </button>
            ))}
          </div>
          <input
            type="number"
            min="1"
            placeholder="$ Custom amount"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setAmount('');
            }}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        {/* Region */}
        <div className="mb-6">
          <label className="block font-medium text-gray-800 mb-2">Select Region to Support</label>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          >
            {regions.map((region) => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        {/* Card Details */}
        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <h4 className="font-medium text-gray-800 mb-4">Card Payment Details</h4>
          <input
            type="text"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            placeholder="Name as it appears on card"
            className="w-full p-2 mb-3 border rounded-md"
          />
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            placeholder="1234 5678 9012 3456"
            className="w-full p-2 mb-3 border rounded-md"
          />
          <div className="flex gap-4">
            <input
              type="text"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              placeholder="MM/YYYY"
              className="w-1/2 p-2 border rounded-md"
            />
            <input
              type="text"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              placeholder="123"
              className="w-1/2 p-2 border rounded-md"
            />
          </div>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-[#0097b2] hover:bg-[#007d91] text-white font-semibold py-3 rounded-md transition"
        >
          {loading ? 'Processing...' : 'Complete Donation'}
        </button>
      </div>
    </div>
  );
}

export default DonationForm;
