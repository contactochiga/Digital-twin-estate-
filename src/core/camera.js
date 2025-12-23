import * as THREE from "three";

export function createCamera() {
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );
  camera.position.set(120, 90, 140);
  return camera;
}
