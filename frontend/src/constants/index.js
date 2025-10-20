/**
 * Application Constants
 */

// Sample search queries for demo
export const SAMPLE_QUERIES = [
  { artist: 'Coldplay', country: 'US' },
  { artist: 'Queen', country: 'France' }
];

// Autocomplete configuration
export const AUTOCOMPLETE = {
  MIN_ARTIST_LENGTH: 3,
  MIN_COUNTRY_LENGTH: 2,
  DEBOUNCE_DELAY: 300
};

// Default image for performances
export const DEFAULT_PERFORMANCE_IMAGE = 'https://images.unsplash.com/photo-1566735355837-2269c24e644e?w=1080&q=80';

// UI Messages
export const MESSAGES = {
  LOADING: 'Searching across multiple data sources...',
  NO_RESULTS: 'No performances found',
  NO_FILTER_MATCH: 'No performances match your filter',
  SEARCH_PROMPT: 'Search for your favorite artist above to see where they\'ve performed around the world',
  ARTIST_SEARCHING: 'Searching artists...',
  COUNTRY_SEARCHING: 'Searching countries...',
  NO_ARTISTS_FOUND: 'No artists found',
  NO_COUNTRIES_FOUND: 'No countries found'
};

export default {
  SAMPLE_QUERIES,
  AUTOCOMPLETE,
  DEFAULT_PERFORMANCE_IMAGE,
  MESSAGES
};
