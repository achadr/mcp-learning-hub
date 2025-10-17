/**
 * News API integration
 * Docs: https://newsapi.org/docs
 */

import { config } from '../config.js';
import type { SearchParams, ServiceResponse, SourceLink } from '../types.js';

export async function searchNews(
  params: SearchParams
): Promise<ServiceResponse<SourceLink[]>> {
  if (!config.newsApi.apiKey) {
    return {
      success: false,
      error: 'News API key not configured',
      source: 'news',
    };
  }

  try {
    const query = `${params.artist} ${params.country || ''} concert performance`.trim();
    const url = new URL(`${config.newsApi.baseUrl}/everything`);

    url.searchParams.append('apiKey', config.newsApi.apiKey);
    url.searchParams.append('q', query);
    url.searchParams.append('sortBy', 'relevancy');
    url.searchParams.append('pageSize', '10');
    url.searchParams.append('language', 'en');

    // Optional date range
    if (params.dateFrom) {
      url.searchParams.append('from', params.dateFrom);
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`News API error: ${response.status}`);
    }

    const data = await response.json();
    const articles = data.articles || [];

    const sourceLinks: SourceLink[] = articles.map((article: any) => ({
      title: article.title,
      url: article.url,
      type: 'news' as const,
      publishedDate: article.publishedAt?.split('T')[0], // Extract date only
      snippet: article.description || undefined,
    }));

    return {
      success: true,
      data: sourceLinks,
      source: 'news',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      source: 'news',
    };
  }
}
