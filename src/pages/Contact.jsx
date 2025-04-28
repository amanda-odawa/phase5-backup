import { useState } from 'react';

function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Simulate sending the message (since there's no backend endpoint for this)
    setSuccess('Thank you for your message! We will get back to you soon.');
    setError('');
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Contact Us</h1>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
          className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your Email"
          className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Your Message"
          className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
          rows="5"
        />
        {error && <p className="text-danger mb-4">{error}</p>}
        {success && <p className="text-secondary mb-4">{success}</p>}
        <button
          onClick={handleSubmit}
          className="w-full bg-primary text-white p-3 rounded-md hover:bg-blue-600"
        >
          Send Message
        </button>
      </div>
    </div>
  );
}

export default Contact;