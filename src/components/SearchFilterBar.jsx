import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchFilterBar() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/diseases?search=${search}`);
    }
  };

  return (
    <div className="bg-gray-200 py-4">
      <div className="container mx-auto px-4">
        <form onSubmit={handleSearch} className="flex items-center justify-center">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search diseases or areas..."
            className="w-full max-w-md p-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="bg-primary text-white p-2 rounded-r-md hover:bg-blue-600"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
}

export default SearchFilterBar;