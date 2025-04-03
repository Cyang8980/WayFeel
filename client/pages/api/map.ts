import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { initMap } from "./mapUtils"; // Import initMap from mapUtils

const MapComponent = () => {
  const { isSignedIn, user } = useUser();
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    initMap("map", isSignedIn!, user).then(() => {
      setIsMapLoaded(true);
      console.log("Map is loaded:", isMapLoaded);
    });
  }, [isSignedIn, user]);
};

export default MapComponent;
