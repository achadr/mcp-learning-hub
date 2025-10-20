/**
 * Artist Image Provider - Unified interface for different image sources
 * Easily switch between MusicBrainz, Last.fm, and Spotify
 */

import { getArtistImage as getArtistImageMusicBrainz } from './artistImage.js';
import { getArtistImageLastfm } from './artistImage.lastfm.js';
import { getArtistImageSpotify } from './artistImage.spotify.js';

export type ImageProvider = 'musicbrainz' | 'lastfm' | 'spotify' | 'multi';

// Configuration - Change this to switch providers
const DEFAULT_PROVIDER: ImageProvider = process.env.IMAGE_PROVIDER as ImageProvider || 'musicbrainz';

/**
 * Get artist image from configured provider
 * @param artistName - Name of the artist
 * @param provider - Optional override for provider
 * @returns Image URL or null if not found
 */
export async function getArtistImage(
  artistName: string,
  provider: ImageProvider = DEFAULT_PROVIDER
): Promise<string | null> {
  console.log(`[ImageProvider] Using provider: ${provider} for artist: ${artistName}`);

  switch (provider) {
    case 'musicbrainz':
      return getArtistImageMusicBrainz(artistName);

    case 'lastfm':
      return getArtistImageLastfm(artistName);

    case 'spotify':
      return getArtistImageSpotify(artistName);

    case 'multi':
      // Try multiple providers in order of preference
      return getArtistImageMulti(artistName);

    default:
      console.warn(`[ImageProvider] Unknown provider: ${provider}, falling back to MusicBrainz`);
      return getArtistImageMusicBrainz(artistName);
  }
}

/**
 * Try multiple providers in order until one returns an image
 * Order: Spotify > Last.fm > MusicBrainz
 * @param artistName - Name of the artist
 * @returns Image URL or null if not found
 */
async function getArtistImageMulti(artistName: string): Promise<string | null> {
  console.log(`[ImageProvider] Trying multiple providers for: ${artistName}`);

  // Try Spotify first (best quality)
  try {
    const spotifyImage = await getArtistImageSpotify(artistName);
    if (spotifyImage) {
      console.log(`[ImageProvider] ✓ Spotify found image`);
      return spotifyImage;
    }
  } catch (error) {
    console.log(`[ImageProvider] ✗ Spotify failed`);
  }

  // Try Last.fm second (good quality artist photos)
  try {
    const lastfmImage = await getArtistImageLastfm(artistName);
    if (lastfmImage) {
      console.log(`[ImageProvider] ✓ Last.fm found image`);
      return lastfmImage;
    }
  } catch (error) {
    console.log(`[ImageProvider] ✗ Last.fm failed`);
  }

  // Fallback to MusicBrainz (album covers)
  try {
    const musicbrainzImage = await getArtistImageMusicBrainz(artistName);
    if (musicbrainzImage) {
      console.log(`[ImageProvider] ✓ MusicBrainz found image`);
      return musicbrainzImage;
    }
  } catch (error) {
    console.log(`[ImageProvider] ✗ MusicBrainz failed`);
  }

  console.log(`[ImageProvider] No image found from any provider`);
  return null;
}

/**
 * Compare images from all providers for testing
 * @param artistName - Name of the artist
 * @returns Object with images from each provider
 */
export async function compareAllProviders(artistName: string): Promise<{
  musicbrainz: string | null;
  lastfm: string | null;
  spotify: string | null;
}> {
  console.log(`[ImageProvider] Comparing all providers for: ${artistName}`);

  const [musicbrainz, lastfm, spotify] = await Promise.allSettled([
    getArtistImageMusicBrainz(artistName),
    getArtistImageLastfm(artistName),
    getArtistImageSpotify(artistName),
  ]);

  return {
    musicbrainz: musicbrainz.status === 'fulfilled' ? musicbrainz.value : null,
    lastfm: lastfm.status === 'fulfilled' ? lastfm.value : null,
    spotify: spotify.status === 'fulfilled' ? spotify.value : null,
  };
}

export default getArtistImage;
