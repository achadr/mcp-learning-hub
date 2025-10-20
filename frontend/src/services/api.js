import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

/**
 * API Service Layer
 * Centralized API calls for the application
 */

export const api = {
  /**
   * Fetch performances for an artist
   * @param {string} artist - Artist name
   * @param {string} country - Optional country filter
   * @returns {Promise} API response
   */
  async getPerformances(artist, country = '') {
    const params = new URLSearchParams();
    params.append('artist', artist.trim());
    if (country.trim()) {
      params.append('country', country.trim());
    }

    const response = await axios.get(`${API_BASE_URL}/performances?${params}`);
    return response.data;
  },

  /**
   * Get autocomplete suggestions for artists
   * @param {string} query - Search query
   * @param {AbortSignal} signal - Abort signal for cancellation
   * @returns {Promise} Array of suggestions
   */
  async getArtistSuggestions(query, signal) {
    const response = await axios.get(`${API_BASE_URL}/autocomplete`, {
      params: { q: query.trim() },
      signal
    });
    return response.data;
  },

  /**
   * Get autocomplete suggestions for countries
   * @param {string} query - Search query
   * @param {AbortSignal} signal - Abort signal for cancellation
   * @returns {Promise} Array of suggestions
   */
  async getCountrySuggestions(query, signal) {
    const response = await axios.get(`${API_BASE_URL}/autocomplete/countries`, {
      params: { q: query.trim() },
      signal
    });
    return response.data;
  }
};

export default api;
