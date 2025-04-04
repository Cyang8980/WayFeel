"use client";

export let map: google.maps.Map;
import { insertMarker } from "@/pages/api/insertMarker";
import { v4 as uuidv4 } from "uuid";

// Helper function for creating image elements
export function createImageElement(src: string): HTMLImageElement {
  const img = document.createElement("img");
  img.src = src;
  img.style.width = "40px";
  img.style.height = "40px";
  return img;
}

// Initialize Google Map
export const initMap = async (
  mapElementId: string,
  isSignedIn: boolean,
  user: { id: string } | null
) => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  const mapElement = document.getElementById(mapElementId);
  if (!mapElement) {
    console.error(`Map element with id ${mapElementId} not found`);
    return;
  }

  map = new google.maps.Map(mapElement, {
    center: { lat: 37.7749, lng: -122.4194 },
    zoom: 8,
  });

  // Rest of your map initialization code...
};
