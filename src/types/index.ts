export interface Property {
  id: string;
  uuid?: string;
  property_uid: string;
  title: string;
  price: number;
  details?: string; // Keep this for all property details
  address: string;
  image_url: string;
  created_at: string;
  client_id: string;
  client_email?: string;
  user_email?: string;
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
