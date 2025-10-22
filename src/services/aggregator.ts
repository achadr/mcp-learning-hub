/**
 * Aggregates results from multiple services
 */

import { searchSetlistFm } from './setlistfm.js';
import { searchSongkick } from './songkick.js';
import { searchTicketmaster } from './ticketmaster.js';
import { searchWikipedia } from './wikipedia.js';
import { searchNews } from './news.js';
import { searchMusicBrainz } from './musicbrainz.js';
import { getArtistImage } from './artistImageProvider.js';
import { config } from '../config.js';
import type { PerformanceEvent, PerformanceResult, SearchParams, SourceLink } from '../types.js';
import { InMemoryCache, generateCacheKey } from '../utils/cache.js';

// Create cache instance with 1 hour TTL
const performanceCache = new InMemoryCache<PerformanceResult>(60 * 60 * 1000);

// Start automatic cleanup every 5 minutes
performanceCache.startAutoCleanup();

// Country name to ISO code mapping
const COUNTRY_TO_ISO: Record<string, string> = {
  'united states': 'US',
  'usa': 'US',
  'america': 'US',
  'united kingdom': 'GB',
  'uk': 'GB',
  'england': 'GB',
  'britain': 'GB',
  'france': 'FR',
  'germany': 'DE',
  'spain': 'ES',
  'italy': 'IT',
  'canada': 'CA',
  'australia': 'AU',
  'japan': 'JP',
  'brazil': 'BR',
  'mexico': 'MX',
  'argentina': 'AR',
  'china': 'CN',
  'india': 'IN',
  'russia': 'RU',
  'south korea': 'KR',
  'netherlands': 'NL',
  'belgium': 'BE',
  'switzerland': 'CH',
  'austria': 'AT',
  'sweden': 'SE',
  'norway': 'NO',
  'denmark': 'DK',
  'finland': 'FI',
  'poland': 'PL',
  'portugal': 'PT',
  'greece': 'GR',
  'ireland': 'IE',
  'czech republic': 'CZ',
  'hungary': 'HU',
  'israel': 'IL',
  'turkey': 'TR',
  'egypt': 'EG',
  'south africa': 'ZA',
  'new zealand': 'NZ',
  'singapore': 'SG',
  'thailand': 'TH',
  'malaysia': 'MY',
  'indonesia': 'ID',
  'philippines': 'PH',
  'hong kong': 'HK',
  'taiwan': 'TW',
  'chile': 'CL',
  'colombia': 'CO',
  'peru': 'PE',
  'united arab emirates': 'AE',
  'uae': 'AE',
  'saudi arabia': 'SA',
};

export async function aggregatePerformanceData(
  params: SearchParams
): Promise<PerformanceResult> {
  // Generate cache key and check cache first
  const cacheKey = generateCacheKey(params.artist, params.country);
  const cachedResult = performanceCache.get(cacheKey);

  if (cachedResult) {
    console.log(`[Aggregator] 🎯 Returning cached result for: ${params.artist}`);
    return { ...cachedResult, cached: true };
  }

  console.log(`[Aggregator] 🔍 Cache miss, fetching fresh data for: ${params.artist}`);

  // Normalize country name to ISO code for better API compatibility
  const originalCountry = params.country;
  let normalizedCountry = params.country;

  if (params.country) {
    const countryLower = params.country.toLowerCase();
    // If we have a mapping, use the ISO code
    if (COUNTRY_TO_ISO[countryLower]) {
      normalizedCountry = COUNTRY_TO_ISO[countryLower];
      console.log(`[Aggregator] Normalized country: ${params.country} -> ${normalizedCountry}`);
    } else if (params.country.length === 2) {
      // Already an ISO code, use uppercase
      normalizedCountry = params.country.toUpperCase();
    }
  }

  console.log(`[Aggregator] Searching for: ${params.artist} in ${normalizedCountry || 'all locations'}`);

  // Create normalized params for API calls
  const normalizedParams: SearchParams = {
    artist: params.artist,
    country: normalizedCountry,
  };

  // Call all services in parallel (including artist image)
  const [setlistfmResult, songkickResult, ticketmasterResult, musicbrainzResult, wikipediaResult, newsResult, artistImage] = await Promise.all([
    searchSetlistFm(normalizedParams),
    searchSongkick(normalizedParams),
    searchTicketmaster(normalizedParams),
    searchMusicBrainz(normalizedParams),
    searchWikipedia(params), // Use original for Wikipedia (better for search)
    searchNews(params), // Use original for News (better for search)
    getArtistImage(params.artist, config.images.provider), // Fetch artist image with configured provider
  ]);

  // Combine events from music databases
  const allEvents: PerformanceEvent[] = [];
  const serviceStats: Record<string, number> = {};

  if (setlistfmResult.success && setlistfmResult.data) {
    const count = setlistfmResult.data.length;
    allEvents.push(...setlistfmResult.data);
    serviceStats['Setlist.fm'] = count;
    console.log(`[Aggregator] ✅ Setlist.fm: ${count} events`);
  } else {
    console.log(`[Aggregator] ❌ Setlist.fm failed: ${setlistfmResult.error}`);
    serviceStats['Setlist.fm'] = 0;
  }

  if (songkickResult.success && songkickResult.data) {
    const count = songkickResult.data.length;
    allEvents.push(...songkickResult.data);
    serviceStats['Songkick'] = count;
    console.log(`[Aggregator] ✅ Songkick: ${count} events`);
  } else {
    console.log(`[Aggregator] ❌ Songkick failed: ${songkickResult.error}`);
    serviceStats['Songkick'] = 0;
  }

  if (ticketmasterResult.success && ticketmasterResult.data) {
    const count = ticketmasterResult.data.length;
    allEvents.push(...ticketmasterResult.data);
    serviceStats['Ticketmaster'] = count;
    console.log(`[Aggregator] ✅ Ticketmaster: ${count} events`);
  } else {
    console.log(`[Aggregator] ❌ Ticketmaster failed: ${ticketmasterResult.error}`);
    serviceStats['Ticketmaster'] = 0;
  }

  if (musicbrainzResult.success && musicbrainzResult.data) {
    const count = musicbrainzResult.data.length;
    allEvents.push(...musicbrainzResult.data);
    serviceStats['MusicBrainz'] = count;
    console.log(`[Aggregator] ✅ MusicBrainz: ${count} events`);
  } else {
    console.log(`[Aggregator] ❌ MusicBrainz failed: ${musicbrainzResult.error}`);
    serviceStats['MusicBrainz'] = 0;
  }

  // Combine source links from Wikipedia and News
  const allSources: SourceLink[] = [];

  if (wikipediaResult.success && wikipediaResult.data) {
    allSources.push(...wikipediaResult.data);
  }

  if (newsResult.success && newsResult.data) {
    allSources.push(...newsResult.data);
  }

  // Deduplicate events (by date, venue, and city)
  const uniqueEvents = deduplicateEvents(allEvents);

  console.log(`[Aggregator] 📊 Total: ${allEvents.length} events, ${uniqueEvents.length} unique after deduplication`);
  console.log(`[Aggregator] 📊 Breakdown:`, serviceStats);

  // Sort events by date (most recent first)
  uniqueEvents.sort((a, b) => {
    if (a.date === 'Date unknown') return 1;
    if (b.date === 'Date unknown') return -1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Determine if artist performed in the location
  const performed = uniqueEvents.length > 0;

  // Calculate total available from APIs (sum of all API totals)
  let totalAvailable: number | undefined;
  const apiTotals: number[] = [];

  if (setlistfmResult.totalAvailable) apiTotals.push(setlistfmResult.totalAvailable);
  if (songkickResult.totalAvailable) apiTotals.push(songkickResult.totalAvailable);
  if (ticketmasterResult.totalAvailable) apiTotals.push(ticketmasterResult.totalAvailable);
  if (musicbrainzResult.totalAvailable) apiTotals.push(musicbrainzResult.totalAvailable);

  // Use the highest total as best estimate (APIs may overlap)
  if (apiTotals.length > 0) {
    totalAvailable = Math.max(...apiTotals);
    console.log(`[Aggregator] 📊 Total available (max across APIs): ${totalAvailable}`);
  }

  // Build result message
  let message: string | undefined;
  if (!performed) {
    const errors: string[] = [];
    if (!setlistfmResult.success) errors.push(`Setlist.fm: ${setlistfmResult.error}`);
    if (!songkickResult.success) errors.push(`Songkick: ${songkickResult.error}`);
    if (!ticketmasterResult.success) errors.push(`Ticketmaster: ${ticketmasterResult.error}`);
    if (!musicbrainzResult.success) errors.push(`MusicBrainz: ${musicbrainzResult.error}`);

    if (errors.length > 0) {
      message = `No performances found. Some services had errors: ${errors.join('; ')}`;
    } else {
      message = `No performance records found for ${params.artist}${params.country ? ` in ${params.country}` : ''}.`;
    }
  }

  // Build result object
  const result: PerformanceResult = {
    artist: params.artist,
    location: originalCountry || 'worldwide',
    performed,
    events: uniqueEvents,
    sources: allSources.slice(0, 10), // Limit to top 10 sources
    message,
    artistImage: artistImage || undefined,
    totalAvailable,
    cached: false,
  };

  // Store in cache before returning
  performanceCache.set(cacheKey, result);

  return result;
}

/**
 * Remove duplicate events based on date, venue, and city
 */
function deduplicateEvents(events: PerformanceEvent[]): PerformanceEvent[] {
  const seen = new Set<string>();
  const unique: PerformanceEvent[] = [];

  for (const event of events) {
    const key = `${event.date}-${event.venue}-${event.city}`.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(event);
    }
  }

  return unique;
}

/**
 * Get performance summary for a quick lookup
 */
export async function getPerformanceSummary(
  artist: string,
  country?: string
): Promise<string> {
  const result = await aggregatePerformanceData({ artist, country });

  if (!result.performed) {
    return result.message || 'No performances found.';
  }

  const eventCount = result.events.length;
  const firstEvent = result.events[0];

  return `Yes, ${artist} has performed in ${result.location}. Found ${eventCount} event(s). Most recent: ${firstEvent.venue}, ${firstEvent.city} on ${firstEvent.date}.`;
}
