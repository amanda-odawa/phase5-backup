import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDiseases, deleteDisease } from '../store/diseaseSlice';
import { fetchAreas, deleteArea } from '../store/areaSlice';
import { toast } from 'react-toastify';

function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const totalUsers = useSelector((state) => state.users.users.length);
  const { diseases, status: diseaseStatus } = useSelector((state) => state.diseases);
  const { areas, status: areaStatus } = useSelector((state) => state.areas);
  const [activeTab, setActiveTab] = useState('Users');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => {
    dispatch(fetchDiseases());
    dispatch(fetchAreas());
    setTimeout(() => setLoading(false), 1000);
  }, [dispatch]);

  const handleDeleteDisease = async (id) => {
    try {
      await dispatch(deleteDisease(id)).unwrap();
      toast.success('Disease deleted successfully!');
      setShowDeleteConfirm(null);
    } catch (err) {
      toast.error('Failed to delete disease.');
    }
  };

  const handleDeleteArea = async (id) => {
    try {
      await dispatch(deleteArea(id)).unwrap();
      toast.success('Area deleted successfully!');
      setShowDeleteConfirm(null);
    } catch (err) {
      toast.error('Failed to delete area.');
    }
  };

  const filteredDiseases = diseases.filter(
    (disease) =>
      disease.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      disease.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAreas = areas.filter(
    (area) =>
      area.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      area.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center card">
          <h2 className="text-2xl font-bold text-gray-800">Total Users</h2>
          <p className="mt-2 text-gray-600">{totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center card">
          <h2 className="text-2xl font-bold text-gray-800">Total Illnesses</h2>
          <p className="mt-2 text-gray-600">{diseases.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center card">
          <h2 className="text-2xl font-bold text-gray-800">Total Locations</h2>
          <p className="mt-2 text-gray-600">{areas.length}</p>
        </div>
      </div>
      <div className="flex space-x-4 mb-6">
        <button onClick={() => setActiveTab('Users')} className={`p-2 ${activeTab === 'Users' ? 'border-b-2 border-blue-500' : ''}`}>Users</button>
        <button onClick={() => setActiveTab('Diseases')} className={`p-2 ${activeTab === 'Diseases' ? 'border-b-2 border-blue-500' : ''}`}>Diseases</button>
        <button onClick={() => setActiveTab('Regions')} className={`p-2 ${activeTab === 'Regions' ? 'border-b-2 border-blue-500' : ''}`}>Regions</button>
      </div>
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-3 border rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Search"
      />
      {loading || diseaseStatus === 'loading' || areaStatus === 'loading' ? (
        <div className="text-center">
          <div className="spinner mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading...</p>
        </div>
      ) : (
        <>
          {activeTab === 'Users' && (
            <div>
              <button onClick={() => navigate('/manage-users')} className="btn-primary p-2 text-white rounded-md mb-4">Manage Users</button>
              <p className="text-gray-600">Click the button above to manage users.</p>
            </div>
          )}
          {activeTab === 'Diseases' && (
            <div>
              <button onClick={() => navigate('/manage-diseases')} className="btn-primary p-2 text-white rounded-md mb-4">+ Add Disease</button>
              <div className="bg-white p-8 rounded-lg shadow-md card">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Description</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDiseases.map((disease) => (
                      <tr key={disease.id} className="border-b">
                        <td className="p-3">{disease.name}</td>
                        <td className="p-3">{disease.description}</td>
                        <td className="p-3">
                          <button
                            onClick={() => navigate('/manage-diseases')}
                            className="btn-primary text-white px-3 py-1 rounded mr-2"
                            aria-label={`Edit ${disease.name}`}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm({ type: 'disease', id: disease.id })}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            aria-label={`Delete ${disease.name}`}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab === 'Regions' && (
            <div>
              <button onClick={() => navigate('/manage-areas')} className="btn-primary p-2 text-white rounded-md mb-4">+ Add Region</button>
              <div className="bg-white p-8 rounded-lg shadow-md card">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Description</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAreas.map((area) => (
                      <tr key={area.id} className="border-b">
                        <td className="p-3">{area.name}</td>
                        <td className="p-3">{area.description}</td>
                        <td className="p-3">
                          <button
                            onClick={() => navigate('/manage-areas')}
                            className="btn-primary text-white px-3 py-1 rounded mr-2"
                            aria-label={`Edit ${area.name}`}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm({ type: 'area', id: area.id })}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            aria-label={`Delete ${area.name}`}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-gray-800 mb-4">Are you sure you want to delete this {showDeleteConfirm.type}?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="p-2 border rounded-lg"
                aria-label="Cancel delete"
              >
                Cancel
              </button>
              <button
                onClick={() => showDeleteConfirm.type === 'disease' ? handleDeleteDisease(showDeleteConfirm.id) : handleDeleteArea(showDeleteConfirm.id)}
                className="p-2 bg-red-500 text-white rounded-lg"
                aria-label="Confirm delete"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;