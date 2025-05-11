import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../utils/api';
import { toast } from 'react-toastify';
import CommentList from '../components/CommentList';

function Comment() {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const location = useLocation();
  const hasNotified = useRef(false);

  const commentInputRef = useRef(null); // NEW: Ref to comment box

  const [content, setContent] = useState('');
  const [diseases, setDiseases] = useState([]);
  const [selectedDiseaseId, setSelectedDiseaseId] = useState('');
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [loginPrompt, setLoginPrompt] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await api.get('/reviews');
        const rawComments = res.data.reverse() || [];

        const diseaseIds = [...new Set(rawComments.map((c) => c.disease_id))];
        const diseaseMap = {};
        await Promise.all(
          diseaseIds.map(async (id) => {
            try {
              const diseaseRes = await api.get(`/diseases/${id}`);
              diseaseMap[id] = diseaseRes.data?.name || `Disease #${id}`;
            } catch {
              diseaseMap[id] = 'Unknown Disease';
            }
          })
        );

        const userIds = [...new Set(rawComments.map((c) => c.user_id))];
        const userMap = {};
        await Promise.all(
          userIds.map(async (id) => {
            try {
              const userRes = await api.get(`/users/${id}`);
              userMap[id] = userRes.data?.username || `User #${id}`;
            } catch {
              userMap[id] = 'Anonymous';
            }
          })
        );

        const enrichedComments = rawComments.map((c) => ({
          ...c,
          user: userMap[c.user_id],
          diseaseName: diseaseMap[c.disease_id],
          date: c.updated_at,
        }));

        setComments(enrichedComments);
      } catch (err) {
        console.error('Failed to fetch comments:', err);
        toast.error('Failed to load comments');
      } finally {
        setCommentsLoading(false);
      }
    };

    fetchComments();

    if (user) {
      const getCurrentUserId = () => 11; // hardcoded ID
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
            setSelectedDiseaseId(res.data[0].id);
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
      window.location.reload(); // TEMP: re-fetch comments
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to submit comment');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = (username) => {
    setContent(`@${username}: `);
    setTimeout(() => {
      commentInputRef.current?.focus();
      commentInputRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-white px-4 py-10 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Discussion Forum</h1>
          <p className="text-gray-600">Start a conversation about any disease</p>
        </div>

        {user ? (
          <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Post a Comment</h2>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">Select Disease</label>
              <select
                value={selectedDiseaseId}
                onChange={(e) => setSelectedDiseaseId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600"
              >
                {diseases.map((disease) => (
                  <option key={disease.id} value={disease.id}>
                    {disease.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">Your Comment</label>
              <textarea
                ref={commentInputRef} // 👈 This enables scroll + focus
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your comment here..."
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-cyan-600"
              />
            </div>

            {error && <p className="text-red-500 mb-2">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-cyan-600 text-white font-semibold py-2 rounded-md hover:bg-cyan-700 transition-colors"
            >
              {loading ? 'Submitting...' : 'Post Comment'}
            </button>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-300 p-6 rounded-lg shadow mb-10 text-center">
            <p className="text-yellow-700">
              Please{' '}
              <a href="/login" className="text-cyan-700 font-semibold hover:underline">
                log in
              </a>{' '}
              to post a comment.
            </p>
          </div>
        )}

        <div className="bg-white border-t pt-6">
          {commentsLoading ? (
            <p className="text-gray-600">Loading comments...</p>
          ) : (
            <CommentList
              comments={comments}
              onReply={handleReply}
              commentInputRef={commentInputRef}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Comment;
