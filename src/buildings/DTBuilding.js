import * as THREE from "three";

export function createDTBuilding(id) {
  const g = new THREE.Group();
  g.name = id;

  const base = new THREE.Mesh(
    new THREE.BoxGeometry(18, 6, 14),
    new THREE.MeshStandardMaterial({ color: 0xffffff })
  );
  base.position.y = 3;
  g.add(base);

  const upper = new THREE.Mesh(
    new THREE.BoxGeometry(16, 6, 12),
    new THREE.MeshStandardMaterial({ color: 0xf0f0f0 })
  );
  upper.position.y = 9;
  g.add(upper);

  const pent = new THREE.Mesh(
    new THREE.BoxGeometry(12, 4, 10),
    new THREE.MeshStandardMaterial({ color: 0xe6e6e6 })
  );
  pent.position.y = 13;
  g.add(pent);

  g.userData = { type: "DT", building: id };
  return g;
}
