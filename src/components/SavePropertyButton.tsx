import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

import { useSavedProperties } from '@/contexts/SavedPropertiesContext';

interface SavePropertyButtonProps {
  propertyUid: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

export default function SavePropertyButton({
  propertyUid,
  className = '',
  size = 'md',
  showTooltip = true,
}: SavePropertyButtonProps) {
  const { data: session } = useSession();
  const { isPropertySaved, toggleSaveProperty } = useSavedProperties();
  const [isLoading, setIsLoading] = useState(false);

  const isSaved = isPropertySaved(propertyUid);

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if inside a Link
    e.stopPropagation(); // Prevent event bubbling

    if (!session?.user) {
      // Could show a login modal or redirect to login
      alert('Please log in to save properties');
      return;
    }

    setIsLoading(true);
    try {
      await toggleSaveProperty(propertyUid);
    } finally {
      setIsLoading(false);
    }
  };

  if (!session?.user) {
    // Don't show the button if user is not logged in
    return null;
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`
        relative inline-flex items-center justify-center
        transition-all duration-200 
        hover:scale-110 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      title={
        showTooltip
          ? isSaved
            ? 'Remove from saved'
            : 'Save property'
          : undefined
      }
    >
      {isSaved ? (
        <HeartIconSolid
          className={`${sizeClasses[size]} text-red-500 drop-shadow-sm`}
        />
      ) : (
        <HeartIcon
          className={`
            ${sizeClasses[size]} 
            text-gray-400 hover:text-red-400 
            transition-colors duration-200
          `}
        />
      )}

      {/* Loading spinner overlay */}
      {isLoading && (
        <div
          className={`
            absolute inset-0 flex items-center justify-center
            bg-white bg-opacity-80 rounded-full
          `}
        >
          <div
            className={`
              animate-spin rounded-full border-2 border-gray-300 border-t-red-500
              ${size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5'}
            `}
          />
        </div>
      )}
    </button>
  );
}
