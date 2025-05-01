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

export const initMap = async (mapElementId: string, isSignedIn: boolean, user: User) => {
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
    mapId: "DEMO_MAP_ID"
  });

  // Fetch existing markers
  if (isSignedIn && user) {
    const markers = await getMarkersCurrUserAnon(user.id);

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
  const openPotatoSelectionDialog = (
    latLng: google.maps.LatLng,
    map: google.maps.Map,
    isSignedIn: boolean,
    user: User
  ) => {

    if (currentModal) {
      document.body.removeChild(currentModal);
      currentModal = null;
    }

    const potatoOptions = [
        { name: "Sad Potato", src: "sad.svg" },
        { name: "Angry Potato", src: "angry.svg" },
        { name: "Meh Potato", src: "meh.svg" },
        { name: "Happy Potato", src: "happy.svg" },
        { name: "Excited Potato", src: "excited.svg" },
    ];

    const modal = document.createElement("div");
    currentModal = modal;
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

    modal.style.width = "500px"; // Fixed width
    modal.style.height = "300px"; // Fixed height
    modal.style.display = "flex";
    modal.style.flexDirection = "column";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center"; 

    const title = document.createElement("h2");
    title.innerText = "Choose a Potato";
    title.style.textAlign = "center";
    modal.appendChild(title);

    const potatoList = document.createElement("div");
    potatoList.style.display = "flex";
    potatoList.style.justifyContent = "space-around";
    potatoList.style.flexWrap = "wrap";
    potatoList.style.gap = "10px";

    // Close button (X)
    const closeButton = document.createElement("button");
    closeButton.innerText = "✕"; 
    closeButton.style.position = "absolute";
    closeButton.style.top = "10px";
    closeButton.style.right = "10px";
    closeButton.style.background = "transparent";
    closeButton.style.border = "none";
    closeButton.style.cursor = "pointer";
    closeButton.style.fontSize = "24px";

    closeButton.onclick = () => {
      document.body.removeChild(modal);
      currentModal = null;
    };

    modal.appendChild(closeButton);

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
            // const isAnonymous = anonSlider.checked;

            // placeMarkerAndPanTo(latLng, map, emoji_id, isSignedIn, user, isAnonymous);
            document.body.removeChild(modal);
            currentModal = null;

            openDescriptionDialog(latLng, map, emoji_id, isSignedIn, user);

        };

        potatoList.appendChild(potatoButton);
        document.body.appendChild(modal);

    });

    // Slider for anonymity selection
    // const anonContainer = document.createElement("div");
    // anonContainer.style.display = "flex";
    // anonContainer.style.alignItems = "center";
    // anonContainer.style.justifyContent = "center";
    // anonContainer.style.marginTop = "15px";

    // const anonLabel = document.createElement("label");
    // anonLabel.innerText = "Anonymous";
    // anonLabel.style.marginRight = "10px";

    // const anonSlider = document.createElement("input");
    // anonSlider.type = "checkbox";
    // anonSlider.style.cursor = "pointer";

    // anonContainer.appendChild(anonLabel);
    // anonContainer.appendChild(anonSlider);

    modal.appendChild(potatoList);
    // modal.appendChild(anonContainer);

    document.body.appendChild(modal);
  };

  // Description modal
  const openDescriptionDialog = (
    latLng: google.maps.LatLng,
    map: google.maps.Map,
    emoji_id: number,
    isSignedIn: boolean,
    user: User
  ) => {

    if (currentModal) {
      document.body.removeChild(currentModal);
      currentModal = null;
    }

    const modal = document.createElement("div");
    currentModal = modal;
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

    modal.style.width = "500px"; // Fixed width (same as potato modal)
    modal.style.height = "300px"; // Fixed height (same as potato modal)
    modal.style.display = "flex";
    modal.style.flexDirection = "column";
    modal.style.alignItems = "center";
  
    const title = document.createElement("h2");
    title.innerText = "Add a Description";
    title.style.textAlign = "center";
    modal.appendChild(title);
  
    // Textbox for description
    const textbox = document.createElement("textarea");
    textbox.style.width = "100%";
    textbox.style.height = "100px";
    textbox.style.marginTop = "10px";
    textbox.style.padding = "10px";
    textbox.style.border = "1px solid #ccc";
    textbox.style.borderRadius = "4px";
    textbox.placeholder = "Enter a description...";
    modal.appendChild(textbox);
  
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
  
    modal.appendChild(anonContainer);
  
    // Submit button
    const submitButton = document.createElement("button");
    submitButton.innerText = "Submit";
    submitButton.style.marginTop = "15px";
    submitButton.style.padding = "10px 20px";
    submitButton.style.background = "#4CAF50";
    submitButton.style.color = "white";
    submitButton.style.border = "none";
    submitButton.style.borderRadius = "4px";
    submitButton.style.cursor = "pointer";
  
    submitButton.onclick = () => {
      const description = textbox.value;
      const isAnonymous = anonSlider.checked;
  
      placeMarkerAndPanTo(latLng, map, emoji_id, isSignedIn, user, isAnonymous, description);
      document.body.removeChild(modal);
      currentModal = null;
    };
  
    modal.appendChild(submitButton);

    // Close button (X)
    const closeButton = document.createElement("button");
    closeButton.innerText = "✕"; 
    closeButton.style.position = "absolute";
    closeButton.style.top = "10px";
    closeButton.style.right = "10px";
    closeButton.style.background = "transparent";
    closeButton.style.border = "none";
    closeButton.style.cursor = "pointer";
    closeButton.style.fontSize = "24px";

    closeButton.onclick = () => {
      document.body.removeChild(modal);
      currentModal = null;
    };

    modal.appendChild(closeButton);
  
    // Back button
    const backButton = document.createElement("button");
    backButton.innerText = "←"; // Unicode for left arrow
    backButton.style.position = "absolute";
    backButton.style.top = "10px";
    backButton.style.left = "10px";
    backButton.style.background = "transparent";
    backButton.style.border = "none";
    backButton.style.cursor = "pointer";
    backButton.style.fontSize = "24px";

    backButton.onclick = () => {
      document.body.removeChild(modal);
      currentModal = null;
      openPotatoSelectionDialog(latLng, map, isSignedIn, user);
    };

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
