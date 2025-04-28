import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/authSlice';
import SearchFilterBar from '@/components/SearchFilterBar';
import logo from '@/assets/logo.png';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/">
          <img src={logo} alt="Charity Logo" className="h-12" />
        </Link>
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
          </svg>
        </button>
        <nav className={`md:flex md:items-center ${isOpen ? 'block' : 'hidden'} w-full md:w-auto`}>
          <div className="flex flex-col md:flex-row md:space-x-6 mt-4 md:mt-0">
            <Link to="/" className="py-2 md:py-0 hover:underline">Home</Link>
            <Link to="/about" className="py-2 md:py-0 hover:underline">About</Link>
            <Link to="/diseases" className="py-2 md:py-0 hover:underline">Illnesses</Link>
            <Link to="/areas" className="py-2 md:py-0 hover:underline">Locations</Link>
            <Link to="/map-analysis" className="py-2 md:py-0 hover:underline">Maps</Link>
            <Link to="/contact" className="py-2 md:py-0 hover:underline">Contact</Link>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="py-2 md:py-0 hover:underline">Profile</Link>
                {user.role === 'admin' ? (
                  <Link to="/admin-dashboard" className="py-2 md:py-0 hover:underline">Admin Dashboard</Link>
                ) : (
                  <Link to="/user-dashboard" className="py-2 md:py-0 hover:underline">User Dashboard</Link>
                )}
                <button
                  onClick={handleLogout}
                  className="py-2 md:py-0 text-danger hover:underline"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="py-2 md:py-0 hover:underline">Login</Link>
                <Link to="/signup" className="py-2 md:py-0 hover:underline">Signup</Link>
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