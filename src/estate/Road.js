import * as THREE from "three";
import { createDTBuilding } from "../buildings/DTBuilding";

export function createRoad(id, zOffset) {
  const road = new THREE.Group();
  road.name = id;

  const asphalt = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 200),
    new THREE.MeshStandardMaterial({ color: 0x444444 })
  );
  asphalt.rotation.x = -Math.PI / 2;
  road.add(asphalt);

  for (let i = 0; i < 6; i++) {
    const dt = createDTBuilding(`${id}-DT-${i + 1}`);
    dt.position.set(i % 2 === 0 ? -30 : 30, 0, -80 + i * 30);
    road.add(dt);
  }

  road.position.z = zOffset;
  return road;
}
