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
  const fallbackImage = diseaseImages[`disease${disease.id}`] || 'https://via.placeholder.com/300x150?text=Disease+Image';
  const imageSrc = disease.image || fallbackImage;

  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <img
          src={imageSrc}
          alt={disease.name}
        className="w-full h-40 object-cover"
        />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{disease.name}</h3>
        <p className="text-gray-600 text-sm mb-3">{disease.about}</p>

        <div className="flex flex-wrap gap-2 mb-3">
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              disease.category === 'Vector-borne'
                ? 'bg-blue-100 text-blue-800'
                : disease.category === 'Bacterial'
                ? 'bg-green-100 text-green-800'
                : 'bg-purple-100 text-purple-800'
            }`}
          >
            {disease.category}
          </span>
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              disease.prevalence === 'High'
                ? 'bg-red-100 text-red-800'
                : disease.prevalence === 'Medium'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {disease.prevalence}
          </span>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {disease.regions?.map((region) => (
            <span
              key={region}
              className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
            >
              {region}
            </span>
          ))}
        </div>

        <Link
          to={`/diseases/${disease.id}`}
          className="text-[#0097b2] font-medium hover:underline"
        >
          Learn more &rarr;
        </Link>
      </div>
    </div>
  );
}

export default DiseaseCard;
