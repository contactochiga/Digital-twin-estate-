// src/buildings/PTBuilding.js
import * as THREE from "three";
import { registerSelectable } from "../core/selection";

const FLOOR_HEIGHT = 3.6;
const BUILDING_WIDTH = 24;
const BUILDING_DEPTH = 20;

export function createPTBuilding(id) {
  const building = new THREE.Group();
  building.name = id;

  const matWall = new THREE.MeshStandardMaterial({
    color: 0xf7f4f1,
    roughness: 0.65
  });

  const matBalcony = new THREE.MeshStandardMaterial({
    color: 0xdedede
  });

  const matGlass = new THREE.MeshStandardMaterial({
    color: 0x88ccff,
    transparent: true,
    opacity: 0.4
  });

  const matCore = new THREE.MeshStandardMaterial({
    color: 0xe8602f
  });

  // -------------------------
  // FLOORS + UNITS
  // -------------------------
  for (let i = 0; i < 5; i++) {
    const floor = new THREE.Group();
    floor.name = `${id}-FLOOR-${i + 1}`;

    const floorY = i * FLOOR_HEIGHT;

    // Slab
    const slab = new THREE.Mesh(
      new THREE.BoxGeometry(BUILDING_WIDTH, 0.4, BUILDING_DEPTH),
      matWall
    );
    slab.position.y = floorY + 0.2;
    floor.add(slab);

    // Facade shell
    const shell = new THREE.Mesh(
      new THREE.BoxGeometry(BUILDING_WIDTH - 0.2, FLOOR_HEIGHT, BUILDING_DEPTH - 0.2),
      matGlass
    );
    shell.position.y = floorY + FLOOR_HEIGHT / 2;
    floor.add(shell);

    // Balcony (shared visual)
    const balcony = new THREE.Mesh(
      new THREE.BoxGeometry(6, 0.3, 2),
      matBalcony
    );
    balcony.position.set(0, floorY + 1.3, -11);
    floor.add(balcony);

    // -------------------------
    // UNITS (4 per floor)
    // -------------------------
    const unitWidth = BUILDING_WIDTH / 4;
    const units = [
      { code: "A", type: "3B", bedrooms: 3 },
      { code: "B", type: "2B", bedrooms: 2 },
      { code: "C", type: "3B", bedrooms: 3 },
      { code: "D", type: "2B", bedrooms: 2 }
    ];

    units.forEach((u, index) => {
      const unit = new THREE.Mesh(
        new THREE.BoxGeometry(unitWidth - 0.4, FLOOR_HEIGHT, BUILDING_DEPTH - 0.6),
        matGlass
      );

      unit.position.set(
        -BUILDING_WIDTH / 2 + unitWidth * index + unitWidth / 2,
        floorY + FLOOR_HEIGHT / 2,
        0
      );

      // 🔑 UNIT METADATA
      unit.userData = {
        selectable: true,
        entity: "UNIT",
        estateId: "OCH",
        buildingType: "PT",
        buildingId: id,
        floor: i + 1,
        unit: u.code,
        unitType: u.type,
        bedrooms: u.bedrooms
      };

      registerSelectable(unit);
      floor.add(unit);
    });

    // Floor metadata
    floor.userData = {
      selectable: true,
      entity: "FLOOR",
      buildingType: "PT",
      buildingId: id,
      floor: i + 1
    };

    registerSelectable(floor);
    building.add(floor);
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
  // ENTRANCE
  // -------------------------
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
  registerSelectable(entrance);
  building.add(entrance);

  // -------------------------
  // BUILDING METADATA
  // -------------------------
  building.userData = {
    selectable: true,
    entity: "BUILDING",
    type: "PT",
    buildingId: id,
    floors: 5,
    estateControlled: true
  };

  registerSelectable(building);

  return building;
}
