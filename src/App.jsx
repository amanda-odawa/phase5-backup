import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Diseases from './pages/Diseases';
import Areas from './pages/Areas';
import DiseaseDetails from './pages/DiseaseDetails';
import AreaDetails from './pages/AreaDetails';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MapAnalysis from './pages/MapAnalysis';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import ManageUsers from './pages/ManageUsers';
import ManageDiseases from './pages/ManageDiseases';
import ManageAreas from './pages/ManageAreas';
import UserProfile from './pages/UserProfile';
import DonationForm from './components/DonationForm';
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/diseases" element={<Diseases />} />
          <Route path="/diseases/:id" element={<DiseaseDetails />} />
          <Route path="/areas" element={<Areas />} />
          <Route path="/areas/:id" element={<AreaDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/map-analysis" element={<MapAnalysis />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute roleRequired="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-users"
            element={
              <ProtectedRoute roleRequired="admin">
                <ManageUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-diseases"
            element={
              <ProtectedRoute roleRequired="admin">
                <ManageDiseases />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-areas"
            element={
              <ProtectedRoute roleRequired="admin">
                <ManageAreas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route path="/donation-form" element={<DonationForm />} />
          <Route
            path="/add-disease"
            element={
              <ProtectedRoute roleRequired="admin">
                <AddDisease />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-disease/:id"
            element={
              <ProtectedRoute roleRequired="admin">
                <EditDisease />
              </ProtectedRoute>
            }
          />
          <Route path="/add-area" element={<AddArea />} />
          <Route path="/edit-area/:id" element={<EditArea />} />
          <Route path="*" element={<div className="container mx-auto px-4 py-12 text-center text-gray-600 dark:text-gray-400">404 - Page Not Found</div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;