import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDiseases, addDisease, updateDisease, deleteDisease } from '../store/diseaseSlice';

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

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchDiseases());
    }
  }, [status, dispatch]);

  const handleEdit = (disease) => {
    setEditingDisease(disease);
    setFormData({ ...disease });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    dispatch(addDisease({ ...formData, id: Date.now() }))
      .then(() => setFormData({
        name: '',
        description: '',
        symptoms: '',
        prevention: '',
        treatment: '',
        image: ''
      }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    dispatch(updateDisease({ id: editingDisease.id, updatedDisease: formData }))
      .then(() => setEditingDisease(null));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this disease?')) {
      dispatch(deleteDisease(id));
    }
  };

  if (status === 'loading') return <div className="text-center mt-12 text-gray-600">Loading...</div>;
  if (status === 'failed') return <div className="text-center mt-12 text-danger">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Manage Illnesses</h1>
      <div className="bg-white p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{editingDisease ? 'Edit Illness' : 'Add New Illness'}</h2>
        <form onSubmit={editingDisease ? handleUpdate : handleAdd}>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Name"
            className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Description"
            className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <textarea
            value={formData.symptoms}
            onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
            placeholder="Symptoms"
            className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <textarea
            value={formData.prevention}
            onChange={(e) => setFormData({ ...formData, prevention: e.target.value })}
            placeholder="Prevention"
            className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <textarea
            value={formData.treatment}
            onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
            placeholder="Treatment"
            className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="Image filename (e.g., disease4.jpg)"
            className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex space-x-4">
            <button
              type="submit"
              className={`w-full ${editingDisease ? 'bg-secondary' : 'bg-primary'} text-white p-3 rounded-md hover:${editingDisease ? 'bg-green-600' : 'bg-blue-600'}`}
            >
              {editingDisease ? 'Update' : 'Add'} Illness
            </button>
            {editingDisease && (
              <button
                onClick={() => setEditingDisease(null)}
                className="w-full bg-gray-500 text-white p-3 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
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
            {diseases.map((disease) => (
              <tr key={disease.id} className="border-b">
                <td className="p-3">{disease.name}</td>
                <td className="p-3">{disease.description}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleEdit(disease)}
                    className="bg-primary text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(disease.id)}
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

export default ManageDiseases;