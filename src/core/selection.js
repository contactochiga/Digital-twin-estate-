// src/core/selection.js
import * as THREE from "three";

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

let selectableObjects = [];
let currentSelection = null;
let originalMaterials = new Map();

const HIGHLIGHT_COLOR = new THREE.Color(0xffa500);

export function registerSelectable(object) {
  selectableObjects.push(object);
}

function applyHighlight(object) {
  object.traverse((child) => {
    if (child.isMesh) {
      if (!originalMaterials.has(child)) {
        originalMaterials.set(child, child.material);
      }
      child.material = child.material.clone();
      child.material.emissive = HIGHLIGHT_COLOR;
      child.material.emissiveIntensity = 0.6;
    }
  });
}

function clearHighlight(object) {
  object.traverse((child) => {
    if (child.isMesh && originalMaterials.has(child)) {
      child.material = originalMaterials.get(child);
      originalMaterials.delete(child);
    }
  });
}

export function setupSelection(renderer, camera) {
  renderer.domElement.addEventListener("pointerdown", (event) => {
    const rect = renderer.domElement.getBoundingClientRect();

    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(selectableObjects, true);
    if (!hits.length) return;

    let obj = hits[0].object;
    while (obj && !obj.userData?.selectable) {
      obj = obj.parent;
    }
    if (!obj) return;

    if (currentSelection) clearHighlight(currentSelection);
    currentSelection = obj;
    applyHighlight(obj);

    // ✅ Store world position (important for next steps)
    const worldPos = new THREE.Vector3();
    obj.getWorldPosition(worldPos);

    obj.userData.__world = {
      x: worldPos.x,
      y: worldPos.y,
      z: worldPos.z
    };

    window.dispatchEvent(
      new CustomEvent("ochiga-select", {
        detail: obj.userData
      })
    );
  });
}
