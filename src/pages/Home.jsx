import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchDiseases } from '../store/diseaseSlice';
import covidImage from '../assets/covid.jpeg'; 
import DiseaseCard from '../components/DiseaseCard'; 

function Home() {
  const dispatch = useDispatch();
  const { diseases, loading, error } = useSelector((state) => state.diseases);

  useEffect(() => {
    dispatch(fetchDiseases());
  }, [dispatch]);

  const featuredDiseases = diseases.slice(0, 4);

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/300x150?text=Image+Failed+to+Load';
  };

  return (
    <div className="bg-white text-gray-900">
    {/* Intro Section */}
    <section className="relative">
      {/* Text Area */}
      <div className="bg-[#0097b2] text-white">
        <div className="w-full px-8 lg:px-24 py-14">
        <div className="md:w-2/3">
          <h1 className="text-4xl md:text-4xl font-bold mb-6">
            Fighting Communicable Diseases Together
          </h1>
          <p className="text-xl mb-8">
            Join our mission to eradicate preventable diseases and improve global health outcomes through education, research, and community action. Through collaboration with healthcare providers, volunteers, and supporters like you, we're creating lasting impact in vulnerable communities around the world.
          </p>
          <div className="flex flex-wrap gap-4">
          <Link
            to="/donation"
            className=" bg-white text-[#0097b2] hover:bg-gray-100 font-medium py-3 px-6 rounded-md text-center"
          >
            Donate Now
          </Link>
          <Link
            to="/diseases"
            className="border border-white text-white hover:bg-white hover:text-[#0097b2] font-medium py-3 px-6 rounded-md text-center"
          >
            Learn More
          </Link>
          </div>
        </div>
      </div>
</div>
      {/* Image Area (always visible, but layout adjusts) */}
      <div className="hidden lg:block absolute top-0 right-0 w-1/3 h-full bg-cover bg-center">
        <img
          src={covidImage}
          alt="Virus"
          className="w-full h-full object-cover"
          onError={handleImageError}
          />
        </div>
      </section>

      {/* Featured Illnesses */}
      <section className="py-16 bg-gray-50 text-center px-4 sm:px-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-2">
          Featured Communicable Diseases
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          Learn about the most prevalent communicable diseases we're fighting and how you can help in prevention and treatment efforts.
        </p>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && featuredDiseases.length === 0 && (
          <p>No diseases found.</p>
        )}

        {!loading && !error && featuredDiseases.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredDiseases.map((disease) => (
              <DiseaseCard key={disease.id} disease={disease} />
            ))}
          </div>
        )}

        <div className="mt-12">
          <Link
            to="/diseases"
            className="text-indigo-600 font-medium hover:underline text-lg"
          >
            View All Diseases &rarr;
          </Link>
        </div>
      </section>

      {/* Footer is already included elsewhere as a reusable component */}
    </div>
  );
}

export default Home;
