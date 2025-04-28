import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAreas, addArea, updateArea, deleteArea } from '../store/areaSlice';

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

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAreas());
    }
  }, [status, dispatch]);

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

  const handleAdd = () => {
    const error = validateForm();
    if (error) {
      setFormError(error);
      return;
    }

    dispatch(addArea({ ...formData, id: Date.now(), latitude: parseFloat(formData.latitude), longitude: parseFloat(formData.longitude) }))
      .then(() => {
        setFormData({
          name: '',
          diseaseId: '',
          description: '',
          latitude: '',
          longitude: '',
          image: ''
        });
        setFormError('');
      });
  };

  const handleUpdate = () => {
    const error = validateForm();
    if (error) {
      setFormError(error);
      return;
    }

    dispatch(updateArea({ id: editingArea.id, updatedArea: { ...formData, latitude: parseFloat(formData.latitude), longitude: parseFloat(formData.longitude) } }))
      .then(() => {
        setEditingArea(null);
        setFormError('');
      });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this area?')) {
      dispatch(deleteArea(id));
    }
  };

  if (status === 'loading') return <div className="text-center mt-12 text-gray-600">Loading...</div>;
  if (status === 'failed') return <div className="text-center mt-12 text-danger">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Manage Locations</h1>
      <div className="bg-white p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{editingArea ? 'Edit Location' : 'Add New Location'}</h2>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Name"
          className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <select
          value={formData.diseaseId}
          onChange={(e) => setFormData({ ...formData, diseaseId: e.target.value })}
          className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
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
          className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="number"
          value={formData.latitude}
          onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
          placeholder="Latitude"
          className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="number"
          value={formData.longitude}
          onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
          placeholder="Longitude"
          className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="text"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          placeholder="Image filename (e.g., area4.jpg)"
          className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {formError && <p className="text-danger mb-4">{formError}</p>}
        <div className="flex space-x-4">
          <button
            onClick={editingArea ? handleUpdate : handleAdd}
            className={`w-full ${editingArea ? 'bg-secondary' : 'bg-primary'} text-white p-3 rounded-md hover:${editingArea ? 'bg-green-600' : 'bg-blue-600'}`}
          >
            {editingArea ? 'Update' : 'Add'} Location
          </button>
          {editingArea && (
            <button
              onClick={() => setEditingArea(null)}
              className="w-full bg-gray-500 text-white p-3 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-md">
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
                    className="bg-primary text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(area.id)}
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

export default ManageAreas;