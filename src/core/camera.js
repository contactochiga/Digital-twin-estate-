// src/core/camera.js
import * as THREE from "three";

export function createCamera() {
  const isMobile = window.innerWidth < 768;

  const camera = new THREE.PerspectiveCamera(
    isMobile ? 55 : 45,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );

  if (isMobile) {
    // Mobile: closer, lower, more human-scale
    camera.position.set(40, 28, 40);
  } else {
    // Desktop: cinematic overview
    camera.position.set(120, 100, 120);
  }

  camera.lookAt(0, 0, 0);

  // Resize handling
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  return camera;
}
