import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchAreas } from '../store/areaSlice';
import { fetchDiseases } from '../store/diseaseSlice';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
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
  const { areas, status: areaStatus, error: areaError } = useSelector((state) => state.areas);
  const { diseases, status: diseaseStatus, error: diseaseError } = useSelector((state) => state.diseases);
  const [searchTerm, setSearchTerm] = useState('');
  const [diseaseFilter, setDiseaseFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [prevalenceFilter, setPrevalenceFilter] = useState('');

  useEffect(() => {
    if (areaStatus === 'idle') dispatch(fetchAreas());
    if (diseaseStatus === 'idle') dispatch(fetchDiseases());
  }, [dispatch, areaStatus, diseaseStatus]);

  const filteredAreas = areas.filter((area) => {
    const matchesSearch =
      area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const stats = filteredAreas.length
    ? filteredAreas.reduce(
        (acc, area) => {
          acc.totalCases += area.totalCases || 0;
          acc.population += area.population || 0;
          acc.diseases = [...new Set([...acc.diseases, ...area.diseases])];
          return acc;
        },
        { totalCases: 0, population: 0, diseases: [] }
      )
    : { totalCases: 0, population: 0, diseases: [] };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-16 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-6">Affected Areas</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Explore the global distribution of communicable diseases and their impact on different regions.
        </p>

        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row items-center justify-center gap-4">
          <input
            type="text"
            placeholder="Search areas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3 px-4 py-3 border rounded-md bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
          />
            <select
              value={diseaseFilter}
              onChange={(e) => setDiseaseFilter(e.target.value)}
            className="px-4 py-3 border rounded-md bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
            >
              <option value="">Filter by Disease</option>
              <option value="Malaria">Malaria</option>
              <option value="Tuberculosis">Tuberculosis</option>
              <option value="HIV/AIDS">HIV/AIDS</option>
            </select>
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
            className="px-4 py-3 border rounded-md bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
            >
              <option value="">Filter by Region</option>
              <option value="Sub-Saharan Africa">Sub-Saharan Africa</option>
              <option value="South Asia">South Asia</option>
              <option value="Eastern Europe">Eastern Europe</option>
            </select>
            <select
              value={prevalenceFilter}
              onChange={(e) => setPrevalenceFilter(e.target.value)}
            className="px-4 py-3 border rounded-md bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
            >
              <option value="">Filter by Prevalence</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

        {/* Map */}
        <MapContainer
          center={[0, 0]}
          zoom={2}
          style={{ height: '400px', width: '100%' }}
          className="rounded-lg shadow-md mb-8"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {filteredAreas.map((area) => (
            <Marker key={area.id} position={[area.latitude, area.longitude]}>
              <Popup>
                <strong>{area.name}</strong>
                <p>{area.description}</p>
                <p><strong>Diseases:</strong> {area.diseases.join(', ')}</p>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Statistics */}
        {filteredAreas.length > 0 && (
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md mb-10">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              {regionFilter || 'Global'} Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-2xl font-bold">{stats.totalCases.toLocaleString()}</p>
                <p className="text-gray-600 dark:text-gray-300">Total Cases</p>
        </div>
              <div>
                <p className="text-2xl font-bold">{stats.population.toLocaleString()}</p>
                <p className="text-gray-600 dark:text-gray-300">Population</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.diseases.length}</p>
                <p className="text-gray-600 dark:text-gray-300">Diseases</p>
              </div>
            </div>
          </div>
        )}

        {/* Area Cards */}
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
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
      </div>
    </div>
  );
}

export default Areas;
