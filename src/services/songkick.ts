/**
 * Songkick API integration
 * Docs: https://www.songkick.com/developer
 */

import { config } from '../config.js';
import type { PerformanceEvent, SearchParams, ServiceResponse } from '../types.js';

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

    // Step 2: Get artist's calendar (upcoming and past events)
    const calendarUrl = `${config.songkick.baseUrl}/artists/${artistId}/calendar.json?apikey=${config.songkick.apiKey}`;

    const calendarResponse = await fetch(calendarUrl);
    if (!calendarResponse.ok) {
      throw new Error(`Songkick calendar API error: ${calendarResponse.status}`);
    }

    const calendarData = await calendarResponse.json();
    const events = calendarData.resultsPage?.results?.event || [];

    // Filter by country if specified
    const filteredEvents = events.filter((event: any) => {
      if (!params.country) return true;

      const location = event.location;
      const country = location?.city?.country?.displayName || '';

      return country.toLowerCase().includes(params.country.toLowerCase());
    });

    // Transform to our format
    const performanceEvents: PerformanceEvent[] = filteredEvents.map((event: any) => ({
      date: event.start?.date || 'Date unknown',
      venue: event.venue?.displayName || 'Venue unknown',
      city: event.location?.city?.displayName || 'City unknown',
      country: event.location?.city?.country?.displayName || 'Country unknown',
      source: 'Songkick',
      sourceUrl: event.uri || '',
      confidence: 'high' as const,
    }));

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
