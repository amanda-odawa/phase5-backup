import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchDiseaseById, updateDisease } from '../store/diseaseSlice';

function EditDisease() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { disease, loading, error } = useSelector((state) => state.diseases);

  const [diseaseData, setDiseaseData] = useState({
    name: '',
    category: '',
    prevalence: '',
    about: '',
    symptoms: '',
    prevention: '',
    treatment: '',
    riskFactors: '',
    affectedRegions: [],
    image: null,
  });

  // Check if user is logged in and is an admin
  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

  // Fetch disease data
  useEffect(() => {
    dispatch(fetchDiseaseById(id));
  }, [dispatch, id]);

  // Populate form with fetched data
  useEffect(() => {
    if (disease) {
      setDiseaseData({
        name: disease.name || '',
        category: disease.category || '',
        prevalence: disease.prevalence || '',
        about: disease.description || '',
        symptoms: disease.symptoms || '',
        prevention: disease.prevention || '',
        treatment: disease.treatment || '',
        riskFactors: disease.riskFactors || '',
        affectedRegions: disease.affectedRegions || [],
        image: disease.image || null,
      });
    }
  }, [disease]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDiseaseData({ ...diseaseData, [name]: value });
  };

  const handleFileChange = (e) => {
    setDiseaseData({ ...diseaseData, image: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Prepare updated data for the backend
    const updatedDiseaseData = {
      name: diseaseData.name,
      category: diseaseData.category,
      prevalence: diseaseData.prevalence,
      description: diseaseData.about,
      symptoms: diseaseData.symptoms,
      prevention: diseaseData.prevention,
      treatment: diseaseData.treatment,
      riskFactors: diseaseData.riskFactors,
      affectedRegions: diseaseData.affectedRegions,
      image: diseaseData.image, // Handle file upload appropriately in the backend
    };
    dispatch(updateDisease({ id, updatedDisease: updatedDiseaseData }));
    navigate('/diseases');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
        <svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
        </svg>
      </div>
    );
  }

  if (error) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center text-danger">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-16 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Edit Disease</h1>
        <div className="max-w-lg mx-auto bg-white dark:bg-gray-700 shadow-lg rounded-lg p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={diseaseData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Category</label>
              <select
                name="category"
                value={diseaseData.category}
                onChange={handleInputChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
              >
                <option value="">Select Category</option>
                <option value="Vector-borne">Vector-borne</option>
                <option value="Bacterial">Bacterial</option>
                <option value="Viral">Viral</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Prevalence</label>
              <select
                name="prevalence"
                value={diseaseData.prevalence}
                onChange={handleInputChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
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
                value={diseaseData.about}
                onChange={handleInputChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                rows="4"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Symptom(s)</label>
              <input
                type="text"
                name="symptoms"
                value={diseaseData.symptoms}
                onChange={handleInputChange}
                placeholder="Separate different symptoms with a coma (,)"
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Prevention method(s)</label>
              <input
                type="text"
                name="prevention"
                value={diseaseData.prevention}
                onChange={handleInputChange}
                placeholder="Separate different prevention methods with a coma (,)"
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Treatment(s)</label>
              <input
                type="text"
                name="treatment"
                value={diseaseData.treatment}
                onChange={handleInputChange}
                placeholder="Separate different treatments with a coma (,)"
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Risk factor(s)</label>
              <input
                type="text"
                name="riskFactors"
                value={diseaseData.riskFactors}
                onChange={handleInputChange}
                placeholder="Separate different risk factors with a coma (,)"
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Affected Regions</label>
              <select
                name="affectedRegions"
                multiple
                value={diseaseData.affectedRegions}
                onChange={(e) =>
                  setDiseaseData({
                    ...diseaseData,
                    affectedRegions: Array.from(e.target.selectedOptions, (option) => option.value),
                  })
                }
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
              >
                <option value="Africa">Africa</option>
                <option value="Asia">Asia</option>
                <option value="Europe">Europe</option>
                <option value="Americas">Americas</option>
              </select>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">You may select multiple regions</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Image</label>
              <input
                type="file"
                name="image"
                onChange={handleFileChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
              />
              {diseaseData.image && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{diseaseData.image.name || diseaseData.image}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary transition-transform duration-300 transform hover:scale-105"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditDisease;