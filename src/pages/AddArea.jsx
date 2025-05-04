import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addArea } from '../store/areaSlice';

function AddArea() {
  const [areaData, setAreaData] = useState({
    name: '',
    totalCases: '',
    population: '',
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAreaData({ ...areaData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addArea(areaData));
    navigate('/areas');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-16 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Add New Area</h1>
        <div className="max-w-lg mx-auto bg-white dark:bg-gray-700 shadow-lg rounded-lg p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={areaData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Total Cases</label>
              <input
                type="text"
                name="totalCases"
                value={areaData.totalCases}
                onChange={handleInputChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Population</label>
              <input
                type="text"
                name="population"
                value={areaData.population}
                onChange={handleInputChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#0097b2] text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-[#0097b2] transition-transform duration-300 transform hover:scale-105"
            >
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddArea;