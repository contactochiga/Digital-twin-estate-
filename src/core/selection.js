import * as THREE from "three";

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

let selectableObjects = [];
let currentSelection = null;

export function registerSelectable(object) {
  selectableObjects.push(object);
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

    // climb up until we find something selectable
    while (obj && !obj.userData?.selectable) {
      obj = obj.parent;
    }

    if (!obj) return;

    currentSelection = obj;

    window.dispatchEvent(
      new CustomEvent("ochiga-select", {
        detail: obj.userData
      })
    );
  });
}
