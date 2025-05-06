import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { login } from '../store/authSlice';
import { toast } from 'react-toastify';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Added state for password visibility
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the path the user came from, or default to home
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    dispatch(login({ username, password }))
      .unwrap()
      .then(() => {
        toast.success('Logged in successfully');
        navigate(from, { replace: true }); // Redirect to the page the user came from
      })
      .catch((error) => {
        toast.error(error.message || 'Login failed');
      });
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-semibold text-center mb-2">Sign in to your account</h1>
        <p className="mt-2 max-w-2xl mx-auto text-center text-gray-600">
          Or{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">
            create a new account
          </Link>
        </p>
      </div>

      <div className="bg-gray-100 p-8 -mt-6 rounded-lg w-full max-w-lg shadow-sm">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="username" className="block text-gray-800 mb-2 font-medium">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-400 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your username"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-800 mb-2 font-medium">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-400 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-3 right-3 text-gray-600"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-cyan-600 text-white py-3 rounded-md shadow-md hover:bg-cyan-700 transition-colors"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
