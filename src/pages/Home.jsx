import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DiseaseCard from '@/components/DiseaseCard';
import heroImage from '@/assets/hero.jpg';

function Home() {
  const diseases = useSelector((state) => state.diseases.diseases).slice(0, 3); // Show top 3 diseases

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative h-[80vh] bg-gray-900 text-white">
        <img src={heroImage} alt="Hero" className="w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div className="text-white">
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

      {/* Mission Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Our Mission</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            We are dedicated to raising awareness, providing support, and funding research to combat communicable diseases globally. Explore our initiatives and see how you can make a difference.
          </p>
        </div>
      </section>

      {/* Featured Diseases */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Featured Illnesses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {diseases.map((disease) => (
              <DiseaseCard key={disease.id} disease={disease} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;