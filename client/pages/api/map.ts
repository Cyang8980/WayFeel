export let map: google.maps.Map;

// export async function initMap(styleArray: google.maps.MapTypeStyle[]) {
export async function initMap() {
  console.log("Initializing map...");

  // Request needed libraries
  // const { Map } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;
  // const { AdvancedMarkerElement } = (await google.maps.importLibrary("marker")) as google.maps.MarkerLibrary;

  const myLatlng = { lat: 40.6782, lng: -73.9442 };

  // Initialize the map
  map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
    zoom: 14,
    center: myLatlng,
    mapId: "DEMO_MAP_ID",
    // styles: styleArray
    // styles:
  });

  // Add a click listener to the map to place a marker
  map.addListener("click", (e: google.maps.MapMouseEvent) => {
    if (e.latLng) { // Check if latLng is not null
      placeMarkerAndPanTo(e.latLng, map);
    }
  });
}

function placeMarkerAndPanTo(latLng: google.maps.LatLng, map: google.maps.Map) {
  new google.maps.marker.AdvancedMarkerElement({
    position: latLng,
    map: map,
  });
  map.panTo(latLng);
}
