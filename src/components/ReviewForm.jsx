
import { useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../utils/api';

function ReviewForm({ areaId, diseaseId, onCommentSubmit }) {
  const [review, setReview] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const user = useSelector((state) => state.auth.user);

  const handleSubmit = async () => {
    if (!review.trim()) {
      setError('Please enter a suggestion.');
      return;
    }

    if (!user) {
      setError('You must be logged in to submit a review.');
      return;
    }

    const newComment = {
      areaId,
      diseaseId,
      content: review,
      date: new Date().toISOString(),
      user: user.username,
    };

    try {
      const res = await api.post('/reviews', newComment);
      setSuccess(true);
      setReview('');
      setError('');
      onCommentSubmit(res.data); // update comment list instantly
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error submitting suggestion:', error);
      setError('Failed to submit suggestion. Please try again.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800 mb-3">Submit a Suggestion</h3>
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="How would you like to help eradicate the disease in this area?"
        className="w-full min-h-[120px] p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
      />
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      {success && <p className="text-sm text-green-600 mt-2">Suggestion submitted successfully!</p>}
      <button
        onClick={handleSubmit}
        className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white font-medium px-5 py-2 rounded-lg transition duration-200"
      >
        Submit
      </button>
    </div>
  );
}

export default ReviewForm;