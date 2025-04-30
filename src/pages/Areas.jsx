import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchAreas } from '../store/areaSlice';

function Areas() {
  const dispatch = useDispatch();
  const { areas, loading, error } = useSelector((state) => state.areas);

  useEffect(() => {
    dispatch(fetchAreas());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-16 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Affected Areas</h1>
        {loading && (
          <div className="flex justify-center">
            <svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
            </svg>
          </div>
        )}
        {error && <p className="text-center text-danger">{error}</p>}
        {!loading && !error && areas.length === 0 && (
          <p className="text-center text-gray-600 dark:text-gray-400">No areas found.</p>
        )}
        {!loading && !error && areas.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {areas.map((area) => (
              <div
                key={area.id}
                className="bg-white dark:bg-gray-700 shadow-lg rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105"
              >
                <img
                  src={area.image || 'https://via.placeholder.com/300x150?text=Area+Image'}
                  alt={area.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2">{area.name}</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{area.description}</p>
                  <Link
                    to={`/areas/${area.id}`}
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
    </div>
  );
}

export default Areas;