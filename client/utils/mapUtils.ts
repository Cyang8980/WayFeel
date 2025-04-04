"use client";

export let map: google.maps.Map;
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
    center: { lat: 40.7128, lng: -74.006 },
    zoom: 8,
  });

  // Rest of your map initialization code...
};

export const insertMarker = async (marker: {
  id: string;
  longitude: number;
  latitude: number;
  emoji_id: number;
  created_by: string;
  anon: boolean;
}) => {
  try {
    const response = await fetch("/api/insertMarker", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(marker),
    });

    if (!response.ok) {
      throw new Error("Failed to insert marker");
    }

    return await response.json();
  } catch (error) {
    console.error("Error inserting marker:", error);
    throw error;
  }
};
