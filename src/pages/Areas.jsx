import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchAreas } from '../store/areaSlice';
import { fetchDiseases } from '../store/diseaseSlice';
import area1 from '../assets/area1.jpg';
import area2 from '../assets/area2.jpg';
import area3 from '../assets/area3.jpg';

// Map image filenames to imported images
const imageMap = {
  'area1.jpg': area1,
  'area2.jpg': area2,
  'area3.jpg': area3,
};

function Areas() {
  const dispatch = useDispatch();
  const { areas, loading: areasLoading, error: areasError } = useSelector((state) => state.areas);
  const { diseases, loading: diseasesLoading, error: diseasesError } = useSelector((state) => state.diseases);
  const [searchTerm, setSearchTerm] = useState('');
  const [diseaseFilter, setDiseaseFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [prevalenceFilter, setPrevalenceFilter] = useState('');

  useEffect(() => {
    dispatch(fetchAreas());
    dispatch(fetchDiseases());
  }, [dispatch]);

  const filteredAreas = areas.filter((area) => {
    const matchesSearch = area.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         area.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDisease = diseaseFilter ? area.diseases.includes(diseaseFilter) : true;
    const matchesRegion = regionFilter ? area.name === regionFilter : true;
    const matchesPrevalence = prevalenceFilter
      ? area.diseases.some((diseaseName) => {
          const disease = diseases.find((d) => d.name === diseaseName);
          return disease?.prevalence === prevalenceFilter;
        })
      : true;
    return matchesSearch && matchesDisease && matchesRegion && matchesPrevalence;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-16 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Affected Areas</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Explore the global distribution of communicable diseases and their impact on different regions.
        </p>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col md:flex-row items-center justify-center gap-4">
          <input
            type="text"
            placeholder="Search areas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3 px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 transition-colors duration-300"
          />
          <div className="flex flex-col md:flex-row gap-4">
            <select
              value={diseaseFilter}
              onChange={(e) => setDiseaseFilter(e.target.value)}
              className="px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 transition-colors duration-300"
            >
              <option value="">Filter by Disease</option>
              <option value="Malaria">Malaria</option>
              <option value="Tuberculosis">Tuberculosis</option>
              <option value="HIV/AIDS">HIV/AIDS</option>
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
          </div>
        </div>

        {(areasLoading || diseasesLoading) && (
          <div className="flex justify-center">
            <svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
            </svg>
          </div>
        )}
        {(areasError || diseasesError) && (
          <p className="text-center text-danger">{areasError || diseasesError}</p>
        )}
        {!(areasLoading || diseasesLoading) && !areasError && !diseasesError && filteredAreas.length === 0 && (
          <p className="text-center text-gray-600 dark:text-gray-400">No areas found.</p>
        )}
        {!(areasLoading || diseasesLoading) && !areasError && !diseasesError && filteredAreas.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredAreas.map((area) => (
              <div
                key={area.id}
                className="bg-white dark:bg-gray-700 shadow-lg rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105"
              >
                <img
                  src={imageMap[area.image] || 'https://via.placeholder.com/300x150?text=Area+Image'}
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