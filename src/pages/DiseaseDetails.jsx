import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDiseases } from '@/store/diseaseSlice';
import DonationForm from '@/components/DonationForm';
import ReviewForm from '@/components/ReviewForm';

// Import images using the @ alias
import disease1 from '@/assets/disease1.jpg';
import disease2 from '@/assets/disease2.jpg';
import disease3 from '@/assets/disease3.jpg';
import disease4 from '@/assets/disease4.jpg';

const diseaseImages = {
  'disease1': disease1,
  'disease2': disease2,
  'disease3': disease3,
  'disease4': disease4,
};

function DiseaseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { diseases, status, error } = useSelector((state) => state.diseases);
  const [disease, setDisease] = useState(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchDiseases());
    }
  }, [status, dispatch]);

  useEffect(() => {
    const foundDisease = diseases.find((d) => d.id === parseInt(id));
    if (foundDisease) {
      setDisease(foundDisease);
    } else if (status === 'succeeded' && !foundDisease) {
      navigate('/diseases');
    }
  }, [diseases, id, navigate, status]);

  if (status === 'loading') return <div className="text-center mt-12 text-gray-600">Loading...</div>;
  if (status === 'failed') return <div className="text-center mt-12 text-danger">Error: {error}</div>;
  if (!disease) return <div className="text-center mt-12 text-gray-600">Illness not found.</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">{disease.name}</h2>
      <div className="flex flex-col md:flex-row gap-6 bg-white p-8 rounded-lg shadow-md">
        <div className="md:w-1/2">
          <img
            src={diseaseImages[`disease${id}`] || diseaseImages['disease1']}
            alt={disease.name}
            className="w-full max-w-md mx-auto h-64 object-cover rounded-lg mb-6"
          />
        </div>
        <div className="md:w-1/2">
          <p className="text-gray-600 mb-4"><strong>Description:</strong> {disease.description}</p>
          <p className="text-gray-600 mb-4"><strong>Symptoms:</strong> {disease.symptoms}</p>
          <p className="text-gray-600 mb-4"><strong>Prevention:</strong> {disease.prevention}</p>
          <p className="text-gray-600 mb-4"><strong>Treatment:</strong> {disease.treatment}</p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Support the Cause</h2>
        <DonationForm areaId={null} diseaseId={id} />
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Share Your Thoughts</h2>
        <ReviewForm areaId={null} diseaseId={id} />
      </div>
    </div>
  );
}

export default DiseaseDetails;