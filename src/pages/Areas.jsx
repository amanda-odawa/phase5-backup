import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAreas } from '../store/areaSlice';
import AreaCard from '../components/AreaCard';
import { useLocation } from 'react-router-dom';

function Areas() {
  const dispatch = useDispatch();
  const { areas, status, error } = useSelector((state) => state.areas);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAreas());
    }
  }, [status, dispatch]);

  const filteredAreas = areas.filter((area) =>
    area.name.toLowerCase().includes(searchQuery) ||
    area.description.toLowerCase().includes(searchQuery)
  );

  if (status === 'loading') return <div className="text-center mt-12 text-gray-600">Loading...</div>;
  if (status === 'failed') return <div className="text-center mt-12 text-danger">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Affected Locations</h2>
      {filteredAreas.length === 0 ? (
        <p className="text-center text-gray-600">No locations found matching your search.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAreas.map((area) => (
            <AreaCard key={area.id} area={area} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Areas;