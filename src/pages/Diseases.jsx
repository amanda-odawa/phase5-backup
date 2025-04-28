import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDiseases } from '../store/diseaseSlice';
import DiseaseCard from '../components/DiseaseCard';
import { useLocation } from 'react-router-dom';

function Diseases() {
  const dispatch = useDispatch();
  const { diseases, status, error } = useSelector((state) => state.diseases);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchDiseases());
    }
  }, [status, dispatch]);

  const filteredDiseases = diseases.filter(
    (disease) =>
      disease.name.toLowerCase().includes(searchQuery) ||
      disease.description.toLowerCase().includes(searchQuery)
  );

  if (status === 'loading') {
    return <div className="text-center text-gray-600 mt-10">Loading diseases...</div>;
  }

  if (status === 'failed') {
    return <div className="text-center text-red-600 mt-10">Error fetching diseases: {error}</div>;
  }

  if (!filteredDiseases || filteredDiseases.length === 0) {
    return <div className="text-center text-gray-600 mt-10">No diseases found matching your search.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Communicable Diseases</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDiseases.map((disease) => (
          <DiseaseCard key={disease.id} disease={disease} />
        ))}
      </div>
    </div>
  );
}

export default Diseases;