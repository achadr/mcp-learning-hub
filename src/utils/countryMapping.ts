/**
 * Country code to country name mapping
 * Used when APIs provide country code but not country name
 */

/**
 * Country name variations to canonical name mapping
 * Normalizes different API responses to consistent country names
 */
const COUNTRY_NAME_VARIATIONS: Record<string, string> = {
  // United States variations
  'united states of america': 'United States',
  'united states': 'United States',
  'usa': 'United States',
  'us': 'United States',

  // United Kingdom variations
  'united kingdom': 'United Kingdom',
  'uk': 'United Kingdom',
  'great britain': 'United Kingdom',
  'britain': 'United Kingdom',
  'england': 'United Kingdom',
  'scotland': 'United Kingdom',
  'wales': 'United Kingdom',

  // Other common variations
  'south korea': 'South Korea',
  'korea': 'South Korea',
  'republic of korea': 'South Korea',

  'uae': 'United Arab Emirates',
  'united arab emirates': 'United Arab Emirates',

  'czech republic': 'Czech Republic',
  'czechia': 'Czech Republic',
};

export const COUNTRY_CODE_TO_NAME: Record<string, string> = {
  // North America
  'US': 'United States',
  'CA': 'Canada',
  'MX': 'Mexico',

  // Europe
  'GB': 'United Kingdom',
  'UK': 'United Kingdom',
  'DE': 'Germany',
  'FR': 'France',
  'IT': 'Italy',
  'ES': 'Spain',
  'PT': 'Portugal',
  'NL': 'Netherlands',
  'BE': 'Belgium',
  'CH': 'Switzerland',
  'AT': 'Austria',
  'SE': 'Sweden',
  'NO': 'Norway',
  'DK': 'Denmark',
  'FI': 'Finland',
  'IE': 'Ireland',
  'PL': 'Poland',
  'CZ': 'Czech Republic',
  'GR': 'Greece',
  'HU': 'Hungary',
  'RO': 'Romania',
  'SK': 'Slovakia',
  'HR': 'Croatia',
  'SI': 'Slovenia',

  // South America
  'BR': 'Brazil',
  'AR': 'Argentina',
  'CL': 'Chile',
  'CO': 'Colombia',
  'PE': 'Peru',
  'VE': 'Venezuela',
  'UY': 'Uruguay',

  // Asia
  'JP': 'Japan',
  'CN': 'China',
  'KR': 'South Korea',
  'IN': 'India',
  'TH': 'Thailand',
  'SG': 'Singapore',
  'MY': 'Malaysia',
  'ID': 'Indonesia',
  'PH': 'Philippines',
  'VN': 'Vietnam',
  'TW': 'Taiwan',
  'HK': 'Hong Kong',

  // Oceania
  'AU': 'Australia',
  'NZ': 'New Zealand',

  // Middle East
  'AE': 'United Arab Emirates',
  'SA': 'Saudi Arabia',
  'IL': 'Israel',
  'TR': 'Turkey',

  // Africa
  'ZA': 'South Africa',
  'EG': 'Egypt',
  'NG': 'Nigeria',
  'KE': 'Kenya',
};

/**
 * Get country name from country code
 */
export function getCountryName(countryCode: string | undefined): string | undefined {
  if (!countryCode) return undefined;
  return COUNTRY_CODE_TO_NAME[countryCode.toUpperCase()];
}

/**
 * Normalize country name variations to canonical names
 */
export function normalizeCountryName(countryName: string): string {
  const normalized = COUNTRY_NAME_VARIATIONS[countryName.toLowerCase()];
  return normalized || countryName;
}

/**
 * Extract country from API data with fallback to country code
 */
export function extractCountry(
  countryName: string | undefined,
  countryCode: string | undefined
): string | undefined {
  // Try country name first
  if (countryName && countryName.toLowerCase() !== 'unknown') {
    return normalizeCountryName(countryName);
  }

  // Try country code mapping
  if (countryCode) {
    const mappedName = getCountryName(countryCode);
    if (mappedName) return mappedName;
  }

  // Return undefined if no valid country found
  return undefined;
}
