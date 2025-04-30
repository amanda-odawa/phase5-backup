import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function SearchFilterBar() {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const diseases = useSelector((state) => state.diseases.diseases);
  const areas = useSelector((state) => state.areas.areas);
  const suggestionsRef = useRef(null);
  const inputRef = useRef(null);
  const debounceTimeout = useRef(null);

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (search.trim()) {
      setIsLoading(true);
      debounceTimeout.current = setTimeout(() => {
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
        setIsLoading(false);
      }, 300);
    } else {
      setSuggestions([]);
      setIsLoading(false);
    }

    return () => clearTimeout(debounceTimeout.current);
  }, [search, diseases, areas]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/diseases?search=${search}`);
      setSuggestions([]);
      inputRef.current.blur();
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

  const handleClear = () => {
    setSearch('');
    setSuggestions([]);
    inputRef.current.focus();
  };

  const handleKeyDown = (e, suggestion, index) => {
    if (e.key === 'Enter') {
      handleSuggestionClick(suggestion);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (index + 1) % suggestions.length;
      suggestionsRef.current.children[nextIndex].focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (index - 1 + suggestions.length) % suggestions.length;
      suggestionsRef.current.children[prevIndex].focus();
    } else if (e.key === 'Escape') {
      setSuggestions([]);
      inputRef.current.focus();
    }
  };

  return (
    <div className="bg-gray-200 dark:bg-gray-800 py-4 relative transition-colors duration-300">
      <div className="container mx-auto px-4">
        <form onSubmit={handleSearch} className="flex items-center justify-center relative">
          <div className="relative w-full max-w-md">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search diseases or areas..."
              className="w-full p-2 pr-10 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-300"
              aria-label="Search diseases or areas"
              autoComplete="off"
            />
            {search && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                aria-label="Clear search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            {isLoading && (
              <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                <svg className="animate-spin h-5 w-5 text-primary" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
                </svg>
              </div>
            )}
          </div>
          <button
            type="submit"
            className="bg-primary text-white p-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-300"
            aria-label="Search"
          >
            Search
          </button>
          {suggestions.length > 0 && (
            <ul
              ref={suggestionsRef}
              className="absolute top-12 w-full max-w-md bg-white dark:bg-gray-700 border rounded-md shadow-md z-50"
              role="listbox"
              aria-label="Search suggestions"
            >
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  onKeyDown={(e) => handleKeyDown(e, suggestion, index)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-600 text-gray-900 dark:text-gray-100 outline-none transition-colors duration-300"
                  role="option"
                  tabIndex="0"
                  aria-selected={false}
                >
                  {suggestion.name} ({suggestion.type === 'disease' ? 'Illness' : 'Location'})
                </li>
              ))}
            </ul>
          )}
        </form>
      </div>
    </div>
  );
}

export default SearchFilterBar;