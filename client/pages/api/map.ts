export let map: google.maps.Map;

export function initMap() {
  console.log("Initializing map...");

  // Ensure google and google.maps are available
  if (window.google && window.google.maps) {
    const center: google.maps.LatLngLiteral = { lat: 40.6782, lng: -73.9442 }; // Corrected longitude
    map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
      center,
      zoom: 12, // Increased zoom for better visibility
    });
    console.log("Map initialized successfully");
  } else {
    console.error("Google Maps API is not loaded");
  }
}
