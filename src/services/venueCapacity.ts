/**
 * Venue capacity database
 * Contains capacities for major concert venues worldwide
 */

interface VenueInfo {
  name: string;
  capacity: number;
  city: string;
  country: string;
}

// Database of major concert venues and their capacities
const VENUE_DATABASE: VenueInfo[] = [
  // USA
  { name: 'Madison Square Garden', capacity: 20789, city: 'New York', country: 'USA' },
  { name: 'The Forum', capacity: 17500, city: 'Los Angeles', country: 'USA' },
  { name: 'United Center', capacity: 23500, city: 'Chicago', country: 'USA' },
  { name: 'Staples Center', capacity: 20000, city: 'Los Angeles', country: 'USA' },
  { name: 'Crypto.com Arena', capacity: 20000, city: 'Los Angeles', country: 'USA' },
  { name: 'TD Garden', capacity: 19580, city: 'Boston', country: 'USA' },
  { name: 'Barclays Center', capacity: 19000, city: 'New York', country: 'USA' },
  { name: 'American Airlines Center', capacity: 20000, city: 'Dallas', country: 'USA' },
  { name: 'T-Mobile Arena', capacity: 20000, city: 'Las Vegas', country: 'USA' },
  { name: 'Red Rocks Amphitheatre', capacity: 9525, city: 'Denver', country: 'USA' },
  { name: 'Hollywood Bowl', capacity: 17500, city: 'Los Angeles', country: 'USA' },
  { name: 'Greek Theatre', capacity: 5900, city: 'Los Angeles', country: 'USA' },
  { name: 'Radio City Music Hall', capacity: 6015, city: 'New York', country: 'USA' },
  { name: 'The Wiltern', capacity: 1850, city: 'Los Angeles', country: 'USA' },

  // UK
  { name: 'O2 Arena', capacity: 20000, city: 'London', country: 'UK' },
  { name: 'Wembley Stadium', capacity: 90000, city: 'London', country: 'UK' },
  { name: 'Royal Albert Hall', capacity: 5272, city: 'London', country: 'UK' },
  { name: 'Roundhouse', capacity: 3300, city: 'London', country: 'UK' },
  { name: 'Brixton Academy', capacity: 4921, city: 'London', country: 'UK' },
  { name: 'Manchester Arena', capacity: 21000, city: 'Manchester', country: 'UK' },
  { name: 'Hydro', capacity: 14300, city: 'Glasgow', country: 'UK' },
  { name: 'Apollo', capacity: 3500, city: 'Manchester', country: 'UK' },

  // France
  { name: 'Accor Arena', capacity: 20300, city: 'Paris', country: 'France' },
  { name: 'Stade de France', capacity: 80000, city: 'Paris', country: 'France' },
  { name: 'Olympia', capacity: 2000, city: 'Paris', country: 'France' },
  { name: 'Zenith Paris', capacity: 6293, city: 'Paris', country: 'France' },

  // Germany
  { name: 'Mercedes-Benz Arena', capacity: 17000, city: 'Berlin', country: 'Germany' },
  { name: 'Olympiahalle', capacity: 15500, city: 'Munich', country: 'Germany' },
  { name: 'Lanxess Arena', capacity: 18500, city: 'Cologne', country: 'Germany' },

  // Spain
  { name: 'WiZink Center', capacity: 17000, city: 'Madrid', country: 'Spain' },
  { name: 'Palau Sant Jordi', capacity: 17000, city: 'Barcelona', country: 'Spain' },

  // Italy
  { name: 'Mediolanum Forum', capacity: 12700, city: 'Milan', country: 'Italy' },
  { name: 'Palalottomatica', capacity: 11000, city: 'Rome', country: 'Italy' },

  // Brazil
  { name: 'Allianz Parque', capacity: 43600, city: 'São Paulo', country: 'Brazil' },
  { name: 'Maracanã', capacity: 78838, city: 'Rio de Janeiro', country: 'Brazil' },
  { name: 'Estádio do Morumbi', capacity: 66795, city: 'São Paulo', country: 'Brazil' },

  // Japan
  { name: 'Tokyo Dome', capacity: 55000, city: 'Tokyo', country: 'Japan' },
  { name: 'Nippon Budokan', capacity: 14471, city: 'Tokyo', country: 'Japan' },
  { name: 'Osaka-jō Hall', capacity: 16000, city: 'Osaka', country: 'Japan' },

  // Australia
  { name: 'Rod Laver Arena', capacity: 15000, city: 'Melbourne', country: 'Australia' },
  { name: 'Sydney Opera House', capacity: 5738, city: 'Sydney', country: 'Australia' },
  { name: 'Marvel Stadium', capacity: 56347, city: 'Melbourne', country: 'Australia' },

  // Canada
  { name: 'Scotiabank Arena', capacity: 19800, city: 'Toronto', country: 'Canada' },
  { name: 'Bell Centre', capacity: 22114, city: 'Montreal', country: 'Canada' },
  { name: 'Rogers Arena', capacity: 19700, city: 'Vancouver', country: 'Canada' },

  // Mexico
  { name: 'Foro Sol', capacity: 65000, city: 'Mexico City', country: 'Mexico' },
  { name: 'Arena Ciudad de México', capacity: 22300, city: 'Mexico City', country: 'Mexico' },

  // Argentina
  { name: 'Estadio River Plate', capacity: 70074, city: 'Buenos Aires', country: 'Argentina' },
  { name: 'Luna Park', capacity: 8000, city: 'Buenos Aires', country: 'Argentina' },

  // Netherlands
  { name: 'Ziggo Dome', capacity: 17000, city: 'Amsterdam', country: 'Netherlands' },
  { name: 'Paradiso', capacity: 1500, city: 'Amsterdam', country: 'Netherlands' },

  // Portugal
  { name: 'Altice Arena', capacity: 20000, city: 'Lisbon', country: 'Portugal' },

  // Sweden
  { name: 'Ericsson Globe', capacity: 16000, city: 'Stockholm', country: 'Sweden' },

  // Denmark
  { name: 'Royal Arena', capacity: 16000, city: 'Copenhagen', country: 'Denmark' },
];

/**
 * Normalize venue name for matching (remove common suffixes, lowercase, trim)
 */
function normalizeVenueName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+(arena|stadium|theatre|theater|hall|center|centre|dome|park)$/i, '')
    .trim();
}

/**
 * Get venue capacity by name
 * Uses fuzzy matching to handle slight variations in venue names
 */
export function getVenueCapacity(venueName: string, city?: string, country?: string): number | undefined {
  if (!venueName || venueName === 'Venue unknown') {
    return undefined;
  }

  const normalizedSearch = normalizeVenueName(venueName);

  // Try exact match first
  let match = VENUE_DATABASE.find(venue => {
    const venueMatch = normalizeVenueName(venue.name) === normalizedSearch;
    const cityMatch = !city || venue.city.toLowerCase() === city.toLowerCase();
    const countryMatch = !country || venue.country.toLowerCase() === country.toLowerCase();
    return venueMatch && cityMatch && countryMatch;
  });

  // Try partial match if no exact match
  if (!match) {
    match = VENUE_DATABASE.find(venue => {
      const venueMatch = normalizeVenueName(venue.name).includes(normalizedSearch) ||
                        normalizedSearch.includes(normalizeVenueName(venue.name));
      const cityMatch = !city || venue.city.toLowerCase() === city.toLowerCase();
      return venueMatch && cityMatch;
    });
  }

  // Try name-only match as last resort
  if (!match) {
    match = VENUE_DATABASE.find(venue =>
      normalizeVenueName(venue.name).includes(normalizedSearch) ||
      normalizedSearch.includes(normalizeVenueName(venue.name))
    );
  }

  return match?.capacity;
}

/**
 * Get estimated capacity based on venue type keywords
 * Used as fallback when venue is not in database
 */
export function estimateCapacityByType(venueName: string): number | undefined {
  const name = venueName.toLowerCase();

  // Stadium - very large
  if (name.includes('stadium') || name.includes('estadio')) {
    return 50000;
  }

  // Arena - large
  if (name.includes('arena')) {
    return 15000;
  }

  // Amphitheater - medium to large
  if (name.includes('amphitheatre') || name.includes('amphitheater')) {
    return 10000;
  }

  // Hall/Auditorium - medium
  if (name.includes('hall') || name.includes('auditorium')) {
    return 5000;
  }

  // Theater/Theatre - small to medium
  if (name.includes('theater') || name.includes('theatre')) {
    return 2000;
  }

  // Club - small
  if (name.includes('club') || name.includes('bar')) {
    return 500;
  }

  return undefined;
}

/**
 * Get venue capacity with fallback to estimation
 */
export function getVenueCapacityWithFallback(
  venueName: string,
  city?: string,
  country?: string
): number | undefined {
  // Try to get exact capacity from database
  const exactCapacity = getVenueCapacity(venueName, city, country);
  if (exactCapacity) {
    return exactCapacity;
  }

  // Fall back to estimation based on venue type
  return estimateCapacityByType(venueName);
}
