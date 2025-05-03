import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { initMap } from "../pages/api/mapUtils"; // Import initMap from mapUtils

const MapComponent = () => {
  const { isSignedIn, user } = useUser();
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    if (isSignedIn && user) {
      initMap("map", isSignedIn, user).then(() => setIsMapLoaded(true));
    }
  }, [isSignedIn, user]);
  
};

export default MapComponent;
