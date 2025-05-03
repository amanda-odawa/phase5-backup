// import { useSelector } from 'react-redux';

// function UserDashboard() {
//   const { user } = useSelector((state) => state.auth);
//   const donations = useSelector((state) => state.donations?.donations || []);

//   // Filter donations made by the current user
//   const userDonations = donations.filter((donation) => donation.userId === user?.id);

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-16 transition-colors duration-300">
//       <div className="container mx-auto px-4">
//         <h1 className="text-4xl font-bold text-center mb-12">User Dashboard</h1>
//         <div className="bg-white dark:bg-gray-700 shadow-lg rounded-lg p-6 mb-8">
//           <h2 className="text-2xl font-semibold mb-4">Welcome, {user?.username || 'User'}!</h2>
//           <p className="text-gray-600 dark:text-gray-300 mb-2"><strong>Role:</strong> {user?.role || 'N/A'}</p>
//           <p className="text-gray-600 dark:text-gray-300">Thank you for supporting our mission to combat communicable diseases.</p>
//         </div>
//         <div className="bg-white dark:bg-gray-700 shadow-lg rounded-lg p-6">
//           <h2 className="text-2xl font-semibold mb-4">Your Donation History</h2>
//           {userDonations.length === 0 ? (
//             <p className="text-gray-600 dark:text-gray-300">You haven't made any donations yet.</p>
//           ) : (
//             <div className="space-y-4">
//               {userDonations.map((donation) => (
//                 <div
//                   key={donation.id}
//                   className="border-b border-gray-200 dark:border-gray-600 pb-4 last:border-b-0"
//                 >
//                   <p className="text-gray-600 dark:text-gray-300">
//                     <strong>Amount:</strong> ${donation.amount}
//                   </p>
//                   <p className="text-gray-600 dark:text-gray-300">
//                     <strong>Date:</strong> {new Date(donation.date).toLocaleDateString()}
//                   </p>
//                   <p className="text-gray-600 dark:text-gray-300">
//                     <strong>Message:</strong> {donation.message || 'No message provided.'}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default UserDashboard;