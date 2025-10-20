/**
 * Last.fm Artist Image Service
 * Fetches actual artist photos from Last.fm API
 *
 * Get your free API key at: https://www.last.fm/api/account/create
 */

const LASTFM_BASE_URL = 'https://ws.audioscrobbler.com/2.0/';
const LASTFM_API_KEY = process.env.LASTFM_API_KEY || 'YOUR_API_KEY_HERE';

// Cache to avoid repeated API calls
const imageCache = new Map<string, string | null>();

/**
 * Get artist image from Last.fm
 * @param artistName - Name of the artist
 * @returns Image URL or null if not found
 */
export async function getArtistImageLastfm(artistName: string): Promise<string | null> {
  // Check cache first
  const cacheKey = artistName.toLowerCase();
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey) || null;
  }

  try {
    console.log(`[Last.fm] Fetching image for: ${artistName}`);

    if (!LASTFM_API_KEY || LASTFM_API_KEY === 'YOUR_API_KEY_HERE') {
      console.error('[Last.fm] API key not configured. Set LASTFM_API_KEY environment variable.');
      return null;
    }

    const url = new URL(LASTFM_BASE_URL);
    url.searchParams.append('method', 'artist.getinfo');
    url.searchParams.append('artist', artistName);
    url.searchParams.append('api_key', LASTFM_API_KEY);
    url.searchParams.append('format', 'json');

    const response = await fetch(url.toString());

    if (!response.ok) {
      console.error(`[Last.fm] API error: ${response.status}`);
      imageCache.set(cacheKey, null);
      return null;
    }

    const data = await response.json();

    // Check if artist was found
    if (!data.artist) {
      console.log(`[Last.fm] No artist found for: ${artistName}`);
      imageCache.set(cacheKey, null);
      return null;
    }

    // Last.fm returns multiple image sizes: small, medium, large, extralarge, mega
    const images = data.artist.image;
    if (!images || images.length === 0) {
      console.log(`[Last.fm] No images found for: ${artistName}`);
      imageCache.set(cacheKey, null);
      return null;
    }

    // Try to get the best quality image available
    // Priority: mega > extralarge > large > medium
    let imageUrl: string | null = null;

    for (const img of images) {
      if (img.size === 'mega' && img['#text']) {
        imageUrl = img['#text'];
        break;
      }
    }

    if (!imageUrl) {
      for (const img of images) {
        if (img.size === 'extralarge' && img['#text']) {
          imageUrl = img['#text'];
          break;
        }
      }
    }

    if (!imageUrl) {
      for (const img of images) {
        if (img.size === 'large' && img['#text']) {
          imageUrl = img['#text'];
          break;
        }
      }
    }

    if (imageUrl) {
      // Check if it's Last.fm's default placeholder image (silver star)
      // Last.fm uses specific hashes for placeholder images
      const placeholderHashes = [
        '2a96cbd8b46e442fc41c2b86b821562f', // Common placeholder
        'c6f59c1e5e7240a4c0d427abd71f3dbb', // Another common placeholder
      ];

      const isPlaceholder = placeholderHashes.some(hash => imageUrl.includes(hash));

      if (isPlaceholder) {
        console.log(`[Last.fm] Skipping placeholder image for: ${artistName}`);
        imageCache.set(cacheKey, null);
        return null;
      }

      console.log(`[Last.fm] Found image: ${imageUrl}`);
      imageCache.set(cacheKey, imageUrl);
      return imageUrl;
    }

    console.log(`[Last.fm] No valid image URL found for: ${artistName}`);
    imageCache.set(cacheKey, null);
    return null;

  } catch (error) {
    console.error(`[Last.fm] Error fetching artist image:`, error);
    imageCache.set(cacheKey, null);
    return null;
  }
}

/**
 * Clear the image cache
 */
export function clearImageCacheLastfm(): void {
  imageCache.clear();
}
