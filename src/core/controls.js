// src/core/controls.js
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export function createControls(camera, renderer) {
  const controls = new OrbitControls(camera, renderer.domElement);

  controls.enableDamping = true;
  controls.dampingFactor = 0.08;

  controls.enablePan = true;
  controls.enableZoom = true;

  controls.minDistance = 20;
  controls.maxDistance = 300;

  controls.maxPolarAngle = Math.PI / 2.2; // stop flipping underground
  controls.target.set(0, 10, 0);
  controls.update();

  return controls;
}
