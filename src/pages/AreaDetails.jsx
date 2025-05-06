import { useEffect } from 'react';
import axios from 'axios'
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAreas } from '../store/areaSlice';
import ReviewForm from '../components/ReviewForm';
import Donation from '../pages/Donation';

function AreaDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { areas, status, error } = useSelector((state) => state.areas);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAreas());
    } else if (status === 'succeeded' && areas.length === 0) {
      dispatch(fetchAreas());
    }
  }, [status, dispatch, areas.length]);

  if (status === 'loading')
    return (
      <div className="text-center mt-12 text-gray-600">
        Loading...
      </div>
    );
  if (status === 'failed')
    return (
      <div className="text-center mt-12 text-danger">
        Error: {error}
      </div>
    );

  const area = areas.find((a) => a.id === id);

  if (!area)
    return (
      <div className="text-center mt-12 text-gray-600">
        Location not found.
      </div>
    );

  const imageSrc = areaImages[area.image] || area1;

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">{area.name}</h2>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <img
          src={imageSrc}
          alt={area.name}
          className="w-full max-w-md mx-auto h-64 object-cover rounded-lg mb-6"
        />
        <p className="text-gray-600 mb-4"><strong>Description:</strong> {area.description}</p>
        <ReviewForm areaId={area.id} />
        <Donation areaId={area.id} />
      </div>
    </div>
  );
}

export default AreaDetails;