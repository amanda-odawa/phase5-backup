import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addArea } from '../store/areaSlice';
import { fetchDiseases } from '../store/diseaseSlice'; // Optional depending on your setup

function AddArea() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const diseases = useSelector((state) => state.diseases.diseases || []);

  const [areaData, setAreaData] = useState({
    name: '',
    description: '',
    population: '',
    latitude: '',
    longitude: '',
    diseaseCases: {}, // { diseaseId: cases }
    totalCases: 0, // Will be calculated dynamically
  });

  useEffect(() => {
    dispatch(fetchDiseases()); // Fetch diseases on load
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAreaData({ ...areaData, [name]: value });
  };

  const handleDiseaseCaseChange = (diseaseId, value) => {
    const updatedCases = {
      ...areaData.diseaseCases,
      [diseaseId]: Number(value),
    };
    const totalCases = Object.values(updatedCases).reduce((sum, val) => sum + (val || 0), 0);
    setAreaData({ ...areaData, diseaseCases: updatedCases, totalCases });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addArea(areaData));
    navigate('/admin-dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Add New Area</h1>
        <div className="max-w-5xl mx-auto bg-white dark:bg-gray-700 shadow-lg rounded-lg p-10">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Area name */}
            <div>
              <label className="block mb-2 text-sm font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={areaData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                required
              />
            </div>

            {/* Population */}
            <div>
              <label className="block mb-2 text-sm font-medium">Population</label>
              <input
                type="number"
                name="population"
                value={areaData.population}
                onChange={handleInputChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
              />
            </div>

            {/* Latitude */}
            <div>
              <label className="block mb-2 text-sm font-medium">Latitude</label>
              <input
                type="number"
                name="latitude"
                value={areaData.latitude}
                onChange={handleInputChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                required
              />
            </div>

            {/* Longitude */}
            <div>
              <label className="block mb-2 text-sm font-medium">Longitude</label>
              <input
                type="number"
                name="longitude"
                value={areaData.longitude}
                onChange={handleInputChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                required
              />
            </div>

            {/* Description (full width) */}
            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-medium">Description</label>
              <textarea
                name="description"
                value={areaData.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                rows={3}
              />
            </div>

            {/* Disease Inputs (full width) */}
            <div className="md:col-span-2">
              <label className="block mb-2 text-lg font-semibold">Disease Cases</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {diseases.map((disease) => (
                  <div key={disease.id}>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                      {disease.name}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={areaData.diseaseCases[disease.id] || ''}
                      onChange={(e) => handleDiseaseCaseChange(disease.id, e.target.value)}
                      className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Total Cases (read-only, full width) */}
            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-medium">Total Cases</label>
              <input
                type="number"
                name="totalCases"
                value={areaData.totalCases}
                readOnly
                className="w-full p-2 bg-gray-200 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
              />
            </div>

            {/* Submit Button (full width) */}
            <div className="md:col-span-2">
            <button
              type="submit"
                className="w-full bg-[#0097b2] text-white px-4 py-2 rounded-md hover:bg-[#007d96] focus:outline-none focus:ring-2 focus:ring-[#0097b2] transition-transform duration-300 transform hover:scale-105"
            >
                Add Area
            </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddArea;
