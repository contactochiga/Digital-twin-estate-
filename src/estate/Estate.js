// src/estate/Estate.js
import * as THREE from "three";

import { createPTBuilding } from "../buildings/PTBuilding";
import { createDTBuilding } from "../buildings/DTBuilding";

import { createRoad } from "./Road";
import { createMEP } from "./MEP";
import { PLOTS } from "./Plots";

export function createEstate() {
  const estate = new THREE.Group();
  estate.name = "OCH-ESTATE-V1";

  // -------------------------
  // ROADS
  // -------------------------
  estate.add(createRoad("ROAD-1", 0));
  estate.add(createRoad("ROAD-2", -120));
  estate.add(createRoad("ROAD-3", -240));

  // -------------------------
  // PT BUILDINGS (Apartments)
  // -------------------------
  const pt1 = createPTBuilding("PT1");
  pt1.position.set(-40, 0, -40);
  estate.add(pt1);

  const pt2 = createPTBuilding("PT2");
  pt2.position.set(40, 0, -40);
  estate.add(pt2);

  // -------------------------
  // DT BUILDINGS (from plots)
  // -------------------------
  PLOTS.forEach((plot) => {
    if (plot.type === "DT") {
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
    }
  });

  // -------------------------
  // MEP (Estate controlled)
  // -------------------------
  estate.add(createMEP());

  return estate;
}
