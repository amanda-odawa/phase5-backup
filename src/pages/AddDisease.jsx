import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addDisease } from '../store/diseaseSlice';

function AddDisease() {
  const [diseaseData, setDiseaseData] = useState({
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

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  // Check if user is logged in and is an admin
  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDiseaseData({ ...diseaseData, [name]: value });
  };

  const handleFileChange = (e) => {
    setDiseaseData({ ...diseaseData, image: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Prepare data for the backend
    const newDisease = {
      name: diseaseData.name,
      category: diseaseData.category,
      prevalence: diseaseData.prevalence,
      about: diseaseData.about,
      symptoms: diseaseData.symptoms,
      prevention: diseaseData.prevention,
      treatment: diseaseData.treatment,
      risk_factors: diseaseData.risk_factors,
      image: diseaseData.image, 
    };
    dispatch(addDisease(newDisease));
    navigate('/admin-dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-16 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Add New Disease</h1>
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-700 shadow-lg rounded-lg p-8">
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
                required
              >
                <option value="">Select Category</option>
                <option value="Bacterial">Bacterial</option>
                <option value="Viral">Viral</option>
                <option value="Vector-borne">Vector-borne</option>
                <option value="Air-borne">Air-borne</option>
                <option value="Water-borne">Water-borne</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Prevalence</label>
              <select
                name="prevalence"
                value={diseaseData.prevalence}
                onChange={handleInputChange}
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
                value={diseaseData.about}
                onChange={handleInputChange}
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
                value={diseaseData.symptoms}
                onChange={handleInputChange}
                placeholder="Separate different symptoms with a coma (,)"
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                required
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
                required
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
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Risk factor(s)</label>
              <input
                type="text"
                name="risk_factors"
                value={diseaseData.risk_factors}
                onChange={handleInputChange}
                placeholder="Separate different risk factors with a coma (,)"
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Image</label>
              <input
                type="url"
                name="image"
                onChange={handleFileChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#0097b2] text-white px-4 py-2 rounded-md hover:bg-[#0097b2] focus:outline-none focus:ring-2 focus:ring-[#0097b2] transition-transform duration-300 transform hover:scale-105"
            >
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddDisease;