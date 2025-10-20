/**
 * Artist Image Service
 * Fetches artist images from MusicBrainz + CoverArtArchive
 */

const MUSICBRAINZ_BASE_URL = 'https://musicbrainz.org/ws/2';
const COVERARTARCHIVE_BASE_URL = 'https://coverartarchive.org';
const USER_AGENT = 'MusicPerformanceTracker/1.0.0 (https://github.com/yourproject)';

// Cache to avoid repeated API calls for the same artist
const imageCache = new Map<string, string | null>();

// Rate limiting helper (1 request per second for MusicBrainz)
let lastRequestTime = 0;
async function rateLimitedFetch(url: string): Promise<Response> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < 1000) {
    await new Promise(resolve => setTimeout(resolve, 1000 - timeSinceLastRequest));
  }

  lastRequestTime = Date.now();

  return fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      'Accept': 'application/json',
    },
  });
}

/**
 * Get artist image URL from MusicBrainz + CoverArtArchive
 * @param artistName - Name of the artist
 * @returns Image URL or null if not found
 */
export async function getArtistImage(artistName: string): Promise<string | null> {
  // Check cache first
  const cacheKey = artistName.toLowerCase();
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey) || null;
  }

  try {
    console.log(`[ArtistImage] Fetching image for: ${artistName}`);

    // Step 1: Search for artist by name
    const artistQuery = encodeURIComponent(artistName);
    const artistSearchUrl = `${MUSICBRAINZ_BASE_URL}/artist?query=artist:${artistQuery}&fmt=json&limit=1`;

    const artistResponse = await rateLimitedFetch(artistSearchUrl);

    if (!artistResponse.ok) {
      console.error(`[ArtistImage] Artist search failed: ${artistResponse.status}`);
      imageCache.set(cacheKey, null);
      return null;
    }

    const artistData = await artistResponse.json();
    const artists = artistData.artists;

    if (!artists || artists.length === 0) {
      console.log(`[ArtistImage] No artist found for: ${artistName}`);
      imageCache.set(cacheKey, null);
      return null;
    }

    const artist = artists[0];
    const artistMbid = artist.id;

    console.log(`[ArtistImage] Found artist: ${artist.name} (MBID: ${artistMbid})`);

    // Step 2: Try to get artist image from CoverArtArchive
    // CoverArtArchive provides artist images through their artist endpoint
    const coverArtUrl = `${COVERARTARCHIVE_BASE_URL}/release-group/${artistMbid}/front`;

    try {
      // Check if cover art exists (don't rate limit this - different service)
      const coverArtResponse = await fetch(coverArtUrl, {
        method: 'HEAD',
        redirect: 'follow'
      });

      if (coverArtResponse.ok) {
        // Get the redirected URL which is the actual image
        const imageUrl = coverArtResponse.url;
        console.log(`[ArtistImage] Found image URL: ${imageUrl}`);
        imageCache.set(cacheKey, imageUrl);
        return imageUrl;
      }
    } catch (coverArtError) {
      console.log(`[ArtistImage] CoverArtArchive failed, trying alternative...`);
    }

    // Step 3: Try to get release group with cover art
    const releaseGroupUrl = `${MUSICBRAINZ_BASE_URL}/release-group?artist=${artistMbid}&fmt=json&limit=1&type=album`;
    const releaseGroupResponse = await rateLimitedFetch(releaseGroupUrl);

    if (releaseGroupResponse.ok) {
      const releaseGroupData = await releaseGroupResponse.json();
      const releaseGroups = releaseGroupData['release-groups'];

      if (releaseGroups && releaseGroups.length > 0) {
        const releaseGroupId = releaseGroups[0].id;
        const releaseGroupCoverUrl = `${COVERARTARCHIVE_BASE_URL}/release-group/${releaseGroupId}/front`;

        try {
          const rgCoverResponse = await fetch(releaseGroupCoverUrl, {
            method: 'HEAD',
            redirect: 'follow'
          });

          if (rgCoverResponse.ok) {
            const imageUrl = rgCoverResponse.url;
            console.log(`[ArtistImage] Found release group image: ${imageUrl}`);
            imageCache.set(cacheKey, imageUrl);
            return imageUrl;
          }
        } catch (error) {
          console.log(`[ArtistImage] Release group cover art failed`);
        }
      }
    }

    // No image found
    console.log(`[ArtistImage] No image found for: ${artistName}`);
    imageCache.set(cacheKey, null);
    return null;

  } catch (error) {
    console.error(`[ArtistImage] Error fetching artist image:`, error);
    imageCache.set(cacheKey, null);
    return null;
  }
}

/**
 * Clear the image cache (useful for testing)
 */
export function clearImageCache(): void {
  imageCache.clear();
}
