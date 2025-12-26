// src/buildings/PTBuilding.js
import * as THREE from "three";
import { registerSelectable } from "../core/selection"; // ✅ ADD

const FLOOR_HEIGHT = 3.6;

export function createPTBuilding(id) {
  const building = new THREE.Group();
  building.name = id;

  const matWall = new THREE.MeshStandardMaterial({ color: 0xf7f4f1, roughness: 0.65 });
  const matBalcony = new THREE.MeshStandardMaterial({ color: 0xdedede });
  const matGlass = new THREE.MeshStandardMaterial({
    color: 0x88ccff,
    transparent: true,
    opacity: 0.4
  });
  const matCore = new THREE.MeshStandardMaterial({ color: 0xe8602f });

  for (let i = 0; i < 5; i++) {
    const floor = new THREE.Group();
    floor.name = `${id}-FLOOR-${i + 1}`;

    const slab = new THREE.Mesh(
      new THREE.BoxGeometry(24, 0.4, 20),
      matWall
    );
    slab.position.y = i * FLOOR_HEIGHT + 0.2;
    floor.add(slab);

    const shell = new THREE.Mesh(
      new THREE.BoxGeometry(23.8, FLOOR_HEIGHT, 19.8),
      matGlass
    );
    shell.position.y = i * FLOOR_HEIGHT + FLOOR_HEIGHT / 2;
    floor.add(shell);

    const balcony = new THREE.Mesh(
      new THREE.BoxGeometry(6, 0.3, 2),
      matBalcony
    );
    balcony.position.set(0, i * FLOOR_HEIGHT + 1.3, -11);
    floor.add(balcony);

    floor.userData = {
      selectable: true,
      entity: "FLOOR",
      buildingType: "PT",
      buildingId: id,
      floor: i + 1
    };

    registerSelectable(floor); // ✅ REGISTER FLOOR
    building.add(floor);
  }

  const core = new THREE.Mesh(
    new THREE.BoxGeometry(4, FLOOR_HEIGHT * 5, 6),
    matCore
  );
  core.position.set(8, (FLOOR_HEIGHT * 5) / 2, 3);
  building.add(core);

  const entrance = new THREE.Mesh(
    new THREE.BoxGeometry(6, 3, 0.6),
    new THREE.MeshStandardMaterial({ color: 0x111111 })
  );
  entrance.position.set(0, 1.5, -10.5);
  entrance.userData = {
    selectable: true,
    entity: "ENTRANCE",
    buildingId: id,
    buildingType: "PT"
  };
  registerSelectable(entrance); // ✅ REGISTER ENTRANCE
  building.add(entrance);

  building.userData = {
    selectable: true,
    entity: "BUILDING",
    type: "PT",
    buildingId: id,
    floors: 5,
    estateControlled: true
  };

  registerSelectable(building); // ✅ REGISTER BUILDING

  return building;
}
