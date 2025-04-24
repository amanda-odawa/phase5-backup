import { useState } from 'react';
import api from '../utils/api';

function ReviewForm({ areaId }) {
  const [review, setReview] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reviews', { areaId, content: review, date: new Date().toISOString() });
      alert('Suggestion submitted successfully!');
      setReview('');
    } catch (error) {
      console.error('Error submitting suggestion:', error);
      alert('Failed to submit suggestion.');
    }
  };

  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Submit a Suggestion</h3>
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="How would you like to help eradicate the disease in this area?"
        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <button
        onClick={handleSubmit}
        className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Submit Suggestion
      </button>
    </div>
  );
}

export default ReviewForm;