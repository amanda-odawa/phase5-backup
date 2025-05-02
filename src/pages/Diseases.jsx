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
    <div className="min-h-screen bg-white text-gray-900 py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-semibold text-center mb-2">Communicable Diseases</h1>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          Learn about the most prevalent communicable diseases worldwide, their symptoms,
          prevention methods, and our efforts to combat them.
        </p>

        {/* Search Input */}
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Search diseases...."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full md:w-1/2 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#9e9e9e] bg-white"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <p>Filter by: </p>
          <select
            value={prevalenceFilter}
            onChange={(e) => setPrevalenceFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white"
          >
            <option value="">Prevalence</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white"
          >
            <option value="">Category</option>
            <option value="Vector-borne">Vector-borne</option>
            <option value="Water-borne">Water-borne</option>
            <option value="Air-borne">Air-borne</option>
            <option value="Viral">Viral</option>
            <option value="Bacterial">Bacterial</option>
          </select>
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white"
          >
            <option value="">Region</option>
            <option value="Africa">Africa</option>
            <option value="Asia">Asia</option>
            <option value="Europe">Europe</option>
            <option value="North America">North America</option>
            <option value="South America">South America</option>
            <option value="Australia">Australia</option>
            <option value="Antarctica">Antarctica</option>
          </select>
        </div>

        {/* Loading/Errors */}
        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && filteredDiseases.length === 0 && (
          <p className="text-center text-gray-600">No diseases found.</p>
        )}

        {/* Disease Cards */}
        {!loading && !error && filteredDiseases.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredDiseases.map((disease) => (
              <div
                key={disease.id}
                className="bg-white border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <img
                  src={disease.image || 'https://via.placeholder.com/300x150?text=Disease+Image'}
                  alt={disease.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold">{disease.name}</h2>
                  <p className="text-gray-600 text-sm mb-3">{disease.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        disease.category === 'Vector-borne'
                          ? 'bg-blue-100 text-blue-800'
                          : disease.category === 'Bacterial'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {disease.category}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        disease.prevalence === 'High'
                          ? 'bg-red-100 text-red-800'
                          : disease.prevalence === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {disease.prevalence}
                    </span>
                  </div>
                  <Link
                    to={`/diseases/${disease.id}`}
                    className="text-[#0097b2] font-medium hover:underline"
                  >
                    Learn more &rarr;
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
