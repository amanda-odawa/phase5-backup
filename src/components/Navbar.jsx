import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import logo from '../assets/logo.png';

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
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo aligned far left */}
        <div className="flex-shrink-0">
          <Link to="/" aria-label="Home">
            <img src={logo} alt="Logo" className="h-10 md:h-12 hover:scale-105 transition-transform" />
          </Link>
        </div>

        {/* Hamburger menu */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-black focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
              />
            </svg>
          </button>
        </div>

        {/* Desktop Menu */}
        <nav
          className={`${
            isOpen ? 'block' : 'hidden'
          } absolute top-full left-0 w-full bg-white border-t md:border-0 md:static md:block md:w-auto`}
        >
          <ul className="flex flex-col md:flex-row md:items-center md:space-x-8 px-4 md:px-0 py-2 md:py-0 md:ml-auto">
            <li>
              <Link to="/" className="block py-2 text-black hover:font-bold">
                Home
              </Link>
            </li>
            <li>
              <Link to="/diseases" className="block py-2 text-black hover:font-bold">
                Diseases
              </Link>
            </li>
            <li>
              <Link to="/regions" className="block py-2 text-black hover:font-bold">
                Regions
              </Link>
            </li>
            <li>
              <Link to="/donation-form" className="block py-2 text-black hover:font-bold">
                Donate
              </Link>
            </li>
            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/profile" className="block py-2 text-black hover:font-bold">
                    Profile
                  </Link>
                </li>
                {user.role === 'admin' && (
                  <>
                    <li>
                      <Link to="/admin-dashboard" className="block py-2 text-black hover:font-bold">
                        Admin Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link to="/add-disease" className="block py-2 text-black hover:font-bold">
                        Add Disease
                      </Link>
                    </li>
                    <li>
                      <Link to="/add-area" className="block py-2 text-black hover:font-bold">
                        Add Area
                      </Link>
                    </li>
                    <li>
                      <Link to="/manage-diseases" className="block py-2 text-black hover:font-bold">
                        Manage Diseases
                      </Link>
                    </li>
                    <li>
                      <Link to="/manage-areas" className="block py-2 text-black hover:font-bold">
                        Manage Areas
                      </Link>
                    </li>
                  </>
                )}
                {user.role !== 'admin' && (
                  <li>
                    <Link to="/user-dashboard" className="block py-2 text-black hover:font-bold">
                      User Dashboard
                    </Link>
                  </li>
                )}
                <li>
                  <button
                    onClick={handleLogout}
                    className="block py-2 text-red-600 hover:font-bold"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="block py-2 text-black hover:font-bold">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="block py-2 text-black hover:font-bold">
                    Signup
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
