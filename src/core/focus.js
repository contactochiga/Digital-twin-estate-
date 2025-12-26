// src/core/focus.js
import * as THREE from "three";

/**
 * Smoothly focuses camera on a selected object
 */
export function focusOnObject(camera, controls, object) {
  if (!object) return;

  const box = new THREE.Box3().setFromObject(object);
  const center = new THREE.Vector3();
  const size = new THREE.Vector3();

  box.getCenter(center);
  box.getSize(size);

  // distance based on object size
  const maxDim = Math.max(size.x, size.y, size.z);
  const distance = maxDim * 2.2;

  // direction from current camera to target
  const dir = new THREE.Vector3()
    .subVectors(camera.position, controls.target)
    .normalize();

  const newPos = center.clone().add(dir.multiplyScalar(distance));

  // smooth transition
  camera.position.lerp(newPos, 0.25);
  controls.target.lerp(center, 0.25);
  controls.update();
}
