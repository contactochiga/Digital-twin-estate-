import * as THREE from "three";

export function createDTBuilding({
  id,
  position = { x: 0, y: 0, z: 0 }
}) {
  const building = new THREE.Group();
  building.name = id;

  const floorHeight = 4;

  const matWall = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.65
  });

  const matGlass = new THREE.MeshStandardMaterial({
    color: 0x88ccff,
    transparent: true,
    opacity: 0.4
  });

  const matCore = new THREE.MeshStandardMaterial({
    color: 0x6f2020
  });

  const floors = [
    { level: 0, name: "GROUND", rooms: ["Living", "Kitchen", "Guest Suite"] },
    { level: 1, name: "FAMILY", rooms: ["Bedrooms 2–4", "Family Lounge"] },
    { level: 2, name: "PENTHOUSE", rooms: ["Master Suite", "Private Terrace"] }
  ];

  floors.forEach((f) => {
    const floor = new THREE.Group();
    floor.name = `${id}-FLOOR-${f.level}`;

    // slab
    const slab = new THREE.Mesh(
      new THREE.BoxGeometry(24, 0.25, 20),
      matWall
    );
    slab.position.y = f.level * floorHeight;
    floor.add(slab);

    // glass shell
    const shell = new THREE.Mesh(
      new THREE.BoxGeometry(23.8, floorHeight, 19.8),
      matGlass
    );
    shell.position.y = f.level * floorHeight + floorHeight / 2;
    floor.add(shell);

    // vertical core (A1 / E1 / R1)
    const core = new THREE.Mesh(
      new THREE.BoxGeometry(4, floorHeight, 8),
      matCore
    );
    core.position.set(8, f.level * floorHeight + floorHeight / 2, 4);
    floor.add(core);

    floor.userData = {
      buildingId: id,
      floor: f.name,
      rooms: f.rooms
    };

    building.add(floor);
  });

  building.position.set(position.x, position.y, position.z);
  building.userData = {
    type: "DT",
    estateControlled: true
  };

  return building;
}
