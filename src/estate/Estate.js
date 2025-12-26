// src/estate/Estate.js
import * as THREE from "three";

import { createPTBuilding } from "../buildings/PTBuilding";
import { createDTBuilding } from "../buildings/DTBuilding";

import { createRoad, ROADS } from "./Road";
import { createMEP } from "./MEP";
import { PLOTS } from "./Plots";

export function createEstate() {
  const estate = new THREE.Group();
  estate.name = "OCH-ESTATE-V1";

  // -------------------------
  // ROADS
  // -------------------------
  ROADS.forEach((road) => {
    estate.add(createRoad(road));
  });

  // -------------------------
  // PT BUILDINGS
  // -------------------------
  const pt1 = createPTBuilding("PT1");
  pt1.position.set(-40, 0, -40);
  estate.add(pt1);

  const pt2 = createPTBuilding("PT2");
  pt2.position.set(40, 0, -40);
  estate.add(pt2);

  // -------------------------
  // DT BUILDINGS
  // -------------------------
  PLOTS.forEach((plot) => {
    if (plot.type !== "DT") return;

    const dt = createDTBuilding({
      id: plot.id,
      position: {
        x: plot.position.x,
        y: 0,
        z: plot.position.z
      },
      rotation: plot.rotation
    });

    estate.add(dt);
  });

  // -------------------------
  // ESTATE MEP (CENTRAL)
  // -------------------------
  estate.add(createMEP());

  return estate;
}
