export let map: google.maps.Map;
import { insertMarker } from "./insertMarker";
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
    console.error("This code is running on the server, not in the browser.");
    return;
  }

  const mapElement = document.getElementById(
    mapElementId
  ) as HTMLElement | null;
  if (!mapElement) {
    console.error("Map element not found.");
    return;
  }

  const { Map } = (await google.maps.importLibrary(
    "maps"
  )) as google.maps.MapsLibrary;
  const { AdvancedMarkerElement } = (await google.maps.importLibrary(
    "marker"
  )) as google.maps.MarkerLibrary;

  map = new Map(mapElement, {
    zoom: 14,
    center: { lat: 40.6782, lng: -73.9442 },
    mapId: "DEMO_MAP_ID",
  });

  // Click event for placing markers
  map.addListener("click", (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      openPotatoSelectionDialog(e.latLng, map, isSignedIn, user);
    }
  });
};

// Handles potato selection and marker placement
const openPotatoSelectionDialog = (
  latLng: google.maps.LatLng,
  map: google.maps.Map,
  isSignedIn: boolean,
  user: { id: string } | null
) => {
  const potatoOptions = [
    { name: "Sad Potato", src: "sad.svg" },
    { name: "Angry Potato", src: "angry.svg" },
    { name: "Meh Potato", src: "meh.svg" },
    { name: "Happy Potato", src: "happy.svg" },
    { name: "Excited Potato", src: "excited.svg" },
  ];

  // Modal container
  const modal = document.createElement("div");
  Object.assign(modal.style, getModalStyles());

  // Title
  const title = document.createElement("h2");
  title.innerText = "Choose a Potato";
  title.style.textAlign = "center";
  modal.appendChild(title);

  // Create potato selection buttons
  const potatoList = document.createElement("div");
  Object.assign(potatoList.style, getPotatoListStyles());

  const anonContainer = document.createElement("div");
  Object.assign(anonContainer.style, getAnonContainerStyles());

  const anonLabel = document.createElement("label");
  anonLabel.innerText = "Anonymous";
  anonLabel.style.marginRight = "10px";

  const anonSlider = document.createElement("input");
  anonSlider.type = "checkbox";
  anonSlider.style.cursor = "pointer";

  anonContainer.appendChild(anonLabel);
  anonContainer.appendChild(anonSlider);

  // Append potato buttons
  potatoOptions.forEach((option) => {
    const potatoButton = document.createElement("button");
    Object.assign(potatoButton.style, getPotatoButtonStyles());

    const potatoImage = document.createElement("img");
    potatoImage.src = option.src;
    potatoImage.alt = option.name;
    potatoImage.style.width = "50px";
    potatoImage.style.height = "50px";

    potatoButton.appendChild(potatoImage);

    potatoButton.onclick = () => {
      const emojiIdMap: { [key: string]: number } = {
        "sad.svg": 1,
        "angry.svg": 2,
        "meh.svg": 3,
        "happy.svg": 4,
        "excited.svg": 5,
      };

      const emoji_id = emojiIdMap[option.src];
      const isAnonymous = anonSlider.checked; // Use slider state

      placeMarkerAndPanTo(latLng, map, emoji_id, isSignedIn, user, isAnonymous);
      document.body.removeChild(modal);
    };

    potatoList.appendChild(potatoButton);
  });

  modal.appendChild(potatoList);
  modal.appendChild(anonContainer);
  document.body.appendChild(modal);
};

// Places marker on map
const placeMarkerAndPanTo = async (
  latLng: google.maps.LatLng,
  map: google.maps.Map,
  emoji_id: number,
  isSignedIn: boolean,
  user: { id: string } | null,
  isAnonymous: boolean
) => {
  const emojiImages: { [key: number]: string } = {
    1: "sad.svg",
    2: "angry.svg",
    3: "meh.svg",
    4: "happy.svg",
    5: "excited.svg",
  };

  const newMarkerImage = createImageElement(
    emojiImages[emoji_id] || "happy.svg"
  );

  new google.maps.marker.AdvancedMarkerElement({
    position: latLng,
    map: map,
    content: newMarkerImage,
  });

  // Insert marker into the database
  if (isSignedIn && user?.id) {
    try {
      await insertMarker({
        id: uuidv4(),
        longitude: latLng.lng(),
        latitude: latLng.lat(),
        emoji_id: emoji_id,
        created_by: user.id,
        anon: isAnonymous,
      });
      console.log(`Marker inserted! (Anonymous: ${isAnonymous})`);
    } catch (error) {
      console.error("Failed to insert marker:", error);
    }
  }

  map.panTo(latLng);
};

// 🔹 Helper functions for styles
const getModalStyles = () => ({
  position: "absolute",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)",
  padding: "20px",
  background: "white",
  border: "1px solid #ccc",
  borderRadius: "8px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  zIndex: "1000",
});

const getPotatoListStyles = () => ({
  display: "flex",
  justifyContent: "space-around",
  flexWrap: "wrap",
  gap: "10px",
});

const getAnonContainerStyles = () => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginTop: "15px",
});

const getPotatoButtonStyles = () => ({
  padding: "10px",
  border: "2px solid #ccc",
  background: "transparent",
  cursor: "pointer",
  width: "80px",
  height: "80px",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "transform 0.3s ease",
});
