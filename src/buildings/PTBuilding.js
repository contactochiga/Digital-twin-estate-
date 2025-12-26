// src/buildings/PTBuilding.js
import * as THREE from "three";
import { registerSelectable } from "../core/selection";

const FLOOR_HEIGHT = 3.6;
const UNIT_HEIGHT = 3.2;

export function createPTBuilding(id) {
  const building = new THREE.Group();
  building.name = id;

  const matWall = new THREE.MeshStandardMaterial({ color: 0xf7f4f1, roughness: 0.65 });
  const matUnit = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.75 });
  const matGlass = new THREE.MeshStandardMaterial({
    color: 0x88ccff,
    transparent: true,
    opacity: 0.35
  });
  const matCore = new THREE.MeshStandardMaterial({ color: 0xe8602f });

  // -------------------------
  // FLOORS
  // -------------------------
  for (let i = 0; i < 5; i++) {
    const floorGroup = new THREE.Group();
    floorGroup.name = `${id}-FLOOR-${i + 1}`;

    // Floor slab
    const slab = new THREE.Mesh(
      new THREE.BoxGeometry(24, 0.4, 20),
      matWall
    );
    slab.position.y = i * FLOOR_HEIGHT + 0.2;
    floorGroup.add(slab);

    // Glass shell
    const shell = new THREE.Mesh(
      new THREE.BoxGeometry(23.8, FLOOR_HEIGHT, 19.8),
      matGlass
    );
    shell.position.y = i * FLOOR_HEIGHT + FLOOR_HEIGHT / 2;
    floorGroup.add(shell);

    // -------------------------
    // UNITS (4 PER FLOOR)
    // -------------------------
    const units = [
      { id: "U1", type: "3B", x: -6, z: -4 },
      { id: "U2", type: "2B", x: 6,  z: -4 },
      { id: "U3", type: "3B", x: -6, z: 4 },
      { id: "U4", type: "2B", x: 6,  z: 4 }
    ];

    units.forEach((u) => {
      const unit = new THREE.Mesh(
        new THREE.BoxGeometry(8, UNIT_HEIGHT, 7),
        matUnit
      );

      unit.position.set(
        u.x,
        i * FLOOR_HEIGHT + UNIT_HEIGHT / 2,
        u.z
      );

      unit.userData = {
        selectable: true,
        entity: "UNIT",
        estateId: "OCH",
        buildingType: "PT",
        buildingId: id,
        floor: i + 1,
        unitId: u.id,
        unitType: u.type
      };

      registerSelectable(unit);
      floorGroup.add(unit);
    });

    // Floor metadata
    floorGroup.userData = {
      selectable: true,
      entity: "FLOOR",
      buildingType: "PT",
      buildingId: id,
      floor: i + 1
    };

    registerSelectable(floorGroup);
    building.add(floorGroup);
  }

  // -------------------------
  // CORE (STAIRS + LIFT)
  // -------------------------
  const core = new THREE.Mesh(
    new THREE.BoxGeometry(4, FLOOR_HEIGHT * 5, 6),
    matCore
  );
  core.position.set(8, (FLOOR_HEIGHT * 5) / 2, 3);
  building.add(core);

  // -------------------------
  // BUILDING METADATA
  // -------------------------
  building.userData = {
    selectable: true,
    entity: "BUILDING",
    buildingType: "PT",
    buildingId: id,
    floors: 5,
    estateControlled: true
  };

  registerSelectable(building);

  return building;
}
