import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../store/authSlice';
import api from '../utils/api';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    if (username.length < 3 || password.length < 6) {
      setError('Username must be at least 3 characters, and password must be at least 6 characters.');
      return;
    }

    try {
      const response = await api.get('/users', { params: { username } });
      if (response.data.length > 0) {
        setError('Username already exists. Please choose another.');
        return;
      }

      const newUser = { id: Date.now(), username, password, role: 'user' };
      await api.post('/users', newUser);
      dispatch(login(newUser));
      navigate('/');
    } catch (err) {
      console.error('Signup error:', err);
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Signup</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {error && <p className="text-danger mb-4">{error}</p>}
        <button
          onClick={handleSubmit}
          className="w-full bg-primary text-white p-3 rounded-md hover:bg-blue-600"
        >
          Signup
        </button>
      </div>
    </div>
  );
}

export default Signup;