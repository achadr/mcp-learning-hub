/**
 * Setlist.fm API integration
 * Docs: https://api.setlist.fm/docs/1.0/index.html
 */

import { config } from '../config.js';
import type { PerformanceEvent, SearchParams, ServiceResponse } from '../types.js';
import { getVenueCapacityWithFallback } from './venueCapacity.js';
import { extractCountry } from '../utils/countryMapping.js';
import { fetchPagesInParallel } from '../utils/parallelPagination.js';

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

    // Step 2: Get artist's setlists (fetch multiple pages for more history)
    const setlistUrl = `${config.setlistfm.baseUrl}/search/setlists`;
    // Fetch more pages when no country filter (to get global coverage)
    const pagesToFetch = params.country ? 5 : 30; // 30 pages worldwide = 600 setlists for better analytics coverage

    // Variable to capture total from first page
    let totalAvailable: number | undefined;

    // Create page fetcher function for parallel pagination
    const fetchSetlistPage = async (page: number): Promise<any[] | null> => {
      const setlistParams = new URLSearchParams({
        artistMbid: artistMbid,
        p: page.toString(),
      });

      // Add country filter if specified
      if (params.country) {
        setlistParams.append('countryCode', params.country.toUpperCase());
      }

      try {
        const setlistResponse = await fetch(`${setlistUrl}?${setlistParams}`, {
          headers: {
            'Accept': 'application/json',
            'x-api-key': config.setlistfm.apiKey,
          },
        });

        if (!setlistResponse.ok) {
          // On page 1, throw error; on other pages, return null to stop
          if (page === 1) {
            throw new Error(`Setlist.fm setlist search error: ${setlistResponse.status}`);
          }
          return null;
        }

        const setlistData = await setlistResponse.json();

        // Capture total from first page
        if (page === 1 && setlistData.total !== undefined) {
          totalAvailable = setlistData.total;
          console.log(`[Setlist.fm] Total available: ${totalAvailable}`);
        }

        return setlistData.setlist || [];
      } catch (error) {
        // On page 1, throw error; on other pages, return null to stop
        if (page === 1) {
          throw error;
        }
        return null;
      }
    };

    // Fetch pages in parallel (batches of 3)
    const setlists = await fetchPagesInParallel(fetchSetlistPage, {
      totalPages: pagesToFetch,
      batchSize: 3,
      batchDelay: 150,
      retries: 2,
      retryDelay: 200,
      serviceName: 'Setlist.fm',
    });

    // Transform to our format
    const performanceEvents: PerformanceEvent[] = setlists.map((setlist: any) => {
      const venue = setlist.venue;
      const city = venue?.city;
      const venueName = venue?.name || 'Venue unknown';
      const cityName = city?.name || 'City unknown';

      // Try to extract country with fallback to country code
      const countryName = extractCountry(
        city?.country?.name,
        city?.country?.code
      ) || 'Country unknown';

      // Extract songs from setlist
      const songs: string[] = [];
      if (setlist.sets && setlist.sets.set) {
        // Setlist.fm can have multiple sets (e.g., main set, encore)
        for (const set of setlist.sets.set) {
          if (set.song && Array.isArray(set.song)) {
            for (const song of set.song) {
              if (song.name) {
                // Some songs have cover info, format as "Song Name (Cover Artist)"
                const songName = song.cover
                  ? `${song.name} (${song.cover.name} cover)`
                  : song.name;
                songs.push(songName);
              }
            }
          }
        }
      }

      // Get venue capacity
      const capacity = getVenueCapacityWithFallback(venueName, cityName, countryName);

      return {
        date: setlist.eventDate || 'Date unknown',
        venue: venueName,
        city: cityName,
        country: countryName,
        source: 'Setlist.fm',
        sourceUrl: setlist.url || `https://www.setlist.fm/setlist/${artist.name}/${setlist.id}.html`,
        confidence: 'high' as const,
        setlist: songs.length > 0 ? songs : undefined,
        capacity,
      };
    });

    return {
      success: true,
      data: performanceEvents,
      source: 'setlistfm',
      totalAvailable,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      source: 'setlistfm',
    };
  }
}
