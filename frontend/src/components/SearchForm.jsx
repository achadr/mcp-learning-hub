import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useAutocomplete } from '../hooks/useAutocomplete';
import api from '../services/api';
import { AUTOCOMPLETE, MESSAGES } from '../constants';

export const SearchForm = ({ onSearch, loading }) => {
  const [artist, setArtist] = useState('');
  const [country, setCountry] = useState('');
  const [artistFocused, setArtistFocused] = useState(false);
  const [countryFocused, setCountryFocused] = useState(false);

  // Autocomplete for artists
  const {
    suggestions: artistSuggestions,
    loading: loadingArtistSuggestions
  } = useAutocomplete(
    artist,
    api.getArtistSuggestions,
    AUTOCOMPLETE.MIN_ARTIST_LENGTH,
    AUTOCOMPLETE.DEBOUNCE_DELAY
  );

  // Autocomplete for countries
  const {
    suggestions: countrySuggestions,
    loading: loadingCountrySuggestions
  } = useAutocomplete(
    country,
    api.getCountrySuggestions,
    AUTOCOMPLETE.MIN_COUNTRY_LENGTH,
    AUTOCOMPLETE.DEBOUNCE_DELAY
  );

  const handleSearch = () => {
    if (artist.trim()) {
      onSearch(artist, country);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleArtistSelect = (selectedArtist) => {
    setArtist(selectedArtist);
    setArtistFocused(false);
  };

  const handleCountrySelect = (selectedCountry) => {
    setCountry(selectedCountry);
    setCountryFocused(false);
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {/* Artist Input with Autocomplete */}
      <div className="relative flex-1 min-w-[200px]">
        <Input
          type="text"
          placeholder="Artist name (e.g., Coldplay, Taylor Swift)..."
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => setArtistFocused(true)}
          onBlur={() => setTimeout(() => setArtistFocused(false), 200)}
          className="w-full bg-white/10 backdrop-blur-lg border-white/20 text-white placeholder:text-white/50"
          disabled={loading}
        />
        {/* Artist Autocomplete Suggestions */}
        {artistFocused && (loadingArtistSuggestions || artistSuggestions.length > 0) && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg overflow-hidden z-[9999]">
            {loadingArtistSuggestions ? (
              <div className="px-4 py-3 text-white/60 text-sm">
                {MESSAGES.ARTIST_SEARCHING}
              </div>
            ) : artistSuggestions.length > 0 ? (
              artistSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleArtistSelect(suggestion)}
                  className="w-full text-left px-4 py-2 text-white hover:bg-white/20 transition-colors"
                >
                  {suggestion}
                </button>
              ))
            ) : artist.length >= AUTOCOMPLETE.MIN_ARTIST_LENGTH && (
              <div className="px-4 py-3 text-white/60 text-sm">
                {MESSAGES.NO_ARTISTS_FOUND}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Country Input with Autocomplete */}
      <div className="relative w-64">
        <Input
          type="text"
          placeholder="Country (optional, e.g., US, Brazil)"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => setCountryFocused(true)}
          onBlur={() => setTimeout(() => setCountryFocused(false), 200)}
          className="w-full bg-white/10 backdrop-blur-lg border-white/20 text-white placeholder:text-white/50"
          disabled={loading}
        />
        {/* Country Autocomplete Suggestions */}
        {countryFocused && (loadingCountrySuggestions || countrySuggestions.length > 0) && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg overflow-hidden z-[9999]">
            {loadingCountrySuggestions ? (
              <div className="px-4 py-3 text-white/60 text-sm">
                {MESSAGES.COUNTRY_SEARCHING}
              </div>
            ) : countrySuggestions.length > 0 ? (
              countrySuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleCountrySelect(suggestion)}
                  className="w-full text-left px-4 py-2 text-white hover:bg-white/20 transition-colors"
                >
                  {suggestion}
                </button>
              ))
            ) : country.length >= AUTOCOMPLETE.MIN_COUNTRY_LENGTH && (
              <div className="px-4 py-3 text-white/60 text-sm">
                {MESSAGES.NO_COUNTRIES_FOUND}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Search Button */}
      <Button
        onClick={handleSearch}
        disabled={loading || !artist.trim()}
        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
      >
        <Search className="w-4 h-4 mr-2" />
        {loading ? 'Searching...' : 'Search'}
      </Button>
    </div>
  );
};

export default SearchForm;
