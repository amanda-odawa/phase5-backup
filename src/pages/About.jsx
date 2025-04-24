function About() {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">About Us</h1>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-gray-600 mb-4">
            Communicable Diseases Charity was founded with a mission to eradicate the spread of infectious diseases through education, research, and community support. Our team works tirelessly to provide resources, fund medical research, and support affected communities worldwide.
          </p>
          <p className="text-gray-600 mb-4">
            We collaborate with global health organizations, local communities, and volunteers to create sustainable solutions. Join us in our efforts to make the world a healthier place for everyone.
          </p>
          <div className="text-center mt-6">
            <a
              href="https://www.who.int"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-600"
            >
              Learn More About Global Health
            </a>
          </div>
        </div>
      </div>
    );
  }
  
  export default About;