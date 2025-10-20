/**
 * Spotify Artist Image Service
 * Fetches high-quality artist photos from Spotify API
 *
 * Get credentials at: https://developer.spotify.com/dashboard
 * Uses Client Credentials Flow (no user authentication needed)
 */

const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API_URL = 'https://api.spotify.com/v1';
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || 'YOUR_CLIENT_ID_HERE';
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || 'YOUR_CLIENT_SECRET_HERE';

// Cache for images and access token
const imageCache = new Map<string, string | null>();
let accessToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Get Spotify access token using Client Credentials flow
 */
async function getAccessToken(): Promise<string | null> {
  // Return cached token if still valid
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken;
  }

  try {
    console.log('[Spotify] Fetching access token...');

    if (!SPOTIFY_CLIENT_ID || SPOTIFY_CLIENT_ID === 'YOUR_CLIENT_ID_HERE' ||
        !SPOTIFY_CLIENT_SECRET || SPOTIFY_CLIENT_SECRET === 'YOUR_CLIENT_SECRET_HERE') {
      console.error('[Spotify] Credentials not configured. Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET environment variables.');
      return null;
    }

    const credentials = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');

    const response = await fetch(SPOTIFY_AUTH_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      console.error(`[Spotify] Auth error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    accessToken = data.access_token;
    // Token expires in 'expires_in' seconds, subtract 60s for safety
    tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;

    console.log('[Spotify] Access token obtained');
    return accessToken;

  } catch (error) {
    console.error('[Spotify] Error getting access token:', error);
    return null;
  }
}

/**
 * Get artist image from Spotify
 * @param artistName - Name of the artist
 * @returns Image URL or null if not found
 */
export async function getArtistImageSpotify(artistName: string): Promise<string | null> {
  // Check cache first
  const cacheKey = artistName.toLowerCase();
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey) || null;
  }

  try {
    console.log(`[Spotify] Fetching image for: ${artistName}`);

    // Get access token
    const token = await getAccessToken();
    if (!token) {
      return null;
    }

    // Search for artist
    const searchUrl = new URL(`${SPOTIFY_API_URL}/search`);
    searchUrl.searchParams.append('q', artistName);
    searchUrl.searchParams.append('type', 'artist');
    searchUrl.searchParams.append('limit', '1');

    const response = await fetch(searchUrl.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error(`[Spotify] API error: ${response.status}`);
      imageCache.set(cacheKey, null);
      return null;
    }

    const data = await response.json();

    // Check if artist was found
    if (!data.artists || !data.artists.items || data.artists.items.length === 0) {
      console.log(`[Spotify] No artist found for: ${artistName}`);
      imageCache.set(cacheKey, null);
      return null;
    }

    const artist = data.artists.items[0];
    const images = artist.images;

    if (!images || images.length === 0) {
      console.log(`[Spotify] No images found for: ${artistName}`);
      imageCache.set(cacheKey, null);
      return null;
    }

    // Spotify returns images sorted by size (largest first)
    // Get the largest image available
    const imageUrl = images[0].url;

    console.log(`[Spotify] Found image: ${imageUrl} (${images[0].width}x${images[0].height})`);
    imageCache.set(cacheKey, imageUrl);
    return imageUrl;

  } catch (error) {
    console.error(`[Spotify] Error fetching artist image:`, error);
    imageCache.set(cacheKey, null);
    return null;
  }
}

/**
 * Clear the image cache
 */
export function clearImageCacheSpotify(): void {
  imageCache.clear();
  accessToken = null;
  tokenExpiry = 0;
}
