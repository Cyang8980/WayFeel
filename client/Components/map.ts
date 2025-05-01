import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { initMap } from "../pages/api/mapUtils";

const MapComponent = () => {
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    if (isSignedIn && user) {
      initMap("map", isSignedIn, user);
    }
  }, [isSignedIn, user]);

  return null;
};


export default MapComponent;
