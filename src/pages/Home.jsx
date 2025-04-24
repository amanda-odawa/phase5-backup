import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="relative">
      <div
        className="h-96 bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1585435557343-3b0929e8318f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80")' }}
      >
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">Welcome to Communicable Diseases Charity</h1>
            <p className="text-lg mb-6">Join us in the fight against communicable diseases worldwide.</p>
            <Link
              to="/diseases"
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-600"
            >
              Browse All Illnesses
            </Link>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Our Mission</h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto">
          We are dedicated to raising awareness, providing support, and funding research to combat communicable diseases globally. Explore our initiatives and see how you can make a difference.
        </p>
      </div>
    </div>
  );
}

export default Home;