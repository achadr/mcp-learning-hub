/**
 * Songkick API integration
 * Docs: https://www.songkick.com/developer
 */

import { config } from '../config.js';
import type { PerformanceEvent, SearchParams, ServiceResponse } from '../types.js';
import { getVenueCapacityWithFallback } from './venueCapacity.js';
import { extractCountry } from '../utils/countryMapping.js';

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
    const pagesToFetch = params.country ? 3 : 8; // 8 pages worldwide for better coverage
    for (let page = 1; page <= pagesToFetch; page++) {
      const gigographyUrl = `${config.songkick.baseUrl}/artists/${artistId}/gigography.json?apikey=${config.songkick.apiKey}&page=${page}`;

      // Retry logic for intermittent failures
      let retries = 2;
      let success = false;
      let pastEvents: any[] = [];

      while (retries > 0 && !success) {
        try {
          const gigographyResponse = await fetch(gigographyUrl);
          if (gigographyResponse.ok) {
            const gigographyData = await gigographyResponse.json();
            pastEvents = gigographyData.resultsPage?.results?.event || [];
            success = true;
          } else {
            throw new Error(`Songkick API error: ${gigographyResponse.status}`);
          }
        } catch (error) {
          retries--;
          if (retries > 0) {
            console.warn(`[Songkick] Page ${page} failed, retrying... (${retries} retries left)`);
            await new Promise(resolve => setTimeout(resolve, 200));
          } else {
            console.warn(`[Songkick] Page ${page} failed after retries, stopping pagination`);
            break;
          }
        }
      }

      if (!success || pastEvents.length === 0) break;

      allEvents.push(...pastEvents);
      console.log(`[Songkick] Page ${page}: ${pastEvents.length} events (total: ${allEvents.length})`);

      // Small delay to avoid rate limiting
      if (page < pagesToFetch) {
        await new Promise(resolve => setTimeout(resolve, 150));
      }
    }

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
