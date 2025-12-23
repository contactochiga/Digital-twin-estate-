import * as THREE from "three";

export function createMEP() {
  const g = new THREE.Group();
  const colors = {
    power: 0xe74c3c,
    water: 0x3498db,
    sewage: 0x7f5539,
    gas: 0xf39c12,
    fiber: 0x8e44ad
  };

  Object.entries(colors).forEach(([k, c], i) => {
    const pipe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.6, 0.6, 300),
      new THREE.MeshStandardMaterial({ color: c })
    );
    pipe.rotation.z = Math.PI / 2;
    pipe.position.y = -1.5;
    pipe.position.z = -100 + i * 4;
    g.add(pipe);
  });

  return g;
}
