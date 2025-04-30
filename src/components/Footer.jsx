function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-8 transition-colors duration-300">
      <div className="container mx-auto px-4 text-center">
        <p className="mb-4">© {currentYear} Communicable Diseases Charity. All rights reserved.</p>
        <div className="flex justify-center space-x-6">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline transition-colors duration-300"
          >
            Facebook
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline transition-colors duration-300"
          >
            Twitter
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline transition-colors duration-300"
          >
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;