import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchAreaById, updateArea } from '../store/areaSlice';
import { fetchDiseases } from '../store/diseaseSlice';

function EditArea() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { area, loading, error } = useSelector((state) => state.areas);
  const diseases = useSelector((state) => state.diseases.diseases || []);

  const [areaData, setAreaData] = useState({
    name: '',
    description: '',
    population: '',
    latitude: '',
    longitude: '',
    diseaseCases: {},
    total_cases: 0,
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    dispatch(fetchAreaById(id));
    dispatch(fetchDiseases());
  }, [dispatch, id]);

  useEffect(() => {
    if (area) {
      const cases = area.diseaseCases || {};
      const total = Object.values(cases).reduce((sum, val) => sum + (val || 0), 0);
      setAreaData({
        name: area.name || '',
        description: area.description || '',
        population: area.population || '',
        latitude: area.latitude || '',
        longitude: area.longitude || '',
        diseaseCases: cases,
        total_cases: total,
      });
    }
  }, [area]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;
  
    if (['population'].includes(name)) {
      parsedValue = parseInt(value, 10); 
    } else if (['latitude', 'longitude'].includes(name)) {
      parsedValue = parseFloat(value); 
    }
  
    setAreaData({ ...areaData, [name]: isNaN(parsedValue) ? '' : parsedValue });
  };
  

  const handleDiseaseCaseChange = (diseaseId, value) => {
    const updatedCases = {
      ...areaData.diseaseCases,
      [diseaseId]: Number(value),
    };
    const total_cases = Object.values(updatedCases).reduce((sum, val) => sum + (val || 0), 0);
    setAreaData({ ...areaData, diseaseCases: updatedCases, total_cases });
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
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Edit Area</h1>
        <div className="max-w-5xl mx-auto bg-white dark:bg-gray-700 shadow-lg rounded-lg p-10">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div className="md:col-span-2">
              <label className="block mb-2 text-lg font-semibold">Disease Cases</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {diseases.map((disease) => (
                  <div key={disease.id}>
                    <label className="block text-sm mb-1">{disease.name}</label>
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

            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-medium">Total Cases</label>
              <input
                type="number"
                name="total_cases"
                value={areaData.total_cases}
                readOnly
                className="w-full p-2 bg-gray-200 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-[#0097b2] text-white px-4 py-2 rounded-md hover:bg-[#007d96] focus:outline-none focus:ring-2 focus:ring-[#0097b2] transition-transform duration-300 transform hover:scale-105"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditArea;
