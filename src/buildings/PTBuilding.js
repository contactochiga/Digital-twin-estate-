import * as THREE from "three";

export function createPTBuilding(id) {
  const g = new THREE.Group();
  g.name = id;

  const floorH = 3.2;
  for (let i = 0; i < 5; i++) {
    const slab = new THREE.Mesh(
      new THREE.BoxGeometry(24, floorH, 20),
      new THREE.MeshStandardMaterial({ color: 0xf7f4f1 })
    );
    slab.position.y = i * floorH;
    slab.userData = { type: "PT", building: id, floor: i + 1 };
    g.add(slab);
  }

  const core = new THREE.Mesh(
    new THREE.BoxGeometry(4, 16, 6),
    new THREE.MeshStandardMaterial({ color: 0xe8602f })
  );
  core.position.y = 8;
  g.add(core);

  return g;
}
