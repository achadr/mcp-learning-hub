import { DEFAULT_PERFORMANCE_IMAGE } from '../constants';

/**
 * Utility helper functions
 */

/**
 * Parse date string in multiple formats (DD-MM-YYYY, YYYY-MM-DD, etc.)
 * @param {string} dateString - Date string in various formats
 * @returns {Date|null} Parsed date or null if invalid
 */
export const parseDate = (dateString) => {
  if (!dateString || dateString === 'Unknown Date' || dateString === 'Date unknown') {
    return null;
  }

  // Try DD-MM-YYYY format first (27-04-2013)
  const ddmmyyyyMatch = dateString.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (ddmmyyyyMatch) {
    const [, day, month, year] = ddmmyyyyMatch;
    return new Date(year, month - 1, day);
  }

  // Try standard ISO format (YYYY-MM-DD)
  const date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    return date;
  }

  return null;
};

/**
 * Check if an event date is in the future
 * @param {string} dateString - Date in ISO format (YYYY-MM-DD)
 * @returns {boolean} True if date is today or in the future
 */
export const isFutureEvent = (dateString) => {
  const eventDate = parseDate(dateString);
  if (!eventDate) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to compare only dates
  return eventDate >= today;
};

/**
 * Transform API event data to application performance format
 * @param {Array} events - Raw events from API
 * @param {string} artistName - Artist name
 * @param {string} countryName - Country name
 * @param {string} artistImage - Artist image URL from API
 * @returns {Array} Transformed performances
 */
export const transformEvents = (events, artistName, countryName, artistImage) => {
  if (!events || !Array.isArray(events)) return [];

  return events.map((event, index) => ({
    id: String(index),
    artistName: artistName,
    venue: event.venue || 'Unknown Venue',
    city: event.location || event.city || '',
    country: event.country || countryName || '',
    date: event.date || 'Unknown Date',
    capacity: event.capacity || 0,
    genre: event.genre || 'Music',
    imageUrl: artistImage || event.imageUrl || DEFAULT_PERFORMANCE_IMAGE,
    setlistUrl: event.setlistUrl || event.url || '',
    setlist: event.setlist || [],
  }));
};

/**
 * Calculate statistics from performances
 * @param {Array} performances - Array of performance objects
 * @returns {Object} Stats object with counts
 */
export const calculateStats = (performances) => {
  const totalPerformances = performances.length;
  const uniqueCities = new Set(performances.map(p => p.city).filter(Boolean)).size;
  const uniqueCountries = new Set(performances.map(p => p.country).filter(Boolean)).size;

  return {
    totalPerformances,
    uniqueCities: uniqueCities || 0,
    uniqueCountries: uniqueCountries || 0,
  };
};

/**
 * Filter performances by search query
 * @param {Array} performances - Array of performance objects
 * @param {string} query - Search query
 * @returns {Array} Filtered performances
 */
export const filterPerformances = (performances, query) => {
  if (!query.trim()) return performances;

  const searchQuery = query.toLowerCase();
  return performances.filter(p =>
    p.artistName.toLowerCase().includes(searchQuery) ||
    p.city.toLowerCase().includes(searchQuery) ||
    p.venue.toLowerCase().includes(searchQuery) ||
    p.country.toLowerCase().includes(searchQuery)
  );
};

/**
 * Sort performances by date (newest first)
 * @param {Array} performances - Array of performance objects
 * @returns {Array} Sorted performances
 */
export const sortByDateDesc = (performances) => {
  return [...performances].sort((a, b) => {
    const dateA = parseDate(a.date)?.getTime() || 0;
    const dateB = parseDate(b.date)?.getTime() || 0;
    return dateB - dateA;
  });
};

/**
 * Sort performances with upcoming concerts first, then past concerts
 * Upcoming concerts sorted by soonest first
 * Past concerts sorted by most recent first
 * @param {Array} performances - Array of performance objects
 * @returns {Array} Sorted performances (future first, then past)
 */
export const sortByUpcomingFirst = (performances) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Separate into future and past
  const futureEvents = [];
  const pastEvents = [];

  performances.forEach(performance => {
    const eventDate = parseDate(performance.date);
    if (eventDate && eventDate >= today) {
      futureEvents.push(performance);
    } else if (eventDate) {
      pastEvents.push(performance);
    }
  });

  // Sort future events: soonest first (ascending)
  futureEvents.sort((a, b) => {
    const dateA = parseDate(a.date)?.getTime() || 0;
    const dateB = parseDate(b.date)?.getTime() || 0;
    return dateA - dateB;
  });

  // Sort past events: newest first (descending)
  pastEvents.sort((a, b) => {
    const dateA = parseDate(a.date)?.getTime() || 0;
    const dateB = parseDate(b.date)?.getTime() || 0;
    return dateB - dateA;
  });

  // Combine: future first, then past
  return [...futureEvents, ...pastEvents];
};

/**
 * Sort performances by date (oldest first)
 * @param {Array} performances - Array of performance objects
 * @returns {Array} Sorted performances
 */
export const sortByDateAsc = (performances) => {
  return [...performances].sort((a, b) => {
    const dateA = parseDate(a.date)?.getTime() || 0;
    const dateB = parseDate(b.date)?.getTime() || 0;
    return dateA - dateB;
  });
};

/**
 * Filter out upcoming concerts
 * @param {Array} performances - Array of performance objects
 * @returns {Array} Only past performances
 */
export const filterPastOnly = (performances) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return performances.filter(p => {
    const eventDate = parseDate(p.date);
    return eventDate && eventDate < today;
  });
};
