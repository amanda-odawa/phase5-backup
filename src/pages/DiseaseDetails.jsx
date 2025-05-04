import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDiseases } from '../store/diseaseSlice';
import { fetchAreas } from '../store/areaSlice';
import ReviewForm from '../components/ReviewForm';

function DiseaseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { diseases, status: diseaseStatus, error } = useSelector((state) => state.diseases);
  const { areas, status: areaStatus } = useSelector((state) => state.areas);

  const [disease, setDisease] = useState(null);
  const [affectedAreas, setAffectedAreas] = useState([]);
  const [totalCases, setTotalCases] = useState(0);

  useEffect(() => {
    if (diseaseStatus === 'idle') dispatch(fetchDiseases());
    if (areaStatus === 'idle') dispatch(fetchAreas());
  }, [dispatch, diseaseStatus, areaStatus]);

  useEffect(() => {
    const foundDisease = diseases.find((d) => d.id === id);
    if (foundDisease) {
      setDisease(foundDisease);
    } else if (diseaseStatus === 'succeeded' && !foundDisease) {
      navigate('/diseases');
    }
  }, [diseases, id, navigate, diseaseStatus]);

  useEffect(() => {
    if (areas.length && disease) {
      const affected = [];
      let total = 0;

      areas.forEach((area) => {
        const cases = area.diseaseCases?.[id];
        if (cases && cases > 0) {
          affected.push(area.name);
          total += cases;
        }
      });

      setAffectedAreas(affected);
      setTotalCases(total);
    }
  }, [areas, disease, id]);

  if (diseaseStatus === 'loading' || areaStatus === 'loading')
    return <div className="text-center mt-12 text-gray-600">Loading...</div>;

  if (diseaseStatus === 'failed')
    return <div className="text-center mt-12 text-danger">Error: {error}</div>;

  if (!disease)
    return <div className="text-center mt-12 text-gray-600">Illness not found.</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">{disease.name}</h2>
      <div className="flex flex-col md:flex-row gap-6 bg-white p-8 rounded-lg shadow-md">
        <div className="md:w-1/2">
          <img
            src={disease.image}
            alt={disease.name}
            className="w-full max-w-md mx-auto h-64 object-cover rounded-lg mb-6"
          />
        </div>
        <div className="md:w-1/2">
          <p className="text-gray-600 mb-4"><strong>Prevalence:</strong> {disease.prevalence}</p>
          <p className="text-gray-600 mb-4"><strong>Category:</strong> {disease.category}</p>
          <p className="text-gray-600 mb-4"><strong>Description:</strong> {disease.about}</p>
          <p className="text-gray-600 mb-4"><strong>Symptoms:</strong> {disease.symptoms}</p>
          <p className="text-gray-600 mb-4"><strong>Prevention:</strong> {disease.prevention}</p>
          <p className="text-gray-600 mb-4"><strong>Treatment:</strong> {disease.treatment}</p>
          <p className="text-gray-600 mb-4"><strong>Risk Factors:</strong> {disease.riskFactors}</p>
          <p className="text-gray-600 mb-4">
            <strong>Areas Affected:</strong>{' '}
            {affectedAreas.length > 0 ? affectedAreas.join(', ') : 'None reported'}
          </p>
          <p className="text-gray-600 mb-4">
            <strong>Total Cases Worldwide:</strong> {totalCases}
          </p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Share Your Thoughts</h2>
        <ReviewForm areaId={null} diseaseId={id} />
      </div>
    </div>
  );
}

export default DiseaseDetails;