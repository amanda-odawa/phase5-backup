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

  const filteredDiseases = diseases.filter((disease) =>
    disease.name.toLowerCase().includes(searchQuery) ||
    disease.description.toLowerCase().includes(searchQuery)
  );

  if (status === 'loading') return <div className="text-center mt-12 text-gray-600">Loading...</div>;
  if (status === 'failed') return <div className="text-center mt-12 text-danger">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Communicable Illnesses</h2>
      {filteredDiseases.length === 0 ? (
        <p className="text-center text-gray-600">No illnesses found matching your search.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDiseases.map((disease) => (
            <DiseaseCard key={disease.id} disease={disease} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Diseases;