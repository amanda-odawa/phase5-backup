import { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

const presetAmounts = [10, 25, 50];

function Donation() {
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState('All areas');
  const [card_name, setcard_name] = useState('');
  const [card_number, setcard_number] = useState('');
  const [expiration_date, setexpiration_date] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState(1); // Default to user ID 1

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await api.get('/areas');
        const areaNames = response.data.map(area => area.name);
        setAreas(['All areas', ...areaNames]);
      } catch (error) {
        console.error('Error fetching areas:', error);
        toast.error('Failed to load areas');
      }
    };

    fetchAreas();
   
    // Get current user ID (in a real app, this might come from context, localStorage, etc.)
    const getCurrentUserId = () => {
      // For this example, we're using a hardcoded value
      // In a real app, you might get this from localStorage, auth context, etc.
      // Example: const storedUserId = localStorage.getItem('userId');
      return 11; // Hardcoded for demonstration
    };
   
    const currentUserId = getCurrentUserId();
    setUserId(currentUserId);
   
    // Fetch the user data using the dynamic endpoint
    const fetchUserData = async (id) => {
      try {
        // Using the dynamic endpoint with the user ID
        const response = await api.get(`/users/${id}`);
       
        // Log the response to see what fields are available
        console.log('User data:', response.data);
       
        // You can choose which field from the user data to display as username
        if (response.data) {
          // Try common field names that might contain user identifier
          const displayName =
            response.data.username ||
            response.data.name ||
            response.data.full_name ||
            response.data.email ||
            `User #${response.data.id}`;
         
          setUsername(displayName);
        }
      } catch (error) {
        console.error(`Error fetching user data for ID ${id}:`, error);
        toast.error('Failed to load user information');
      }
    };
   
    // Fetch user data with the current user ID
    fetchUserData(currentUserId);
  }, []);

  const handleAmountSelect = (value) => {
    setAmount(value.toString());
    setCustomAmount('');
  };

  const validateForm = () => {
    const donationAmount = customAmount || amount;
    if (!donationAmount || parseFloat(donationAmount) <= 0) return 'Please enter a valid donation amount.';
    if (!card_name.trim()) return 'Please enter the name on the card.';
    if (!/^\d{16}$/.test(card_number.replace(/\s/g, ''))) return 'Card number must be 16 digits.';
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiration_date)) return 'Enter expiration_date as MM/YY.';
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
      card_name,
      card_number: card_number.replace(/\s/g, ''),
      expiration_date,
      cvv,
      area_name: selectedArea,
      username: username
    });
    toast.success('Donation submitted successfully!');
    setAmount('');
    setCustomAmount('');
    setSelectedArea('All areas');
    setcard_name('');
    setcard_number('');
    setexpiration_date('');
    setCvv('');
    setError('');
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || 'Failed to submit donation.');
  } finally {
    setLoading(false);
  }
};


  // const handleSubmit = async () => {
  //   const validationError = validateForm();
  //   if (validationError) {
  //     setError(validationError);
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     await api.post('/donations', {
  //       amount: parseFloat(customAmount || amount),
  //       area: selectedArea,
  //       date: new Date().toISOString()
  //     });
  //     toast.success('Donation submitted successfully!');
  //     setAmount('');
  //     setCustomAmount('');
  //     setSelectedArea('All areas');
  //     setcard_name('');
  //     setcard_number('');
  //     setexpiration_date('');
  //     setCvv('');
  //     setError('');
  //   } catch (err) {
  //     console.error(err);
  //     toast.error('Failed to submit donation.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-semibold text-center mb-2">Make a Donation</h1>
        <p className="mt-2 max-w-2xl mx-auto text-center text-gray-600">
          Your support helps us combat communicable diseases worldwide
        </p>
      </div>

      <div className="bg-gray-100 p-8 rounded-lg w-full max-w-lg shadow-sm">
        <div className="mb-6">
          <label className="block text-gray-800 mb-2 font-medium">Username</label>
          <input
            type="text"
            value={username}
            disabled
            className="w-full px-4 py-2 border border-gray-400 rounded-md bg-gray-200"
            title="Currently logged in user"
          />
        </div>
       
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
          <label className="block text-gray-800 mb-2 font-medium">Select Area</label>
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="w-full px-4 py-2 border border-gray-400 rounded-md"
          >
            {areas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <h4 className="text-gray-800 font-medium mb-3">Card Payment Details</h4>
          <input
            type="text"
            value={card_name}
            onChange={(e) => setcard_name(e.target.value)}
            placeholder="Name on Card"
            className="w-full p-3 mb-3 border border-gray-400 rounded-md"
          />
          <input
            type="text"
            value={card_number}
            onChange={(e) => setcard_number(e.target.value)}
            placeholder="Card Number (16 digits)"
            className="w-full p-3 mb-3 border border-gray-400 rounded-md"
          />
          <div className="flex gap-4">
            <input
              type="text"
              value={expiration_date}
              onChange={(e) => setexpiration_date(e.target.value)}
              placeholder="MM/YY"
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