// mapUtils.ts

export let map: google.maps.Map;
import { insertMarker } from './insertMarker' 
import {v4 as uuidv4} from 'uuid';
import { getMarkersCurrUserAnon } from './getMarkers';

interface User {
  id: string;
}


let currentModal: HTMLElement | null = null;

export function createImageElement(src: string): HTMLImageElement {
  const img = document.createElement("img");
  img.src = src;
  img.style.width = "40px";
  img.style.height = "40px";
  return img;
}

export const initMap = async (mapElementId: string, isSignedIn: boolean, user: User, startDate?: Date, endDate?: Date) => {
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
    mapId: "2144d356e076f199b6e1e755"
  });

  // Fetch existing markers
  if (isSignedIn && user) {
    const markers = await getMarkersCurrUserAnon(user.id, startDate, endDate); 

    if (markers) {
      markers.forEach((marker) => {
        const emojiImages: { [key: number]: string } = {
          1: "sad.svg",
          2: "angry.svg",
          3: "meh.svg",
          4: "happy.svg",
          5: "excited.svg",
        };

        const potatoImageSrc = emojiImages[marker.emoji_id] || "happy.svg";
        const newMarkerImage = createImageElement(potatoImageSrc);

        new AdvancedMarkerElement({
          position: { lat: marker.latitude, lng: marker.longitude },
          map: map,
          content: newMarkerImage,
        });
      });
    }
  }

  // // Marker images initialization
  // const sadPotato = createImageElement("sad.svg");
  // const angryPotato = createImageElement("angry.svg");
  // const mehPotato = createImageElement("meh.svg");
  // const happyPotato = createImageElement("happy.svg");
  // const excitedPotato = createImageElement("excited.svg");

  map.addListener("click", (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      console.log("Clicked LatLng:", e.latLng.lat(), e.latLng.lng()); // Log directly
      openPotatoSelectionDialog(e.latLng, map, isSignedIn, user);
    }
  });

  // Potato Selection Modal
  // Safe utility to remove current modal
  function removeCurrentModal() {
    
    if (currentModal && currentModal.isConnected) {
      console.trace("Calling removeChild on node:", currentModal);
      currentModal.remove(); // safe and simple
    }
    currentModal = null;
  }

const openPotatoSelectionDialog = (
  latLng: google.maps.LatLng,
  map: google.maps.Map,
  isSignedIn: boolean,
  user: User
) => {
  removeCurrentModal();

  const modal = document.createElement("div");
  modal.id = "custom-potato-modal";
  currentModal = modal;
  Object.assign(modal.style, {
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
    width: "500px",
    height: "300px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  });

  const title = document.createElement("h2");
  title.innerText = "Choose a Potato";
  title.style.textAlign = "center";
  modal.appendChild(title);

  const potatoList = document.createElement("div");
  Object.assign(potatoList.style, {
    display: "flex",
    justifyContent: "space-around",
    flexWrap: "wrap",
    gap: "10px"
  });

  const closeButton = document.createElement("button");
  closeButton.innerText = "✕";
  Object.assign(closeButton.style, {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "24px"
  });
  closeButton.onclick = () => {
    removeCurrentModal();
  };
  modal.appendChild(closeButton);

  const emojiIdMap: { [key: string]: number } = {
    "sad.svg": 1,
    "angry.svg": 2,
    "meh.svg": 3,
    "happy.svg": 4,
    "excited.svg": 5,
  };

  const potatoOptions = Object.entries(emojiIdMap).map(([src, id]) => ({
    name: src.replace(".svg", "").replace(/^./, c => c.toUpperCase()) + " Potato",
    src,
    id
  }));

  potatoOptions.forEach(option => {
    const button = document.createElement("button");
    Object.assign(button.style, {
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
      transition: "transform 0.3s ease"
    });

    const img = document.createElement("img");
    img.src = option.src;
    img.alt = option.name;
    Object.assign(img.style, {
      width: "50px",
      height: "50px",
      objectFit: "contain",
      borderRadius: "8px"
    });

    button.appendChild(img);

    button.onclick = () => {
      const emoji_id = emojiIdMap[option.src];
      removeCurrentModal();
      openDescriptionDialog(latLng, map, emoji_id, isSignedIn, user);
    };

    potatoList.appendChild(button);
  });

  modal.appendChild(potatoList);
  document.body.appendChild(modal);
};

const openDescriptionDialog = (
  latLng: google.maps.LatLng,
  map: google.maps.Map,
  emoji_id: number,
  isSignedIn: boolean,
  user: User
) => {
  removeCurrentModal();

  const modal = document.createElement("div");
  modal.id = "custom-potato-modal"; 
  currentModal = modal;
  Object.assign(modal.style, {
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
    width: "500px",
    height: "300px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  });

  const title = document.createElement("h2");
  title.innerText = "Add a Description";
  title.style.textAlign = "center";
  modal.appendChild(title);

  const textbox = document.createElement("textarea");
  Object.assign(textbox.style, {
    width: "100%",
    height: "100px",
    marginTop: "10px",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px"
  });
  textbox.placeholder = "Enter a description...";
  modal.appendChild(textbox);

  const anonContainer = document.createElement("div");
  Object.assign(anonContainer.style, {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "15px"
  });

  const anonLabel = document.createElement("label");
  anonLabel.innerText = "Anonymous";
  anonLabel.style.marginRight = "10px";

  const anonSlider = document.createElement("input");
  anonSlider.type = "checkbox";
  anonSlider.style.cursor = "pointer";

  anonContainer.appendChild(anonLabel);
  anonContainer.appendChild(anonSlider);
  modal.appendChild(anonContainer);

  const submitButton = document.createElement("button");
  submitButton.innerText = "Submit";
  Object.assign(submitButton.style, {
    marginTop: "15px",
    padding: "10px 20px",
    background: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  });

  submitButton.onclick = () => {
    const description = textbox.value;
    const isAnonymous = anonSlider.checked;
    placeMarkerAndPanTo(latLng, map, emoji_id, isSignedIn, user, isAnonymous, description);
    removeCurrentModal();
  };

  const closeButton = document.createElement("button");
  closeButton.innerText = "✕";
  Object.assign(closeButton.style, {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "24px"
  });
  closeButton.onclick = () => {
    removeCurrentModal();
  };

  const backButton = document.createElement("button");
  backButton.innerText = "←";
  Object.assign(backButton.style, {
    position: "absolute",
    top: "10px",
    left: "10px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "24px"
  });
  backButton.onclick = () => {
    removeCurrentModal();
    openPotatoSelectionDialog(latLng, map, isSignedIn, user);
  };

  modal.appendChild(submitButton);
  modal.appendChild(closeButton);
  modal.appendChild(backButton);

  document.body.appendChild(modal);
};



const placeMarkerAndPanTo = async (
    latLng: google.maps.LatLng,
    map: google.maps.Map,
    emoji_id: number, // Add emoji_id to the function arguments
    isSignedIn: boolean,
    user: User,
    isAnonymous: boolean, // New parameter for anonymous upload
    description?: string // New parameter for description 
) => {

    // const newMarker = new google.maps.marker.AdvancedMarkerElement({
    //     position: latLng,
    //     map: map,
    //     content: newMarkerImage,
    // });

    console.log("inserting marker");
    // console.log("signed in " + isSignedIn);
    // console.log("user " + user)
    // Insert the marker into the database
    if (isSignedIn && user) {
        try {
            console.log('User id ' + user.id)
            await insertMarker({
              id: uuidv4(),
              longitude: latLng.lng(),
              latitude: latLng.lat(),
              emoji_id: emoji_id,
              created_by: user.id, // Handle anonymous uploads
              anon: isAnonymous,
              text: description || "",
              created_at: ''
            });
            console.log(`Marker Successfully Inserted! (Anonymous: ${isAnonymous})`);
            removeCurrentModal();
            initMap("map", true, user)
        } catch (error) {
            console.error("Failed to insert marker:", error);
        }
    }

    // Pin the map to the new marker location
    map.panTo(latLng);
  };
};

// You can also move `openPotatoSelectionDialog` here if necessary
