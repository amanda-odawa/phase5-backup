import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAreas } from '../store/areaSlice';
import { fetchDiseases } from '../store/diseaseSlice';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});


function formatNumber(value) {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)} billion`;
  } else if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)} million`;
  } else {
    return value.toLocaleString();
  }
}

function Areas() {
  const dispatch = useDispatch();
  const { areas } = useSelector((state) => state.areas);
  const { diseases } = useSelector((state) => state.diseases);
  const [selectedArea, setSelectedArea] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDisease, setSelectedDisease] = useState('');
  const [selectedPrevalence, setSelectedPrevalence] = useState('');

  useEffect(() => {
    dispatch(fetchAreas());
    dispatch(fetchDiseases());
  }, [dispatch]);

  const getTotalCases = (area) =>
    Object.values(area.diseaseCases || {}).reduce((acc, count) => acc + count, 0);

  const globalStats = () => {
    const total_cases = areas.reduce(
      (sum, area) => sum + getTotalCases(area),
      0
    );
    const totalPopulation = areas.reduce((sum, area) => {
      const population = Number(area.population);
      return sum + (isNaN(population) ? 0 : population);
    }, 0);

    const diseaseIds = new Set();
    areas.forEach((area) => {
      Object.keys(area.diseaseCases || {}).forEach((id) => diseaseIds.add(id));
    });

    const allDiseaseCases = {};
    areas.forEach((area) => {
      for (const [diseaseId, count] of Object.entries(area.diseaseCases || {})) {
        allDiseaseCases[diseaseId] = (allDiseaseCases[diseaseId] || 0) + count;
      }
    });

    return { total_cases, totalPopulation, diseaseCount: diseaseIds.size, allDiseaseCases };
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedDisease('');
    setSelectedPrevalence('');
    setSelectedArea(null);
  };

  const filteredAreas = areas.filter((area) => {
    const matchesSearch = area.name.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesDisease = true;
    if (selectedDisease) {
      matchesDisease = selectedDisease in (area.diseaseCases || {});
    }

    let matchesPrevalence = true;
    if (selectedPrevalence) {
      const matchingDiseaseIds = Object.keys(area.diseaseCases || {}).filter((id) => {
        const disease = diseases.find((d) => d.id === id);
        return disease?.prevalence === selectedPrevalence;
      });
      matchesPrevalence = matchingDiseaseIds.length > 0;
    }

    return matchesSearch && matchesDisease && matchesPrevalence;
  });

  const stats = selectedArea
    ? {
        title: selectedArea.name,
        total_cases: getTotalCases(selectedArea),
        population: selectedArea.population,
        diseaseCases: selectedArea.diseaseCases || {},
      }
    : {
        title: 'Global Statistics',
        ...globalStats(),
        population: globalStats().totalPopulation,
        diseaseCases: globalStats().allDiseaseCases,
      };

  return (
    <div className="min-h-screen bg-white text-gray-900 py-16 px-4 sm:px-8">
      <h1 className="text-3xl font-semibold text-center mb-2">Affected Areas</h1>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
        Explore the global distribution of communicable diseases and their impact on different regions.
      </p>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <input
          type="text"
          placeholder="Search area..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-48"
        />
        <select
          value={selectedDisease}
          onChange={(e) => setSelectedDisease(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-48"
        >
          <option value="">All Diseases</option>
          {diseases.map((disease) => (
            <option key={disease.id} value={disease.id}>
              {disease.name}
            </option>
          ))}
        </select>
        <select
          value={selectedPrevalence}
          onChange={(e) => setSelectedPrevalence(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-48"
        >
          <option value="">All Prevalence</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button
          onClick={handleReset}
          className="bg-gray-100 border border-gray-300 rounded px-4 py-2 hover:bg-gray-200"
        >
          Reset Filters
        </button>
      </div>

      {/* Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
  {/* Map */}
  <div className="lg:w-2/3 h-[400px] lg:h-[500px] rounded-lg overflow-hidden shadow-md border">
    <MapContainer
      center={[0, 0]}
      zoom={2}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
      className="z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {filteredAreas.map((area) => (
        <Marker
          key={area.id}
          position={[area.latitude, area.longitude]}
          icon={selectedArea?.id === area.id ? redIcon : defaultIcon}
          eventHandlers={{ click: () => setSelectedArea(area) }}
        >
          <Popup>
            <div className="text-sm leading-snug space-y-1 text-left">
              <div className="text-base font-bold text-center">{area.name}</div>
              <div>{area.description || 'No description available.'}</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  </div>

  {/* Stats */}
  <div className="lg:w-1/3 mt-6 lg:mt-0">
    <div className="bg-gray-100 rounded-lg p-4 shadow-md h-full">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">{stats.title}</h2>
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div>
          <p className="text-2xl font-bold text-gray-800">{formatNumber(stats.total_cases)}</p>
          <p className="text-gray-600">Total Cases</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-800">{formatNumber(stats.population)}</p>
          <p className="text-gray-600">Population</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-800">{Object.keys(stats.diseaseCases).length}</p>
          <p className="text-gray-600">Diseases</p>
        </div>
      </div>

      <ul className="list-disc list-inside space-y-1 mb-4">
        {Object.entries(stats.diseaseCases).map(([diseaseId, cases]) => {
          const disease = diseases.find((d) => d.id === diseaseId);
          if (!disease) return null;
          return (
            <div key={diseaseId} className="flex justify-between items-center mb-2">
              <span className="text-gray-800">{disease.name}</span>
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">
                  {cases.toLocaleString()} cases
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
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
            </div>
          );
        })}
      </ul>
    </div>
  </div>
</div>

    </div>
  );
}

export default Areas;
