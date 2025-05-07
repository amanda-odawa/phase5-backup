import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateDisease, fetchDiseaseById } from '../store/diseaseSlice';
import { toast } from 'react-toastify';

const EditDisease = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { disease, loading } = useSelector((state) => state.diseases);

  const [form, setForm] = useState({
    name: '',
    category: '',
    prevalence: '',
    about: '',
    symptoms: '',
    prevention: '',
    treatment: '',
    risk_factors: '',
    image: '',
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchDiseaseById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (disease) {
      setForm({
        name: disease.name || '',
        category: disease.category || '',
        prevalence: disease.prevalence || '',
        about: disease.about || '',
        symptoms: disease.symptoms || '',
        prevention: disease.prevention || '',
        treatment: disease.treatment || '',
        risk_factors: disease.risk_factors || '',
        image: disease.image || '',
      });
    }
  }, [disease]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, image: e.target.value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateDisease({ id, updatedDisease: form })).unwrap();
      toast.success('Disease updated successfully!');
      navigate('/admin-dashboard');
    } catch (err) {
      toast.error('Failed to update disease');
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-gray-600">Loading disease...</p>;
  }

  if (!disease) {
    return <p className="text-center mt-10 text-gray-600">Disease not found.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-16 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Edit Disease</h1>
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-700 shadow-lg rounded-lg p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                required
              >
                <option value="">Select Category</option>
                <option value="Bacterial">Bacterial</option>
                <option value="Viral">Viral</option>
                <option value="Vector-borne">Vector-borne</option>
                <option value="Water-borne">Water-borne</option>
                <option value="Air-borne">Air-borne</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Prevalence</label>
              <select
                name="prevalence"
                value={form.prevalence}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                required
              >
                <option value="">Select Prevalence</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">About</label>
              <textarea
                name="about"
                value={form.about}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                rows="4"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Symptom(s)</label>
              <input
                type="text"
                name="symptoms"
                value={form.symptoms}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                placeholder="Separate different symptoms with a coma (,)"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Prevention method(s)</label>
              <input
                type="text"
                name="prevention"
                value={form.prevention}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                placeholder="Separate different prevention methods with a coma (,) "
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Treatment(s)</label>
              <input
                type="text"
                name="treatment"
                value={form.treatment}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                placeholder="Separate different treatments with a coma (,) "
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Risk factor(s)</label>
              <input
                type="text"
                name="risk_factors"
                value={form.risk_factors}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                placeholder="Separate different risk factors with a coma (,) "
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Image</label>
              <input
                type="url"
                name="image"
                value={form.image}
                onChange={handleImageChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
              />
              {form.image && <img src={form.image} alt="Disease" className="mt-4 w-32 h-32 object-cover" />}
            </div>
            <button
              type="submit"
              className="w-full bg-[#0097b2] text-white px-4 py-2 rounded-md hover:bg-[#0097b2] focus:outline-none focus:ring-2 focus:ring-[#0097b2] transition-transform duration-300 transform hover:scale-105"
            >
              Update Disease
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditDisease;
