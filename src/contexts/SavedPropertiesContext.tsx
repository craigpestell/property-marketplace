'use client';

import { useSession } from 'next-auth/react';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

export interface SavedProperty {
  saved_id: number;
  saved_at: string;
  id: string;
  property_uid: string;
  title: string;
  price: number;
  address: string;
  image_url: string;
  created_at: string;
  client_id: string;
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
      const response = await fetch('/api/saved-properties');

      if (!response.ok) {
        throw new Error('Failed to fetch saved properties');
      }

      const data = await response.json();

      if (data.success) {
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
  }, [session?.user?.email]);

  // Save a property
  const saveProperty = useCallback(
    async (propertyUid: string) => {
      if (!session?.user?.email) {
        setError('Please log in to save properties');
        return false;
      }

      try {
        const response = await fetch('/api/saved-properties', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ propertyUid }),
        });

        const data = await response.json();

        if (data.success) {
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
    [session?.user?.email, fetchSavedProperties],
  );

  // Remove a saved property
  const removeSavedProperty = useCallback(
    async (propertyUid: string) => {
      if (!session?.user?.email) {
        setError('Please log in to manage saved properties');
        return false;
      }

      try {
        const response = await fetch(
          `/api/saved-properties?propertyUid=${propertyUid}`,
          {
            method: 'DELETE',
          },
        );

        const data = await response.json();

        if (data.success) {
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
    [session?.user?.email],
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

  // Load saved properties when user logs in
  useEffect(() => {
    if (session?.user?.email) {
      fetchSavedProperties();
    } else {
      // Clear state when user logs out
      setSavedProperties([]);
      setSavedPropertyIds(new Set());
      setError(null);
    }
  }, [session?.user?.email, fetchSavedProperties]);

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
