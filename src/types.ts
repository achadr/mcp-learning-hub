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
  setlist?: string[];
  capacity?: number;
}

export interface PerformanceResult {
  artist: string;
  location: string;
  performed: boolean;
  events: PerformanceEvent[];
  sources: SourceLink[];
  message?: string;
  artistImage?: string;
  /** Total available performances according to APIs (may be more than what we fetched) */
  totalAvailable?: number;
  /** Whether this result came from cache */
  cached?: boolean;
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
  /** Total count reported by the API (if available) */
  totalAvailable?: number;
}
