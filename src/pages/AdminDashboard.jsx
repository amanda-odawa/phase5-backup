import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDiseases, deleteDisease } from '../store/diseaseSlice';
import { fetchAreas, deleteArea } from '../store/areaSlice';
import { fetchUsers } from '../store/userSlice'; 
import { updateUser } from '../store/userSlice';
import { toast } from 'react-toastify';

function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { diseases, status: diseaseStatus } = useSelector((state) => state.diseases);
  const { areas, status: areaStatus } = useSelector((state) => state.areas);
  const { users, status: userStatus } = useSelector((state) => state.users);
  const [activeTab, setActiveTab] = useState('Users');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => {
    dispatch(fetchDiseases());
    dispatch(fetchAreas());
    dispatch(fetchUsers());
    setTimeout(() => setLoading(false), 1000);
  }, [dispatch]);

  const handleRoleChange = (userId, newRole) => {
    dispatch(updateUser({ id: userId, updatedUser: { role: newRole } }))
      .unwrap()
      .then(() => toast.success('User role updated'))
      .catch(() => toast.error('Failed to update user role'));
  };

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
      (disease.name && disease.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (disease.description && disease.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const filteredAreas = areas.filter(
    (area) =>
      (area.name && area.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (area.description && area.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const filteredUsers = users.filter(
    (user) =>
      (user.username && user.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Admin Dashboard</h1>
      <div className="flex space-x-4 mb-6">
        <button onClick={() => setActiveTab('Users')} className={`p-2 ${activeTab === 'Users' ? 'border-b-2 border-blue-500' : ''}`}>Users</button>
        <button onClick={() => setActiveTab('Diseases')} className={`p-2 ${activeTab === 'Diseases' ? 'border-b-2 border-blue-500' : ''}`}>Diseases</button>
        <button onClick={() => setActiveTab('Areas')} className={`p-2 ${activeTab === 'Areas' ? 'border-b-2 border-blue-500' : ''}`}>Areas</button>
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
              <button
                onClick={() => navigate('/register')}
                className="btn-primary bg-cyan-600 text-white p-2 mb-4 rounded-md shadow-md hover:bg-cyan-700 transition-colors"
              >
                + Add User
              </button>
              <div className="bg-white p-8 rounded-lg shadow-md card">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-3 text-left">Username</th>
                      <th className="p-3 text-left">Email</th>
                      <th className="p-3 text-left">Role</th> 
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b">
                        <td className="p-3">{user.username}</td>
                        <td className="p-3">{user.email}</td>
                        <td className="p-3">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="border p-1 rounded-md"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab === 'Diseases' && (
            <div>
              <button onClick={() => navigate('/add-disease')} className="btn-primary bg-cyan-600 text-white p-2 mb-4 rounded-md shadow-md hover:bg-cyan-700 transition-colors">+ Add Disease</button>
              <div className="bg-white p-8 rounded-lg shadow-md card">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Category</th>
                      <th className="p-3 text-left">Prevalence</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDiseases.map((disease) => (
                      <tr key={disease.id} className="border-b">
                        <td className="p-3">{disease.name}</td>
                        <td className="p-3">{disease.category}</td>
                        <td className="p-3">{disease.prevalence}</td>
                        <td className="p-3">
                          <button
                            onClick={() => navigate(`/edit-disease/${disease.id}`)}
                            className="btn-primary text-blue-500 pr-3 py-1 rounded mr-2"
                            aria-label={`Edit ${disease.name}`}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm({ type: 'disease', id: disease.id })}
                            className="btn-primary text-red-500 px-3 py-1 rounded"
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
          {activeTab === 'Areas' && (
            <div>
              <button onClick={() => navigate('/add-area')} className="btn-primary bg-cyan-600 text-white p-2 mb-4 rounded-md shadow-md hover:bg-cyan-700 transition-colors">+ Add Area</button>
              <div className="bg-white p-8 rounded-lg shadow-md card">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Total Cases</th>
                      <th className="p-3 text-left">Population</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAreas.map((area) => (
                      <tr key={area.id} className="border-b">
                        <td className="p-3">{area.name}</td>
                        <td className="p-3">{area.totalCases}</td>
                        <td className="p-3">{area.population}</td>
                        <td className="p-3">
                          <button
                            onClick={() => navigate(`/edit-area/${area.id}`)}
                            className="btn-primary text-blue-500 pr-3 py-1 rounded mr-2"
                            aria-label={`Edit ${area.name}`}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm({ type: 'area', id: area.id })}
                            className="btn-primary text-red-500 px-3 py-1 rounded"
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