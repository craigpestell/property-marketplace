/**
 * Utilities for handling Canadian addresses, particularly for British Columbia
 */

import { Address } from '@/types';

// BC major cities for validation/autocomplete
export const BC_CITIES = [
  'Vancouver',
  'Surrey',
  'Burnaby',
  'Richmond',
  'Abbotsford',
  'Coquitlam',
  'Langley',
  'Saanich',
  'Delta',
  'North Vancouver',
  'West Vancouver',
  'Victoria',
  'Kamloops',
  'Nanaimo',
  'Prince George',
  'Chilliwack',
  'Vernon',
  'Penticton',
  'Campbell River',
  'Courtenay',
  'Cranbrook',
  'Fort St. John',
  'Dawson Creek',
  'Williams Lake',
  'Quesnel',
] as const;

// Canadian provinces/territories
export const CANADIAN_PROVINCES = [
  { code: 'BC', name: 'British Columbia' },
  { code: 'AB', name: 'Alberta' },
  { code: 'SK', name: 'Saskatchewan' },
  { code: 'MB', name: 'Manitoba' },
  { code: 'ON', name: 'Ontario' },
  { code: 'QC', name: 'Quebec' },
  { code: 'NB', name: 'New Brunswick' },
  { code: 'NS', name: 'Nova Scotia' },
  { code: 'PE', name: 'Prince Edward Island' },
  { code: 'NL', name: 'Newfoundland and Labrador' },
  { code: 'YT', name: 'Yukon' },
  { code: 'NT', name: 'Northwest Territories' },
  { code: 'NU', name: 'Nunavut' },
] as const;

/**
 * Validates Canadian postal code format
 * Accepts both "V6B 1A1" and "V6B1A1" formats
 */
export function validatePostalCode(postalCode: string): boolean {
  if (!postalCode) return false;
  const cleaned = postalCode.replace(/\s/g, '').toUpperCase();
  return /^[A-Z][0-9][A-Z][0-9][A-Z][0-9]$/.test(cleaned);
}

/**
 * Formats postal code to standard Canadian format "V6B 1A1"
 */
export function formatPostalCode(postalCode: string): string {
  if (!postalCode) return '';
  const cleaned = postalCode.replace(/\s/g, '').toUpperCase();
  if (cleaned.length === 6) {
    return `${cleaned.substring(0, 3)} ${cleaned.substring(3)}`;
  }
  return postalCode;
}

/**
 * Formats a complete Canadian address
 */
export function formatCanadianAddress(address: Address): string {
  const parts: string[] = [];

  // Street address and unit
  if (address.street_address) {
    if (address.unit) {
      parts.push(`${address.street_address}, ${address.unit}`);
    } else {
      parts.push(address.street_address);
    }
  }

  // City, Province
  if (address.city && address.province) {
    parts.push(`${address.city}, ${address.province}`);
  }

  // Postal code
  if (address.postal_code) {
    parts.push(formatPostalCode(address.postal_code));
  }

  // Country (only if not Canada)
  if (address.country && address.country !== 'Canada') {
    parts.push(address.country);
  }

  return parts.join(', ');
}

/**
 * Parse a freeform address string into components (best effort)
 * Useful for migrating existing address data
 */
export function parseCanadianAddress(addressString: string): Partial<Address> {
  if (!addressString) return {};

  const parts = addressString.split(',').map((part) => part.trim());
  const result: Partial<Address> = {
    country: 'Canada',
    province: 'British Columbia', // Default for BC market
  };

  // Look for postal code (usually last or second to last)
  const postalCodeRegex = /^[A-Z][0-9][A-Z][\s]?[0-9][A-Z][0-9]$/;
  const postalCodeIndex = parts.findIndex((part) =>
    postalCodeRegex.test(part.toUpperCase()),
  );

  if (postalCodeIndex !== -1) {
    result.postal_code = formatPostalCode(parts[postalCodeIndex]);
    parts.splice(postalCodeIndex, 1);
  }

  // Look for BC cities
  const cityIndex = parts.findIndex(
    (part) =>
      (BC_CITIES as readonly string[]).includes(part) ||
      BC_CITIES.some((city) => city.toLowerCase() === part.toLowerCase()),
  );

  if (cityIndex !== -1) {
    result.city = parts[cityIndex];
    parts.splice(cityIndex, 1);
  }

  // Look for province
  const provinceIndex = parts.findIndex(
    (part) =>
      part.toLowerCase() === 'british columbia' || part.toLowerCase() === 'bc',
  );

  if (provinceIndex !== -1) {
    result.province = 'British Columbia';
    parts.splice(provinceIndex, 1);
  }

  // Remaining parts are likely street address
  if (parts.length > 0) {
    result.street_address = parts.join(', ');
  }

  return result;
}

/**
 * Get approximate coordinates for BC cities (for initial geocoding)
 * In production, you'd use a real geocoding service
 */
export function getBCCityCoordinates(
  city: string,
): { latitude: number; longitude: number } | null {
  const coordinates: Record<string, { latitude: number; longitude: number }> = {
    Vancouver: { latitude: 49.2827, longitude: -123.1207 },
    Surrey: { latitude: 49.1913, longitude: -122.849 },
    Burnaby: { latitude: 49.2488, longitude: -122.9805 },
    Richmond: { latitude: 49.1666, longitude: -123.1336 },
    Victoria: { latitude: 48.4284, longitude: -123.3656 },
    Abbotsford: { latitude: 49.0504, longitude: -122.3045 },
    Coquitlam: { latitude: 49.3956, longitude: -122.8229 },
    Langley: { latitude: 49.1042, longitude: -122.6604 },
    'North Vancouver': { latitude: 49.3163, longitude: -123.0686 },
    'West Vancouver': { latitude: 49.3289, longitude: -123.1519 },
    Delta: { latitude: 49.1499, longitude: -123.0581 },
    Saanich: { latitude: 48.4894, longitude: -123.3661 },
    Kamloops: { latitude: 50.6745, longitude: -120.3273 },
    Nanaimo: { latitude: 49.1659, longitude: -123.9401 },
    'Prince George': { latitude: 53.9171, longitude: -122.7497 },
  };

  return coordinates[city] || null;
}
