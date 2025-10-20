# Artist Images - Provider Comparison Guide

This guide helps you test and compare different artist image providers to choose the best one for your application.

## Available Providers

### 1. **MusicBrainz + CoverArtArchive** (Currently Active)
- ✅ **FREE** - No API key required
- ✅ **No registration** needed
- ⚠️ Provides **album covers**, not artist photos
- ✅ Good coverage for popular artists
- ⚠️ Rate limited (1 request/second)

**Best for:** Quick setup, no dependencies

---

### 2. **Last.fm API**
- ✅ **FREE** tier available
- ✅ Provides **actual artist photos**
- ✅ High-quality images
- ✅ Multiple sizes (mega, extralarge, large, medium)
- ✅ Good coverage
- ⚠️ Requires API key (free, easy to get)

**Best for:** Real artist photos without complexity

**Get API Key:** https://www.last.fm/api/account/create

---

### 3. **Spotify API**
- ✅ **Best quality** images
- ✅ Actual artist photos
- ✅ Excellent coverage
- ✅ Large high-resolution images
- ⚠️ Requires Client ID + Secret (free)
- ⚠️ OAuth setup required

**Best for:** Production apps wanting highest quality

**Get Credentials:** https://developer.spotify.com/dashboard

---

### 4. **Multi (Fallback Chain)**
- Tries all providers in order: Spotify → Last.fm → MusicBrainz
- Uses best available image automatically
- Requires all API keys to be configured
- Slower (tries multiple sources)

**Best for:** Maximum coverage and quality

---

## How to Test Each Provider

### Option 1: Test via Environment Variable

Edit your `.env` file:

```env
# Choose one:
IMAGE_PROVIDER=musicbrainz
# IMAGE_PROVIDER=lastfm
# IMAGE_PROVIDER=spotify
# IMAGE_PROVIDER=multi

# Add API credentials for testing:
LASTFM_API_KEY=your_lastfm_key_here
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_secret
```

Restart your backend server and test searches.

---

### Option 2: Test All Providers at Once

Add this temporary endpoint to `src/http-server.ts` for comparison:

```typescript
import { compareAllProviders } from './services/artistImageProvider.js';

// Add inside your Express app
app.get('/api/compare-images', async (req, res) => {
  const { artist } = req.query;

  if (!artist) {
    return res.status(400).json({ error: 'Artist parameter required' });
  }

  const comparison = await compareAllProviders(artist as string);
  res.json(comparison);
});
```

Then visit: `http://localhost:3000/api/compare-images?artist=Queen`

You'll get:
```json
{
  "musicbrainz": "https://coverartarchive.org/...",
  "lastfm": "https://lastfm.freetls.fastly.net/...",
  "spotify": "https://i.scdn.co/image/..."
}
```

---

## Setup Instructions for Each Provider

### Last.fm Setup (5 minutes)

1. Go to: https://www.last.fm/api/account/create
2. Fill in:
   - **Application name:** Music Performance Tracker
   - **Application description:** Tracks musician performances
   - **Callback URL:** (leave empty)
3. Click "Submit"
4. Copy the **API Key**
5. Add to `.env`:
   ```env
   LASTFM_API_KEY=your_key_here
   IMAGE_PROVIDER=lastfm
   ```

---

### Spotify Setup (10 minutes)

1. Go to: https://developer.spotify.com/dashboard
2. Log in with Spotify account (or create one)
3. Click **"Create app"**
4. Fill in:
   - **App name:** Music Performance Tracker
   - **App description:** Tracks musician performances
   - **Redirect URI:** http://localhost:3000
   - **Which API/SDKs are you planning to use?** Web API
   - Accept terms
5. Click "Settings"
6. Copy **Client ID** and **Client Secret**
7. Add to `.env`:
   ```env
   SPOTIFY_CLIENT_ID=your_client_id
   SPOTIFY_CLIENT_SECRET=your_client_secret
   IMAGE_PROVIDER=spotify
   ```

---

## Visual Comparison

Test with these popular artists to see differences:

```bash
# Test commands (after starting backend)
curl "http://localhost:3000/api/performances?artist=Queen&country=US"
curl "http://localhost:3000/api/performances?artist=Coldplay&country=US"
curl "http://localhost:3000/api/performances?artist=Taylor%20Swift&country=US"
```

Look at the `artistImage` field in the response.

---

## Expected Results

| Artist | MusicBrainz | Last.fm | Spotify |
|--------|-------------|---------|---------|
| Queen | Album cover (e.g., "A Night at the Opera") | Band photo | Band photo (high-res) |
| Coldplay | Album cover (e.g., "Parachutes") | Band photo | Band photo (high-res) |
| Taylor Swift | Album cover (latest release) | Artist photo | Artist photo (high-res) |

---

## Recommendation

**For quick testing:**
- Use **MusicBrainz** (current, no setup needed)

**For better results:**
- Use **Last.fm** (5-min setup, actual artist photos)

**For production:**
- Use **Spotify** (best quality) or **Multi** (best coverage)

---

## Making Your Choice

After testing, update `.env` with your preferred provider:

```env
# Keep current (album covers)
IMAGE_PROVIDER=musicbrainz

# Or switch to one of these:
# IMAGE_PROVIDER=lastfm
# IMAGE_PROVIDER=spotify
# IMAGE_PROVIDER=multi
```

No code changes needed - just restart the backend!

---

## Troubleshooting

### Images not showing?
1. Check backend logs for `[ImageProvider]` messages
2. Verify API keys in `.env` if using Last.fm/Spotify
3. Ensure environment variables are loaded (`npm run dev`)

### "API key not configured" errors?
- Last.fm: Set `LASTFM_API_KEY` in `.env`
- Spotify: Set both `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` in `.env`

### Still seeing album covers?
- Make sure you restarted the backend after changing `.env`
- Check that `IMAGE_PROVIDER` is set correctly

---

## Current Implementation

Your application is currently using: **MusicBrainz + CoverArtArchive**

To see it in action:
1. Start backend: `npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Search for any artist
4. Look at the performance cards - they all use the same image per artist

Ready to compare! 🎨
