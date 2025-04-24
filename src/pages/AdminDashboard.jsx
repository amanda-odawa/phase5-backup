import { Link } from 'react-router-dom';

function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/manage-users"
          className="bg-primary text-white p-6 rounded-lg shadow-md text-center hover:bg-blue-600"
        >
          <h2 className="text-2xl font-bold">Manage Users</h2>
          <p className="mt-2">View, update, or delete user accounts.</p>
        </Link>
        <Link
          to="/manage-diseases"
          className="bg-primary text-white p-6 rounded-lg shadow-md text-center hover:bg-blue-600"
        >
          <h2 className="text-2xl font-bold">Manage Illnesses</h2>
          <p className="mt-2">Add, update, or delete disease information.</p>
        </Link>
        <Link
          to="/manage-areas"
          className="bg-primary text-white p-6 rounded-lg shadow-md text-center hover:bg-blue-600"
        >
          <h2 className="text-2xl font-bold">Manage Locations</h2>
          <p className="mt-2">Add, update, or delete affected areas.</p>
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;