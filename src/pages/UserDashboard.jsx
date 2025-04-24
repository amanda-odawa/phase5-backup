import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function UserDashboard() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">User Dashboard</h1>
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome, {user.username}!</h2>
        <div className="flex flex-col space-y-4">
          <Link
            to="/profile"
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            View Profile
          </Link>
          <Link
            to="/diseases"
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            Browse Illnesses
          </Link>
          <Link
            to="/areas"
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            Browse Locations
          </Link>
          <Link
            to="/map-analysis"
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            View Maps
          </Link>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;