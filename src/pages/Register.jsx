import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../store/authSlice';
import { toast } from 'react-toastify';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [touched, setTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const passwordRules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  const allValid = Object.values(passwordRules).every(Boolean);
  const emailValid = email.includes('@') && email.includes('.');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!allValid) {
      toast.error('Password does not meet requirements');
      return;
    }

    if (!emailValid) {
      toast.error('Email must contain "@" and "."');
      return;
    }

    // Register using the API
    dispatch(register({ username, email, password }))
      .unwrap()
      .then(() => {
        toast.success('Signed up successfully');
        navigate('/login');
      })
      .catch((error) => {
        toast.error(error.message || 'Username already exists');
      });
  };

  const focusOnFirstUnmetField = () => {
    if (!username) {
      document.getElementById('username').focus();
    } else if (!emailValid) {
      document.getElementById('email').focus();
    } else if (!passwordRules.length) {
      passwordRef.current.focus();
    } else if (!passwordRules.uppercase) {
      passwordRef.current.focus();
    } else if (!passwordRules.lowercase) {
      passwordRef.current.focus();
    } else if (!passwordRules.number) {
      passwordRef.current.focus();
    } else if (!passwordRules.special) {
      passwordRef.current.focus();
    } else if (password !== confirmPassword) {
      confirmPasswordRef.current.focus();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-12 pt-0">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-semibold text-center mb-2">Create your account</h1>
        <p className="mt-2 text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign in
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
            <label htmlFor="email" className="block text-gray-800 mb-2 font-medium">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-400 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
            />
            {email && !emailValid && (
              <p className="mt-2 text-sm text-red-600">Email must contain "@" and "."</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-800 mb-2 font-medium">
              Password
            </label>
            <div className="relative">
              <input
                ref={passwordRef}
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched(true)}
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
            {touched && (
              <ul className="mt-3 text-sm text-left space-y-1">
                {!passwordRules.length && <li className="text-red-600">• At least 8 characters</li>}
                {!passwordRules.uppercase && <li className="text-red-600">• At least one uppercase letter</li>}
                {!passwordRules.lowercase && <li className="text-red-600">• At least one lowercase letter</li>}
                {!passwordRules.number && <li className="text-red-600">• At least one number</li>}
                {!passwordRules.special && <li className="text-red-600">• At least one special character</li>}
              </ul>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-800 mb-2 font-medium">
              Confirm Password
            </label>
            <div className="relative">
              <input
                ref={confirmPasswordRef}
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-400 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Re-enter your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-3 right-3 text-gray-600"
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            onClick={focusOnFirstUnmetField}
            className="w-full py-3 rounded-md shadow-md bg-cyan-600 text-white hover:bg-cyan-700"
          >
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
