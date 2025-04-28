import { Link } from 'react-router-dom';
import area1 from '@/assets/area1.jpg';
import area2 from '@/assets/area2.jpg';
import area3 from '@/assets/area3.jpg';

const areaImages = {
  'area1': area1,
  'area2': area2,
  'area3': area3,
};

function AreaCard({ area }) {
  const imageSrc = areaImages[`area${area.id}`] || areaImages['area1']; // Fallback to area1 if image not found

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition duration-300">
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={area.name}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">Image Placeholder</span>
        </div>
      )}
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800">{area.name}</h3>
        <p className="text-gray-600 mt-2">{area.description}</p>
        <Link
          to={`/areas/${area.id}`}
          className="mt-4 inline-block bg-primary text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default AreaCard;