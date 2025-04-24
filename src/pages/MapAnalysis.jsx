import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAreas } from '../store/areaSlice';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

function MapAnalysis() {
  const dispatch = useDispatch();
  const { areas, status, error } = useSelector((state) => state.areas);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAreas());
    }
  }, [status, dispatch]);

  if (status === 'loading') return <div className="text-center mt-12 text-gray-600">Loading...</div>;
  if (status === 'failed') return <div className="text-center mt-12 text-danger">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Disease Spread Map</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <MapContainer center={[0, 0]} zoom={2} style={{ height: '500px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {areas.map((area) => (
            <Marker key={area.id} position={[area.latitude, area.longitude]}>
              <Popup>
                <strong>{area.name}</strong><br />
                {area.description}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default MapAnalysis;