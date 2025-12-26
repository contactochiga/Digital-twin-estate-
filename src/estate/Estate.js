// src/estate/Estate.js
import * as THREE from "three";
import { createPTBuilding } from "../buildings/PTBuilding";
import { createRoad, ROADS } from "./Road";
import { createMEP } from "./MEP";

export function createEstate() {
  const estate = new THREE.Group();
  estate.name = "OCH-ESTATE-V1";

  // Roads
  ROADS.forEach((road) => {
    estate.add(createRoad(road));
  });

  // PT Buildings
  const pt1 = createPTBuilding("PT1");
  pt1.position.set(-20, 0, 0);
  estate.add(pt1);

  const pt2 = createPTBuilding("PT2");
  pt2.position.set(20, 0, 0);
  estate.add(pt2);

  // MEP backbone
  estate.add(createMEP());

  return estate;
}
