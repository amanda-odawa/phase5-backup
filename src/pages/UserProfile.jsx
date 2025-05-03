// import { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { updateUser } from '../store/userSlice';
// import { login } from '../store/authSlice';
// import api from '../utils/api';

// function UserProfile() {
//   const user = useSelector((state) => state.auth.user);
//   const [formData, setFormData] = useState({
//     username: user.username,
//     password: user.password,
//   });
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const dispatch = useDispatch();

//   const validateForm = () => {
//     if (!formData.username.trim() || !formData.password.trim()) {
//       return 'Username and password are required.';
//     }
//     if (formData.username.length < 3 || formData.password.length < 6) {
//       return 'Username must be at least 3 characters, and password must be at least 6 characters.';
//     }
//     return '';
//   };

//   const handleSubmit = async () => {
//     const validationError = validateForm();
//     if (validationError) {
//       setError(validationError);
//       return;
//     }

//     try {
//       const response = await api.get('/users', { params: { username: formData.username } });
//       const existingUser = response.data.find((u) => u.id !== user.id);
//       if (existingUser) {
//         setError('Username already exists. Please choose another.');
//         return;
//       }

//       const updatedUser = { ...user, ...formData };
//       await dispatch(updateUser({ id: user.id, updatedUser }));
//       dispatch(login(updatedUser));
//       setSuccess('Profile updated successfully!');
//       setError('');
//     } catch (err) {
//       console.error('Profile update error:', err);
//       setError('Failed to update profile. Please try again.');
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-12">
//       <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Your Profile</h1>
//       <div className="bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto">
//         <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Profile</h2>
//         <input
//           type="text"
//           value={formData.username}
//           onChange={(e) => setFormData({ ...formData, username: e.target.value })}
//           placeholder="Username"
//           className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
//         />
//         <input
//           type="password"
//           value={formData.password}
//           onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//           placeholder="Password"
//           className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
//         />
//         {error && <p className="text-danger mb-4">{error}</p>}
//         {success && <p className="text-secondary mb-4">{success}</p>}
//         <button
//           onClick={handleSubmit}
//           className="w-full bg-primary text-white p-3 rounded-md hover:bg-blue-600"
//         >
//           Update Profile
//         </button>
//       </div>
//     </div>
//   );
// }

// export default UserProfile;