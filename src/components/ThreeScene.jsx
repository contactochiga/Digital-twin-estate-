import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function ThreeScene() {
  const containerRef = useRef();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- renderer, scene, camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeef2f5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(
      35,
      container.clientWidth / container.clientHeight,
      0.1,
      2000
    );

    // place camera in front of building, slightly above center
    camera.position.set(0, 12, 36);

    // --- controls (better for mobile)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 0.9;
    controls.zoomSpeed = 0.9;
    controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN
    };
    controls.target.set(0, 8, 0);
    controls.update();

    // --- lights
    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.9);
    hemi.position.set(0, 50, 0);
    scene.add(hemi);

    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(-30, 40, 20);
    scene.add(dir);

    // ground grid (subtle)
    const grid = new THREE.GridHelper(120, 24, 0xdfeff3, 0xdfeff3);
    grid.position.y = 0;
    scene.add(grid);

    // ---- main building group
    const building = new THREE.Group();
    scene.add(building);

    // clickable volumes list
    const clickable = [];

    // materials
    const matWall = new THREE.MeshStandardMaterial({ color: 0xf7f4f1 }); // off-white
    const matOrange = new THREE.MeshStandardMaterial({ color: 0xe86e3a }); // orange recessed
    const matGlass = new THREE.MeshStandardMaterial({
      color: 0x7fa7ff,
      opacity: 0.85,
      transparent: true,
      roughness: 0.2,
      metalness: 0.0
    });
    const matRail = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const matBalcony = new THREE.MeshStandardMaterial({ color: 0xebebe8 });

    // footprint and heights (meters)
    const footprint = { width: 24, depth: 20 };
    const floorHeight = 3.2;

    // fetch inventory file and then build model
    fetch("/PT1_inventory.json")
      .then((r) => r.json())
      .then((inv) => buildFromInventory(inv))
      .catch(() => {
        // fallback simple inventory (5 floors, 4 units each)
        const fallback = {
          footprint_m: { width: 24, depth: 20 },
          floors: Array.from({ length: 5 }).map((_, i) => ({
            floor: i + 1,
            units: [
              { uid: `OCH-PT1-F0${i + 1}-A`, type: "3B" },
              { uid: `OCH-PT1-F0${i + 1}-B`, type: "2B" },
              { uid: `OCH-PT1-F0${i + 1}-C`, type: "3B" },
              { uid: `OCH-PT1-F0${i + 1}-D`, type: "2B" }
            ]
          }))
        };
        buildFromInventory(fallback);
      });

    function buildFromInventory(inv) {
      const floors = inv.floors.length;
      const depth = inv.footprint_m?.depth ?? footprint.depth;
      const width = inv.footprint_m?.width ?? footprint.width;

      // base slab (thin plinth)
      const plinth = new THREE.Mesh(
        new THREE.BoxGeometry(width + 0.5, 0.2, depth + 0.5),
        new THREE.MeshStandardMaterial({ color: 0xd0d0d0 })
      );
      plinth.position.set(0, 0.1, 0);
      building.add(plinth);

      // left and right recessed cores: create per-floor vertical recessed boxes
      // left core X position: - (width/2 - coreInset)
      const coreInset = 3.2; // distance from outer wall to core face
      const coreWidth = 3.6; // width of recessed cavity
      const balconyDepth = 1.4;
      const balconyWidth = 3.2; // approximate per-unit balcony width

      // create full facade shells per floor (front-facing facade elements)
      for (let f = 0; f < floors; f++) {
        const y = (f + 0.5) * floorHeight;

        const floorGroup = new THREE.Group();
        floorGroup.position.y = y;

        // --- create left facade panel (outer wall) as thin box to give depth
        const outerWallThickness = 0.25;
        const sidePanelGeom = new THREE.BoxGeometry(width, floorHeight, outerWallThickness);

        // front facade main wall (we will cut recessed cores visually by overlaying orange boxes)
        const frontWallMat = matWall.clone();
        const frontPlane = new THREE.Mesh(
          new THREE.BoxGeometry(width, floorHeight, 0.8),
          frontWallMat
        );
        frontPlane.position.set(0, 0, -(depth / 2) + 0.4);
        floorGroup.add(frontPlane);

        // --- left recessed orange box (vertical inset area):
        // position along X: left side core is offset from center to left
        const leftX = - (width / 2) + coreInset + coreWidth / 2;
        const leftCoreGeom = new THREE.BoxGeometry(coreWidth, floorHeight, 1.6);
        const leftCore = new THREE.Mesh(leftCoreGeom, matOrange);
        // push into facade slightly
        leftCore.position.set(leftX, 0, -(depth / 2) + 0.8);
        floorGroup.add(leftCore);

        // --- right recessed orange box
        const rightX = (width / 2) - coreInset - coreWidth / 2;
        const rightCoreGeom = new THREE.BoxGeometry(coreWidth, floorHeight, 1.6);
        const rightCore = new THREE.Mesh(rightCoreGeom, matOrange);
        rightCore.position.set(rightX, 0, -(depth / 2) + 0.8);
        floorGroup.add(rightCore);

        // --- balconies: left and right, placed in front of the recessed cores (extrude slightly)
        const leftBal = new THREE.Mesh(
          new THREE.BoxGeometry(balconyWidth, 0.18, balconyDepth),
          matBalcony
        );
        leftBal.position.set(leftX, -1.3, -(depth / 2) + balconyDepth / 2 + 0.05);
        floorGroup.add(leftBal);

        const rightBal = new THREE.Mesh(
          new THREE.BoxGeometry(balconyWidth, 0.18, balconyDepth),
          matBalcony
        );
        rightBal.position.set(rightX, -1.3, -(depth / 2) + balconyDepth / 2 + 0.05);
        floorGroup.add(rightBal);

        // balcony railings (3 horizontal bars each)
        const createRails = (xPos) => {
          const rails = new THREE.Group();
          for (let i = 0; i < 3; i++) {
            const bar = new THREE.Mesh(
              new THREE.BoxGeometry(balconyWidth, 0.05, 0.04),
              matRail
            );
            bar.position.set(xPos, -0.9 + i * 0.28, -(depth / 2) + 0.14);
            rails.add(bar);
          }
          return rails;
        };
        floorGroup.add(createRails(leftX));
        floorGroup.add(createRails(rightX));

        // --- windows: position small blue-window planes in appropriate places
        // front: two windows near left core (one up, one down) and two near right core
        const winW = 1.4, winH = 1.0;
        const addWindow = (xOff, yOff) => {
          const w = new THREE.Mesh(new THREE.PlaneGeometry(winW, winH), matGlass);
          w.position.set(xOff, yOff, -(depth / 2) + 0.08);
          floorGroup.add(w);
        };

        // windows near left core
        addWindow(leftX - 1.2, 0.6);
        addWindow(leftX - 1.2, -0.6);
        // windows near right core
        addWindow(rightX + 1.2, 0.6);
        addWindow(rightX + 1.2, -0.6);

        // --- secondary windows mid-section (to reflect corridor/kitchen windows)
        addWindow(0, 0.6);
        addWindow(0, -0.6);

        // --- clickable unit volumes (A,B on left side, C,D on right side)
        // unit positions (x) within each half: we place two units per side
        const leftUnitX1 = leftX - (coreWidth / 2 + 1.6);
        const leftUnitX2 = leftX + (coreWidth / 2 + 1.6);
        const rightUnitX1 = rightX - (coreWidth / 2 + 1.6);
        const rightUnitX2 = rightX + (coreWidth / 2 + 1.6);

        const unitXs = [leftUnitX1, leftUnitX2, rightUnitX1, rightUnitX2];

        for (let ui = 0; ui < 4; ui++) {
          const ux = unitXs[ui];
          const unitGeom = new THREE.BoxGeometry(3.0, floorHeight, depth - 0.6);
          const unitMesh = new THREE.Mesh(unitGeom, matWall.clone());
          unitMesh.position.set(ux, 0, 0); // centered in depth
          // map to inventory if exists
          const floorData = inv.floors[f];
          const meta = floorData && floorData.units && floorData.units[ui] ? floorData.units[ui] : { uid: `F${f+1}-${ui}`, type: "n/a", floor: f+1 };
          unitMesh.userData = { uid: meta.uid, type: meta.type, floor: meta.floor };

          // small label sprite (UID short)
          const canvas = document.createElement("canvas");
          canvas.width = 256;
          canvas.height = 64;
          const ctx = canvas.getContext("2d");
          ctx.fillStyle = "rgba(255,255,255,0.0)";
          ctx.fillRect(0, 0, 256, 64);
          ctx.fillStyle = "#111";
          ctx.font = "bold 18px Arial";
          const short = meta.uid ? meta.uid.split("-").slice(-1)[0] : `U${ui+1}`;
          ctx.fillText(short, 8, 34);
          const tex = new THREE.CanvasTexture(canvas);
          const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex }));
          sprite.scale.set(4.5, 1.2, 1);
          sprite.position.set(ux, floorHeight / 2 - 0.6, (depth / 2) - 0.4);
          floorGroup.add(sprite);

          clickable.push(unitMesh);
          floorGroup.add(unitMesh);
        }

        building.add(floorGroup);
      } // end floors

      // add a flat roof slab on top
      const roof = new THREE.Mesh(
        new THREE.BoxGeometry(width + 0.3, 0.25, depth + 0.3),
        new THREE.MeshStandardMaterial({ color: 0x333333 })
      );
      roof.position.set(0, floors * floorHeight + 0.125, 0);
      building.add(roof);

      // center building slightly above ground
      building.position.y = 0.2;

      // ensure camera faces the front elevation (z negative is front)
      controls.target.set(0, (floors * floorHeight) / 2, -(depth / 4));
      controls.update();

      // notify UI that scene is ready
      window.dispatchEvent(new CustomEvent("ochiga-scene-ready"));
    } // end buildFromInventory

    // --- raycasting for clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let selected = null;

    function onPointerDown(e) {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(clickable, true);
      if (hits.length > 0) {
        let o = hits[0].object;
        while (o && !o.userData?.uid) o = o.parent;
        if (o) {
          if (selected && selected !== o) selected.scale.set(1, 1, 1);
          selected = o;
          selected.scale.set(1.04, 1.04, 1.04);
          // dispatch selection event
          window.dispatchEvent(new CustomEvent("ochiga-select-unit", { detail: selected.userData }));
          // open drawer on mobile
          if (window._ochigaToggleDrawer) window._ochigaToggleDrawer(true);
        }
      }
    }

    renderer.domElement.addEventListener("pointerdown", onPointerDown);

    // focus floor handler (used by UI chips)
    function onFocusFloor(e) {
      const floor = e.detail;
      const y = (floor - 0.5) * floorHeight;
      controls.target.set(0, y, -(invDepth() / 4));
      controls.update();
      if (window._ochigaToggleDrawer) window._ochigaToggleDrawer(true);
    }
    window.addEventListener("ochiga-focus-floor", onFocusFloor);

    // helper: get inventory depth if available
    function invDepth() {
      // try to read PT1_inventory.json if present via window (not reliable here) — fallback:
      return footprint.depth;
    }

    // handle resize
    function onResize() {
      if (!container) return;
      renderer.setSize(container.clientWidth, container.clientHeight);
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", onResize);

    // animate
    (function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    })();

    // cleanup on unmount
    return () => {
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("ochiga-focus-floor", onFocusFloor);
      try { container.removeChild(renderer.domElement); } catch (err) {}
    };
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
