/**
 * Setlist.fm API integration
 * Docs: https://api.setlist.fm/docs/1.0/index.html
 */

import { config } from '../config.js';
import type { PerformanceEvent, SearchParams, ServiceResponse } from '../types.js';
import { getVenueCapacityWithFallback } from './venueCapacity.js';
import { extractCountry } from '../utils/countryMapping.js';

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
    const allSetlists: any[] = [];
    // Fetch more pages when no country filter (to get global coverage)
    const pagesToFetch = params.country ? 5 : 15; // 15 pages worldwide = 300 setlists for better coverage

    for (let page = 1; page <= pagesToFetch; page++) {
      const setlistParams = new URLSearchParams({
        artistMbid: artistMbid,
        p: page.toString(),
      });

      // Add country filter if specified
      if (params.country) {
        setlistParams.append('countryCode', params.country.toUpperCase());
      }

      // Retry logic for intermittent failures
      let retries = 2;
      let success = false;
      let pageSetlists: any[] = [];

      while (retries > 0 && !success) {
        try {
          const setlistResponse = await fetch(`${setlistUrl}?${setlistParams}`, {
            headers: {
              'Accept': 'application/json',
              'x-api-key': config.setlistfm.apiKey,
            },
          });

          if (!setlistResponse.ok) {
            // If we get an error on page > 1, just stop fetching more pages
            if (page > 1 && retries === 1) {
              console.warn(`[Setlist.fm] Page ${page} failed, stopping pagination`);
              break;
            }
            throw new Error(`Setlist.fm setlist search error: ${setlistResponse.status}`);
          }

          const setlistData = await setlistResponse.json();
          pageSetlists = setlistData.setlist || [];
          success = true;
        } catch (error) {
          retries--;
          if (retries > 0) {
            console.warn(`[Setlist.fm] Page ${page} failed, retrying... (${retries} retries left)`);
            await new Promise(resolve => setTimeout(resolve, 200)); // Wait before retry
          } else if (page > 1) {
            console.warn(`[Setlist.fm] Page ${page} failed after retries, stopping pagination`);
            break;
          } else {
            throw error; // Throw on page 1 failure
          }
        }
      }

      // If no more results, stop fetching
      if (!success || pageSetlists.length === 0) break;

      allSetlists.push(...pageSetlists);
      console.log(`[Setlist.fm] Page ${page}: ${pageSetlists.length} setlists (total: ${allSetlists.length})`);

      // Add a small delay to avoid rate limiting
      if (page < pagesToFetch) {
        await new Promise(resolve => setTimeout(resolve, 150));
      }
    }

    const setlists = allSetlists;

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
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      source: 'setlistfm',
    };
  }
}
