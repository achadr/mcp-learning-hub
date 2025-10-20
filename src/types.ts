/**
 * Shared types for musician performance lookup
 */

export interface PerformanceEvent {
  date: string;
  venue: string;
  city: string;
  country: string;
  source: string;
  sourceUrl: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface PerformanceResult {
  artist: string;
  location: string;
  performed: boolean;
  events: PerformanceEvent[];
  sources: SourceLink[];
  message?: string;
  artistImage?: string;
}

export interface SourceLink {
  title: string;
  url: string;
  type: 'official' | 'news' | 'musicdb' | 'social' | 'other';
  publishedDate?: string;
  snippet?: string;
}

export interface SearchParams {
  artist: string;
  country?: string;
  city?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  source: string;
}
