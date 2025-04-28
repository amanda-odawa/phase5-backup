import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAreas } from '../store/areaSlice';
import { fetchDiseases } from '../store/diseaseSlice';

function MapAnalysis() {
  const dispatch = useDispatch();
  const { areas, status: areaStatus, error: areaError } = useSelector((state) => state.areas);
  const { diseases, status: diseaseStatus, error: diseaseError } = useSelector((state) => state.diseases);
  const [selectedDisease, setSelectedDisease] = useState('');

  useEffect(() => {
    if (areaStatus === 'idle') {
      dispatch(fetchAreas());
    }
    if (diseaseStatus === 'idle') {
      dispatch(fetchDiseases());
    }
  }, [areaStatus, diseaseStatus, dispatch]);

  const filteredAreas = selectedDisease
    ? areas.filter((area) => area.diseaseId === parseInt(selectedDisease))
    : areas;

  if (areaStatus === 'loading' || diseaseStatus === 'loading') {
    return <div className="text-center mt-12 text-gray-600">Loading...</div>;
  }
  if (areaStatus === 'failed') {
    return <div className="text-center mt-12 text-danger">Error: {areaError}</div>;
  }
  if (diseaseStatus === 'failed') {
    return <div className="text-center mt-12 text-danger">Error: {diseaseError}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Map Analysis</h1>
      <div className="mb-6">
        <label htmlFor="diseaseFilter" className="block text-gray-700 mb-2">
          Filter by Disease:
        </label>
        <select
          id="diseaseFilter"
          value={selectedDisease}
          onChange={(e) => setSelectedDisease(e.target.value)}
          className="w-full max-w-xs p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Diseases</option>
          {diseases.map((disease) => (
            <option key={disease.id} value={disease.id}>
              {disease.name}
            </option>
          ))}
        </select>
      </div>
      <MapContainer
        center={[0, 0]}
        zoom={2}
        style={{ height: '500px', width: '100%' }}
        className="rounded-lg shadow-md"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {filteredAreas.map((area) => (
          <Marker key={area.id} position={[area.latitude, area.longitude]}>
            <Popup>
              <strong>{area.name}</strong>
              <p>{area.description}</p>
              <p>
                <strong>Disease:</strong>{' '}
                {diseases.find((d) => d.id === area.diseaseId)?.name || 'Unknown'}
              </p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-bold text-gray-800 mb-2">Legend</h2>
        <p className="text-gray-600">
          <span className="inline-block w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
          Markers indicate areas affected by communicable diseases.
        </p>
      </div>
    </div>
  );
}

export default MapAnalysis;