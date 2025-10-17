/**
 * Wikipedia API integration
 * Docs: https://www.mediawiki.org/wiki/API:Main_page
 */

import { config } from '../config.js';
import type { SearchParams, ServiceResponse, SourceLink } from '../types.js';

export async function searchWikipedia(
  params: SearchParams
): Promise<ServiceResponse<SourceLink[]>> {
  try {
    // Search for articles about the artist's tours
    const searchQuery = `${params.artist} ${params.country || ''} tour concert`.trim();
    const url = new URL(config.wikipedia.baseUrl);

    url.searchParams.append('action', 'query');
    url.searchParams.append('list', 'search');
    url.searchParams.append('srsearch', searchQuery);
    url.searchParams.append('format', 'json');
    url.searchParams.append('srlimit', '5');
    url.searchParams.append('origin', '*'); // For CORS

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Wikipedia API error: ${response.status}`);
    }

    const data = await response.json();
    const results = data.query?.search || [];

    const sourceLinks: SourceLink[] = results.map((result: any) => ({
      title: result.title,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(result.title.replace(/ /g, '_'))}`,
      type: 'other' as const,
      snippet: result.snippet ? stripHtml(result.snippet) : undefined,
    }));

    return {
      success: true,
      data: sourceLinks,
      source: 'wikipedia',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      source: 'wikipedia',
    };
  }
}

/**
 * Strip HTML tags from Wikipedia snippets
 */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}
