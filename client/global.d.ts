export {}; // Ensure this file is treated as a module.

declare global {
  interface Window {
    google: any; // Replace `any` with the appropriate type if you know it.
  }
}
