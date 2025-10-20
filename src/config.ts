/**
 * Configuration and environment variables
 */

import dotenv from 'dotenv';

dotenv.config();

export const config = {
  setlistfm: {
    apiKey: process.env.SETLISTFM_API_KEY || '',
    baseUrl: 'https://api.setlist.fm/rest/1.0',
  },
  songkick: {
    apiKey: process.env.SONGKICK_API_KEY || '',
    baseUrl: 'https://api.songkick.com/api/3.0',
  },
  ticketmaster: {
    apiKey: process.env.TICKETMASTER_API_KEY || '',
    baseUrl: 'https://app.ticketmaster.com/discovery/v2',
  },
  newsApi: {
    apiKey: process.env.NEWS_API_KEY || '',
    baseUrl: 'https://newsapi.org/v2',
  },
  wikipedia: {
    baseUrl: 'https://en.wikipedia.org/w/api.php',
    // Wikipedia doesn't require API key
  },
  server: {
    httpPort: parseInt(process.env.PORT || '3000', 10),
  },
  images: {
    provider: (process.env.IMAGE_PROVIDER || 'musicbrainz') as 'musicbrainz' | 'lastfm' | 'spotify' | 'multi',
    lastfm: {
      apiKey: process.env.LASTFM_API_KEY || '',
    },
    spotify: {
      clientId: process.env.SPOTIFY_CLIENT_ID || '',
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET || '',
    },
  },
};

export function validateConfig(): { valid: boolean; missing: string[] } {
  const missing: string[] = [];

  if (!config.setlistfm.apiKey) missing.push('SETLISTFM_API_KEY');
  if (!config.songkick.apiKey) missing.push('SONGKICK_API_KEY (optional)');
  if (!config.ticketmaster.apiKey) missing.push('TICKETMASTER_API_KEY');
  if (!config.newsApi.apiKey) missing.push('NEWS_API_KEY');

  return {
    valid: missing.length === 0,
    missing,
  };
}
