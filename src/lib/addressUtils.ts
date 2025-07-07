/**
 * Utility functions for handling Canadian addresses, specifically for British Columbia
 */

import { Address } from '@/types';

// Common BC cities for validation and standardization
export const BC_CITIES = [
  'Vancouver',
  'Victoria',
  'Burnaby',
  'Richmond',
  'Surrey',
  'Langley',
  'Coquitlam',
  'North Vancouver',
  'West Vancouver',
  'New Westminster',
  'Port Coquitlam',
  'Port Moody',
  'Delta',
  'White Rock',
  'Maple Ridge',
  'Pitt Meadows',
  'Abbotsford',
  'Chilliwack',
  'Kelowna',
  'Kamloops',
  'Nanaimo',
  'Prince George',
  'Vernon',
  'Penticton',
  'Campbell River',
  'Courtenay',
  'Powell River',
  'Squamish',
  'Whistler',
] as const;

export type BCCity = (typeof BC_CITIES)[number];

/**
 * Validates Canadian postal code format
 */
export function isValidCanadianPostalCode(postalCode: string): boolean {
  const canadianPostalRegex = /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i;
  return canadianPostalRegex.test(postalCode.trim());
}

/**
 * Formats Canadian postal code to standard format (A1A 1A1)
 */
export function formatCanadianPostalCode(postalCode: string): string {
  const cleaned = postalCode.replace(/\s/g, '').toUpperCase();
  if (cleaned.length === 6 && /^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(cleaned)) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
  }
  return postalCode;
}

/**
 * Parses a full address string into components (best effort for Canadian addresses)
 */
export function parseCanadianAddress(fullAddress: string): Partial<Address> {
  const address: Partial<Address> = {
    country: 'Canada',
    province: 'British Columbia',
  };

  // Extract postal code
  const postalCodeMatch = fullAddress.match(/([A-Z]\d[A-Z]\s?\d[A-Z]\d)/i);
  if (postalCodeMatch) {
    address.postal_code = formatCanadianPostalCode(postalCodeMatch[1]);
    fullAddress = fullAddress.replace(postalCodeMatch[0], '').trim();
  }

  // Split by commas
  const parts = fullAddress.split(',').map((part) => part.trim());

  if (parts.length >= 2) {
    // Last part is likely city
    address.city = parts[parts.length - 1];

    // First part is likely street address
    const streetPart = parts[0];
    const streetMatch = streetPart.match(/^(\d+[A-Z]?)\s+(.+)$/);
    if (streetMatch) {
      address.street_number = streetMatch[1];
      address.street_name = streetMatch[2];
    } else {
      address.street_name = streetPart;
    }

    // Middle parts might include unit
    if (parts.length > 2) {
      for (let i = 1; i < parts.length - 1; i++) {
        const part = parts[i];
        if (part.match(/^(unit|apt|suite|#)/i)) {
          address.unit = part;
          break;
        }
      }
    }
  }

  return address;
}

/**
 * Formats an address object into a display string
 */
export function formatAddressForDisplay(address: Partial<Address>): string {
  const parts: string[] = [];

  // Street address
  if (address.street_number && address.street_name) {
    parts.push(`${address.street_number} ${address.street_name}`);
  } else if (address.street_name) {
    parts.push(address.street_name);
  }

  // Unit
  if (address.unit) {
    parts.push(address.unit);
  }

  // City, Province
  if (address.city && address.province) {
    parts.push(`${address.city}, ${address.province}`);
  } else if (address.city) {
    parts.push(address.city);
  }

  // Postal code
  if (address.postal_code) {
    parts.push(address.postal_code);
  }

  return parts.join(', ');
}

/**
 * Formats address for single line display (like in property cards)
 */
export function formatCityProvince(property: {
  city?: string;
  province?: string;
}): string {
  if (property.city && property.province) {
    // Show BC instead of full province name for brevity
    const provinceCode =
      property.province === 'British Columbia' ? 'BC' : property.province;
    return `${property.city}, ${provinceCode}`;
  }
  if (property.city) {
    return property.city;
  }
  return '';
}

/**
 * Validates if a city is a known BC city
 */
export function isValidBCCity(city: string): city is BCCity {
  return BC_CITIES.includes(city as BCCity);
}

/**
 * Suggests similar BC cities based on input
 */
export function suggestBCCities(input: string, limit = 5): BCCity[] {
  const normalizedInput = input.toLowerCase();
  return BC_CITIES.filter((city) =>
    city.toLowerCase().includes(normalizedInput),
  ).slice(0, limit);
}

/**
 * Gets the approximate center coordinates for major BC cities
 */
export function getCityCoordinates(
  city: string,
): { lat: number; lng: number } | null {
  const coordinates: Record<string, { lat: number; lng: number }> = {
    Vancouver: { lat: 49.2827, lng: -123.1207 },
    Victoria: { lat: 48.4284, lng: -123.3656 },
    Burnaby: { lat: 49.2488, lng: -122.9805 },
    Richmond: { lat: 49.1666, lng: -123.1336 },
    Surrey: { lat: 49.1913, lng: -122.849 },
    Langley: { lat: 49.1042, lng: -122.6604 },
    Coquitlam: { lat: 49.2838, lng: -122.7932 },
    'North Vancouver': { lat: 49.3163, lng: -123.0926 },
    'West Vancouver': { lat: 49.328, lng: -123.1593 },
    'New Westminster': { lat: 49.2057, lng: -122.911 },
    Kelowna: { lat: 49.8951, lng: -119.5116 },
    Kamloops: { lat: 50.6745, lng: -120.3273 },
    Nanaimo: { lat: 49.1659, lng: -123.9401 },
  };

  return coordinates[city] || null;
}
