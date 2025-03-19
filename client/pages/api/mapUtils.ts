// mapUtils.ts

export let map: google.maps.Map;
import { insertMarker } from './insertMarker' 
import {v4 as uuidv4} from 'uuid';
// import { getMarkers } from './getMarkers'

export function createImageElement(src: string): HTMLImageElement {
  const img = document.createElement("img");
  img.src = src;
  img.style.width = "40px";
  img.style.height = "40px";
  return img;
}

export const initMap = async (mapElementId: string, isSignedIn: boolean, user: any) => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    console.error("This code is running on the server, not in the browser.");
    return;
  }
  console.log()
  const mapElement = document.getElementById(mapElementId) as HTMLElement | null;

  if (!mapElement) {
    console.error("Map element not found.");
    return;
  }

  const { Map } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;
  const { AdvancedMarkerElement } = (await google.maps.importLibrary("marker")) as google.maps.MarkerLibrary;

  map = new Map(mapElement, {
    zoom: 14,
    center: { lat: 40.6782, lng: -73.9442 },
    mapId: "DEMO_MAP_ID",
  });

  // Marker images initialization
  const sadPotato = createImageElement("sad.svg");
  const angryPotato = createImageElement("angry.svg");
  const mehPotato = createImageElement("meh.svg");
  const happyPotato = createImageElement("happy.svg");
  const excitedPotato = createImageElement("excited.svg");

  map.addListener("click", (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      console.log("Clicked LatLng:", e.latLng.lat(), e.latLng.lng()); // Log directly
      openPotatoSelectionDialog(e.latLng, map, isSignedIn, user);
    }
  });
  const openPotatoSelectionDialog = (
    latLng: google.maps.LatLng,
    map: google.maps.Map,
    isSignedIn: boolean,
    user: any
) => {
    const potatoOptions = [
        { name: "Sad Potato", src: "sad.svg" },
        { name: "Angry Potato", src: "angry.svg" },
        { name: "Meh Potato", src: "meh.svg" },
        { name: "Happy Potato", src: "happy.svg" },
        { name: "Excited Potato", src: "excited.svg" },
    ];

    const modal = document.createElement("div");
    modal.style.position = "absolute";
    modal.style.left = "50%";
    modal.style.top = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.padding = "20px";
    modal.style.background = "white";
    modal.style.border = "1px solid #ccc";
    modal.style.borderRadius = "8px";
    modal.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.2)";
    modal.style.zIndex = "1000";

    const title = document.createElement("h2");
    title.innerText = "Choose a Potato";
    title.style.textAlign = "center";
    modal.appendChild(title);

    const potatoList = document.createElement("div");
    potatoList.style.display = "flex";
    potatoList.style.justifyContent = "space-around";
    potatoList.style.flexWrap = "wrap";
    potatoList.style.gap = "10px";

    potatoOptions.forEach((option) => {
        const potatoButton = document.createElement("button");
        potatoButton.style.padding = "10px";
        potatoButton.style.border = "2px solid #ccc";
        potatoButton.style.background = "transparent";
        potatoButton.style.cursor = "pointer";
        potatoButton.style.width = "80px";
        potatoButton.style.height = "80px";
        potatoButton.style.borderRadius = "8px";
        potatoButton.style.display = "flex";
        potatoButton.style.alignItems = "center";
        potatoButton.style.justifyContent = "center";
        potatoButton.style.transition = "transform 0.3s ease";

        const potatoImage = document.createElement("img");
        potatoImage.src = option.src;
        potatoImage.alt = option.name;
        potatoImage.style.width = "50px";
        potatoImage.style.height = "50px";
        potatoImage.style.objectFit = "contain";
        potatoImage.style.borderRadius = "8px";

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

            // Get slider value for anonymity
            const isAnonymous = anonSlider.checked;

            placeMarkerAndPanTo(latLng, map, emoji_id, isSignedIn, user, isAnonymous);
            document.body.removeChild(modal);
        };

        potatoList.appendChild(potatoButton);
    });

    // Slider for anonymity selection
    const anonContainer = document.createElement("div");
    anonContainer.style.display = "flex";
    anonContainer.style.alignItems = "center";
    anonContainer.style.justifyContent = "center";
    anonContainer.style.marginTop = "15px";

    const anonLabel = document.createElement("label");
    anonLabel.innerText = "Anonymous";
    anonLabel.style.marginRight = "10px";

    const anonSlider = document.createElement("input");
    anonSlider.type = "checkbox";
    anonSlider.style.cursor = "pointer";

    anonContainer.appendChild(anonLabel);
    anonContainer.appendChild(anonSlider);

    modal.appendChild(potatoList);
    modal.appendChild(anonContainer);

    document.body.appendChild(modal);
};


  const placeMarkerAndPanTo = async (
    latLng: google.maps.LatLng,
    map: google.maps.Map,
    emoji_id: number, // Add emoji_id to the function arguments
    isSignedIn: boolean,
    user: any,
    isAnonymous: boolean // New parameter for anonymous upload
) => {
    const emojiImages: { [key: number]: string } = {
        1: "sad.svg",
        2: "angry.svg",
        3: "meh.svg",
        4: "happy.svg",
        5: "excited.svg",
    };

    const potatoImageSrc = emojiImages[emoji_id] || "happy.svg";
    const newMarkerImage = createImageElement(potatoImageSrc);

    const newMarker = new google.maps.marker.AdvancedMarkerElement({
        position: latLng,
        map: map,
        content: newMarkerImage,
    });

    // Insert the marker into the database
    if (isSignedIn && user) {
        try {
            await insertMarker({
                id: uuidv4(),
                longitude: latLng.lng(),
                latitude: latLng.lat(),
                emoji_id: emoji_id,
                created_by: user.id, // Handle anonymous uploads
                anon: isAnonymous
            });
            console.log(`Marker Successfully Inserted! (Anonymous: ${isAnonymous})`);
        } catch (error) {
            console.error("Failed to insert marker:", error);
        }
    }

    // Pan the map to the new marker location
    map.panTo(latLng);
  };
};

// You can also move `openPotatoSelectionDialog` here if necessary
