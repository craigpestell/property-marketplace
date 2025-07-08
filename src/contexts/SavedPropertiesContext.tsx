'use client';

import { useSession } from 'next-auth/react';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useClientUid } from '@/hooks/useClientUid';

export interface SavedProperty {
  saved_at: string;
  id: string;
  property_uid: string;
  title: string;
  price: number;
  image_url: string;
  created_at: string;
  // New schema fields
  street_number?: string;
  street_name?: string;
  unit?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  formatted_address?: string;
  address_type?: string;
  // Legacy fields
  address?: string;
  client_id?: string;
  // Client reference fields
  client_uid?: string;
  client_email?: string;
  client_name?: string;
  // Property details
  details?: Record<string, unknown>;
}

interface SavedPropertiesContextType {
  savedProperties: SavedProperty[];
  savedPropertyIds: Set<string>;
  loading: boolean;
  error: string | null;
  saveProperty: (propertyUid: string) => Promise<boolean>;
  removeSavedProperty: (propertyUid: string) => Promise<boolean>;
  toggleSaveProperty: (propertyUid: string) => Promise<boolean>;
  isPropertySaved: (propertyUid: string) => boolean;
  fetchSavedProperties: () => Promise<void>;
  count: number;
}

const SavedPropertiesContext = createContext<
  SavedPropertiesContextType | undefined
>(undefined);

export function SavedPropertiesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const { clientUid, loading: clientUidLoading } = useClientUid();
  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([]);
  const [savedPropertyIds, setSavedPropertyIds] = useState<Set<string>>(
    new Set(),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's saved properties
  const fetchSavedProperties = useCallback(async () => {
    if (!session?.user?.email) return;

    setLoading(true);
    setError(null);

    try {
      // Add client_uid query parameter if available and not still loading
      const queryParam =
        clientUid && !clientUidLoading ? `?clientUid=${clientUid}` : '';

      const response = await fetch(`/api/saved-properties${queryParam}`);

      if (!response.ok) {
        throw new Error('Failed to fetch saved properties');
      }

      const data = await response.json();

      if (data.savedProperties) {
        setSavedProperties(data.savedProperties);
        // Create a Set of property UIDs for quick lookup
        const propertyIds = new Set<string>(
          data.savedProperties.map((p: SavedProperty) => p.property_uid),
        );
        setSavedPropertyIds(propertyIds);
      } else {
        throw new Error(data.error || 'Failed to fetch saved properties');
      }
    } catch (err) {
      console.error('Error fetching saved properties:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [session?.user?.email, clientUid, clientUidLoading]);

  // Save a property
  const saveProperty = useCallback(
    async (propertyUid: string) => {
      if (!session?.user?.email) {
        setError('Please log in to save properties');
        return false;
      }

      try {
        // Include client_uid in request body if available
        const requestBody = clientUid
          ? { propertyUid, clientUid }
          : { propertyUid };

        const response = await fetch('/api/saved-properties', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (!data.error) {
          // Add to local state
          setSavedPropertyIds((prev) => new Set(prev).add(propertyUid));
          // Optionally refresh the full list
          fetchSavedProperties();
          return true;
        } else {
          throw new Error(data.error || 'Failed to save property');
        }
      } catch (err) {
        console.error('Error saving property:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        return false;
      }
    },
    [session?.user?.email, clientUid, fetchSavedProperties],
  );

  // Remove a saved property
  const removeSavedProperty = useCallback(
    async (propertyUid: string) => {
      if (!session?.user?.email) {
        setError('Please log in to manage saved properties');
        return false;
      }

      try {
        // Include client_uid in query params if available
        const queryParams = new URLSearchParams({ propertyUid });
        if (clientUid) {
          queryParams.append('clientUid', clientUid);
        }

        const response = await fetch(
          `/api/saved-properties?${queryParams.toString()}`,
          {
            method: 'DELETE',
          },
        );

        const data = await response.json();

        if (!data.error) {
          // Remove from local state
          setSavedPropertyIds((prev) => {
            const newSet = new Set(prev);
            newSet.delete(propertyUid);
            return newSet;
          });
          setSavedProperties((prev) =>
            prev.filter((p) => p.property_uid !== propertyUid),
          );
          return true;
        } else {
          throw new Error(data.error || 'Failed to remove saved property');
        }
      } catch (err) {
        console.error('Error removing saved property:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        return false;
      }
    },
    [session?.user?.email, clientUid],
  );

  // Toggle save state for a property
  const toggleSaveProperty = useCallback(
    async (propertyUid: string) => {
      const isSaved = savedPropertyIds.has(propertyUid);

      if (isSaved) {
        return await removeSavedProperty(propertyUid);
      } else {
        return await saveProperty(propertyUid);
      }
    },
    [savedPropertyIds, saveProperty, removeSavedProperty],
  );

  // Check if a property is saved
  const isPropertySaved = useCallback(
    (propertyUid: string) => {
      return savedPropertyIds.has(propertyUid);
    },
    [savedPropertyIds],
  );

  // Load saved properties when user logs in and client_uid is available
  useEffect(() => {
    if (session?.user?.email) {
      // Only fetch if we have client_uid or we're sure it's not available (clientUidLoading is false)
      if (clientUid || (!clientUid && !clientUidLoading)) {
        fetchSavedProperties();
      }
    } else {
      // Clear state when user logs out
      setSavedProperties([]);
      setSavedPropertyIds(new Set());
      setError(null);
    }
  }, [session?.user?.email, clientUid, clientUidLoading, fetchSavedProperties]);

  const value: SavedPropertiesContextType = {
    savedProperties,
    savedPropertyIds,
    loading,
    error,
    saveProperty,
    removeSavedProperty,
    toggleSaveProperty,
    isPropertySaved,
    fetchSavedProperties,
    count: savedProperties.length,
  };

  return (
    <SavedPropertiesContext.Provider value={value}>
      {children}
    </SavedPropertiesContext.Provider>
  );
}

export function useSavedProperties() {
  const context = useContext(SavedPropertiesContext);
  if (context === undefined) {
    throw new Error(
      'useSavedProperties must be used within a SavedPropertiesProvider',
    );
  }
  return context;
}
