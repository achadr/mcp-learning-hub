/**
 * Aggregates results from multiple services
 */

import { searchSetlistFm } from './setlistfm.js';
import { searchSongkick } from './songkick.js';
import { searchTicketmaster } from './ticketmaster.js';
import { searchWikipedia } from './wikipedia.js';
import { searchNews } from './news.js';
import type { PerformanceEvent, PerformanceResult, SearchParams, SourceLink } from '../types.js';

export async function aggregatePerformanceData(
  params: SearchParams
): Promise<PerformanceResult> {
  console.log(`[Aggregator] Searching for: ${params.artist} in ${params.country || 'all locations'}`);

  // Call all services in parallel
  const [setlistfmResult, songkickResult, ticketmasterResult, wikipediaResult, newsResult] = await Promise.all([
    searchSetlistFm(params),
    searchSongkick(params),
    searchTicketmaster(params),
    searchWikipedia(params),
    searchNews(params),
  ]);

  // Combine events from music databases
  const allEvents: PerformanceEvent[] = [];

  if (setlistfmResult.success && setlistfmResult.data) {
    allEvents.push(...setlistfmResult.data);
  }

  if (songkickResult.success && songkickResult.data) {
    allEvents.push(...songkickResult.data);
  }

  if (ticketmasterResult.success && ticketmasterResult.data) {
    allEvents.push(...ticketmasterResult.data);
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

  // Sort events by date (most recent first)
  uniqueEvents.sort((a, b) => {
    if (a.date === 'Date unknown') return 1;
    if (b.date === 'Date unknown') return -1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Determine if artist performed in the location
  const performed = uniqueEvents.length > 0;

  // Build result message
  let message: string | undefined;
  if (!performed) {
    const errors: string[] = [];
    if (!setlistfmResult.success) errors.push(`Setlist.fm: ${setlistfmResult.error}`);
    if (!songkickResult.success) errors.push(`Songkick: ${songkickResult.error}`);
    if (!ticketmasterResult.success) errors.push(`Ticketmaster: ${ticketmasterResult.error}`);

    if (errors.length > 0) {
      message = `No performances found. Some services had errors: ${errors.join('; ')}`;
    } else {
      message = `No performance records found for ${params.artist}${params.country ? ` in ${params.country}` : ''}.`;
    }
  }

  return {
    artist: params.artist,
    location: params.country || 'worldwide',
    performed,
    events: uniqueEvents,
    sources: allSources.slice(0, 10), // Limit to top 10 sources
    message,
  };
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
