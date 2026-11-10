// Mounts the home page's WebGL scene. Imported only when the device has a real GPU, so phones
// and laptops without one never download React or three.js for the hero.
import { createRoot } from "react-dom/client";
import Spectrum from "./Spectrum.jsx";

export function mount(el) {
  createRoot(el).render(<Spectrum />);
}
