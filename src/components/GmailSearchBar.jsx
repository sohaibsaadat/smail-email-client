import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const GmailSearchBar = ({ query, setQuery }) => {
  const [isFocused, setIsFocused] = useState(false);
  const searchContainerRef = useRef(null);
  const location = useLocation();

  const filterSuggestions = [
    { label: 'From specific sender', prefix: 'from:' },
    { label: 'To specific recipient', prefix: 'to:' },
    { label: 'Subject line contains', prefix: 'subject:' },
    { label: 'Search in body', prefix: 'body:' },
    { label: 'Has attachment', prefix: 'has:attachment' },
  ];

  // Dynamic placeholder based on active route path
  const getPlaceholder = () => {
    const path = location.pathname.toLowerCase();
    if (path.includes('/inbox')) return 'Search in Inbox';
    if (path.includes('/sent')) return 'Search in Sent';
    if (path.includes('/draft')) return 'Search in Drafts';
    if (path.includes('/starred')) return 'Search in Starred';
    if (path.includes('/trash')) return 'Search in Trash';
    if (path.includes('/all-mail')) return 'Search in All Mail';
    return 'Search mail';
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clear query automatically when route changes
  useEffect(() => {
    setQuery('');
    setIsFocused(false);
  }, [location.pathname, setQuery]);

  const handleSuggestionClick = (prefix) => {
    const newQuery = query ? `${query} ${prefix}` : prefix;
    setQuery(newQuery);
    setIsFocused(true);
  };

  return (
    <div
      ref={searchContainerRef}
      className={`relative w-full max-w-2xl transition-all duration-200 z-50 ${
        isFocused
          ? 'fixed inset-0 sm:relative sm:inset-auto bg-white sm:bg-transparent p-2 sm:p-0'
          : ''
      }`}
    >
      {/* Search Input Container */}
      <div
        className={`min-h-12 w-full flex items-center px-2 shadow-xs transition-all duration-200 ${
          isFocused
            ? 'bg-white shadow-md rounded-lg border border-gray-200'
            : 'bg-gray-200 hover:bg-gray-300/80 rounded-full'
        }`}
      >
        {isFocused ? (
          <button
            type="button"
            onClick={() => setIsFocused(false)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full focus:outline-none"
            aria-label="Back"
          >
            <ArrowBackIcon sx={{ fontSize: 24 }} />
          </button>
        ) : (
          <SearchIcon
            sx={{ fontSize: 40 }}
            className="text-gray-500 rounded-full p-2 cursor-pointer"
          />
        )}

        {/* Input */}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={getPlaceholder()}
          className="w-full h-12 bg-transparent text-gray-800 px-2 text-base focus:outline-none font-normal placeholder-gray-600"
          type="text"
        />

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="p-1 text-gray-500 hover:bg-gray-200 rounded-full focus:outline-none mr-1"
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isFocused && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white sm:rounded-xl shadow-lg border border-gray-100 py-2 overflow-hidden z-50">
          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Search Filters
          </div>
          <ul className="divide-y divide-gray-100">
            {filterSuggestions.map((item) => (
              <li key={item.prefix}>
                <button
                  type="button"
                  onClick={() => handleSuggestionClick(item.prefix)}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-100 flex items-center justify-between text-sm text-gray-700 group transition-colors"
                >
                  <span className="font-medium text-gray-800">
                    {item.label}
                  </span>
                  <span className="text-xs font-mono bg-gray-100 group-hover:bg-gray-200 text-gray-600 px-2 py-0.5 rounded border border-gray-200">
                    {item.prefix}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GmailSearchBar;