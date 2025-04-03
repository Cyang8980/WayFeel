import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { initMap } from "./mapUtils"; // Import initMap from mapUtils

const MapComponent = () => {
  const { isSignedIn, user } = useUser();
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    initMap("map", isSignedIn!, user ?? null).then(() => {
      setIsMapLoaded(true);
    });
  }, [isSignedIn, user]);

  // Log map loading status outside useEffect
  console.log("Map is loaded:", isMapLoaded);
};

export default MapComponent;
