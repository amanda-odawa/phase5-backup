import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchAreaById, updateArea } from '../store/areaSlice';

function EditArea() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { area, loading, error } = useSelector((state) => state.areas);

  const [areaData, setAreaData] = useState({
    name: '',
    totalCases: '',
    population: '',
  });

  // Check if user is logged in and is an admin
  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

  // Fetch area data
  useEffect(() => {
    dispatch(fetchAreaById(id));
  }, [dispatch, id]);

  // Populate form with fetched data
  useEffect(() => {
    if (area) {
      setAreaData({
        name: area.name || '',
        totalCases: area.totalCases || '',
        population: area.population || '',
      });
    }
  }, [area]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAreaData({ ...areaData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateArea({ id, updatedArea: areaData }));
    navigate('/admin-dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
        <svg className="animate-spin h-8 w-8 text-[#0097b2]" viewBox="0 0 24 24">
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
        <h1 className="text-4xl font-bold text-center mb-12">Edit Area</h1>
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
              className="w-full bg-[#0097b2] text-white px-4 py-2 rounded-md hover:bg-[#0097b2] focus:outline-none focus:ring-2 focus:ring-[#0097b2] transition-transform duration-300 transform hover:scale-105"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditArea;