import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { fetchDiseases } from '../store/diseaseSlice';

function Diseases() {
  const dispatch = useDispatch();
  const { diseases, loading, error } = useSelector((state) => state.diseases);
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('search') || '';
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [prevalenceFilter, setPrevalenceFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');

  useEffect(() => {
    dispatch(fetchDiseases());
  }, [dispatch]);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const filteredDiseases = diseases.filter((disease) => {
    const matchesSearch =
      disease.name.toLowerCase().includes(localSearch.toLowerCase()) ||
      disease.description.toLowerCase().includes(localSearch.toLowerCase());
    const matchesPrevalence = prevalenceFilter ? disease.prevalence === prevalenceFilter : true;
    const matchesCategory = categoryFilter ? disease.category === categoryFilter : true;
    const matchesRegion = regionFilter ? disease.regions.includes(regionFilter) : true;
    return matchesSearch && matchesPrevalence && matchesCategory && matchesRegion;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-16 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Communicable Diseases</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Learn about the most prevalent communicable diseases worldwide, their symptoms,
          prevention methods, and our efforts to combat them.
        </p>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col md:flex-row items-center justify-center gap-4">
          <input
            type="text"
            placeholder="Search diseases..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full md:w-1/3 px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 transition-colors duration-300"
          />
          <div className="flex flex-col md:flex-row gap-4">
            <select
              value={prevalenceFilter}
              onChange={(e) => setPrevalenceFilter(e.target.value)}
              className="px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 transition-colors duration-300"
            >
              <option value="">Filter by Prevalence</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 transition-colors duration-300"
            >
              <option value="">Filter by Category</option>
              <option value="Vector-borne">Vector-borne</option>
              <option value="Bacterial">Bacterial</option>
              <option value="Viral">Viral</option>
            </select>
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 transition-colors duration-300"
            >
              <option value="">Filter by Region</option>
              <option value="Sub-Saharan Africa">Sub-Saharan Africa</option>
              <option value="South Asia">South Asia</option>
              <option value="Eastern Europe">Eastern Europe</option>
            </select>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center">
            <svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
            </svg>
          </div>
        )}
        {error && <p className="text-center text-danger">{error}</p>}
        {!loading && !error && filteredDiseases.length === 0 && (
          <p className="text-center text-gray-600 dark:text-gray-400">No diseases found.</p>
        )}
        {!loading && !error && filteredDiseases.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredDiseases.map((disease) => (
              <div
                key={disease.id}
                className="bg-white dark:bg-gray-700 shadow-lg rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105"
              >
                <img
                  src={disease.image || 'https://via.placeholder.com/300x150?text=Disease+Image'}
                  alt={disease.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2">{disease.name}</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{disease.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        disease.category === 'Vector-borne'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : disease.category === 'Bacterial'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                      }`}
                    >
                      {disease.category}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        disease.prevalence === 'High'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : disease.prevalence === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}
                    >
                      {disease.prevalence}
                    </span>
                  </div>
                  <Link
                    to={`/diseases/${disease.id}`}
                    className="inline-block bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary transition-transform duration-300 transform hover:scale-105"
                  >
                    Learn More
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

export default Diseases;