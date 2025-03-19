// mapUtils.ts

export let map: google.maps.Map;
import { insertMarker } from './insertMarker' 
import {v4 as uuidv4} from 'uuid';
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
  const openPotatoSelectionDialog = (latLng: google.maps.LatLng, map: google.maps.Map, isSignedIn: boolean, user: any) => {
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
        placeMarkerAndPanTo(latLng, map, option.src, isSignedIn, user);
        document.body.removeChild(modal);
      };

      potatoButton.onmouseenter = () => {
        potatoButton.style.transform = "scale(1.1)";
      };
      potatoButton.onmouseleave = () => {
        potatoButton.style.transform = "scale(1)";
      };

      potatoList.appendChild(potatoButton);
    });

    modal.appendChild(potatoList);

    const closeButton = document.createElement("button");
    closeButton.innerText = "Close";
    closeButton.style.padding = "10px";
    closeButton.style.border = "2px solid #ccc";
    closeButton.style.background = "#f44336";
    closeButton.style.color = "white";
    closeButton.style.cursor = "pointer";
    closeButton.style.borderRadius = "8px";
    closeButton.style.marginTop = "20px";
    closeButton.style.width = "100%";
    closeButton.onclick = () => {
      document.body.removeChild(modal);
    };

    modal.appendChild(closeButton);

    document.body.appendChild(modal);
  };

  const placeMarkerAndPanTo = async (latLng: google.maps.LatLng, map: google.maps.Map, potatoImageSrc: string, isSignedIn: boolean, user: any) => {
    const newMarkerImage = createImageElement(potatoImageSrc);

    const newMarker = new google.maps.marker.AdvancedMarkerElement({
      position: latLng,
      map: map,
      content: newMarkerImage,
    });

    if (isSignedIn && user) {
    const lat = latLng.lat();
    const lng = latLng.lng();
    console.log("Latitude:", latLng.lat());
    console.log("Longitude:", latLng.lng());
      try {
        await insertMarker({
          id: uuidv4(),
          longitude: latLng.lng(),
          latitude: latLng.lat(),
          emoji_id: 1,
          created_by: user.id!,
        });
        console.log("Marker Successfully Inserted!");
      } catch (error) {
        console.error("Failed to insert user:", error);
      }
    }

    map.panTo(latLng);
  };
};

// You can also move `openPotatoSelectionDialog` here if necessary
