import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { fetchDiseases } from '../store/diseaseSlice';
import DiseaseCard from '../components/DiseaseCard';

function Diseases() {
  const dispatch = useDispatch();
  const { diseases, loading, error } = useSelector((state) => state.diseases);
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('search') || '';
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [prevalenceFilter, setPrevalenceFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [areaFilter, setAreaFilter] = useState('');

  useEffect(() => {
    dispatch(fetchDiseases());
  }, [dispatch]);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const filteredDiseases = diseases.filter((disease) => {
    const matchesSearch =
      disease.name.toLowerCase().includes(localSearch.toLowerCase()) ||
      (disease.about || '').toLowerCase().includes(localSearch.toLowerCase());

    const matchesPrevalence = prevalenceFilter ? disease.prevalence === prevalenceFilter : true;
    const matchesCategory = categoryFilter ? disease.category === categoryFilter : true;
    const matchesArea =
      areaFilter && Array.isArray(disease.areas)
        ? disease.areas.includes(areaFilter)
        : !areaFilter;

    return matchesSearch && matchesPrevalence && matchesCategory && matchesArea;
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
            placeholder="Search diseases..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full md:w-1/2 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#9e9e9e] bg-white"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <p>Filter by:</p>
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
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white"
          >
            <option value="">Area</option>
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
           <DiseaseCard key={disease.id} disease={disease} />
         ))}
       </div>       
        )}
      </div>
    </div>
  );
}

export default Diseases;
