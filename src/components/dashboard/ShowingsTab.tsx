'use client';

import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';

import { useClientUid } from '@/hooks/useClientUid';

import { PROPERTY_COLORS } from '@/constant/propertyColors';

import { PropertyColorPicker } from './PropertyColorPicker';

import { Property } from '@/types';

interface ShowingTime {
  id: string;
  propertyUid: string;
  startTime: string;
  endTime: string;
  propertyTitle: string;
}

export default function ShowingsTab() {
  const { data: session } = useSession();
  const { clientUid, loading: clientUidLoading } = useClientUid();
  const [userListings, setUserListings] = useState<Property[]>([]);
  const [showingTimes, setShowingTimes] = useState<ShowingTime[]>([]);
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<{
    date: string;
    startSlot: number;
    endSlot: number;
  } | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const [selectedListingForCalendar, setSelectedListingForCalendar] =
    useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [dragState, setDragState] = useState<{
    isSelecting: boolean;
    startSlot: number | null;
    currentSlot: number | null;
    date: string | null;
  }>({
    isSelecting: false,
    startSlot: null,
    currentSlot: null,
    date: null,
  });
  // Color assignment state: property_uid -> color
  const [propertyColors, setPropertyColors] = useState<Record<string, string>>(
    {},
  );
  // Color picker popover state
  const [colorPickerOpen, setColorPickerOpen] = useState<string | null>(null);
  // Delete confirmation state
  const [showingToDelete, setShowingToDelete] = useState<{
    id: string;
    title: string;
    time: string;
  } | null>(null);

  const fetchUserListings = useCallback(async () => {
    if (!session?.user?.email) return;

    try {
      // Only use clientUid if it's already loaded and not null
      const queryParam =
        clientUid && !clientUidLoading
          ? `clientUid=${clientUid}`
          : `userEmail=${session.user.email}`;

      const response = await fetch(`/api/listings?${queryParam}`);
      if (response.ok) {
        const data = await response.json();
        setUserListings(data.properties || []);
      }
    } catch (err) {
      // Handle error silently or show user notification
    }
  }, [session?.user?.email, clientUid, clientUidLoading]);

  const fetchShowingTimes = useCallback(async () => {
    if (!session?.user?.email) return;

    try {
      // Only use clientUid if it's already loaded and not null
      const queryParam =
        clientUid && !clientUidLoading ? `?clientUid=${clientUid}` : '';
      const response = await fetch(`/api/showings/calendar${queryParam}`);
      if (response.ok) {
        const data = await response.json();
        setShowingTimes(data.showings || []);
      }
    } catch (err) {
      // Handle error silently or show user notification
    }
  }, [session?.user?.email, clientUid, clientUidLoading]);

  const fetchPropertyColors = useCallback(async () => {
    if (!session?.user?.email) return;

    try {
      // Only use clientUid if it's already loaded and not null
      const queryParam =
        clientUid && !clientUidLoading
          ? `clientUid=${clientUid}`
          : `userEmail=${session.user.email}`;

      const response = await fetch(`/api/properties/colors?${queryParam}`);
      if (response.ok) {
        const data = await response.json();
        setPropertyColors(data.colorAssignments || {});
      }
    } catch (err) {
      // Handle error silently or show user notification
    }
  }, [session?.user?.email, clientUid, clientUidLoading]);

  // Only fetch once when session is available and not on every clientUid change
  useEffect(() => {
    if (session?.user) {
      fetchUserListings();
      fetchShowingTimes();
      fetchPropertyColors();
    }
  }, [session]); // Intentionally omit fetchUserListings and other functions to prevent loops

  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        colorPickerOpen &&
        !(event.target as Element).closest('.color-picker-container')
      ) {
        setColorPickerOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [colorPickerOpen]);

  const getDaysInWeek = (date: Date) => {
    const startOfWeek = new Date(date);
    // Get the start of the week (Sunday)
    startOfWeek.setDate(date.getDate() - date.getDay());

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }

    return days;
  };

  const getShowingsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return showingTimes.filter((showing) =>
      showing.startTime.startsWith(dateStr),
    );
  };

  const getShowingsForDateAndProperty = (date: Date, propertyUid: string) => {
    const dateStr = date.toISOString().split('T')[0];
    return showingTimes.filter(
      (showing) =>
        showing.startTime.startsWith(dateStr) &&
        showing.propertyUid === propertyUid,
    );
  };

  const getOtherPropertyShowings = (date: Date) => {
    if (selectedListingForCalendar === 'all') return [];
    const dateStr = date.toISOString().split('T')[0];
    return showingTimes.filter(
      (showing) =>
        showing.startTime.startsWith(dateStr) &&
        showing.propertyUid !== selectedListingForCalendar,
    );
  };

  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeValue = hour * 60 + minute; // Total minutes from midnight
        const displayHour = hour > 12 ? hour - 12 : hour;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHourFormatted = displayHour === 0 ? 12 : displayHour;

        slots.push({
          value: timeValue,
          hour,
          minute,
          time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
          label: `${displayHourFormatted}:${minute.toString().padStart(2, '0')} ${ampm}`,
        });
      }
    }
    return slots;
  };

  const handleTimeSlotMouseDown = (date: Date, slotValue: number) => {
    // Only allow drag selection if a specific property is selected
    if (selectedListingForCalendar === 'all') return;

    // Prevent selection if the slot is already conflicted for this property
    if (isSlotConflicted(date, slotValue, selectedListingForCalendar)) return;

    const dateStr = date.toISOString().split('T')[0];
    setDragState({
      isSelecting: true,
      startSlot: slotValue,
      currentSlot: slotValue,
      date: dateStr,
    });
  };

  const handleTimeSlotMouseEnter = (date: Date, slotValue: number) => {
    if (
      dragState.isSelecting &&
      dragState.date === date.toISOString().split('T')[0]
    ) {
      // Don't extend selection into conflicted slots for the selected property
      if (
        selectedListingForCalendar !== 'all' &&
        isSlotConflicted(date, slotValue, selectedListingForCalendar)
      ) {
        return;
      }

      setDragState((prev) => ({
        ...prev,
        currentSlot: slotValue,
      }));
    }
  };

  const handleTimeSlotMouseUp = () => {
    if (
      dragState.isSelecting &&
      dragState.startSlot !== null &&
      dragState.currentSlot !== null &&
      dragState.date
    ) {
      const startSlot = Math.min(dragState.startSlot, dragState.currentSlot);
      const endSlot = Math.max(dragState.startSlot, dragState.currentSlot);

      setSelectedTimeRange({
        date: dragState.date,
        startSlot,
        endSlot,
      });
      // Pre-select the property if viewing a specific listing
      if (selectedListingForCalendar !== 'all') {
        setSelectedProperty(selectedListingForCalendar);
      }
      setShowAddModal(true);
    }

    setDragState({
      isSelecting: false,
      startSlot: null,
      currentSlot: null,
      date: null,
    });
  };

  const isSlotSelected = (date: Date, slotValue: number) => {
    if (
      !dragState.isSelecting ||
      dragState.date !== date.toISOString().split('T')[0]
    ) {
      return false;
    }

    if (dragState.startSlot !== null && dragState.currentSlot !== null) {
      const minSlot = Math.min(dragState.startSlot, dragState.currentSlot);
      const maxSlot = Math.max(dragState.startSlot, dragState.currentSlot);
      return slotValue >= minSlot && slotValue <= maxSlot;
    }

    return false;
  };

  const handleAddShowing = async () => {
    if (!selectedTimeRange || !selectedProperty || !session?.user?.email)
      return;

    // Check for time conflicts before proceeding
    const conflictDate = new Date(selectedTimeRange.date);
    if (
      hasTimeConflict(
        conflictDate,
        selectedTimeRange.startSlot,
        selectedTimeRange.endSlot,
        selectedProperty,
      )
    ) {
      alert(
        'This time slot conflicts with an existing showing for this property. Please select a different time.',
      );
      return;
    }

    setIsLoading(true);
    try {
      // Convert slot values back to time
      const startHour = Math.floor(selectedTimeRange.startSlot / 60);
      const startMinute = selectedTimeRange.startSlot % 60;
      const endHour = Math.floor((selectedTimeRange.endSlot + 15) / 60); // Add 15 minutes to end slot
      const endMinute = (selectedTimeRange.endSlot + 15) % 60;

      const startTime = new Date(
        `${selectedTimeRange.date}T${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}:00`,
      );
      const endTime = new Date(
        `${selectedTimeRange.date}T${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}:00`,
      );

      const response = await fetch('/api/showings/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyUid: selectedProperty,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        }),
      });

      if (response.ok) {
        await fetchShowingTimes();
        setShowAddModal(false);
        setSelectedProperty('');
        setSelectedTimeRange(null);
      } else {
        // Handle error silently or show user notification
      }
    } catch (err) {
      // Handle error silently or show user notification
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteShowing = async (showingId: string) => {
    if (!showingToDelete || showingToDelete.id !== showingId) return;

    try {
      const response = await fetch(`/api/showings/calendar?id=${showingId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchShowingTimes();
        setShowingToDelete(null);
      } else {
        // Handle error silently or show user notification
        alert('Failed to delete showing. Please try again.');
      }
    } catch (err) {
      // Handle error silently or show user notification
      alert('Failed to delete showing. Please try again.');
    }
  };

  const promptDeleteShowing = (showing: ShowingTime) => {
    const startTime = new Date(showing.startTime);
    const endTime = new Date(showing.endTime);
    const timeString = `${startTime.toLocaleDateString()} ${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    setShowingToDelete({
      id: showing.id,
      title: showing.propertyTitle,
      time: timeString,
    });
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  const days = getDaysInWeek(currentWeek);
  const timeSlots = getTimeSlots();

  // Assign a color to a property
  const handleColorChange = async (propertyUid: string, color: string) => {
    if (!session?.user?.email) return;

    try {
      const response = await fetch('/api/properties/colors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyUid,
          color,
          userEmail: session.user.email,
        }),
      });

      if (response.ok) {
        // Update local state only after successful database update
        setPropertyColors((prev) => ({ ...prev, [propertyUid]: color }));
      } else {
        const errorData = await response.json();
        // eslint-disable-next-line no-console
        console.error(
          'Failed to update property color:',
          response.status,
          errorData,
        );
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error updating property color:', err);
    }
  };

  // Helper function to get all overlapping showings for a time slot
  const getOverlappingShowings = (
    day: Date,
    slot: { hour: number; minute: number },
  ) => {
    const allShowings = getShowingsForDate(day);

    return allShowings.filter((showing) => {
      const showingStart = new Date(showing.startTime);
      const showingEnd = new Date(showing.endTime);
      const slotStart = new Date(day);
      slotStart.setHours(slot.hour, slot.minute, 0, 0);
      const slotEnd = new Date(slotStart.getTime() + 15 * 60000);

      return (
        (showingStart <= slotStart && showingEnd > slotStart) ||
        (showingStart < slotEnd && showingEnd >= slotEnd) ||
        (showingStart >= slotStart && showingEnd <= slotEnd)
      );
    });
  };

  // Helper function to check if a time range conflicts with existing showings for a property
  const hasTimeConflict = (
    date: Date,
    startSlot: number,
    endSlot: number,
    propertyUid: string,
  ): boolean => {
    const dateStr = date.toISOString().split('T')[0];
    const existingShowings = showingTimes.filter(
      (showing) =>
        showing.startTime.startsWith(dateStr) &&
        showing.propertyUid === propertyUid,
    );

    // Convert slots to actual times
    const newStartHour = Math.floor(startSlot / 60);
    const newStartMinute = startSlot % 60;
    const newEndHour = Math.floor((endSlot + 15) / 60); // Add 15 minutes to end slot
    const newEndMinute = (endSlot + 15) % 60;

    const newStartTime = new Date(date);
    newStartTime.setHours(newStartHour, newStartMinute, 0, 0);
    const newEndTime = new Date(date);
    newEndTime.setHours(newEndHour, newEndMinute, 0, 0);

    return existingShowings.some((showing) => {
      const existingStart = new Date(showing.startTime);
      const existingEnd = new Date(showing.endTime);

      // Check for any overlap
      return newStartTime < existingEnd && newEndTime > existingStart;
    });
  };

  // Helper function to check if a single slot is conflicted for a property
  const isSlotConflicted = (
    date: Date,
    slotValue: number,
    propertyUid: string,
  ): boolean => {
    const dateStr = date.toISOString().split('T')[0];
    const existingShowings = showingTimes.filter(
      (showing) =>
        showing.startTime.startsWith(dateStr) &&
        showing.propertyUid === propertyUid,
    );

    const slotHour = Math.floor(slotValue / 60);
    const slotMinute = slotValue % 60;
    const slotStart = new Date(date);
    slotStart.setHours(slotHour, slotMinute, 0, 0);
    const slotEnd = new Date(slotStart.getTime() + 15 * 60000); // 15 minutes later

    return existingShowings.some((showing) => {
      const showingStart = new Date(showing.startTime);
      const showingEnd = new Date(showing.endTime);

      return slotStart < showingEnd && slotEnd > showingStart;
    });
  };

  // Effect to check for adjacent showings to merge when showings change
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const checkAndMerge = async () => {
      if (!session?.user?.email || showingTimes.length < 2) return;

      // Group showings by property and date
      const showingsByPropertyAndDate: Record<
        string,
        Record<string, ShowingTime[]>
      > = {};

      showingTimes.forEach((showing) => {
        const date = showing.startTime.split('T')[0];

        if (!showingsByPropertyAndDate[showing.propertyUid]) {
          showingsByPropertyAndDate[showing.propertyUid] = {};
        }
        if (!showingsByPropertyAndDate[showing.propertyUid][date]) {
          showingsByPropertyAndDate[showing.propertyUid][date] = [];
        }

        showingsByPropertyAndDate[showing.propertyUid][date].push(showing);
      });

      const mergeOperations: Array<{
        showingsToDelete: string[];
        newShowing: {
          propertyUid: string;
          startTime: string;
          endTime: string;
        };
      }> = [];

      // Check each property's showings for each date
      Object.entries(showingsByPropertyAndDate).forEach(
        ([_propertyUid, dateGroups]) => {
          Object.entries(dateGroups).forEach(([_date, showings]) => {
            if (showings.length < 2) return;

            // Sort showings by start time
            const sortedShowings = [...showings].sort(
              (a, b) =>
                new Date(a.startTime).getTime() -
                new Date(b.startTime).getTime(),
            );

            // Find groups of adjacent showings
            const mergeGroups: ShowingTime[][] = [];
            let currentGroup = [sortedShowings[0]];

            for (let i = 1; i < sortedShowings.length; i++) {
              const prevShowing = currentGroup[currentGroup.length - 1];
              const currentShowing = sortedShowings[i];

              const prevEnd = new Date(prevShowing.endTime);
              const currentStart = new Date(currentShowing.startTime);

              // Check if the end time of previous showing equals start time of current showing
              if (prevEnd.getTime() === currentStart.getTime()) {
                currentGroup.push(currentShowing);
              } else {
                // If current group has more than one showing, it needs merging
                if (currentGroup.length > 1) {
                  mergeGroups.push([...currentGroup]);
                }
                currentGroup = [currentShowing];
              }
            }

            // Don't forget the last group
            if (currentGroup.length > 1) {
              mergeGroups.push(currentGroup);
            }

            // Create merge operations for each group
            mergeGroups.forEach((group) => {
              const firstShowing = group[0];
              const lastShowing = group[group.length - 1];

              mergeOperations.push({
                showingsToDelete: group.map((s) => s.id),
                newShowing: {
                  propertyUid: firstShowing.propertyUid,
                  startTime: firstShowing.startTime,
                  endTime: lastShowing.endTime,
                },
              });
            });
          });
        },
      );

      // Execute merge operations
      if (mergeOperations.length > 0) {
        for (const operation of mergeOperations) {
          try {
            // Delete the individual showings
            await Promise.all(
              operation.showingsToDelete.map((id) =>
                fetch(`/api/showings/calendar?id=${id}`, { method: 'DELETE' }),
              ),
            );

            // Create the merged showing
            await fetch('/api/showings/calendar', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(operation.newShowing),
            });
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Failed to merge showings:', err);
          }
        }

        // Refresh the showings
        fetchShowingTimes();
      }
    };

    if (showingTimes.length > 1 && session?.user?.email) {
      // Use a timeout to avoid immediate re-rendering and potential infinite loops
      timeoutId = setTimeout(checkAndMerge, 1000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    JSON.stringify(
      showingTimes.map((s) => ({
        id: s.id,
        start: s.startTime,
        end: s.endTime,
        prop: s.propertyUid,
      })),
    ),
    session?.user?.email,
    fetchShowingTimes,
  ]);

  return (
    <div className='p-6'>
      <div className='mb-8'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
          Showing Calendar
        </h2>
        <p className='text-gray-600 dark:text-gray-400'>
          Manage available showing times for your properties
        </p>
      </div>

      {/* Property Listings Selector */}
      <div className='mb-6'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-3'>
          Select Property
        </h3>
        <div className='flex flex-wrap gap-2'>
          <button
            onClick={() => setSelectedListingForCalendar('all')}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              selectedListingForCalendar === 'all'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            All Properties
          </button>
          {userListings.map((property) => (
            <div
              key={property.property_uid}
              className='flex items-center gap-2'
            >
              <button
                onClick={() =>
                  setSelectedListingForCalendar(property.property_uid)
                }
                className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 ${
                  selectedListingForCalendar === property.property_uid
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                style={{
                  borderColor:
                    propertyColors[property.property_uid] || '#d1d5db',
                }}
              >
                <span
                  className='w-3 h-3 rounded-full mr-2'
                  style={{
                    backgroundColor:
                      propertyColors[property.property_uid] || '#d1d5db',
                  }}
                />
                {property.title}
              </button>
              <div className='relative color-picker-container'>
                <button
                  onClick={() =>
                    setColorPickerOpen(
                      colorPickerOpen === property.property_uid
                        ? null
                        : property.property_uid,
                    )
                  }
                  className='p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
                  title='Choose color'
                >
                  <svg
                    className='w-4 h-4 text-gray-600 dark:text-gray-400'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v6a2 2 0 002 2h4a2 2 0 002-2V5zM21 15a2 2 0 00-2-2h-4a2 2 0 00-2 2v2a2 2 0 002 2h4a2 2 0 002-2v-2z'
                    />
                  </svg>
                </button>
                {colorPickerOpen === property.property_uid && (
                  <div className='absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 z-50'>
                    <PropertyColorPicker
                      value={
                        propertyColors[property.property_uid] ||
                        PROPERTY_COLORS[0]
                      }
                      onChange={(color) => {
                        handleColorChange(property.property_uid, color);
                        setColorPickerOpen(null);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {selectedListingForCalendar === 'all' && (
          <p className='text-sm text-gray-500 dark:text-gray-400 mt-2'>
            Viewing all properties. Select a specific property to add new
            showing times.
            <span className='text-blue-600 dark:text-blue-400'>
              Click on any showing box to remove it.
            </span>
          </p>
        )}
        {selectedListingForCalendar !== 'all' && (
          <p className='text-sm text-gray-500 dark:text-gray-400 mt-2'>
            Click and drag on the calendar to add showing times for this
            property. Other properties' showings appear faded.
            <span className='text-red-600 dark:text-red-400'>
              Red slots indicate conflicts
            </span>{' '}
            with existing showings for this property.
            <br />
            <span className='text-blue-600 dark:text-blue-400'>
              Click on any showing box to remove it.
            </span>{' '}
            Hover to see the delete (×) button.
            <br />
            <span className='text-green-600 dark:text-green-400'>
              Adjacent time slots are automatically merged
            </span>{' '}
            into continuous blocks.
          </p>
        )}
      </div>

      {/* Calendar Header */}
      <div className='flex items-center justify-between mb-6'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
          {days[0].toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}{' '}
          -{' '}
          {days[6].toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </h3>
        <div className='flex gap-2'>
          <button
            onClick={() => navigateWeek('prev')}
            className='p-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
          >
            ←
          </button>
          <button
            onClick={() => navigateWeek('next')}
            className='p-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
          >
            →
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div
        className='bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden'
        onMouseUp={handleTimeSlotMouseUp}
        onMouseLeave={handleTimeSlotMouseUp}
      >
        {/* Days of week header */}
        <div className='grid grid-cols-8 border-b border-gray-200 dark:border-gray-700'>
          <div className='p-3 text-sm font-medium text-gray-500 dark:text-gray-400'>
            Time
          </div>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className='p-3 text-sm font-medium text-gray-500 dark:text-gray-400 text-center'
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar rows */}
        {timeSlots.map((slot) => (
          <div
            key={slot.value}
            className='grid grid-cols-8 border-b border-gray-200 dark:border-gray-700'
          >
            <div className='p-1 text-xs text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700 flex items-center'>
              {slot.minute === 0 && slot.label}
            </div>
            {days.map((day) => {
              const allShowings = getShowingsForDate(day);
              const selectedPropertyShowings =
                selectedListingForCalendar === 'all'
                  ? allShowings
                  : getShowingsForDateAndProperty(
                      day,
                      selectedListingForCalendar,
                    );
              const otherPropertyShowings = getOtherPropertyShowings(day);

              // Get all overlapping showings for this time slot
              const overlappingShowings = getOverlappingShowings(day, slot);

              const hasSelectedPropertyShowing = selectedPropertyShowings.some(
                (showing) => {
                  const showingStart = new Date(showing.startTime);
                  const showingEnd = new Date(showing.endTime);
                  const slotStart = new Date(day);
                  slotStart.setHours(slot.hour, slot.minute, 0, 0);
                  const slotEnd = new Date(slotStart.getTime() + 15 * 60000);

                  return (
                    (showingStart <= slotStart && showingEnd > slotStart) ||
                    (showingStart < slotEnd && showingEnd >= slotEnd) ||
                    (showingStart >= slotStart && showingEnd <= slotEnd)
                  );
                },
              );

              const hasOtherPropertyShowing = otherPropertyShowings.some(
                (showing) => {
                  const showingStart = new Date(showing.startTime);
                  const showingEnd = new Date(showing.endTime);
                  const slotStart = new Date(day);
                  slotStart.setHours(slot.hour, slot.minute, 0, 0);
                  const slotEnd = new Date(slotStart.getTime() + 15 * 60000);

                  return (
                    (showingStart <= slotStart && showingEnd > slotStart) ||
                    (showingStart < slotEnd && showingEnd >= slotEnd) ||
                    (showingStart >= slotStart && showingEnd <= slotEnd)
                  );
                },
              );

              const isSelected = isSlotSelected(day, slot.value);

              // Check if this slot is conflicted for the selected property (only when a specific property is selected)
              const isConflicted =
                selectedListingForCalendar !== 'all' &&
                isSlotConflicted(day, slot.value, selectedListingForCalendar);

              return (
                <div
                  key={`${day.toISOString()}-${slot.value}`}
                  className={`relative p-1 border-r border-gray-200 dark:border-gray-700 min-h-[15px] select-none ${
                    selectedListingForCalendar !== 'all' && !isConflicted
                      ? 'cursor-pointer'
                      : 'cursor-not-allowed'
                  } ${
                    isSelected
                      ? 'bg-blue-200 dark:bg-blue-800'
                      : selectedListingForCalendar !== 'all' && !isConflicted
                        ? 'hover:bg-gray-50 dark:hover:bg-gray-700'
                        : ''
                  } ${
                    hasOtherPropertyShowing &&
                    !hasSelectedPropertyShowing &&
                    selectedListingForCalendar !== 'all'
                      ? 'opacity-50'
                      : ''
                  } ${
                    isConflicted ? 'bg-red-100 dark:bg-red-900 opacity-60' : ''
                  }`}
                  onMouseDown={() => handleTimeSlotMouseDown(day, slot.value)}
                  onMouseEnter={() => handleTimeSlotMouseEnter(day, slot.value)}
                  onMouseUp={handleTimeSlotMouseUp}
                >
                  {/* Overlapping property color bars */}
                  {overlappingShowings.length > 0 &&
                    !isSelected &&
                    !isConflicted && (
                      <div className='absolute inset-1 flex'>
                        {overlappingShowings.map((showing, index) => {
                          const width = `${100 / overlappingShowings.length}%`;
                          const isSelectedProperty =
                            selectedListingForCalendar !== 'all' &&
                            showing.propertyUid === selectedListingForCalendar;
                          const opacity =
                            selectedListingForCalendar === 'all' ||
                            isSelectedProperty
                              ? 1
                              : 0.3;

                          return (
                            <div
                              key={showing.id}
                              className='h-full'
                              style={{
                                width,
                                backgroundColor:
                                  propertyColors[showing.propertyUid] ||
                                  PROPERTY_COLORS[0],
                                opacity,
                              }}
                              title={`${showing.propertyTitle} - ${new Date(showing.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} to ${new Date(showing.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                            />
                          );
                        })}
                      </div>
                    )}

                  {slot.minute === 0 && (
                    <div className='text-xs text-gray-600 dark:text-gray-400 mb-1 relative z-10'>
                      {day.getDate()}
                    </div>
                  )}
                  {(hasSelectedPropertyShowing || hasOtherPropertyShowing) &&
                    slot.minute === 0 && (
                      <div className='space-y-1 relative z-10'>
                        {/* Selected property showings - clickable with delete button */}
                        {selectedPropertyShowings
                          .filter((showing) => {
                            const showingHour = new Date(
                              showing.startTime,
                            ).getHours();
                            return showingHour === slot.hour;
                          })
                          .map((showing) => (
                            <div
                              key={showing.id}
                              className='text-xs text-white p-1 rounded truncate cursor-pointer hover:opacity-80 relative group'
                              style={{
                                backgroundColor:
                                  propertyColors[showing.propertyUid] ||
                                  PROPERTY_COLORS[0],
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                promptDeleteShowing(showing);
                              }}
                              title={`Click to remove: ${showing.propertyTitle}`}
                            >
                              <span className='block pr-4'>
                                {showing.propertyTitle.slice(0, 15)}...
                              </span>
                              <span className='absolute top-0 right-0 opacity-0 group-hover:opacity-100 text-xs font-bold leading-none transition-opacity'>
                                ×
                              </span>
                            </div>
                          ))}
                        {/* Other property showings - clickable when viewing all, faded when viewing specific property */}
                        {otherPropertyShowings
                          .filter((showing) => {
                            const showingHour = new Date(
                              showing.startTime,
                            ).getHours();
                            return showingHour === slot.hour;
                          })
                          .map((showing) => (
                            <div
                              key={showing.id}
                              className={`text-xs p-1 rounded truncate relative group ${
                                selectedListingForCalendar === 'all'
                                  ? 'text-white cursor-pointer hover:opacity-80'
                                  : 'text-gray-600 dark:text-gray-400 opacity-40 cursor-default'
                              }`}
                              style={{
                                backgroundColor:
                                  selectedListingForCalendar === 'all'
                                    ? propertyColors[showing.propertyUid] ||
                                      PROPERTY_COLORS[0]
                                    : `${propertyColors[showing.propertyUid] || '#e5e7eb'}40`,
                              }}
                              onClick={
                                selectedListingForCalendar === 'all'
                                  ? (e) => {
                                      e.stopPropagation();
                                      promptDeleteShowing(showing);
                                    }
                                  : undefined
                              }
                              title={
                                selectedListingForCalendar === 'all'
                                  ? `Click to remove: ${showing.propertyTitle}`
                                  : undefined
                              }
                            >
                              <span
                                className={
                                  selectedListingForCalendar === 'all'
                                    ? 'block pr-4'
                                    : 'block'
                                }
                              >
                                {showing.propertyTitle.slice(0, 15)}...
                              </span>
                              {selectedListingForCalendar === 'all' && (
                                <span className='absolute top-0 right-0 opacity-0 group-hover:opacity-100 text-xs font-bold leading-none transition-opacity'>
                                  ×
                                </span>
                              )}
                            </div>
                          ))}
                      </div>
                    )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Add Showing Modal */}
      {showAddModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg w-full max-w-md'>
            <h3 className='text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>
              Add Available Showing Time
            </h3>

            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300'>
                  Date & Time
                </label>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  {selectedTimeRange &&
                    (() => {
                      const startHour = Math.floor(
                        selectedTimeRange.startSlot / 60,
                      );
                      const startMinute = selectedTimeRange.startSlot % 60;
                      const endHour = Math.floor(
                        (selectedTimeRange.endSlot + 15) / 60,
                      );
                      const endMinute = (selectedTimeRange.endSlot + 15) % 60;

                      const startTime = new Date(
                        `${selectedTimeRange.date}T${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}:00`,
                      );
                      const endTime = new Date(
                        `${selectedTimeRange.date}T${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}:00`,
                      );

                      return `${startTime.toLocaleDateString()} ${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                    })()}
                </p>
              </div>

              <div>
                <label className='block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300'>
                  Property
                </label>
                <select
                  value={selectedProperty}
                  onChange={(e) => setSelectedProperty(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  required
                >
                  <option value=''>Select a property...</option>
                  {userListings.map((property) => (
                    <option
                      key={property.property_uid}
                      value={property.property_uid}
                    >
                      {property.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className='flex gap-3 pt-4'>
                <button
                  onClick={handleAddShowing}
                  disabled={!selectedProperty || isLoading}
                  className='flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50'
                >
                  {isLoading ? 'Adding...' : 'Add Showing Time'}
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className='flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg transition-colors'
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Showing Confirmation Modal */}
      {showingToDelete && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg w-full max-w-md'>
            <h3 className='text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>
              Remove Showing Time
            </h3>

            <div className='space-y-4'>
              <div>
                <p className='text-sm text-gray-600 dark:text-gray-400 mb-2'>
                  Are you sure you want to remove this showing time?
                </p>
                <div className='p-3 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                  <p className='text-sm font-medium text-gray-900 dark:text-gray-100'>
                    {showingToDelete.title}
                  </p>
                  <p className='text-xs text-gray-600 dark:text-gray-400'>
                    {showingToDelete.time}
                  </p>
                </div>
              </div>

              <div className='flex gap-3 pt-4'>
                <button
                  onClick={() => handleDeleteShowing(showingToDelete.id)}
                  className='flex-1 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors'
                >
                  Remove Showing
                </button>
                <button
                  onClick={() => setShowingToDelete(null)}
                  className='flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg transition-colors'
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Property Color Assignment Info - for development/testing */}
      <div className='mt-8'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-3'>
          Property Color Assignments
        </h3>
        <div className='flex flex-wrap gap-4'>
          {userListings.map((property) => (
            <div
              key={property.property_uid}
              className='flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg'
            >
              <span
                className='w-4 h-4 rounded-full border border-gray-300'
                style={{
                  backgroundColor:
                    propertyColors[property.property_uid] || PROPERTY_COLORS[0],
                }}
              />
              <span className='text-sm text-gray-700 dark:text-gray-300'>
                {property.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
