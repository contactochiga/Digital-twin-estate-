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
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 0.9;
    controls.zoomSpeed = 0.9;

    // better mobile touch mapping
    controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN
    };

    controls.update();

    // Lighting
    scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1));
    const dl = new THREE.DirectionalLight(0xffffff, 0.8);
    dl.position.set(-20, 30, 10);
    scene.add(dl);

    const grid = new THREE.GridHelper(120, 24, 0xcccccc, 0xcccccc);
    grid.position.y = 0;
    scene.add(grid);

    // Main building group
    const building = new THREE.Group();
    scene.add(building);

    // Load inventory for floors
    let inventory = null;
    fetch("/PT1_inventory.json")
      .then((r) => r.json())
      .then((inv) => {
        inventory = inv;
        buildModel(inv);
      })
      .catch(() => {
        // fallback
        inventory = {
          footprint_m: { width: 24, depth: 20 },
          floors: new Array(5).fill(0).map((_, i) => ({
            floor: i + 1,
            units: [
              { uid: `OCH-PT1-F0${i+1}-A`, type: "3B" },
              { uid: `OCH-PT1-F0${i+1}-B`, type: "2B" },
              { uid: `OCH-PT1-F0${i+1}-C`, type: "3B" },
              { uid: `OCH-PT1-F0${i+1}-D`, type: "2B" }
            ]
          }))
        };
        buildModel(inventory);
      });

    const clickable = [];

    const matWall = new THREE.MeshStandardMaterial({ color: 0xf7f4f1 });
    const matOrange = new THREE.MeshStandardMaterial({ color: 0xe8602f });
    const matGlass = new THREE.MeshStandardMaterial({ color: 0x7fa7ff, opacity: 0.85, transparent: true });
    const matRail = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const matBalcony = new THREE.MeshStandardMaterial({ color: 0xdedede });

    function buildModel(inv) {
      const floors = inv.floors.length;
      const floorHeight = 3.2;
      const depth = inv.footprint_m?.depth ?? 20;

      for (let f = 0; f < floors; f++) {
        const y = (f + 0.5) * floorHeight;
        const floorGroup = new THREE.Group();
        floorGroup.position.y = y;

        // orange recessed core cavity (center front)
        const coreGeom = new THREE.BoxGeometry(6, floorHeight, 2.2);
        const core = new THREE.Mesh(coreGeom, matOrange);
        core.position.set(0, 0, -(depth / 2) + 1.1);
        floorGroup.add(core);

        // balconies left + right
        const createBalcony = (xPos) => {
          const bal = new THREE.Mesh(new THREE.BoxGeometry(3, 0.18, 1.4), matBalcony);
          bal.position.set(xPos, -1.3, -(depth / 2) + 0.8);

          // rails
          const railCount = 3;
          for (let i = 0; i < railCount; i++) {
            const rail = new THREE.Mesh(new THREE.BoxGeometry(3, 0.05, 0.05), matRail);
            rail.position.set(xPos, -0.8 + i * 0.3, -(depth / 2) + 0.1);
            floorGroup.add(rail);
          }
          return bal;
        };

        floorGroup.add(createBalcony(-4));
        floorGroup.add(createBalcony(4));

        // windows (front)
        const createWindow = (xPos, yOffset = 0) => {
          const w = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1), matGlass);
          w.position.set(xPos, yOffset, -(depth / 2) + 0.05);
          return w;
        };

        floorGroup.add(createWindow(-8, 0.5));
        floorGroup.add(createWindow(-8, -0.8));
        floorGroup.add(createWindow(8, 0.5));
        floorGroup.add(createWindow(8, -0.8));

        // units A,B,C,D clickable volumes (thin extruded boxes)
        const unitSlots = [
          { x: -6, id: "A" },
          { x: -2, id: "B" },
          { x: 2, id: "C" },
          { x: 6, id: "D" }
        ];

        for (let u = 0; u < unitSlots.length; u++) {
          const slot = unitSlots[u];
          const unitGeom = new THREE.BoxGeometry(3, floorHeight, depth - 0.3);
          const unitMesh = new THREE.Mesh(unitGeom, matWall);
          unitMesh.position.set(slot.x, 0, 0);

          const real = inv.floors[f].units[u];
          unitMesh.userData = { uid: real.uid, type: real.type, floor: real.floor };

          clickable.push(unitMesh);
          floorGroup.add(unitMesh);
        }

        building.add(floorGroup);
      }

      // send ready event
      window.dispatchEvent(new CustomEvent("ochiga-scene-ready"));
    }

    // raycaster & click
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let selected = null;

    function onPointerDown(event) {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(clickable, true);

      if (intersects.length > 0) {
        let o = intersects[0].object;
        while (o && !o.userData?.uid) o = o.parent;
        if (o) {
          if (selected && selected !== o) selected.scale.set(1, 1, 1);
          selected = o;
          selected.scale.set(1.03, 1.03, 1.03);
          window.dispatchEvent(new CustomEvent("ochiga-select-unit", { detail: selected.userData }));
        }
      }
    }

    renderer.domElement.addEventListener("pointerdown", onPointerDown);

    // focus floor event
    function onFocusFloor(e) {
      const f = e.detail;
      const y = (f - 0.5) * 3.2;
      controls.target.set(0, y + 0.8, 0);
      controls.update();
      // open drawer on mobile when focusing
      if (window._ochigaToggleDrawer) window._ochigaToggleDrawer(true);
    }
    window.addEventListener("ochiga-focus-floor", onFocusFloor);

    // resize
    function onWindowResize() {
      renderer.setSize(container.clientWidth, container.clientHeight);
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", onWindowResize);

    // render loop
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    // cleanup
    return () => {
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", onWindowResize);
      window.removeEventListener("ochiga-focus-floor", onFocusFloor);
      if (container && renderer.domElement) container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
