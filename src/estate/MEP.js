// src/estate/MEP.js
import * as THREE from "three";

export function createMEP() {
  const g = new THREE.Group();
  g.name = "ESTATE-MEP";

  const colors = {
    power: 0xe74c3c,
    water: 0x3498db,
    sewage: 0x7f5539,
    gas: 0xf39c12,
    fiber: 0x8e44ad
  };

  let offset = 0;

  Object.entries(colors).forEach(([k, c]) => {
    const pipe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.6, 0.6, 300),
      new THREE.MeshStandardMaterial({ color: c })
    );

    pipe.rotation.z = Math.PI / 2;
    pipe.position.set(0, -1.5, -100 + offset);
    pipe.name = `MEP-${k.toUpperCase()}`;

    offset += 4;
    g.add(pipe);
  });

  return g;
}
