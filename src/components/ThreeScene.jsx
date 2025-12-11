import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function ThreeScene() {
  const containerRef = useRef();

  useEffect(() => {
    const container = containerRef.current;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeef2f5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(
      35,
      container.clientWidth / container.clientHeight,
      0.1,
      2000
    );
    camera.position.set(40, 30, 60);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 8, 0);
    controls.update();

    // Lighting
    scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1));
    const dl = new THREE.DirectionalLight(0xffffff, 0.8);
    dl.position.set(-20, 30, 10);
    scene.add(dl);

    // Main building group
    const building = new THREE.Group();
    scene.add(building);

    // Load inventory for floors
    fetch("/PT1_inventory.json")
      .then((r) => r.json())
      .then((inventory) => buildModel(inventory))
      .catch(() => console.warn("Inventory missing—using fallback"));

    const clickable = [];

    // MATERIALS
    const matWall = new THREE.MeshStandardMaterial({ color: 0xf7f4f1 });
    const matOrange = new THREE.MeshStandardMaterial({ color: 0xe8602f });
    const matGlass = new THREE.MeshStandardMaterial({
      color: 0x7fa7ff,
      opacity: 0.85,
      transparent: true,
    });
    const matRail = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const matBalcony = new THREE.MeshStandardMaterial({ color: 0xdedede });

    // ======================================================
    // 🔥 BUILD REAL ARCHITECTURAL MODEL
    // ======================================================
    function buildModel(inventory) {
      const floors = inventory.floors.length;
      const floorHeight = 3.2;
      const totalHeight = floors * floorHeight;

      // FRONT/BACK width and depth
      const width = 24;
      const depth = 20;

      // Build each floor shell
      for (let f = 0; f < floors; f++) {
        const y = (f + 0.5) * floorHeight;

        const floorGroup = new THREE.Group();
        floorGroup.position.y = y;

        // ------------------------------
        // ORANGE RECESSED CORE
        // ------------------------------
        const coreGeom = new THREE.BoxGeometry(6, floorHeight, 2.2);
        const core = new THREE.Mesh(coreGeom, matOrange);
        core.position.set(0, 0, -(depth / 2) + 1.1);
        floorGroup.add(core);

        // ------------------------------
        // BALCONIES LEFT / RIGHT (2 per floor)
        // ------------------------------
        const createBalcony = (xPos) => {
          const bal = new THREE.Mesh(
            new THREE.BoxGeometry(3, 0.18, 1.4),
            matBalcony
          );
          bal.position.set(xPos, -1.3, -(depth / 2) + 0.8);

          // rails
          for (let i = 0; i < 3; i++) {
            const rail = new THREE.Mesh(
              new THREE.BoxGeometry(3, 0.05, 0.05),
              matRail
            );
            rail.position.set(xPos, -0.8 + i * 0.3, -(depth / 2) + 0.1);
            floorGroup.add(rail);
          }

          return bal;
        };

        floorGroup.add(createBalcony(-4)); // left balcony
        floorGroup.add(createBalcony(4)); // right balcony

        // ------------------------------
        // WINDOWS (front + sides)
        // ------------------------------
        const createWindow = (xPos, yOffset = 0) => {
          const win = new THREE.Mesh(
            new THREE.PlaneGeometry(1.4, 1),
            matGlass
          );
          win.position.set(xPos, yOffset, -(depth / 2) + 0.05);
          return win;
        };

        floorGroup.add(createWindow(-8, 0.5));
        floorGroup.add(createWindow(-8, -0.8));

        floorGroup.add(createWindow(8, 0.5));
        floorGroup.add(createWindow(8, -0.8));

        // ------------------------------
        // UNIT CLICK BOXES (A, B, C, D)
        // ------------------------------
        const unitSlots = [
          { x: -6, id: "A" },
          { x: -2, id: "B" },
          { x: 2, id: "C" },
          { x: 6, id: "D" },
        ];

        unitSlots.forEach((slot, idx) => {
          const unitGeom = new THREE.BoxGeometry(3, floorHeight, depth);
          const mesh = new THREE.Mesh(unitGeom, matWall);
          mesh.position.set(slot.x, 0, 0);

          const real = inventory.floors[f].units[idx];

          mesh.userData = {
            uid: real.uid,
            type: real.type,
            floor: real.floor,
          };

          clickable.push(mesh);
          floorGroup.add(mesh);
        });

        building.add(floorGroup);
      }
    }

    // ======================================================
    // CLICK HANDLER
    // ======================================================
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let selected = null;

    function onClick(event) {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const hit = raycaster.intersectObjects(clickable);

      if (hit.length) {
        const unit = hit[0].object;

        if (selected && selected !== unit) selected.scale.set(1, 1, 1);
        selected = unit;
        selected.scale.set(1.05, 1.05, 1.05);

        window.dispatchEvent(
          new CustomEvent("ochiga-select-unit", {
            detail: unit.userData,
          })
        );
      }
    }

    renderer.domElement.addEventListener("pointerdown", onClick);

    // Animation
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();

    return () => container.removeChild(renderer.domElement);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", background: "#eef2f5" }}
    />
  );
}
