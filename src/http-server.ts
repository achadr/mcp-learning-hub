#!/usr/bin/env node

/**
 * HTTP/Express server for the musician performance lookup web app
 * Uses the same shared services as the MCP server
 */

import express from 'express';
import cors from 'cors';
import { aggregatePerformanceData, getPerformanceSummary } from './services/aggregator.js';
import { config, validateConfig } from './config.js';

const app = express();
const PORT = config.server.httpPort;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  const configCheck = validateConfig();

  res.json({
    status: 'ok',
    version: '2.0.0',
    services: {
      setlistfm: !!config.setlistfm.apiKey,
      songkick: !!config.songkick.apiKey,
      ticketmaster: !!config.ticketmaster.apiKey,
      newsApi: !!config.newsApi.apiKey,
      wikipedia: true, // No key required
    },
    configValid: configCheck.valid,
    missingKeys: configCheck.missing,
  });
});

/**
 * Main endpoint: Search for musician performances
 *
 * GET /api/performances?artist=<name>&country=<country>
 *
 * Example: /api/performances?artist=Coldplay&country=Brazil
 */
app.get('/api/performances', async (req, res) => {
  try {
    const artist = req.query.artist as string;
    const country = req.query.country as string | undefined;

    if (!artist) {
      return res.status(400).json({
        error: 'Missing required parameter: artist',
        usage: '/api/performances?artist=<name>&country=<country>',
      });
    }

    console.log(`[HTTP Server] Query: artist=${artist}, country=${country || 'all'}`);

    const result = await aggregatePerformanceData({
      artist,
      country,
    });

    res.json(result);
  } catch (error) {
    console.error('[HTTP Server] Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * Quick summary endpoint
 *
 * GET /api/summary?artist=<name>&country=<country>
 *
 * Returns a plain text summary
 */
app.get('/api/summary', async (req, res) => {
  try {
    const artist = req.query.artist as string;
    const country = req.query.country as string | undefined;

    if (!artist) {
      return res.status(400).json({
        error: 'Missing required parameter: artist',
      });
    }

    const summary = await getPerformanceSummary(artist, country);
    res.send(summary);
  } catch (error) {
    console.error('[HTTP Server] Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * Autocomplete endpoint - Get artist suggestions
 *
 * GET /api/autocomplete?q=<query>
 *
 * Returns a list of artist suggestions based on the query
 */
app.get('/api/autocomplete', (req, res) => {
  try {
    const query = (req.query.q as string || '').toLowerCase().trim();

    if (!query) {
      return res.json([]);
    }

    // Popular artists database for autocomplete
    const popularArtists = [
      'Coldplay', 'Taylor Swift', 'The Beatles', 'BTS', 'Ed Sheeran',
      'Beyoncé', 'Drake', 'Ariana Grande', 'The Rolling Stones', 'Queen',
      'Adele', 'Billie Eilish', 'The Weeknd', 'Radiohead', 'Metallica',
      'Pink Floyd', 'Led Zeppelin', 'Nirvana', 'AC/DC', 'U2',
      'Rihanna', 'Justin Bieber', 'Lady Gaga', 'Kanye West', 'Eminem',
      'Post Malone', 'Harry Styles', 'Dua Lipa', 'Shakira', 'Elton John',
      'David Bowie', 'Madonna', 'Michael Jackson', 'Prince', 'Bob Marley',
      'Arctic Monkeys', 'Foo Fighters', 'Green Day', 'Linkin Park', 'Muse',
      'Red Hot Chili Peppers', 'Imagine Dragons', 'Twenty One Pilots', 'The Killers', 'Maroon 5',
      'Bruno Mars', 'Katy Perry', 'Miley Cyrus', 'Selena Gomez', 'Shawn Mendes',
      'Travis Scott', 'Cardi B', 'Nicki Minaj', 'Kendrick Lamar', 'Jay-Z',
      'Fleetwood Mac', 'The Who', 'Black Sabbath', 'Iron Maiden', 'Guns N\' Roses',
      'Pearl Jam', 'Soundgarden', 'R.E.M.', 'The Smiths', 'Joy Division',
      'Depeche Mode', 'The Cure', 'Oasis', 'Blur', 'Gorillaz',
      'Daft Punk', 'Calvin Harris', 'David Guetta', 'Avicii', 'Swedish House Mafia',
      'One Direction', '5 Seconds of Summer', 'Jonas Brothers', 'NSYNC', 'Backstreet Boys',
      'Spice Girls', 'Destiny\'s Child', 'TLC', 'No Doubt', 'Paramore',
      'Evanescence', 'Bring Me The Horizon', 'My Chemical Romance', 'Fall Out Boy', 'Panic! At The Disco',
      'John Mayer', 'Jack Johnson', 'Jason Mraz', 'Train', 'OneRepublic',
      'Imagine Dragons', 'Bastille', 'Mumford & Sons', 'The Lumineers', 'Of Monsters and Men',
      'Florence + The Machine', 'Lana Del Rey', 'Lorde', 'Halsey', 'Sia',
      'Sam Smith', 'John Legend', 'Alicia Keys', 'Usher', 'Chris Brown',
      'The Chainsmokers', 'Marshmello', 'Zedd', 'Tiësto', 'Martin Garrix',
      'Bob Dylan', 'Neil Young', 'Bruce Springsteen', 'Tom Petty', 'Eagles',
      'Stevie Wonder', 'Marvin Gaye', 'Aretha Franklin', 'Ray Charles', 'James Brown',
      'Frank Sinatra', 'Elvis Presley', 'Chuck Berry', 'Little Richard', 'Buddy Holly'
    ];

    // Filter artists that match the query
    const suggestions = popularArtists
      .filter(artist => artist.toLowerCase().includes(query))
      .slice(0, 10); // Return max 10 suggestions

    res.json(suggestions);
  } catch (error) {
    console.error('[HTTP Server] Autocomplete error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * Country autocomplete endpoint - Get country suggestions
 *
 * GET /api/autocomplete/countries?q=<query>
 *
 * Returns a list of country suggestions based on the query
 */
app.get('/api/autocomplete/countries', (req, res) => {
  try {
    const query = (req.query.q as string || '').toLowerCase().trim();

    if (!query) {
      return res.json([]);
    }

    // Popular countries where concerts are frequently held
    const countries = [
      'United States',
      'United Kingdom',
      'Canada',
      'Australia',
      'Germany',
      'France',
      'Spain',
      'Italy',
      'Netherlands',
      'Belgium',
      'Switzerland',
      'Austria',
      'Sweden',
      'Norway',
      'Denmark',
      'Finland',
      'Poland',
      'Czech Republic',
      'Hungary',
      'Greece',
      'Portugal',
      'Ireland',
      'Japan',
      'South Korea',
      'China',
      'Singapore',
      'Thailand',
      'Malaysia',
      'Indonesia',
      'Philippines',
      'Taiwan',
      'Hong Kong',
      'India',
      'Brazil',
      'Argentina',
      'Chile',
      'Mexico',
      'Colombia',
      'Peru',
      'New Zealand',
      'South Africa',
      'Russia',
      'Turkey',
      'Israel',
      'United Arab Emirates',
      'Saudi Arabia',
      'Egypt',
    ];

    // Filter countries that match the query
    const suggestions = countries
      .filter(country => country.toLowerCase().includes(query))
      .slice(0, 10); // Return max 10 suggestions

    res.json(suggestions);
  } catch (error) {
    console.error('[HTTP Server] Country autocomplete error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * Root endpoint - API documentation
 */
app.get('/', (req, res) => {
  res.json({
    name: 'Musician Performance Lookup API',
    version: '2.0.0',
    description: 'Search for musician performances across multiple data sources',
    endpoints: {
      'GET /api/health': 'Check API health and configuration',
      'GET /api/performances': 'Search for performances (params: artist, country)',
      'GET /api/summary': 'Get quick text summary (params: artist, country)',
      'GET /api/autocomplete': 'Get artist suggestions (params: q)',
      'GET /api/autocomplete/countries': 'Get country suggestions (params: q)',
    },
    dataSources: ['Setlist.fm', 'MusicBrainz', 'Songkick', 'Ticketmaster', 'Wikipedia', 'News API'],
    examples: [
      '/api/performances?artist=Coldplay&country=Brazil',
      '/api/performances?artist=Taylor%20Swift&country=France',
      '/api/summary?artist=The%20Beatles&country=USA',
      '/api/autocomplete?q=cold',
      '/api/autocomplete/countries?q=uni',
    ],
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🎵 Musician Performance Lookup API`);
  console.log(`📡 Server running at: http://localhost:${PORT}`);
  console.log(`\n📚 Endpoints:`);
  console.log(`   GET /api/health`);
  console.log(`   GET /api/performances?artist=<name>&country=<country>`);
  console.log(`   GET /api/summary?artist=<name>&country=<country>`);

  const configCheck = validateConfig();
  if (!configCheck.valid) {
    console.log(`\n⚠️  Warning: Missing API keys: ${configCheck.missing.join(', ')}`);
    console.log(`   Some services may not work. Create a .env file with your API keys.`);
  } else {
    console.log(`\n✅ All API keys configured`);
  }

  console.log(`\n🚀 Ready to receive requests!\n`);
});
