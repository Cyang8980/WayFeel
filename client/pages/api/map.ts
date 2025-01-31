export let map: google.maps.Map;

export async function initMap() {
  // Request needed libraries.
  console.log("Initializing map...");
  const { Map } = (await google.maps.importLibrary(
    "maps"
  )) as google.maps.MapsLibrary;
  const { AdvancedMarkerElement } = (await google.maps.importLibrary(
    "marker"
  )) as google.maps.MarkerLibrary;

  const myLatlng = { lat: 40.6782, lng: -73.9442 };

  // Initialize the map
  map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
    zoom: 14,
    center: myLatlng,
    mapId: "DEMO_MAP_ID",
  });

  // Add a click listener to the map to place a marker
  map.addListener("click", (e: { latLng: google.maps.LatLng }) => {
    placeMarkerAndPanTo(e.latLng, map);
  });
}

function placeMarkerAndPanTo(latLng: google.maps.LatLng, map: google.maps.Map) {
  new google.maps.marker.AdvancedMarkerElement({
    position: latLng,
    map: map,
  });
  map.panTo(latLng);
}
