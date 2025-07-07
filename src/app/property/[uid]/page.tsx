import { notFound } from 'next/navigation';

import PropertyDetailClient from '@/components/PropertyDetailClient';

import { Property, PropertyDetails } from '@/types';

async function fetchPropertyByUID(uid: string): Promise<Property | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/listings/uid/${uid}`,
      {
        cache: 'no-store',
      },
    );

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch property');
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching property:', error);
    return null;
  }
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ uid: string }>; // Updated to Promise
}) {
  const { uid } = await params; // Await the params
  const property = await fetchPropertyByUID(uid);

  if (!property) {
    notFound();
  }

  return <PropertyDetailClient property={property} />;
}

// Generate metadata using UID
export async function generateMetadata({
  params,
}: {
  params: Promise<{ uid: string }>;
}) {
  const { uid } = await params; // Await the params
  const property = await fetchPropertyByUID(uid);

  if (!property) {
    return {
      title: 'Property Not Found',
    };
  }

  // Extract description from details if available
  let description = `${property.title} located at ${property.formatted_address || `${property.street_number || ''} ${property.street_name || ''}, ${property.city}, ${property.province}`.trim()}. Price: $${property.price.toLocaleString()}`;

  if (property.details) {
    try {
      const parsedDetails: PropertyDetails = JSON.parse(property.details);
      if (parsedDetails.description) {
        description = parsedDetails.description;
      }
    } catch {
      // If details is plain text, use it as description
      description = property.details.substring(0, 160) + '...';
    }
  }

  return {
    title: `${property.title} - ${property.property_uid}`,
    description,
  };
}
