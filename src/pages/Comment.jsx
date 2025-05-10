import { useState, useEffect, useRef } from 'react'; 
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../utils/api';
import { toast } from 'react-toastify';
import CommentList from '../components/CommentList'; // Component for displaying comments

function Comment() {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const location = useLocation();
  const hasNotified = useRef(false);

  const [content, setContent] = useState('');
  const [diseases, setDiseases] = useState([]);
  const [selectedDiseaseId, setSelectedDiseaseId] = useState('');
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]); // To store fetched comments
  const [commentsLoading, setCommentsLoading] = useState(true); // To track if comments are loading
  const [loginPrompt, setLoginPrompt] = useState(false); // To show login prompt if not logged in

  useEffect(() => {
    // Fetch comments regardless of whether user is logged in
    const fetchComments = async () => {
      try {
        const res = await api.get('/reviews');
        setComments(res.data || []);
      } catch (err) {
        console.error('Failed to fetch comments:', err);
        toast.error('Failed to load comments');
      } finally {
        setCommentsLoading(false);
      }
    };

    fetchComments();

    // If the user is logged in, fetch their data and disease options
    if (user) {
      const getCurrentUserId = () => 11; // Replace with real logic if needed
      const currentUserId = getCurrentUserId();
      setUserId(currentUserId);

      const fetchUserData = async () => {
        try {
          const res = await api.get(`/users/${currentUserId}`);
          if (res.data) {
            setUsername(res.data.username || `User #${res.data.id}`);
          }
        } catch (err) {
          console.error('Failed to fetch user:', err);
          toast.error('Failed to load user');
        }
      };

      const fetchDiseases = async () => {
        try {
          const res = await api.get('/diseases');
          setDiseases(res.data || []);
          if (res.data.length > 0) {
            setSelectedDiseaseId(res.data[0].id); // Set the first disease as default
          }
        } catch (err) {
          console.error('Failed to fetch diseases:', err);
          toast.error('Failed to load diseases');
        }
      };

      fetchUserData();
      fetchDiseases();
    }
  }, [user, navigate, location]);

  const validateForm = () => {
    if (!content.trim()) return 'Please enter a comment.';
    if (!selectedDiseaseId) return 'Please select a disease.';
    return '';
  };

  const handleSubmit = async () => {
    // If the user is not logged in, show a prompt
    if (!user) {
      setLoginPrompt(true);
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await api.post('/reviews', {
        content,
        user_id: userId,
        disease_id: selectedDiseaseId,
      });
      toast.success('Comment submitted successfully!');
      setContent('');
      setError('');
      fetchComments(); // Refresh comments after posting
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-semibold mb-2">Leave a Comment</h1>
        <p className="text-gray-600">Share your thoughts on a disease</p>
      </div>

      {/* Display comment form for all users */}
      <div className="bg-gray-100 p-8 rounded-lg w-full max-w-lg shadow-sm">
        <div className="mb-6">
          <label className="block text-gray-800 mb-2 font-medium">Select Disease</label>
          <select
            value={selectedDiseaseId}
            onChange={(e) => setSelectedDiseaseId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-400 rounded-md"
            // Allow all users to select a disease
          >
            {diseases.map((disease) => (
              <option key={disease.id} value={disease.id}>
                {disease.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-gray-800 mb-2 font-medium">Comment</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your comment here..."
            rows="5"
            className="w-full p-3 border border-gray-400 rounded-md"
            disabled={!user} // Disable textarea if not logged in
          />
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Login prompt if not logged in */}
        {loginPrompt && !user && (
          <p className="text-red-500 mb-4">Please log in to submit a comment</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || !user} // Disable submit button if not logged in
          className="w-full bg-cyan-600 text-white py-3 rounded-md shadow-md hover:bg-cyan-700 transition-colors"
        >
          {loading ? 'Submitting...' : 'Post Comment'}
        </button>
      </div>

      {/* Display comments */}
      <div className="mt-8 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        {commentsLoading ? (
          <p>Loading comments...</p>
        ) : (
          <CommentList comments={comments} />
        )}
      </div>
    </div>
  );
}

export default Comment;

