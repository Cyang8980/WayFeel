import { useState, useEffect, useRef, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { initMap, loadMarkersWithFilters, ApiMarker, toWayfeelEvent, MarkerFilterOptions, setMarkerReloadCallback } from '../pages/api/mapUtils';
import { WayfeelEvent } from '../types/events';

interface UseMapInitializationProps {
  startDate: Date | null;
  endDate: Date | null;
  selectedView: string;
}

export function useMapInitialization({ startDate, endDate, selectedView }: UseMapInitializationProps) {
  const { isSignedIn, user } = useUser();
  const [mapScriptLoaded, setMapScriptLoaded] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<WayfeelEvent | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  
  const googleMapsRef = useRef<google.maps.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  // Load Google Maps script
  useEffect(() => {
    if (window.google?.maps) {
      setMapScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_MAP_API_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapScriptLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Handle marker click
  const handleMarkerClick = (marker: ApiMarker) => {
    console.log("Raw marker from initMap:", marker);
    console.log("Converted WayfeelEvent:", toWayfeelEvent(marker));
    setSelectedMarker(toWayfeelEvent(marker));
    setIsEventModalOpen(true);
  };

  // Function to reload markers with current filters (exposed for external use)
  const reloadMarkers = useCallback(async () => {
    if (mapInitialized && user) {
      const filterOptions: MarkerFilterOptions = {};

      // Apply view filter
      if (selectedView === "personal" && user?.id) {
        filterOptions.user_id = user.id;
        filterOptions.anonFilter = "all";
      } else if (selectedView === "anon") {
        filterOptions.anonFilter = "only";
      } else if (selectedView === "notanon") {
        filterOptions.anonFilter = "exclude";
      } else if (selectedView === "all") {
        filterOptions.anonFilter = "all";
      }

      // Apply date filters
      if (startDate) {
        filterOptions.startDate = startDate;
      }
      if (endDate) {
        filterOptions.endDate = endDate;
      }

      await loadMarkersWithFilters(filterOptions, handleMarkerClick);
    }
  }, [mapInitialized, user, selectedView, startDate, endDate]);

  // Initialize map when ready (loads personal markers first)
  useEffect(() => {
    if (mapScriptLoaded && mapContainerRef.current && user && !mapInitialized) {
      googleMapsRef.current = new window.google.maps.Map(mapContainerRef.current, {
        zoom: 8,
        center: { lat: 37.7749, lng: -122.4194 },
      });

      // Initialize map with personal markers first
      initMap(
        'map',
        isSignedIn,
        user,
        undefined, // startDate
        undefined, // endDate
        'personal', // selectedView - default to personal
        handleMarkerClick
      );

      setMapInitialized(true);
    }
  }, [mapScriptLoaded, user, isSignedIn, mapInitialized]);

  // Set up marker reload callback
  useEffect(() => {
    setMarkerReloadCallback(() => {
      if (mapInitialized && user) {
        reloadMarkers();
      }
    });

    return () => {
      setMarkerReloadCallback(null);
    };
  }, [mapInitialized, user, reloadMarkers]);

  // Load markers based on filter changes
  useEffect(() => {
    if (mapInitialized && user) {
      const filterOptions: MarkerFilterOptions = {};

      // Apply view filter
      if (selectedView === "personal" && user?.id) {
        filterOptions.user_id = user.id;
        filterOptions.anonFilter = "all";
      } else if (selectedView === "anon") {
        filterOptions.anonFilter = "only";
      } else if (selectedView === "notanon") {
        filterOptions.anonFilter = "exclude";
      } else if (selectedView === "all") {
        filterOptions.anonFilter = "all";
      }

      // Apply date filters
      if (startDate) {
        filterOptions.startDate = startDate;
      }
      if (endDate) {
        filterOptions.endDate = endDate;
      }

      // Debug logging
      console.log("Filtering markers with options:", {
        selectedView,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        filterOptions
      });

      // Load markers with new filters
      loadMarkersWithFilters(filterOptions, handleMarkerClick);
    }
  }, [startDate, endDate, selectedView, mapInitialized, user, isSignedIn]);

  // Function to load markers with custom filters (exposed for external use)
  const loadCustomMarkers = async (customFilters: MarkerFilterOptions) => {
    if (mapInitialized) {
      await loadMarkersWithFilters(customFilters, handleMarkerClick);
    }
  };

  return {
    mapContainerRef,
    mapScriptLoaded,
    mapInitialized,
    selectedMarker,
    isEventModalOpen,
    setIsEventModalOpen,
    setSelectedMarker,
    loadCustomMarkers, // Expose the function for external use
    reloadMarkers, // Expose the reload function for external use
  };
}
