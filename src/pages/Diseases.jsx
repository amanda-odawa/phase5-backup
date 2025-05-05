import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { fetchDiseases } from '../store/diseaseSlice';
import { fetchAreas } from '../store/areaSlice';
import DiseaseCard from '../components/DiseaseCard';

function Diseases() {
  const dispatch = useDispatch();
  const { diseases, loading, error } = useSelector((state) => state.diseases);
  const { areas } = useSelector((state) => state.areas);
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('search') || '';
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [prevalenceFilter, setPrevalenceFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [areaFilter, setAreaFilter] = useState('');

  useEffect(() => {
    dispatch(fetchDiseases());
    dispatch(fetchAreas());
  }, [dispatch]);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const handleReset = () => {
    setLocalSearch('');
    setPrevalenceFilter('');
    setCategoryFilter('');
    setAreaFilter('');
  };

  // Add area names to each disease based on which areas have case counts
  const diseasesWithAreas = diseases.map((disease) => {
    const diseaseAreas = areas
      .filter((area) => area.diseaseCases?.[disease.id])
      .map((area) => area.name);
    return { ...disease, areas: diseaseAreas };
  });

  const filteredDiseases = diseasesWithAreas.filter((disease) => {
    const matchesSearch =
      disease.name.toLowerCase().includes(localSearch.toLowerCase()) ||
      (disease.about || '').toLowerCase().includes(localSearch.toLowerCase());

    const matchesPrevalence = prevalenceFilter ? disease.prevalence === prevalenceFilter : true;
    const matchesCategory = categoryFilter ? disease.category === categoryFilter : true;

    const matchesArea = areaFilter
      ? disease.areas.includes(
          areas.find((area) => area.id === areaFilter)?.name || ''
        )
      : true;

    return matchesSearch && matchesPrevalence && matchesCategory && matchesArea;
  });

  return (
    <div className="min-h-screen bg-white text-gray-900 py-16 px-4 sm:px-8">
      <h1 className="text-3xl font-semibold text-center mb-2">Communicable Diseases</h1>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
        Learn about the most prevalent communicable diseases worldwide, their symptoms,
        prevention methods, and our efforts to combat them.
      </p>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
      <input
          type="text"
          placeholder="Search diseases..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-48"
        />
        <select
          value={prevalenceFilter}
          onChange={(e) => setPrevalenceFilter(e.target.value)}
          className="px-4 py-3 border rounded-md bg-white"
        >
          <option value="">All Prevalence</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-3 border rounded-md bg-white"
        >
          <option value="">All Categories</option>
          <option value="Bacterial">Bacterial</option>
          <option value="Viral">Viral</option>
          <option value="Vector-borne">Vector-borne</option>
          <option value="Air-borne">Air-borne</option>
          <option value="Water-borne">Water-borne</option>
        </select>

        <select
          value={areaFilter}
          onChange={(e) => setAreaFilter(e.target.value)}
          className="px-4 py-3 border rounded-md bg-white"
        >
          <option value="">All Areas</option>
          {areas.map((area) => (
            <option key={area.id} value={area.id}>
              {area.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleReset}
          className="bg-gray-100 border border-gray-300 rounded px-4 py-2 hover:bg-gray-200"
        >
          Reset Filters
        </button>
      </div>

      {/* Disease Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="text-center col-span-full">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-600 col-span-full">{error}</div>
        ) : filteredDiseases.length > 0 ? (
          filteredDiseases.map((disease) => (
            <DiseaseCard key={disease.id} disease={disease} />
          ))
        ) : (
          <div className="text-center col-span-full">No diseases found.</div>
        )}
      </div>
    </div>
  );
}

export default Diseases;
