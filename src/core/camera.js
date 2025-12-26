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

/**
 * Smoothly focus camera + controls on a selected object
 */
export function focusOnObject(camera, controls, object) {
  const box = new THREE.Box3().setFromObject(object);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());

  const maxDim = Math.max(size.x, size.y, size.z);
  const distance = maxDim * 2.2;

  const direction = new THREE.Vector3(1, 1, 1).normalize();
  const newPosition = center.clone().add(direction.multiplyScalar(distance));

  // Smooth move
  camera.position.lerp(newPosition, 0.8);
  controls.target.lerp(center, 0.8);
  controls.update();
}
