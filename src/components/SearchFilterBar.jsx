import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function SearchFilterBar() {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const diseases = useSelector((state) => state.diseases.diseases);
  const areas = useSelector((state) => state.areas.areas);

  useEffect(() => {
    if (search.trim()) {
      const diseaseSuggestions = diseases
        .filter((disease) =>
          disease.name.toLowerCase().includes(search.toLowerCase()) ||
          disease.description.toLowerCase().includes(search.toLowerCase())
        )
        .map((disease) => ({ type: 'disease', name: disease.name, id: disease.id }));

      const areaSuggestions = areas
        .filter((area) =>
          area.name.toLowerCase().includes(search.toLowerCase()) ||
          area.description.toLowerCase().includes(search.toLowerCase())
        )
        .map((area) => ({ type: 'area', name: area.name, id: area.id }));

      setSuggestions([...diseaseSuggestions, ...areaSuggestions].slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [search, diseases, areas]);

  const handleSearch = () => {
    if (search.trim()) {
      navigate(`/diseases?search=${search}`);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearch('');
    setSuggestions([]);
    if (suggestion.type === 'disease') {
      navigate(`/diseases/${suggestion.id}`);
    } else {
      navigate(`/areas/${suggestion.id}`);
    }
  };

  return (
    <div className="bg-gray-200 py-4 relative">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search diseases or areas..."
            className="w-full max-w-md p-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleSearch}
            className="bg-primary text-white p-2 rounded-r-md hover:bg-blue-600"
          >
            Search
          </button>
          {suggestions.length > 0 && (
            <ul className="absolute top-12 w-full max-w-md bg-white border rounded-md shadow-md z-10">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {suggestion.name} ({suggestion.type === 'disease' ? 'Illness' : 'Location'})
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchFilterBar;