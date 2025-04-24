import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
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
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import ManageUsers from './pages/ManageUsers';
import ManageDiseases from './pages/ManageDiseases';
import ManageAreas from './pages/ManageAreas';
import UserProfile from './pages/UserProfile';
import Contact from './pages/Contact';
import { Navigate } from 'react-router-dom';

function App() {
  const ProtectedRoute = ({ children, roleRequired }) => {
    const user = store.getState().auth.user;
    if (!user) return <Navigate to="/login" />;
    if (roleRequired && user.role !== roleRequired) return <Navigate to="/" />;
    return children;
  };

  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-100">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/diseases" element={<Diseases />} />
              <Route path="/areas" element={<Areas />} />
              <Route path="/diseases/:id" element={<DiseaseDetails />} />
              <Route path="/areas/:id" element={<AreaDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/map-analysis" element={<MapAnalysis />} />
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
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;