import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateDisease, fetchDiseaseById } from '../store/diseaseSlice';
import { toast } from 'react-toastify';

const EditDisease = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { diseases } = useSelector((state) => state.diseases);
  const { areas } = useSelector((state) => state.areas);

  const disease = diseases.find((d) => d.id === Number(id));

  const [form, setForm] = useState({
    name: '',
    category: '',
    prevalence: '',
    about: '',
    symptoms: '',
    prevention: '',
    treatment: '',
    riskFactors: '',
    regions: [],
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
        riskFactors: disease.riskFactors || '',
        regions: disease.regions || [],
        image: disease.image || '',
      });
    }
  }, [disease]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (e) => {
    const selected = Array.from(e.target.selectedOptions, (option) => option.value);
    setForm((prev) => ({ ...prev, regions: selected }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateDisease({ id, updatedDisease: form })).unwrap();
      toast.success('Disease updated successfully!');
      navigate('/admin-dashboard'); // Navigate to the admin dashboard after successful update
    } catch (err) {
      toast.error('Failed to update disease');
    }
  };

  if (!disease) {
    return <p className="text-center mt-10 text-gray-600">Disease not found.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-2xl font-bold mb-6">Edit Disease</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['name', 'about', 'symptoms', 'prevention', 'treatment', 'riskFactors'].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={form[field]}
            onChange={handleChange}
            className="w-full p-3 border rounded-md"
            required
          />
        ))}
        <select name="category" value={form.category} onChange={handleChange} className="w-full p-3 border rounded-md">
          <option value="">Select Category</option>
          <option value="bacterial">Bacterial</option>
          <option value="viral">Viral</option>
          <option value="vector-borne">Vector-borne</option>
          <option value="water-borne">Water-borne</option>
          <option value="air-borne">Air-borne</option>
        </select>
        <select name="prevalence" value={form.prevalence} onChange={handleChange} className="w-full p-3 border rounded-md">
          <option value="">Select Prevalence</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select
          multiple
          name="regions"
          value={form.regions}
          onChange={handleMultiSelect}
          className="w-full p-3 border rounded-md h-40"
        >
          {areas.map((area) => (
            <option key={area.id} value={area.name}>{area.name}</option>
          ))}
        </select>
        <div>
          <label className="block text-sm font-medium text-gray-700">Disease Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-3 border rounded-md"
          />
          {form.image && <img src={form.image} alt="Disease" className="mt-4 w-32 h-32 object-cover" />}
        </div>
        <button type="submit" className="bg-cyan-600 text-white py-2 px-4 rounded hover:bg-cyan-700">Update Disease</button>
      </form>
    </div>
  );
};

export default EditDisease;
