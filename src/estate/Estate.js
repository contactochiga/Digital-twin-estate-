import * as THREE from "three";
import { createPTBuilding } from "../buildings/PTBuilding";
import { createRoad } from "./Road";
import { createMEP } from "./MEP";

export function createEstate() {
  const estate = new THREE.Group();
  estate.name = "OCH-ESTATE-V1";

  const pt1 = createPTBuilding("PT1");
  pt1.position.set(-20, 0, 0);
  estate.add(pt1);

  const pt2 = createPTBuilding("PT2");
  pt2.position.set(20, 0, 0);
  estate.add(pt2);

  estate.add(createRoad("ROAD-1", -120));
  estate.add(createRoad("ROAD-2", -260));
  estate.add(createRoad("ROAD-3", -400));

  estate.add(createMEP());

  return estate;
}
