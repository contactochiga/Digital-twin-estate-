// src/buildings/PTBuilding.js
import * as THREE from "three";
import { registerSelectable } from "../core/selection";

const FLOOR_HEIGHT = 3.6;

export function createPTBuilding(id) {
  const building = new THREE.Group();
  building.name = id;

  const matUnit = new THREE.MeshStandardMaterial({
    color: 0xf7f4f1,
    roughness: 0.65
  });

  const matGlass = new THREE.MeshStandardMaterial({
    color: 0x88ccff,
    transparent: true,
    opacity: 0.35
  });

  const matCore = new THREE.MeshStandardMaterial({ color: 0xe8602f });

  // -------------------------
  // FLOORS
  // -------------------------
  for (let floorIndex = 0; floorIndex < 5; floorIndex++) {
    const floorGroup = new THREE.Group();
    const floorNumber = floorIndex + 1;
    floorGroup.name = `${id}-FLOOR-${floorNumber}`;

    const yBase = floorIndex * FLOOR_HEIGHT;

    // ---- FLOOR SLAB (non-selectable)
    const slab = new THREE.Mesh(
      new THREE.BoxGeometry(24, 0.25, 20),
      matUnit
    );
    slab.position.y = yBase + 0.12;
    floorGroup.add(slab);

    // -------------------------
    // UNITS (A, B, C, D)
    // -------------------------
    const units = [
      { key: "A", x: -6, z: -5, beds: 2 },
      { key: "B", x:  6, z: -5, beds: 3 },
      { key: "C", x: -6, z:  5, beds: 2 },
      { key: "D", x:  6, z:  5, beds: 3 }
    ];

    units.forEach((u) => {
      const unit = new THREE.Group();
      const unitId = `${id}-F${floorNumber}-${u.key}`;
      unit.name = unitId;

      // Unit volume
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(11.5, FLOOR_HEIGHT - 0.3, 9.5),
        matGlass
      );
      body.position.set(u.x, yBase + FLOOR_HEIGHT / 2, u.z);
      unit.add(body);

      // Unit metadata
      unit.userData = {
        selectable: true,
        entity: "UNIT",
        unitId,
        unitType: u.beds === 3 ? "3 Bedroom" : "2 Bedroom",
        beds: u.beds,
        floor: floorNumber,
        buildingId: id,
        buildingType: "PT",
        estateControlled: true
      };

      registerSelectable(unit);
      floorGroup.add(unit);
    });

    // Floor metadata (still selectable)
    floorGroup.userData = {
      selectable: true,
      entity: "FLOOR",
      floor: floorNumber,
      buildingId: id,
      buildingType: "PT"
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
    buildingId: id,
    buildingType: "PT",
    floors: 5,
    unitsPerFloor: 4,
    estateControlled: true
  };

  registerSelectable(building);
  return building;
}
