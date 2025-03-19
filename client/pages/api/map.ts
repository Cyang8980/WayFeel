import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { initMap } from "./mapUtils"; // Import initMap from mapUtils

const MapComponent = () => {
  const { isSignedIn, user } = useUser();
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    // Call initMap here
    initMap("map", isSignedIn!, user).then(() => setIsMapLoaded(true));
  }, [isSignedIn, user]);

};

export default MapComponent;
