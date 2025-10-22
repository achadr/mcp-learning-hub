/**
 * Ticketmaster API integration
 * Docs: https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/
 */

import { config } from '../config.js';
import type { PerformanceEvent, SearchParams, ServiceResponse } from '../types.js';
import { getVenueCapacityWithFallback } from './venueCapacity.js';
import { extractCountry } from '../utils/countryMapping.js';

export async function searchTicketmaster(
  params: SearchParams
): Promise<ServiceResponse<PerformanceEvent[]>> {
  if (!config.ticketmaster.apiKey) {
    return {
      success: false,
      error: 'Ticketmaster API key not configured',
      source: 'ticketmaster',
    };
  }

  try {
    const url = new URL(`${config.ticketmaster.baseUrl}/events.json`);
    url.searchParams.append('apikey', config.ticketmaster.apiKey);
    url.searchParams.append('keyword', params.artist);
    url.searchParams.append('classificationName', 'music');

    if (params.country) {
      // Ticketmaster uses ISO country codes (US, GB, FR, etc.)
      url.searchParams.append('countryCode', params.country.toUpperCase());
    }

    if (params.dateFrom) {
      url.searchParams.append('startDateTime', `${params.dateFrom}T00:00:00Z`);
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Ticketmaster API error: ${response.status}`);
    }

    const data = await response.json();
    const events = data._embedded?.events || [];

    const performanceEvents: PerformanceEvent[] = events.map((event: any) => {
      const venue = event._embedded?.venues?.[0];
      const date = event.dates?.start?.localDate || 'Date unknown';
      const venueName = venue?.name || 'Venue unknown';
      const cityName = venue?.city?.name || 'City unknown';

      // Try to extract country with fallback to country code
      const countryName = extractCountry(
        venue?.country?.name,
        venue?.country?.countryCode
      ) || 'Country unknown';

      // Get venue capacity
      const capacity = getVenueCapacityWithFallback(venueName, cityName, countryName);

      return {
        date,
        venue: venueName,
        city: cityName,
        country: countryName,
        source: 'Ticketmaster',
        sourceUrl: event.url || '',
        confidence: 'high' as const,
        capacity,
      };
    });

    return {
      success: true,
      data: performanceEvents,
      source: 'ticketmaster',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      source: 'ticketmaster',
    };
  }
}
