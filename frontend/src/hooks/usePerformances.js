import { useState, useMemo } from 'react';
import api from '../services/api';
import { transformEvents, filterPerformances, calculateStats } from '../utils/helpers';

/**
 * Custom hook for managing performance search and data
 * @returns {Object} Hook state and methods
 */
export const usePerformances = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Transform API results to performance objects
   */
  const performances = useMemo(() => {
    if (!results || !results.performed || !results.events) return [];

    return transformEvents(
      results.events,
      results.artist,
      results.location,
      results.artistImage
    );
  }, [results]);

  /**
   * Filter performances by local search query
   */
  const filteredPerformances = useMemo(() => {
    return filterPerformances(performances, searchQuery);
  }, [performances, searchQuery]);

  /**
   * Calculate statistics for filtered performances
   */
  const stats = useMemo(() => {
    return calculateStats(filteredPerformances);
  }, [filteredPerformances]);

  /**
   * Search for performances
   * @param {string} artist - Artist name
   * @param {string} country - Optional country
   */
  const searchPerformances = async (artist, country = '') => {
    if (!artist.trim()) return;

    setLoading(true);
    setError(null);
    setResults(null);
    setSearchQuery('');

    try {
      const data = await api.getPerformances(artist, country);
      setResults(data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Failed to fetch data. Make sure the backend server is running.'
      );
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clear all search results and state
   */
  const clearResults = () => {
    setResults(null);
    setError(null);
    setSearchQuery('');
  };

  return {
    // State
    results,
    loading,
    error,
    searchQuery,
    performances,
    filteredPerformances,
    stats,

    // Methods
    searchPerformances,
    setSearchQuery,
    clearResults
  };
};

export default usePerformances;
