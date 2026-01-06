export {}; // Ensure this file is treated as a module.

declare global {
  interface Window {
    initializeMap: () => void;
    google?: {
      maps: typeof google.maps;
    };
  }
}

export {};
