import React, { useEffect, useRef } from "react";

const GoogleMap = () => {
  const mapRef = useRef<google.maps.Map | null>(null);

  // Function to initialize the map
  const initializeMap = () => {
    const mapElement = document.getElementById("map");
    if (!mapRef.current && mapElement) {
      mapRef.current = new window.google.maps.Map(mapElement, {
        center: { lat: 37.7749, lng: -122.4194 }, // Change this to your desired center
        zoom: 10,
      });
    }
  };

  // Load the Google Maps script and initialize the map once it's loaded
  const loadGoogleMapsScript = () => {
    // If Google Maps is already loaded, initialize the map immediately
    if (window.google && window.google.maps) {
      initializeMap();
    } else {
      // Create the script tag to load the API
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_MAP_API_KEY}&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      // Set up a global callback for Google Maps
      (window as any).initMap = initializeMap;
    }
  };

  useEffect(() => {
    loadGoogleMapsScript();
  }, []);

  return (
    <div
      id="map"
      style={{ height: "400px", width: "100%" }}
      className="rounded-lg shadow-lg"
    />
  );
};

export default GoogleMap;
