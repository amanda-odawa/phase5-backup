import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAreas } from '../store/areaSlice';
import { fetchDiseases } from '../store/diseaseSlice';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function Areas() {
  const dispatch = useDispatch();
  const { areas } = useSelector((state) => state.areas);
  const { diseases } = useSelector((state) => state.diseases);
  const [selectedArea, setSelectedArea] = useState(null);

  useEffect(() => {
    dispatch(fetchAreas());
    dispatch(fetchDiseases());
  }, [dispatch]);

  const getTotalCases = (area) =>
    Object.values(area.diseaseCases || {}).reduce((acc, count) => acc + count, 0);

  return (
    <div className=" min-h-screen bg-white text-gray-900 py-16 px-4 sm:px-8">
      <h1 className="text-3xl font-semibold text-center mb-8">Affected Areas</h1>

      {/* Map */}
      <div className="h-[400px] mb-10 rounded-lg overflow-hidden shadow-md border">
        <MapContainer center={[0, 0]} zoom={2} scrollWheelZoom={true} style={{ height: '500px', width: '100%' }} className="rounded-lg shadow-md mb-6 z-0">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
          {areas.map((area) => (
            <Marker key={area.id} position={[area.latitude, area.longitude]} eventHandlers={{ click: () => setSelectedArea(area) }}>
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
      {selectedArea ? (
        <div className="bg-gray-100 rounded-lg p-4 mb-8 shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">{selectedArea.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-2xl font-bold text-gray-800">{getTotalCases(selectedArea).toLocaleString()}</p>
              <p className="text-gray-600">Total Cases</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{(selectedArea.population / 1000000).toFixed(2)} million</p>
              <p className="text-gray-600">Population</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{Object.keys(selectedArea.diseaseCases || {}).length}</p>
              <p className="text-gray-600">Diseases</p>
            </div>
          </div>
          <ul className="list-disc list-inside space-y-1 mb-4">
            {Object.entries(selectedArea.diseaseCases || {}).map(([diseaseId, cases]) => {
              const disease = diseases.find((d) => d.id === diseaseId);
              if (!disease) return null;
              return (
                disease && (
                  <div key={diseaseId} className="flex justify-between items-center mb-2">
                    <span className="text-gray-800">{disease.name}</span>
                    <div className="flex items-center">       
                      <span className="text-gray-600 dark:text-gray-300 mr-2"> 
                        {cases.toLocaleString()} cases 
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        disease.prevalence === 'High' 
                          ?  'bg-red-100 text-red-800'
                          :  disease.prevalence === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                        }`}
                      >
                      {disease.prevalence}
                      </span>
                    </div>
                  </div>
                )
              );
            })}
          </ul> 
        </div>
      ) : (
        <p className="text-center text-gray-600 italic">Click on a marker to view area details</p>
      )}
    </div>
  );
}

export default Areas;
