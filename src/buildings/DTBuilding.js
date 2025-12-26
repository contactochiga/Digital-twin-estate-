// src/buildings/DTBuilding.js
import * as THREE from "three";

const FLOOR_HEIGHT = 3.6;

export function createDTBuilding({
  id,
  position = { x: 0, y: 0, z: 0 },
  rotation = 0
}) {
  const building = new THREE.Group();
  building.name = id;

  const matWall = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.6
  });

  const matGlass = new THREE.MeshStandardMaterial({
    color: 0x88ccff,
    transparent: true,
    opacity: 0.35
  });

  const matBalcony = new THREE.MeshStandardMaterial({
    color: 0xdedede
  });

  const matCore = new THREE.MeshStandardMaterial({
    color: 0x6f2020
  });

  const floors = [
    {
      level: 0,
      name: "GROUND",
      rooms: ["Living", "Dining", "Kitchen", "Guest Suite"]
    },
    {
      level: 1,
      name: "FAMILY",
      rooms: ["Bedrooms 2–4", "Family Lounge"]
    },
    {
      level: 2,
      name: "PENTHOUSE",
      rooms: ["Master Suite", "Private Lounge", "Terrace"]
    }
  ];

  floors.forEach((f) => {
    const floor = new THREE.Group();
    floor.name = `${id}-FLOOR-${f.name}`;

    // slab
    const slab = new THREE.Mesh(
      new THREE.BoxGeometry(24, 0.4, 20),
      matWall
    );
    slab.position.y = f.level * FLOOR_HEIGHT + 0.2;
    floor.add(slab);

    // glass shell
    const shell = new THREE.Mesh(
      new THREE.BoxGeometry(23.8, FLOOR_HEIGHT, 19.8),
      matGlass
    );
    shell.position.y = f.level * FLOOR_HEIGHT + FLOOR_HEIGHT / 2;
    floor.add(shell);

    // balcony (front)
    const balcony = new THREE.Mesh(
      new THREE.BoxGeometry(7, 0.3, 2),
      matBalcony
    );
    balcony.position.set(0, f.level * FLOOR_HEIGHT + 1.4, -11);
    floor.add(balcony);

    // vertical core (A1 / E1 / R1)
    const core = new THREE.Mesh(
      new THREE.BoxGeometry(4, FLOOR_HEIGHT, 8),
      matCore
    );
    core.position.set(8, f.level * FLOOR_HEIGHT + FLOOR_HEIGHT / 2, 4);
    floor.add(core);

    floor.userData = {
      estateId: "OCH",
      buildingId: id,
      type: "DT",
      floor: f.name,
      rooms: f.rooms
    };

    building.add(floor);
  });

  // -------------------------
  // GROUND ENTRANCE
  // -------------------------
  const entrance = new THREE.Mesh(
    new THREE.BoxGeometry(6, 3, 0.6),
    new THREE.MeshStandardMaterial({ color: 0x111111 })
  );
  entrance.position.set(0, 1.5, -10.5);
  building.add(entrance);

  building.position.set(position.x, position.y, position.z);
  building.rotation.y = rotation;

  building.userData = {
    estateControlled: true,
    type: "DT",
    floors: 3
  };

  return building;
}
