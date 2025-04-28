import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import api from '../utils/api';

function UserDashboard() {
  const user = useSelector((state) => state.auth.user);
  const [donations, setDonations] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const donationResponse = await api.get('/donations', { params: { userId: user.id } });
        const reviewResponse = await api.get('/reviews', { params: { userId: user.id } });
        setDonations(donationResponse.data);
        setReviews(reviewResponse.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchData();
  }, [user.id]);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Welcome, {user.username}!
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link
          to="/diseases"
          className="bg-primary text-white p-6 rounded-lg shadow-md text-center hover:bg-blue-600"
        >
          <h2 className="text-2xl font-bold">Explore Illnesses</h2>
          <p className="mt-2">Learn more about communicable diseases.</p>
        </Link>
        <Link
          to="/areas"
          className="bg-primary text-white p-6 rounded-lg shadow-md text-center hover:bg-blue-600"
        >
          <h2 className="text-2xl font-bold">Explore Locations</h2>
          <p className="mt-2">Discover areas affected by diseases.</p>
        </Link>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Donations</h2>
        {donations.length === 0 ? (
          <p className="text-gray-600">You haven't made any donations yet.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 text-left">Area ID</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation) => (
                <tr key={donation.id} className="border-b">
                  <td className="p-3">{donation.areaId}</td>
                  <td className="p-3">${donation.amount}</td>
                  <td className="p-3">{new Date(donation.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Suggestions</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-600">You haven't submitted any suggestions yet.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 text-left">Area ID</th>
                <th className="p-3 text-left">Suggestion</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.id} className="border-b">
                  <td className="p-3">{review.areaId}</td>
                  <td className="p-3">{review.content}</td>
                  <td className="p-3">{new Date(review.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;