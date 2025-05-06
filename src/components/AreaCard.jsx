import { Link } from 'react-router-dom';

function AreaCard({ area }) {
  const imageSrc = areaImages[`area${area.id}`] || areaImages['area1']; 

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