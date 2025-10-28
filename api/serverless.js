/**
 * Vercel Serverless Function - Main API Handler
 * This wraps the Express app to work as a serverless function
 */

import express from 'express';
import cors from 'cors';
import { aggregatePerformanceData, getPerformanceSummary } from '../build/services/aggregator.js';
import { config, validateConfig } from '../build/config.js';

const app = express();

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
      wikipedia: true,
    },
    configValid: configCheck.valid,
    missingKeys: configCheck.missing,
  });
});

// Main endpoint: Search for musician performances
app.get('/api/performances', async (req, res) => {
  try {
    const artist = req.query.artist;
    const country = req.query.country;

    if (!artist) {
      return res.status(400).json({
        error: 'Missing required parameter: artist',
        usage: '/api/performances?artist=<name>&country=<country>',
      });
    }

    console.log(`[Serverless] Query: artist=${artist}, country=${country || 'all'}`);

    const result = await aggregatePerformanceData({
      artist,
      country,
    });

    res.json(result);
  } catch (error) {
    console.error('[Serverless] Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Summary endpoint
app.get('/api/summary', async (req, res) => {
  try {
    const artist = req.query.artist;
    const country = req.query.country;

    if (!artist) {
      return res.status(400).json({
        error: 'Missing required parameter: artist',
      });
    }

    const summary = await getPerformanceSummary(artist, country);
    res.send(summary);
  } catch (error) {
    console.error('[Serverless] Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Autocomplete endpoint
app.get('/api/autocomplete', (req, res) => {
  try {
    const query = (req.query.q || '').toLowerCase().trim();

    if (!query) {
      return res.json([]);
    }

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

    const suggestions = popularArtists
      .filter(artist => artist.toLowerCase().includes(query))
      .slice(0, 10);

    res.json(suggestions);
  } catch (error) {
    console.error('[Serverless] Autocomplete error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Country autocomplete endpoint
app.get('/api/autocomplete/countries', (req, res) => {
  try {
    const query = (req.query.q || '').toLowerCase().trim();

    if (!query) {
      return res.json([]);
    }

    const countries = [
      'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
      'France', 'Spain', 'Italy', 'Netherlands', 'Belgium',
      'Switzerland', 'Austria', 'Sweden', 'Norway', 'Denmark',
      'Finland', 'Poland', 'Czech Republic', 'Hungary', 'Greece',
      'Portugal', 'Ireland', 'Japan', 'South Korea', 'China',
      'Singapore', 'Thailand', 'Malaysia', 'Indonesia', 'Philippines',
      'Taiwan', 'Hong Kong', 'India', 'Brazil', 'Argentina',
      'Chile', 'Mexico', 'Colombia', 'Peru', 'New Zealand',
      'South Africa', 'Russia', 'Turkey', 'Israel', 'United Arab Emirates',
      'Saudi Arabia', 'Egypt',
    ];

    const suggestions = countries
      .filter(country => country.toLowerCase().includes(query))
      .slice(0, 10);

    res.json(suggestions);
  } catch (error) {
    console.error('[Serverless] Country autocomplete error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Export for Vercel
export default app;
