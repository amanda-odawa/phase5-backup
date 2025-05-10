// import { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';  // Import useSelector to get user data
// import api from '../utils/api';

// function ReviewForm({ areaId, diseaseId }) {
//   const [review, setReview] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(false);

//   // Access the logged-in user's username from the Redux store
//   const user = useSelector((state) => state.auth.user);

//   const handleSubmit = async () => {
//     if (!review.trim()) {
//       setError('Please enter a suggestion.');
//       return;
//     }

//     if (!user) {
//       setError('You must be logged in to submit a review.');
//       return;
//     }

//     try {
//       // Add the username to the review data when submitting
//       await api.post('/reviews', {
//         diseaseId,
//         content: review,
//         date: new Date().toISOString(),
//         username: user.username,  // Include username in the review data
//       });
//       setSuccess(true);
//       setReview('');
//       setError('');
//       setTimeout(() => setSuccess(false), 3000);
//     } catch (error) {
//       console.error('Error submitting suggestion:', error);
//       setError('Failed to submit suggestion. Please try again.');
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded-2xl shadow-lg">
//       <h3 className="text-xl font-semibold text-gray-800 mb-3">Submit a Suggestion</h3>
//       <textarea
//         value={review}
//         onChange={(e) => setReview(e.target.value)}
//         placeholder="How would you like to help eradicate the disease in this area?"
//         className="w-full min-h-[120px] p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
//       />
//       {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
//       {success && <p className="text-sm text-green-600 mt-2">Suggestion submitted successfully!</p>}
//       <button
//         onClick={handleSubmit}
//         className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white font-medium px-5 py-2 rounded-lg transition duration-200"
//       >
//         Submit
//       </button>
//     </div>
//   );
// }

// export default ReviewForm;

/////////////////////////////////////////////////////////

// src/components/ReviewForm.jsx
// import { useState } from 'react';
// import { useSelector } from 'react-redux';
// import api from '../utils/api';

// function ReviewForm({ areaId, diseaseId, onCommentSubmit }) {
//   const [review, setReview] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(false);

//   const user = useSelector((state) => state.auth.user);

//   const handleSubmit = async () => {
//     if (!review.trim()) {
//       setError('Please enter a suggestion.');
//       return;
//     }

//     if (!user) {
//       setError('You must be logged in to submit a review.');
//       return;
//     }

//     const newComment = {
//       areaId,
//       diseaseId,
//       content: review,
//       date: new Date().toISOString(),
//       user: user.username,
//     };

//     try {
//       const res = await api.post('/reviews', newComment);
//       setSuccess(true);
//       setReview('');
//       setError('');
//       onCommentSubmit(res.data); // update comment list instantly
//       setTimeout(() => setSuccess(false), 3000);
//     } catch (error) {
//       console.error('Error submitting suggestion:', error);
//       setError('Failed to submit suggestion. Please try again.');
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded-2xl shadow-lg">
//       <h3 className="text-xl font-semibold text-gray-800 mb-3">Submit a Suggestion</h3>
//       <textarea
//         value={review}
//         onChange={(e) => setReview(e.target.value)}
//         placeholder="How would you like to help eradicate the disease in this area?"
//         className="w-full min-h-[120px] p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
//       />
//       {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
//       {success && <p className="text-sm text-green-600 mt-2">Suggestion submitted successfully!</p>}
//       <button
//         onClick={handleSubmit}
//         className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white font-medium px-5 py-2 rounded-lg transition duration-200"
//       >
//         Submit
//       </button>
//     </div>
//   );
// }

// export default ReviewForm;

///////////////////////////////////////////////

import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';

const ReviewForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasNotified = useRef(false);
  const { diseaseId } = useParams();

  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const getCurrentUserId = () => {
      return 11; // Hardcoded for demo; replace with real logic
    };

    const currentUserId = getCurrentUserId();
    setUserId(currentUserId);

    const fetchUserData = async (id) => {
      try {
        const response = await api.get(`/users/${id}`);
        if (response.data) {
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

    if (!currentUserId && !hasNotified.current) {
      toast.info('Please log in to leave a review');
      hasNotified.current = true;
      navigate('/login', { state: { from: location.pathname } });
    } else {
      fetchUserData(currentUserId);
    }
  }, [navigate, location]);

  if (!userId) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error('Please enter a comment before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        content: content.trim(),
        user_id: userId,
        disease_id: parseInt(diseaseId),
      };

      await api.post('/reviews', payload);
      toast.success('Review submitted successfully');
      setContent('');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-center">Leave a Comment</h2>
      <p className="text-sm text-gray-500 mb-2">Commenting as <span className="font-medium">{username}</span></p>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="5"
          placeholder="Write your comment here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-md mb-4"
        ></textarea>
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-cyan-600 text-white py-2 rounded-md hover:bg-cyan-700 transition-colors"
        >
          {submitting ? 'Submitting...' : 'Submit Comment'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
