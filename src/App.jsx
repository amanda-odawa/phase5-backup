import { Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchDiseases } from './store/diseaseSlice';
import { fetchAreas } from './store/areaSlice';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Diseases from './pages/Diseases';
import DiseaseDetails from './pages/DiseaseDetails';
import Areas from './pages/Areas';
import AreaDetails from './pages/AreaDetails'; 
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import Donation from './pages/Donation';
import AddDisease from './pages/AddDisease';
import EditDisease from './pages/EditDisease';
import AddArea from './pages/AddArea';
import EditArea from './pages/EditArea';
import { Navigate } from 'react-router-dom';

function App() {
  const ProtectedRoute = ({ children, roleRequired }) => {
    const user = useSelector((state) => state.auth.user);
    if (!user) return <Navigate to="/login" />;
    if (roleRequired && user.role !== roleRequired) return <Navigate to="/" />;
    return children;
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchDiseases());
    dispatch(fetchAreas());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/donation" element={<Donation />} />
          <Route path="/diseases" element={<Diseases />} />
          <Route path="/diseases/:id" element={<DiseaseDetails />} />
          <Route path="/areas" element={<Areas />} />
          <Route path="/areas/:id" element={<AreaDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/admin-dashboard" element={
            <ProtectedRoute roleRequired="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/add-disease" element={
            <ProtectedRoute roleRequired="admin">
              <AddDisease />
            </ProtectedRoute>
          } />

          <Route path="/edit-disease/:id" element={
            <ProtectedRoute roleRequired="admin">
              <EditDisease />
            </ProtectedRoute>
          } />

          <Route path="/add-area" element={
            <ProtectedRoute roleRequired="admin">
              <AddArea />
            </ProtectedRoute>
          } />

          <Route path="/edit-area/:id" element={
            <ProtectedRoute roleRequired="admin">
              <EditArea />
            </ProtectedRoute>
          } />

          <Route path="*" element={<div className="container mx-auto px-4 py-12 text-center text-gray-600 dark:text-gray-400">404 - Page Not Found</div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
