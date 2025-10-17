/**
 * Setlist.fm API integration
 * Docs: https://api.setlist.fm/docs/1.0/index.html
 */

import { config } from '../config.js';
import type { PerformanceEvent, SearchParams, ServiceResponse } from '../types.js';

export async function searchSetlistFm(
  params: SearchParams
): Promise<ServiceResponse<PerformanceEvent[]>> {
  if (!config.setlistfm.apiKey) {
    return {
      success: false,
      error: 'Setlist.fm API key not configured',
      source: 'setlistfm',
    };
  }

  try {
    // Step 1: Search for artist by name
    const artistSearchUrl = `${config.setlistfm.baseUrl}/search/artists`;
    const artistParams = new URLSearchParams({
      artistName: params.artist,
      p: '1',
      sort: 'relevance',
    });

    const artistResponse = await fetch(`${artistSearchUrl}?${artistParams}`, {
      headers: {
        'Accept': 'application/json',
        'x-api-key': config.setlistfm.apiKey,
      },
    });

    if (!artistResponse.ok) {
      throw new Error(`Setlist.fm artist search error: ${artistResponse.status}`);
    }

    const artistData = await artistResponse.json();
    const artists = artistData.artist;

    if (!artists || artists.length === 0) {
      return {
        success: true,
        data: [],
        source: 'setlistfm',
      };
    }

    // Take the first matching artist
    const artist = artists[0];
    const artistMbid = artist.mbid;

    // Step 2: Get artist's setlists
    const setlistUrl = `${config.setlistfm.baseUrl}/search/setlists`;
    const setlistParams = new URLSearchParams({
      artistMbid: artistMbid,
      p: '1',
    });

    // Add country filter if specified
    if (params.country) {
      setlistParams.append('countryCode', params.country.toUpperCase());
    }

    const setlistResponse = await fetch(`${setlistUrl}?${setlistParams}`, {
      headers: {
        'Accept': 'application/json',
        'x-api-key': config.setlistfm.apiKey,
      },
    });

    if (!setlistResponse.ok) {
      throw new Error(`Setlist.fm setlist search error: ${setlistResponse.status}`);
    }

    const setlistData = await setlistResponse.json();
    const setlists = setlistData.setlist || [];

    // Transform to our format
    const performanceEvents: PerformanceEvent[] = setlists.map((setlist: any) => {
      const venue = setlist.venue;
      const city = venue?.city;

      return {
        date: setlist.eventDate || 'Date unknown',
        venue: venue?.name || 'Venue unknown',
        city: city?.name || 'City unknown',
        country: city?.country?.name || 'Country unknown',
        source: 'Setlist.fm',
        sourceUrl: setlist.url || `https://www.setlist.fm/setlist/${artist.name}/${setlist.id}.html`,
        confidence: 'high' as const,
      };
    });

    return {
      success: true,
      data: performanceEvents,
      source: 'setlistfm',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      source: 'setlistfm',
    };
  }
}
