import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAreas } from '../store/areaSlice';
import { fetchDiseases } from '../store/diseaseSlice';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function Areas() {
  const dispatch = useDispatch();
  const { areas, status: areaStatus, error: areaError } = useSelector((state) => state.areas);
  const { diseases, status: diseaseStatus, error: diseaseError } = useSelector((state) => state.diseases);

  const [searchTerm, setSearchTerm] = useState('');
  const [diseaseFilter, setDiseaseFilter] = useState('');
  const [areaFilter, setAreaFilter] = useState('');
  const [prevalenceFilter, setPrevalenceFilter] = useState('');
  const [selectedArea, setSelectedArea] = useState(null);

  useEffect(() => {
    if (areaStatus === 'idle') dispatch(fetchAreas());
    if (diseaseStatus === 'idle') dispatch(fetchDiseases());
  }, [dispatch, areaStatus, diseaseStatus]);

  const filteredAreas = areas.filter((area) => {
    const matchesSearch =
      area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (area.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

    const matchesDisease = diseaseFilter
      ? diseases.some(
          (d) => d.name === diseaseFilter && d.areas?.includes(area.id)
        )
      : true;

    const matchesPrevalence = prevalenceFilter
      ? diseases.some(
          (d) => d.prevalence === prevalenceFilter && d.areas?.includes(area.id)
        )
      : true;

    const matchesArea = areaFilter ? area.name === areaFilter : true;

    return matchesSearch && matchesDisease && matchesPrevalence && matchesArea;
  });

  const currentAreas = selectedArea ? [selectedArea] : filteredAreas;

  const stats = currentAreas.reduce(
    (acc, area) => {
      const areaDiseases = diseases.filter((d) => d.areas?.includes(area.id));
      acc.totalCases += area.totalCases || 0;
      acc.population += area.population || 0;
      acc.totalDiseaseCases += areaDiseases.reduce((sum, d) => sum + (d.cases || 0), 0);
      acc.diseases = [...new Set([...acc.diseases, ...areaDiseases.map((d) => d.name)])];
      acc.details = [...acc.details, ...areaDiseases];
      return acc;
    },
    { totalCases: 0, population: 0, diseases: [], totalDiseaseCases: 0, details: [] }
  );

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
    return <div className="text-center mt-12 text-red-600">Error: {areaError || diseaseError}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-16 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-6">Affected Areas</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Explore the global distribution of communicable diseases and their impact on different areas.
        </p>

        {/* Filters */}
        <div className="mb-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
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
            {diseases.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="px-4 py-3 border rounded-md bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
          >
            <option value="">All Areas</option>
            {[...new Set(areas.map((a) => a.name))].map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
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
                <p><strong>Diseases:</strong> {diseases.filter(d => d.areas?.includes(area.id)).map(d => d.name).join(', ')}</p>
                <button
                  onClick={() => setSelectedArea(area)}
                  className="mt-2 text-sm text-blue-500 underline"
                >
                  View Statistics
                </button>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Statistics */}
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {selectedArea ? `${selectedArea.name} Statistics` : areaFilter || 'Global Statistics'}
            </h2>
            {selectedArea && (
              <button onClick={() => setSelectedArea(null)} className="text-sm text-blue-500 underline">
                Clear selection
              </button>
            )}
          </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-2xl font-bold">{stats.totalCases.toLocaleString()}</p>
              <p className="text-gray-600 dark:text-gray-300">Reported Cases</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.population.toLocaleString()}</p>
                <p className="text-gray-600 dark:text-gray-300">Population</p>
              </div>
              <div>
              <p className="text-2xl font-bold">{stats.totalDiseaseCases.toLocaleString()}</p>
              <p className="text-gray-600 dark:text-gray-300">Disease Cases</p>
            </div>
          </div>

          {stats.diseases.map((diseaseName) => {
            const disease = diseases.find((d) => d.name === diseaseName);
            return (
              <div key={diseaseName} className="flex justify-between items-center mb-2">
                <span>{diseaseName}</span>
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
            {selectedArea?.name || areaFilter || 'The world'} faces significant challenges with communicable diseases, including{' '}
            {stats.diseases.join(', ')}.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Areas;
