import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDiseases } from '../store/diseaseSlice';

function DiseaseDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { diseases, status, error } = useSelector((state) => state.diseases);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchDiseases());
    }
  }, [status, dispatch]);

  if (status === 'loading') return <div className="text-center mt-12 text-gray-600">Loading...</div>;
  if (status === 'failed') return <div className="text-center mt-12 text-danger">Error: {error}</div>;

  const disease = diseases.find((d) => d.id === parseInt(id));

  if (!disease) return <div className="text-center mt-12 text-gray-600">Illness not found.</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">{disease.name}</h2>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <img
          src={`/src/assets/${disease.image}`}
          alt={disease.name}
          className="w-full max-w-md mx-auto h-64 object-cover rounded-lg mb-6"
        />
        <p className="text-gray-600 mb-4"><strong>Description:</strong> {disease.description}</p>
        <p className="text-gray-600 mb-4"><strong>Symptoms:</strong> {disease.symptoms}</p>
        <p className="text-gray-600 mb-4"><strong>Prevention:</strong> {disease.prevention}</p>
        <p className="text-gray-600 mb-4"><strong>Treatment:</strong> {disease.treatment}</p>
      </div>
    </div>
  );
}

export default DiseaseDetails;