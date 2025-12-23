import * as THREE from "three";

export function attachDTMEP(building) {
  const mep = new THREE.Group();
  mep.name = `${building.name}-MEP`;

  const systems = [
    { id: "POWER", color: 0xe74c3c },
    { id: "WATER", color: 0x3498db },
    { id: "SEWAGE", color: 0x7f5539 },
    { id: "GAS", color: 0xf39c12 },
    { id: "FIBER", color: 0x8e44ad }
  ];

  systems.forEach((s, i) => {
    const pipe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.4, 8),
      new THREE.MeshStandardMaterial({ color: s.color })
    );
    pipe.position.set(8 + i * 0.8, -4, 4);
    pipe.userData = {
      system: s.id,
      controlledBy: "ESTATE"
    };
    mep.add(pipe);
  });

  building.add(mep);
}
