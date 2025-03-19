export let map: google.maps.Map;

// Create image elements for the markers only on the client side

function createImageElement(src: string): HTMLImageElement {
  const img = document.createElement('img');
  img.src = src;
  img.style.width = '40px';
  img.style.height = '40px';
  return img;
}

let sadPotato: HTMLImageElement;
let angryPotato: HTMLImageElement;
let mehPotato: HTMLImageElement;
let happyPotato: HTMLImageElement;
let excitedPotato: HTMLImageElement;

export async function initMap() {
  if (typeof window === "undefined" || typeof document === "undefined") {
    console.error("This code is running on the server, not in the browser.");
    return;
  }

  const mapElement = document.getElementById("map") as HTMLElement | null;

  if (!mapElement) {
    console.error("Map element not found.");
    return;
  }

  // Ensure that the 'maps' and 'marker' libraries are loaded
  const { Map } = (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;
  const { AdvancedMarkerElement } = (await google.maps.importLibrary('marker')) as google.maps.MarkerLibrary;

  map = new Map(mapElement, {
    zoom: 14,
    center: { lat: 40.6782, lng: -73.9442 },
    mapId: "DEMO_MAP_ID",
  });

  // Create image elements for the markers
  sadPotato = document.createElement('img');
  angryPotato = document.createElement('img');
  mehPotato = document.createElement('img');
  happyPotato = document.createElement('img');
  excitedPotato = document.createElement('img');

  sadPotato.src = 'sad.svg';
  angryPotato.src = 'angry.svg';
  mehPotato.src = 'meh.svg';
  happyPotato.src = 'happy.svg';
  excitedPotato.src = 'excited.svg';

  // Optionally set styles or sizes for the images to ensure they display correctly
  sadPotato.style.width = '50px';
  sadPotato.style.height = '50px';
  angryPotato.style.width = '50px';
  angryPotato.style.height = '50px';
  mehPotato.style.width = '50px';
  mehPotato.style.height = '50px';
  happyPotato.style.width = '50px';
  happyPotato.style.height = '50px';
  excitedPotato.style.width = '50px';
  excitedPotato.style.height = '50px';

  // Add a click listener to the map to place a new marker
  map.addListener("click", (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      placeMarkerAndPanTo(e.latLng, map);
    }
  });
}

// Function to place a new marker and pan to its location
function placeMarkerAndPanTo(latLng: google.maps.LatLng, map: google.maps.Map) {
  // Create a new image element for the new marker
  const newMarkerImage = createImageElement('happy.svg'); // Reuse the same 'happy.svg' or any other image

  // Create a new marker with the new image as its content
  const newMarker = new google.maps.marker.AdvancedMarkerElement({
    position: latLng,
    map: map,
    content: newMarkerImage, // New marker with an image as its content
  });
  map.panTo(latLng); // Pan the map to the new marker position
}
