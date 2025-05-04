import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  const [areaFilter, setAreaFilter] = useState('');
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
    const matchesArea = areaFilter ? area.name === areaFilter : true;
    const matchesPrevalence = prevalenceFilter
      ? area.diseases.some((diseaseName) => {
          const disease = diseases.find((d) => d.name === diseaseName);
          return disease?.prevalence === prevalenceFilter;
        })
      : true;
    return matchesSearch && matchesDisease && matchesArea && matchesPrevalence;
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
          Explore the global distribution of communicable diseases and their impact on different areas.
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
              <option value="">All Diseases</option>
              <option value="Malaria">Malaria</option>
              <option value="Tuberculosis">Tuberculosis</option>
              <option value="COVID-19">COVID-19</option>
            </select>
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
            className="px-4 py-3 border rounded-md bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
            >
              <option value="">All Areas</option>
              <option value="Africa">Africa</option>
              <option value="Asia">Asia</option>
              <option value="Europe">Europe</option>
              <option value="North America">North America</option>
              <option value="South America">South America</option>
              <option value="Antarctica">Antarctica</option>
              <option value="Oceania">Oceania</option>
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
        style={{ height: '500px', width: '100%' }}
        className="rounded-lg shadow-md mb-6"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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

      {/* Legend */}
      <div className="mb-6 bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">Legend</h2>
        <p className="text-gray-600 dark:text-gray-300">
          <span className="inline-block w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
          Markers indicate areas affected by communicable diseases.
        </p>
      </div>

      {/* Statistics */}
      {filteredAreas.length > 0 && (
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            {areaFilter || 'Global'} Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.totalCases.toLocaleString()}</p>
              <p className="text-gray-600 dark:text-gray-300">Total Cases</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.population.toLocaleString()}</p>
              <p className="text-gray-600 dark:text-gray-300">Population</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.diseases.length}</p>
              <p className="text-gray-600 dark:text-gray-300">Diseases</p>
            </div>
          </div>
          {stats.diseases.map((diseaseName) => {
            const disease = diseases.find((d) => d.name === diseaseName);
            return (
              <div key={diseaseName} className="flex justify-between items-center mb-2">
                <span className="text-gray-800 dark:text-gray-100">{diseaseName}</span>
                <div className="flex items-center">
                  <span className="text-gray-600 dark:text-gray-300 mr-2">
                    {disease?.cases?.toLocaleString() || 0} cases
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      disease?.prevalence === 'High'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : disease?.prevalence === 'Medium'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}
                  >
                    {disease?.prevalence || 'Unknown'}
                  </span>
                </div>
              </div>
            );
          })}
          <p className="text-gray-600 dark:text-gray-300 mt-4">
            {areaFilter || 'The world'} faces significant challenges with communicable diseases, particularly {stats.diseases.join(', ')}.
          </p>
        </div>
      )}

      </div>
    </div>
  );
}

export default Areas;
