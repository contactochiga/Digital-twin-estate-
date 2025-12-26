// src/buildings/DTBuilding.js
import * as THREE from "three";
import { registerSelectable } from "../core/selection"; // ✅ ADD

export function createDTBuilding({
  id,
  position = { x: 0, y: 0, z: 0 },
  rotation = 0
}) {
  const building = new THREE.Group();
  building.name = id;

  const floorHeight = 4;

  const matWall = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.65 });
  const matGlass = new THREE.MeshStandardMaterial({
    color: 0x88ccff,
    transparent: true,
    opacity: 0.4
  });
  const matCore = new THREE.MeshStandardMaterial({ color: 0x6f2020 });

  const floors = [
    { level: 0, name: "GROUND", rooms: ["Living", "Kitchen", "Guest Suite"] },
    { level: 1, name: "FAMILY", rooms: ["Bedrooms 2–4", "Family Lounge"] },
    { level: 2, name: "PENTHOUSE", rooms: ["Master Suite", "Private Terrace"] }
  ];

  floors.forEach((f) => {
    const floor = new THREE.Group();
    floor.name = `${id}-FLOOR-${f.level}`;

    const slab = new THREE.Mesh(
      new THREE.BoxGeometry(24, 0.25, 20),
      matWall
    );
    slab.position.y = f.level * floorHeight;
    floor.add(slab);

    const shell = new THREE.Mesh(
      new THREE.BoxGeometry(23.8, floorHeight, 19.8),
      matGlass
    );
    shell.position.y = f.level * floorHeight + floorHeight / 2;
    floor.add(shell);

    const core = new THREE.Mesh(
      new THREE.BoxGeometry(4, floorHeight, 8),
      matCore
    );
    core.position.set(8, f.level * floorHeight + floorHeight / 2, 4);
    floor.add(core);

    // ✅ MAKE FLOOR SELECTABLE
    floor.userData = {
      selectable: true,
      entity: "FLOOR",
      buildingType: "DT",
      buildingId: id,
      floor: f.name,
      rooms: f.rooms
    };

    registerSelectable(floor); // ✅ REGISTER FLOOR
    building.add(floor);
  });

  building.position.set(position.x, position.y, position.z);
  building.rotation.y = rotation;

  // ✅ MAKE BUILDING SELECTABLE
  building.userData = {
    selectable: true,
    entity: "BUILDING",
    type: "DT",
    buildingId: id,
    estateControlled: true
  };

  registerSelectable(building); // ✅ REGISTER BUILDING

  return building;
}
