import { Link } from 'react-router-dom';
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

function DiseaseCard({ disease }) {
  const imageSrc = diseaseImages[`disease${disease.id}`] || diseaseImages['disease1']; // Fallback to disease1 if image not found

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition duration-300">
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={disease.name}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">Image Placeholder</span>
        </div>
      )}
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800">{disease.name}</h3>
        <p className="text-gray-600 mt-2">{disease.description}</p>
        <Link
          to={`/diseases/${disease.id}`}
          className="mt-4 inline-block bg-primary text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default DiseaseCard;