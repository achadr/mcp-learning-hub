/**
 * MusicBrainz API integration
 * Docs: https://musicbrainz.org/doc/MusicBrainz_API
 *
 * IMPORTANT: Rate limit is 1 request per second
 * User-Agent header is required
 */

import type { PerformanceEvent, SearchParams, ServiceResponse } from '../types.js';

const MUSICBRAINZ_BASE_URL = 'https://musicbrainz.org/ws/2';
const USER_AGENT = 'MusicPerformanceTracker/1.0.0 (https://github.com/yourproject)';

// Helper to respect rate limiting (1 request per second)
let lastRequestTime = 0;
async function rateLimitedFetch(url: string): Promise<Response> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < 1000) {
    // Wait until 1 second has passed since last request
    await new Promise(resolve => setTimeout(resolve, 1000 - timeSinceLastRequest));
  }

  lastRequestTime = Date.now();

  return fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      'Accept': 'application/json',
    },
  });
}

export async function searchMusicBrainz(
  params: SearchParams
): Promise<ServiceResponse<PerformanceEvent[]>> {
  try {
    // Step 1: Search for artist by name
    const artistQuery = encodeURIComponent(params.artist);
    const artistSearchUrl = `${MUSICBRAINZ_BASE_URL}/artist?query=artist:${artistQuery}&fmt=json&limit=1`;

    const artistResponse = await rateLimitedFetch(artistSearchUrl);

    if (!artistResponse.ok) {
      throw new Error(`MusicBrainz artist search error: ${artistResponse.status}`);
    }

    const artistData = await artistResponse.json();
    const artists = artistData.artists;

    if (!artists || artists.length === 0) {
      return {
        success: true,
        data: [],
        source: 'musicbrainz',
      };
    }

    // Take the first matching artist
    const artist = artists[0];
    const artistMbid = artist.id;

    console.log(`[MusicBrainz] Found artist: ${artist.name} (${artistMbid})`);

    // Step 2: Get events for this artist
    // Include 'place' and 'area' relations to get venue and location info
    const eventsUrl = `${MUSICBRAINZ_BASE_URL}/event?artist=${artistMbid}&fmt=json&limit=100&inc=place-rels+area-rels`;

    const eventsResponse = await rateLimitedFetch(eventsUrl);

    if (!eventsResponse.ok) {
      throw new Error(`MusicBrainz events search error: ${eventsResponse.status}`);
    }

    const eventsData = await eventsResponse.json();
    const events = eventsData.events || [];

    console.log(`[MusicBrainz] Found ${events.length} events for ${artist.name}`);

    // Filter by country if specified (expects ISO codes like "FR", "US", etc.)
    let filteredEvents = events;
    if (params.country) {
      const isoCode = params.country.toUpperCase();

      filteredEvents = events.filter((event: any, index: number) => {
        // Check if event has place relations with matching country
        const placeRelations = event.relations?.filter((rel: any) => rel.type === 'held at') || [];

        // Debug: Log first event's structure
        if (index === 0 && placeRelations.length > 0) {
          console.log(`[MusicBrainz DEBUG] Sample place data:`, JSON.stringify(placeRelations[0].place, null, 2));
        }

        for (const rel of placeRelations) {
          const place = rel.place;
          if (!place) continue;

          // Check the place's immediate area for ISO codes
          const area = place.area;

          // Check if area has matching ISO code
          if (area?.['iso-3166-1-codes']?.includes(isoCode)) {
            return true;
          }

          // If area type is a country and matches
          if (area?.type === 'Country' && area?.['iso-3166-1-codes']?.includes(isoCode)) {
            return true;
          }

          // MusicBrainz sometimes includes country ISO code directly in the place object
          if (place.country && place.country.toUpperCase() === isoCode) {
            return true;
          }

          // Fallback: check if place itself has iso codes
          if (place['iso-3166-1-codes']?.includes(isoCode)) {
            return true;
          }
        }

        return false;
      });

      console.log(`[MusicBrainz] Filtered to ${filteredEvents.length} events in ${params.country}`);
    }

    // Transform to our format
    const performanceEvents: PerformanceEvent[] = filteredEvents.map((event: any) => {
      // Extract venue and location from place relations
      const placeRelations = event.relations?.filter((rel: any) => rel.type === 'held at') || [];
      let venue = 'Venue unknown';
      let city = 'City unknown';
      let country = 'Country unknown';

      if (placeRelations.length > 0) {
        const place = placeRelations[0].place;
        venue = place?.name || 'Venue unknown';

        if (place?.area) {
          city = place.area.name || 'City unknown';

          // Try to find country from area hierarchy
          if (place.area['iso-3166-1-codes'] && place.area['iso-3166-1-codes'].length > 0) {
            // Area is a country
            country = place.area.name;
          } else {
            // Need to look up parent area for country
            // For now, use area name as city
            country = 'Country unknown';
          }
        }
      }

      // Format date
      let date = 'Date unknown';
      if (event['life-span']?.begin) {
        date = event['life-span'].begin;
      } else if (event.begin) {
        date = event.begin;
      }

      return {
        date,
        venue,
        city,
        country,
        source: 'MusicBrainz',
        sourceUrl: `https://musicbrainz.org/event/${event.id}`,
        confidence: 'high' as const,
      };
    });

    return {
      success: true,
      data: performanceEvents,
      source: 'musicbrainz',
    };
  } catch (error) {
    console.error('[MusicBrainz] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      source: 'musicbrainz',
    };
  }
}
