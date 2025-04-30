import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDiseases, addDisease, updateDisease, deleteDisease } from '../store/diseaseSlice';
import { toast } from 'react-toastify';

function ManageDiseases() {
  const dispatch = useDispatch();
  const { diseases, status, error } = useSelector((state) => state.diseases);
  const [editingDisease, setEditingDisease] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    symptoms: '',
    prevention: '',
    treatment: '',
    image: ''
  });
  const [formError, setFormError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchDiseases());
    }
    if (status === 'failed' && error) {
      toast.error(error);
    }
  }, [status, dispatch, error]);

  const handleEdit = (disease) => {
    setEditingDisease(disease);
    setFormData({ ...disease });
  };

  const validateForm = () => {
    if (!formData.name.trim() || !formData.description.trim() || !formData.symptoms.trim() || !formData.prevention.trim() || !formData.treatment.trim()) {
      return 'All fields except image are required.';
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
      await dispatch(addDisease({ ...formData, id: Date.now() })).unwrap();
      toast.success('Disease added successfully!');
      setFormData({
        name: '',
        description: '',
        symptoms: '',
        prevention: '',
        treatment: '',
        image: ''
      });
      setFormError('');
    } catch (err) {
      toast.error('Failed to add disease.');
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
      await dispatch(updateDisease({ id: editingDisease.id, updatedDisease: formData })).unwrap();
      toast.success('Disease updated successfully!');
      setEditingDisease(null);
      setFormError('');
    } catch (err) {
      toast.error('Failed to update disease.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await dispatch(deleteDisease(id)).unwrap();
      toast.success('Disease deleted successfully!');
      setShowDeleteConfirm(null);
    } catch (err) {
      toast.error('Failed to delete disease.');
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
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Manage Illnesses</h1>
      <div className="bg-white p-8 rounded-lg shadow-md mb-8 card">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{editingDisease ? 'Edit Illness' : 'Add New Illness'}</h2>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Name"
          className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Disease name"
        />
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Description"
          className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Description"
        />
        <textarea
          value={formData.symptoms}
          onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
          placeholder="Symptoms"
          className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Symptoms"
        />
        <textarea
          value={formData.prevention}
          onChange={(e) => setFormData({ ...formData, prevention: e.target.value })}
          placeholder="Prevention"
          className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Prevention"
        />
        <textarea
          value={formData.treatment}
          onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
          placeholder="Treatment"
          className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Treatment"
        />
        <input
          type="text"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          placeholder="Image filename (e.g., disease4.jpg)"
          className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Image filename"
        />
        {formError && <p className="text-red-500 mb-4">{formError}</p>}
        <div className="flex space-x-4">
          <button
            onClick={editingDisease ? handleUpdate : handleAdd}
            className="btn-primary w-full p-3 text-white rounded-md flex items-center justify-center"
            disabled={loading}
            aria-label={editingDisease ? 'Update illness' : 'Add illness'}
          >
            {loading ? <div className="spinner mr-2"></div> : null}
            {editingDisease ? 'Update' : 'Add'} Illness
          </button>
          {editingDisease && (
            <button
              onClick={() => setEditingDisease(null)}
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
            {diseases.map((disease) => (
              <tr key={disease.id} className="border-b">
                <td className="p-3">{disease.name}</td>
                <td className="p-3">{disease.description}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleEdit(disease)}
                    className="btn-primary text-white px-3 py-1 rounded mr-2"
                    aria-label={`Edit ${disease.name}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(disease.id)}
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
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-gray-800 mb-4">Are you sure you want to delete this disease?</p>
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

export default ManageDiseases;