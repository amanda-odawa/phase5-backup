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

  const filteredAreas = areas.filter(
    (area) =>
      area.name.toLowerCase().includes(searchQuery) ||
      area.description.toLowerCase().includes(searchQuery)
  );

  if (status === 'loading') {
    return <div className="text-center text-gray-600 mt-10">Loading areas...</div>;
  }

  if (status === 'failed') {
    return <div className="text-center text-red-600 mt-10">Error fetching areas: {error}</div>;
  }

  if (!filteredAreas || filteredAreas.length === 0) {
    return <div className="text-center text-gray-600 mt-10">No areas found matching your search.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Affected Areas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAreas.map((area) => (
          <AreaCard key={area.id} area={area} />
        ))}
      </div>
    </div>
  );
}

export default Areas;