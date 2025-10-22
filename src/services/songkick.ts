/**
 * Songkick API integration
 * Docs: https://www.songkick.com/developer
 */

import { config } from '../config.js';
import type { PerformanceEvent, SearchParams, ServiceResponse } from '../types.js';
import { getVenueCapacityWithFallback } from './venueCapacity.js';
import { extractCountry } from '../utils/countryMapping.js';
import { fetchPagesInParallel } from '../utils/parallelPagination.js';

export async function searchSongkick(
  params: SearchParams
): Promise<ServiceResponse<PerformanceEvent[]>> {
  if (!config.songkick.apiKey) {
    return {
      success: false,
      error: 'Songkick API key not configured',
      source: 'songkick',
    };
  }

  try {
    // Step 1: Search for artist by name
    const artistSearchUrl = `${config.songkick.baseUrl}/search/artists.json?apikey=${config.songkick.apiKey}&query=${encodeURIComponent(params.artist)}`;

    const artistResponse = await fetch(artistSearchUrl);
    if (!artistResponse.ok) {
      throw new Error(`Songkick API error: ${artistResponse.status}`);
    }

    const artistData = await artistResponse.json();
    const artists = artistData.resultsPage?.results?.artist;

    if (!artists || artists.length === 0) {
      return {
        success: true,
        data: [],
        source: 'songkick',
      };
    }

    // Take the first matching artist
    const artist = artists[0];
    const artistId = artist.id;

    // Step 2: Get artist's calendar (upcoming events) and gigography (past events)
    const allEvents: any[] = [];

    // Fetch upcoming events
    const calendarUrl = `${config.songkick.baseUrl}/artists/${artistId}/calendar.json?apikey=${config.songkick.apiKey}`;
    try {
      const calendarResponse = await fetch(calendarUrl);
      if (calendarResponse.ok) {
        const calendarData = await calendarResponse.json();
        const upcomingEvents = calendarData.resultsPage?.results?.event || [];
        allEvents.push(...upcomingEvents);
      }
    } catch (error) {
      // Continue even if calendar fails
      console.warn('Songkick calendar fetch failed:', error);
    }

    // Fetch past events (gigography) - fetch multiple pages
    // Fetch more pages when no country filter (to get global coverage)
    const pagesToFetch = params.country ? 3 : 15; // 15 pages worldwide for better analytics coverage

    // Create page fetcher function for parallel pagination
    const fetchGigographyPage = async (page: number): Promise<any[] | null> => {
      const gigographyUrl = `${config.songkick.baseUrl}/artists/${artistId}/gigography.json?apikey=${config.songkick.apiKey}&page=${page}`;

      try {
        const gigographyResponse = await fetch(gigographyUrl);
        if (gigographyResponse.ok) {
          const gigographyData = await gigographyResponse.json();
          return gigographyData.resultsPage?.results?.event || [];
        } else {
          throw new Error(`Songkick API error: ${gigographyResponse.status}`);
        }
      } catch (error) {
        // Return null to signal failure
        return null;
      }
    };

    // Fetch gigography pages in parallel (batches of 3)
    const pastEvents = await fetchPagesInParallel(fetchGigographyPage, {
      totalPages: pagesToFetch,
      batchSize: 3,
      batchDelay: 150,
      retries: 2,
      retryDelay: 200,
      serviceName: 'Songkick',
    });

    allEvents.push(...pastEvents);

    const events = allEvents;

    // Filter by country if specified
    const filteredEvents = events.filter((event: any) => {
      if (!params.country) return true;

      const location = event.location;
      const country = location?.city?.country?.displayName || '';

      return country.toLowerCase().includes(params.country.toLowerCase());
    });

    // Transform to our format
    const performanceEvents: PerformanceEvent[] = filteredEvents.map((event: any) => {
      const venueName = event.venue?.displayName || 'Venue unknown';
      const cityName = event.location?.city?.displayName || 'City unknown';

      // Try to extract country with fallback to country code
      const countryName = extractCountry(
        event.location?.city?.country?.displayName,
        event.location?.city?.country?.code
      ) || 'Country unknown';

      // Get venue capacity
      const capacity = getVenueCapacityWithFallback(venueName, cityName, countryName);

      return {
        date: event.start?.date || 'Date unknown',
        venue: venueName,
        city: cityName,
        country: countryName,
        source: 'Songkick',
        sourceUrl: event.uri || '',
        confidence: 'high' as const,
        capacity,
      };
    });

    return {
      success: true,
      data: performanceEvents,
      source: 'songkick',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      source: 'songkick',
    };
  }
}
