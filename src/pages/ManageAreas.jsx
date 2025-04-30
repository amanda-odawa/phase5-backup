import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAreas, addArea, updateArea, deleteArea } from '../store/areaSlice';
import { toast } from 'react-toastify';

function ManageAreas() {
  const dispatch = useDispatch();
  const { areas, status, error } = useSelector((state) => state.areas);
  const diseases = useSelector((state) => state.diseases.diseases);
  const [editingArea, setEditingArea] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    diseaseId: '',
    description: '',
    latitude: '',
    longitude: '',
    image: ''
  });
  const [formError, setFormError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAreas());
    }
    if (status === 'failed' && error) {
      toast.error(error);
    }
  }, [status, dispatch, error]);

  const handleEdit = (area) => {
    setEditingArea(area);
    setFormData({
      name: area.name,
      diseaseId: area.diseaseId,
      description: area.description,
      latitude: area.latitude,
      longitude: area.longitude,
      image: area.image
    });
  };

  const validateForm = () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      return 'Name and description are required.';
    }
    if (!formData.diseaseId) {
      return 'Please select a disease.';
    }
    if (!formData.latitude || !formData.longitude || isNaN(formData.latitude) || isNaN(formData.longitude)) {
      return 'Please enter valid latitude and longitude.';
    }
    if (!formData.image.trim()) {
      return 'Please enter an image filename.';
    }
    return '';
  };

  const handleAdd = async () => {
    const error = validateForm();
    if (error) {
      setFormError(error);
      return;
    }

    setLoading(true);
    try {
      await dispatch(addArea({ ...formData, id: Date.now(), latitude: parseFloat(formData.latitude), longitude: parseFloat(formData.longitude) })).unwrap();
      toast.success('Area added successfully!');
      setFormData({
        name: '',
        diseaseId: '',
        description: '',
        latitude: '',
        longitude: '',
        image: ''
      });
      setFormError('');
    } catch (err) {
      toast.error('Failed to add area.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    const error = validateForm();
    if (error) {
      setFormError(error);
      return;
    }

    setLoading(true);
    try {
      await dispatch(updateArea({ id: editingArea.id, updatedArea: { ...formData, latitude: parseFloat(formData.latitude), longitude: parseFloat(formData.longitude) } })).unwrap();
      toast.success('Area updated successfully!');
      setEditingArea(null);
      setFormError('');
    } catch (err) {
      toast.error('Failed to update area.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await dispatch(deleteArea(id)).unwrap();
      toast.success('Area deleted successfully!');
      setShowDeleteConfirm(null);
    } catch (err) {
      toast.error('Failed to delete area.');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') return (
    <div className="text-center mt-12">
      <div className="spinner mx-auto"></div>
      <p className="text-gray-600 mt-2">Loading...</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Manage Locations</h1>
      <div className="bg-white p-8 rounded-lg shadow-md mb-8 card">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{editingArea ? 'Edit Location' : 'Add New Location'}</h2>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Name"
          className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Area name"
        />
        <select
          value={formData.diseaseId}
          onChange={(e) => setFormData({ ...formData, diseaseId: e.target.value })}
          className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Select disease"
        >
          <option value="">Select Disease</option>
          {diseases.map((disease) => (
            <option key={disease.id} value={disease.id}>{disease.name}</option>
          ))}
        </select>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Description"
          className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Description"
        />
        <input
          type="number"
          value={formData.latitude}
          onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
          placeholder="Latitude"
          className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Latitude"
        />
        <input
          type="number"
          value={formData.longitude}
          onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
          placeholder="Longitude"
          className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Longitude"
        />
        <input
          type="text"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          placeholder="Image filename (e.g., area4.jpg)"
          className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Image filename"
        />
        {formError && <p className="text-red-500 mb-4">{formError}</p>}
        <div className="flex space-x-4">
          <button
            onClick={editingArea ? handleUpdate : handleAdd}
            className="btn-primary w-full p-3 text-white rounded-md flex items-center justify-center"
            disabled={loading}
            aria-label={editingArea ? 'Update location' : 'Add location'}
          >
            {loading ? <div className="spinner mr-2"></div> : null}
            {editingArea ? 'Update' : 'Add'} Location
          </button>
          {editingArea && (
            <button
              onClick={() => setEditingArea(null)}
              className="w-full bg-gray-500 text-white p-3 rounded-md hover:bg-gray-600"
              aria-label="Cancel edit"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
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
            {areas.map((area) => (
              <tr key={area.id} className="border-b">
                <td className="p-3">{area.name}</td>
                <td className="p-3">{area.description}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleEdit(area)}
                    className="btn-primary text-white px-3 py-1 rounded mr-2"
                    aria-label={`Edit ${area.name}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(area.id)}
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
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-gray-800 mb-4">Are you sure you want to delete this area?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="p-2 border rounded-lg"
                aria-label="Cancel delete"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="p-2 bg-red-500 text-white rounded-lg flex items-center"
                disabled={loading}
                aria-label="Confirm delete"
              >
                {loading ? <div className="spinner mr-2"></div> : null}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageAreas;