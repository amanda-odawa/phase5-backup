import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, updateUser, deleteUser } from '../store/userSlice';

function ManageUsers() {
  const dispatch = useDispatch();
  const { users, status, error } = useSelector((state) => state.users);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ username: '', password: '', role: 'user' });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers());
    }
  }, [status, dispatch]);

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ username: user.username, password: user.password, role: user.role });
  };

  const validateForm = () => {
    if (!formData.username.trim() || !formData.password.trim()) {
      return 'Username and password are required.';
    }
    if (!['user', 'admin'].includes(formData.role)) {
      return 'Please select a valid role.';
    }
    return '';
  };

  const handleUpdate = () => {
    const error = validateForm();
    if (error) {
      setFormError(error);
      return;
    }

    dispatch(updateUser({ id: editingUser.id, updatedUser: formData }))
      .then(() => {
        setEditingUser(null);
        setFormError('');
      });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(id));
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
    setFormData({ username: '', password: '', role: 'user' });
    setFormError('');
  };

  if (status === 'loading') return <div className="text-center mt-12 text-gray-600">Loading...</div>;
  if (status === 'failed') return <div className="text-center mt-12 text-danger">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Manage Users</h1>
      {editingUser && (
        <div className="bg-white p-8 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit User</h2>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            placeholder="Username"
            className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Password"
            className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          {formError && <p className="text-danger mb-4">{formError}</p>}
          <div className="flex space-x-4">
            <button
              onClick={handleUpdate}
              className="w-full bg-secondary text-white p-3 rounded-md hover:bg-green-600"
            >
              Update User
            </button>
            <button
              onClick={handleCancel}
              className="w-full bg-gray-500 text-white p-3 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="bg-white p-8 rounded-lg shadow-md">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">Username</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="p-3">{user.username}</td>
                <td className="p-3">{user.role}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleEdit(user)}
                    className="bg-primary text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-danger text-white px-3 py-1 rounded hover:bg-red-600"
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
  );
}

export default ManageUsers;