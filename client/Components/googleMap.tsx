import React, { useEffect, useRef } from "react";

const GoogleMap = () => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Function to initialize the map and set user's location
  const initializeMap = () => {
    if (!mapRef.current && document.getElementById("map")) {
      mapRef.current = new window.google.maps.Map(document.getElementById("map"), {
        zoom: 12, // Adjust zoom level as needed
      });

      // Try to get user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            // Center map on user's location
            mapRef.current.setCenter(userLocation);

            // Place a marker on user's location
            markerRef.current = new window.google.maps.Marker({
              position: userLocation,
              map: mapRef.current,
              title: "You are here",
            });
          },
          (error) => {
            console.error("Error getting location:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    }
  };

  // Load Google Maps script and initialize the map
  const loadGoogleMapsScript = () => {
    if (window.google && window.google.maps) {
      initializeMap();
    } else {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_MAP_API_KEY}&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      window.initMap = initializeMap;
    }
  };

  useEffect(() => {
    loadGoogleMapsScript();
  }, []);

  return (
    <div id="map" style={{ height: "400px", width: "100%" }} className="rounded-lg shadow-lg" />
  );
};

export default GoogleMap;
