import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for debounced autocomplete suggestions
 *
 * @param {string} query - The search query
 * @param {Function} apiFunction - API function to call for suggestions
 * @param {number} minLength - Minimum query length to trigger search (default: 2)
 * @param {number} delay - Debounce delay in milliseconds (default: 300ms)
 * @returns {Object} - { suggestions, loading, error }
 */
export function useAutocomplete(query, apiFunction, minLength = 2, delay = 300) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    // Don't search if query is empty or too short
    if (!query || query.trim().length < minLength) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setLoading(true);
    setError(null);

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    // Debounce the API call
    const timeoutId = setTimeout(async () => {
      try {
        const data = await apiFunction(query, abortControllerRef.current.signal);
        setSuggestions(data);
        setLoading(false);
      } catch (err) {
        if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
          console.error('Autocomplete error:', err);
          setError(err.message);
          setSuggestions([]);
        }
        setLoading(false);
      }
    }, delay);

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [query, apiFunction, minLength, delay]);

  return { suggestions, loading, error };
}

export default useAutocomplete;
