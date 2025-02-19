// components/GoogleMap.jsx
import React, { useEffect, useRef } from "react";
import { initMap } from "@/pages/api/map";
const GoogleMap = () => {
  const googleMapsRef = useRef<google.maps.Map | null>(null);
  // Load the Google Maps script and initialize the map once it's loaded
  const loadGoogleMapsScript = () => {
      if (window.google && window.google.maps) {
        googleMapsRef.current = new window.google.maps.Map(
          document.getElementById("map") as HTMLElement,
          {
            center: { lat: 37.7749, lng: -122.4194 }, // Set default map center (example: San Francisco)
            zoom: 10,
          }
        );
        initMap();
      } else {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_MAP_API_KEY}&callback=initMap`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          if (window.google && window.google.maps) {
            googleMapsRef.current = new window.google.maps.Map(
              document.getElementById("map") as HTMLElement,
              {
                center: { lat: 37.7749, lng: -122.4194 }, // Set default map center
                zoom: 10,
              }
            );
            initMap(); // Ensure this is only called once the script is loaded
          }
        };
        document.head.appendChild(script);
  
        // Define the initMap function globally so Google Maps can call it once the script is loaded
        window.initMap = () => {
          if (window.google && window.google.maps) {
            googleMapsRef.current = new window.google.maps.Map(
              document.getElementById("map") as HTMLElement,
              {
                center: { lat: 37.7749, lng: -122.4194 },
                zoom: 10,
              }
            );
            initMap();
          }
        };
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
