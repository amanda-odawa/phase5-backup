import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import SearchFilterBar from '../components/SearchFilterBar';
import logo from '../assets/logo.png';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="navbar bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" aria-label="Home">
          <img src={logo} alt="Charity Logo" className="h-12 transform transition-transform duration-300 hover:scale-110" />
        </Link>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-white focus:outline-none focus:ring-2 focus:ring-blue-300 transition-transform duration-300 transform hover:scale-110"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          <button
            className="md:hidden text-white focus:outline-none focus:ring-2 focus:ring-blue-300 transition-transform duration-300 transform hover:scale-110"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="navbar-menu"
            aria-label="Toggle navigation"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
            </svg>
          </button>
        </div>
        <nav
          id="navbar-menu"
          className={`md:flex md:items-center ${isOpen ? 'block' : 'hidden'} w-full md:w-auto absolute md:static top-16 left-0 bg-blue-900 md:bg-transparent md:p-0 p-4 transition-all duration-300 ease-in-out z-40`}
        >
          <div className="flex flex-col md:flex-row md:space-x-6 mt-4 md:mt-0">
            <Link to="/" className="py-2 md:py-0 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-300">Home</Link>
            <Link to="/about" className="py-2 md:py-0 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-300">About</Link>
            <Link to="/diseases" className="py-2 md:py-0 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-300">Diseases</Link>
            <Link to="/areas" className="py-2 md:py-0 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-300">Areas</Link>
            <Link to="/map-analysis" className="py-2 md:py-0 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-300">Maps</Link>
            <Link to="/contact" className="py-2 md:py-0 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-300">Contact</Link>
            <Link to="/donation-form" className="py-2 md:py-0 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-300">Donate</Link>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="py-2 md:py-0 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-300">Profile</Link>
                {user.role === 'admin' && (
                  <>
                    <Link to="/admin-dashboard" className="py-2 md:py-0 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-300">Admin Dashboard</Link>
                    <Link to="/add-disease" className="py-2 md:py-0 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-300">Add Disease</Link>
                    <Link to="/add-area" className="py-2 md:py-0 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-300">Add Area</Link>
                    <Link to="/manage-diseases" className="py-2 md:py-0 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-300">Manage Diseases</Link>
                    <Link to="/manage-areas" className="py-2 md:py-0 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-300">Manage Areas</Link>
                  </>
                )}
                {user.role !== 'admin' && (
                  <Link to="/user-dashboard" className="py-2 md:py-0 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-300">User Dashboard</Link>
                )}
                <button
                  onClick={handleLogout}
                  className="py-2 md:py-0 text-red-400 hover:underline focus:outline-none focus:ring-2 focus:ring-red-300 transition-colors duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="py-2 md:py-0 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-300">Login</Link>
                <Link to="/signup" className="py-2 md:py-0 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-300">Signup</Link>
              </>
            )}
          </div>
        </nav>
      </div>
      <SearchFilterBar />
    </header>
  );
}

export default Navbar;