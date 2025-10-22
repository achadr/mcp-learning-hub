import { useState, useMemo } from 'react';
import api from '../services/api';
import {
  transformEvents,
  calculateStats,
  parseDate
} from '../utils/helpers';

/**
 * Custom hook for managing performance search and data
 * @returns {Object} Hook state and methods
 */
export const usePerformances = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest-first'); // 'newest-first', 'oldest-first'
  const [showUpcoming, setShowUpcoming] = useState(true);

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
   * Filter and sort performances by sort order and upcoming filter
   * Upcoming concerts always appear first (when shown), sorted by soonest
   * Past concerts sorted by selected order
   */
  const filteredPerformances = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Step 1: Separate into upcoming and past
    const upcomingEvents = [];
    const pastEvents = [];

    performances.forEach(performance => {
      const eventDate = parseDate(performance.date);
      if (eventDate && eventDate >= today) {
        upcomingEvents.push(performance);
      } else if (eventDate) {
        pastEvents.push(performance);
      }
    });

    // Step 2: Sort upcoming (always soonest first - ascending)
    upcomingEvents.sort((a, b) => {
      const dateA = parseDate(a.date)?.getTime() || 0;
      const dateB = parseDate(b.date)?.getTime() || 0;
      return dateA - dateB;
    });

    // Step 3: Sort past based on selected order
    pastEvents.sort((a, b) => {
      const dateA = parseDate(a.date)?.getTime() || 0;
      const dateB = parseDate(b.date)?.getTime() || 0;

      if (sortOrder === 'oldest-first') {
        return dateA - dateB; // Ascending: oldest first
      } else {
        return dateB - dateA; // Descending: newest first
      }
    });

    // Step 4: Combine - upcoming first (if shown), then past
    return showUpcoming ? [...upcomingEvents, ...pastEvents] : pastEvents;
  }, [performances, sortOrder, showUpcoming]);

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
  };

  return {
    // State
    results,
    loading,
    error,
    performances,
    filteredPerformances,
    stats,
    sortOrder,
    showUpcoming,

    // Methods
    searchPerformances,
    setSortOrder,
    setShowUpcoming,
    clearResults
  };
};

export default usePerformances;
