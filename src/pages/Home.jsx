import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchDiseases } from '../store/diseaseSlice';
import heroImage from '../assets/hero.jpg'; // Updated path (remove @ alias)

function Home() {
  const dispatch = useDispatch();
  const { diseases, loading, error } = useSelector((state) => state.diseases);

  useEffect(() => {
    dispatch(fetchDiseases());
  }, [dispatch]);

  const featuredDiseases = diseases.slice(0, 3); // Show top 3 diseases

  // Handle image loading errors
  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/300x150?text=Image+Failed+to+Load';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative h-[80vh] bg-gray-900 text-white">
        <img src={heroImage} alt="Hero" className="w-full h-full object-cover opacity-40" onError={handleImageError} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent flex items-center justify-center text-center">
          <div className="text-white animate-fade-in">
            <h1 className="text-5xl font-bold mb-4">Welcome to Communicable Diseases Charity</h1>
            <p className="text-lg mb-8 animate-fade-in-delay">Join us in the fight against communicable diseases worldwide.</p>
            <div className="space-x-4">
              <Link
                to="/diseases"
                className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary transition-transform duration-300 transform hover:scale-105"
              >
                Browse All Illnesses
              </Link>
              <Link
                to="/donation-form"
                className="inline-block bg-secondary text-white px-6 py-3 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-secondary transition-transform duration-300 transform hover:scale-105"
              >
                Donate Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-100 dark:bg-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Our Mission</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            We are dedicated to raising awareness, providing support, and funding research to combat communicable diseases globally. Explore our initiatives and learn how you can make a difference.
          </p>
        </div>
      </section>

      {/* Featured Illnesses Section */}
      <section className="py-16 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-12 text-gray-800 dark:text-gray-100">Featured Illnesses</h2>
          {loading && (
            <div className="flex justify-center">
              <svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
              </svg>
            </div>
          )}
          {error && <p className="text-center text-danger dark:text-red-400">{error}</p>}
          {!loading && !error && featuredDiseases.length === 0 && (
            <p className="text-center text-gray-600 dark:text-gray-400">No diseases found.</p>
          )}
          {!loading && !error && featuredDiseases.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredDiseases.map((disease) => (
                <div
                  key={disease.id}
                  className="bg-white dark:bg-gray-700 shadow-lg rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105"
                >
                  <img
                    src={disease.image || 'https://via.placeholder.com/300x150?text=Disease+Image'}
                    alt={disease.name}
                    className="w-full h-48 object-cover"
                    onError={handleImageError}
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">{disease.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{disease.description}</p>
                    <Link
                      to={`/diseases/${disease.id}`}
                      className="inline-block bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary transition-transform duration-300 transform hover:scale-105"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary transition-transform duration-300 transform hover:scale-110"
        aria-label="Back to top"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  );
}

export default Home;