"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { initMap } from "@/pages/api/mapUtils";

const MapComponent = () => {
  const { isSignedIn, user } = useUser();
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      initMap("map", isSignedIn, user ?? null).then(() => {
        setIsMapLoaded(true);
      });
    }
  }, [isSignedIn, user]);

  return (
    <div id="map" style={{ width: "100%", height: "100vh" }}>
      {!isMapLoaded && <div>Loading map...</div>}
    </div>
  );
};

export default MapComponent;
