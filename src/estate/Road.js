// src/estate/Road.js
import * as THREE from "three";

export const ROADS = [
  {
    id: "ROAD_1",
    position: { x: 0, z: 0 },
    direction: "NORTH",
    length: 800
  },
  {
    id: "ROAD_2",
    position: { x: -120, z: 120 },
    direction: "NORTH",
    length: 500
  },
  {
    id: "ROAD_3",
    position: { x: 120, z: 120 },
    direction: "NORTH",
    length: 500
  }
];

export function createRoad(road) {
  const g = new THREE.Group();
  g.name = road.id;

  const asphalt = new THREE.Mesh(
    new THREE.PlaneGeometry(12, road.length),
    new THREE.MeshStandardMaterial({ color: 0x1f1f1f })
  );

  asphalt.rotation.x = -Math.PI / 2;
  asphalt.position.set(road.position.x, 0.01, road.position.z);

  g.add(asphalt);
  return g;
}
