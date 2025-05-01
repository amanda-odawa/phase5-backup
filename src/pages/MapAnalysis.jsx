import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAreas } from '../store/areaSlice';
import { fetchDiseases } from '../store/diseaseSlice';
import 'leaflet/dist/leaflet.css';

function MapAnalysis() {
  const dispatch = useDispatch();
  const { areas, status: areaStatus, error: areaError } = useSelector((state) => state.areas);
  const { diseases, status: diseaseStatus, error: diseaseError } = useSelector((state) => state.diseases);
  const [diseaseFilter, setDiseaseFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [prevalenceFilter, setPrevalenceFilter] = useState('');

  useEffect(() => {
    if (areaStatus === 'idle') {
      dispatch(fetchAreas());
    }
    if (diseaseStatus === 'idle') {
      dispatch(fetchDiseases());
    }
  }, [areaStatus, diseaseStatus, dispatch]);

  const filteredAreas = areas.filter((area) => {
    const matchesDisease = diseaseFilter ? area.diseases.includes(diseaseFilter) : true;
    const matchesRegion = regionFilter ? area.name === regionFilter : true;
    const matchesPrevalence = prevalenceFilter
      ? area.diseases.some((diseaseName) => {
          const disease = diseases.find((d) => d.name === diseaseName);
          return disease?.prevalence === prevalenceFilter;
        })
      : true;
    return matchesDisease && matchesRegion && matchesPrevalence;
  });

  // Calculate statistics
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

  if (areaStatus === 'loading' || diseaseStatus === 'loading') {
    return (
      <div className="text-center mt-12 text-gray-600 dark:text-gray-400">
        <svg className="animate-spin h-8 w-8 text-primary mx-auto" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
        </svg>
      </div>
    );
  }
  if (areaStatus === 'failed' || diseaseStatus === 'failed') {
    return <div className="text-center mt-12 text-danger">Error: {areaError || diseaseError}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">Map Analysis</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
        Explore the global distribution of communicable diseases and their impact on different regions.
      </p>

      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row items-center justify-start gap-4">
        <select
          value={diseaseFilter}
          onChange={(e) => setDiseaseFilter(e.target.value)}
          className="w-full md:w-1/4 px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 transition-colors duration-300"
        >
          <option value="">Filter by Disease</option>
          <option value="Malaria">Malaria</option>
          <option value="Tuberculosis">Tuberculosis</option>
          <option value="HIV/AIDS">HIV/AIDS</option>
        </select>
        <select
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
          className="w-full md:w-1/4 px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 transition-colors duration-300"
        >
          <option value="">Filter by Region</option>
          <option value="Sub-Saharan Africa">Sub-Saharan Africa</option>
          <option value="South Asia">South Asia</option>
          <option value="Eastern Europe">Eastern Europe</option>
        </select>
        <select
          value={prevalenceFilter}
          onChange={(e) => setPrevalenceFilter(e.target.value)}
          className="w-full md:w-1/4 px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 transition-colors duration-300"
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
            {regionFilter || 'Global'} Statistics
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
            {regionFilter || 'The world'} faces significant challenges with communicable diseases, particularly {stats.diseases.join(', ')}.
          </p>
        </div>
      )}
    </div>
  );
}

export default MapAnalysis;