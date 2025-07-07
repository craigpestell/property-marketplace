export interface Property {
  id: string;
  uuid?: string;
  property_uid: string;
  title: string;
  price: number;
  details?: string; // Keep this for all property details
  // New granular address fields
  street_number?: string;
  street_name?: string;
  unit?: string;
  city: string;
  province: string;
  postal_code?: string;
  country: string;
  latitude?: number;
  longitude?: number;
  formatted_address?: string;
  address_type?: 'residential' | 'commercial' | 'mixed';
  image_url: string;
  created_at: string;
  client_id: string;
  client_uid: string; // New relationship field
  saves?: number; // Number of times this property has been saved by users
}

export interface Address {
  street_number?: string;
  street_name?: string;
  unit?: string;
  city: string;
  province: string;
  postal_code?: string;
  country: string;
  latitude?: number;
  longitude?: number;
  formatted_address?: string;
  address_type?: 'residential' | 'commercial' | 'mixed';
}

export interface PropertyDetails {
  bedrooms?: number;
  bathrooms?: number;
  squareFootage?: number;
  lotSize?: string;
  yearBuilt?: number;
  propertyType?: 'house' | 'apartment' | 'condo' | 'townhouse' | 'commercial';
  features?: string[];
  amenities?: string[];
  parking?: string;
  heating?: string;
  cooling?: string;
  flooring?: string[];
  appliances?: string[];
  utilities?: string[];
  restrictions?: string[];
  notes?: string;
  description?: string; // Move description here as part of details
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
