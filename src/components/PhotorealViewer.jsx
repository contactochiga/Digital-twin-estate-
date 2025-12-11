import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { PMREMGenerator } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

export default function PhotorealViewer({
  modelUrl = "/pt1_building.glb",
  mepUrls = {
    power: "/pt1_mep_power.glb",
    water: "/pt1_mep_water.glb",
    sewage: "/pt1_mep_sewage.glb",
    gas: "/pt1_mep_gas.glb",
    fiber: "/pt1_mep_fiber.glb"
  },
  onSelectUnit = () => {}
}) {
  const mountRef = useRef();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(40, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.set(0, 22, 52);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 9, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.update();

    // PMREM + HDRI: optional (fail silently if HDR missing)
    const pmremGen = new PMREMGenerator(renderer);
    const rgbl = new RGBELoader();
    rgbl.load("/hdr/royal_esplanade_1k.hdr",
      (hdr) => {
        const envMap = pmremGen.fromEquirectangular(hdr).texture;
        scene.environment = envMap;
        hdr.dispose();
        pmremGen.dispose();
      },
      undefined,
      (err) => {
        // ignore failure — fallback will still look fine
        // console.warn("HDR load failed", err);
      }
    );

    // lights
    const sun = new THREE.DirectionalLight(0xffffff, 1.0);
    sun.position.set(-50, 60, 20);
    sun.castShadow = true;
    scene.add(sun);
    const amb = new THREE.HemisphereLight(0xffffff, 0x444444, 0.5);
    scene.add(amb);

    // ground
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(400, 400),
      new THREE.MeshStandardMaterial({ color: 0xedf2f7, roughness: 1 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // postprocessing
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const ssaoPass = new SSAOPass(scene, camera, mount.clientWidth, mount.clientHeight);
    ssaoPass.kernelRadius = 12;
    ssaoPass.minDistance = 0.001;
    ssaoPass.maxDistance = 0.2;
    composer.addPass(ssaoPass);
    const bloom = new UnrealBloomPass(new THREE.Vector2(mount.clientWidth, mount.clientHeight), 0.12, 1, 0.6);
    composer.addPass(bloom);

    // loaders
    const gltfLoader = new GLTFLoader();

    // scene references
    const sceneObjects = { building: null, mep: {} };
    const clickable = [];

    function applyPBRFixes(node) {
      node.traverse((c) => {
        if (c.isMesh) {
          c.castShadow = true;
          c.receiveShadow = true;
          if (Array.isArray(c.material)) {
            c.material.forEach(m => { m.metalness = m.metalness ?? 0.0; m.roughness = m.roughness ?? 0.6; });
          } else {
            c.material.metalness = c.material.metalness ?? 0.0;
            c.material.roughness = c.material.roughness ?? 0.6;
          }
        }
      });
    }

    // Attempt to load GLTF building. If it fails, fallback to procedural build.
    let attemptedLoad = false;
    function buildProcedural() {
      // build a functional 3D model that matches PT1 massing and node names
      const building = new THREE.Group();
      building.name = "PT1_BUILDING_PROC";

      const floors = 5;
      const floorH = 3.2;
      const depth = 20;
      const width = 24;

      // materials
      const matWall = new THREE.MeshStandardMaterial({ color: 0xf7f4f1 });
      const matOrange = new THREE.MeshStandardMaterial({ color: 0xe86e3a });
      const matGlass = new THREE.MeshStandardMaterial({ color: 0x7fa7ff, opacity: 0.85, transparent: true });
      const matBal = new THREE.MeshStandardMaterial({ color: 0xdddddd });

      // core left/right full height (visual only)
      const leftCore = new THREE.Mesh(new THREE.BoxGeometry(3.6, floors * floorH, 1.6), matOrange);
      leftCore.position.set(-8.0, (floors * floorH) / 2 - floorH / 2, -(depth / 2) + 0.8);
      building.add(leftCore);

      const rightCore = leftCore.clone();
      rightCore.position.set(8.0, (floors * floorH) / 2 - floorH / 2, -(depth / 2) + 0.8);
      building.add(rightCore);

      // create floors and units
      const unitXs = [-6, -2, 2, 6];
      for (let f = 0; f < floors; f++) {
        const floorY = (f + 0.5) * floorH;
        const fg = new THREE.Group();
        fg.position.y = floorY;

        // add thin facade plane to make surfaces visible (transparent so details show)
        const facade = new THREE.Mesh(new THREE.BoxGeometry(width, floorH, 0.18), matWall);
        facade.position.set(0, 0, -(depth / 2) + 0.09);
        fg.add(facade);

        // balconies
        const by = -1.3;
        const balL = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.18, 1.4), matBal);
        balL.position.set(-8.0, by, -(depth / 2) + 0.8);
        fg.add(balL);
        const balR = balL.clone();
        balR.position.set(8.0, by, -(depth / 2) + 0.8);
        fg.add(balR);

        // windows as planes
        const win = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.0), matGlass);
        win.position.set(-8.0 - 1.2, 0.5, -(depth / 2) + 0.08);
        fg.add(win);
        const win2 = win.clone(); win2.position.set(-8.0 - 1.2, -0.6, -(depth / 2) + 0.08); fg.add(win2);
        const win3 = win.clone(); win3.position.set(8.0 + 1.2, 0.5, -(depth / 2) + 0.08); fg.add(win3);
        const win4 = win.clone(); win4.position.set(8.0 + 1.2, -0.6, -(depth / 2) + 0.08); fg.add(win4);
        const mid1 = win.clone(); mid1.position.set(0, 0.5, -(depth / 2) + 0.08); fg.add(mid1);
        const mid2 = win.clone(); mid2.position.set(0, -0.6, -(depth / 2) + 0.08); fg.add(mid2);

        // unit clickable volumes
        for (let u = 0; u < 4; u++) {
          const ux = unitXs[u];
          const unitGeom = new THREE.BoxGeometry(3.0, floorH * 0.95, depth - 0.6);
          const unitMesh = new THREE.Mesh(unitGeom, matWall.clone());
          unitMesh.position.set(ux, 0, 0);
          const uid = `OCH-PT1-F${f+1 < 10 ? "0"+(f+1) : (f+1)}-${String.fromCharCode(65+u)}`;
          unitMesh.name = `UNIT_${uid}`;
          unitMesh.userData = { uid, type: (u%2===0? "3B":"2B"), floor: f+1 };
          fg.add(unitMesh);
          clickable.push(unitMesh);
        }

        building.add(fg);
      }

      // roof
      const roof = new THREE.Mesh(new THREE.BoxGeometry(width + 0.3, 0.25, depth + 0.3), new THREE.MeshStandardMaterial({ color: 0x333333 }));
      roof.position.set(0, floors * floorH + 0.125, 0);
      building.add(roof);

      building.position.y = 0.2;
      scene.add(building);
      sceneObjects.building = building;

      controls.target.set(0, (floors * floorH) / 2, -(depth / 4));
      controls.update();

      setReady(true);
    }

    // loader with fallback
    gltfLoader.load(modelUrl,
      (g) => {
        applyPBRFixes(g.scene);
        scene.add(g.scene);
        sceneObjects.building = g.scene;

        // register clickable units by name UNIT_...
        g.scene.traverse((n) => {
          if (n.name && n.name.startsWith("UNIT_")) {
            clickable.push(n);
            // ensure userData.uid exists
            n.userData = n.userData || {};
            if (!n.userData.uid) n.userData.uid = n.name.replace("UNIT_","");
          }
        });

        setReady(true);
      },
      undefined,
      (err) => {
        // GLB failed to load -> build procedural fallback
        console.warn("GLB load failed, fallback to procedural building.", err);
        buildProcedural();
      }
    );

    // load MEP layers (if present). If fail, ignore.
    Object.keys(mepUrls).forEach(k => {
      gltfLoader.load(mepUrls[k],
        (g) => {
          g.scene.name = `MEP_${k.toUpperCase()}`;
          // color override by layer
          let color;
          if (k === "power") color = new THREE.Color(0xe74c3c);
          else if (k === "water") color = new THREE.Color(0x2E86DE);
          else if (k === "sewage") color = new THREE.Color(0x7f5539);
          else if (k === "gas") color = new THREE.Color(0xd35400);
          else if (k === "fiber") color = new THREE.Color(0x6f42c1);
          g.scene.traverse(m => { if (m.isMesh) { m.material = m.material.clone(); m.material.color = color; m.visible = false; }});
          scene.add(g.scene);
          sceneObjects.mep[k] = g.scene;
        },
        undefined,
        (err) => {
          // ignore
        }
      );
    });

    // raycast click handler
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let selected = null;

    function onPointerDown(ev) {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(clickable, true);
      if (hits.length) {
        let node = hits[0].object;
        // walk to parent with name UNIT_
        while (node && !node.name?.startsWith("UNIT_")) node = node.parent;
        if (node) {
          if (selected && selected !== node) selected.scale.set(1,1,1);
          selected = node;
          selected.scale.set(1.03,1.03,1.03);
          onSelectUnit(node.userData);
          window.dispatchEvent(new CustomEvent("ochiga-select-unit", { detail: node.userData }));
        }
      }
    }
    renderer.domElement.addEventListener("pointerdown", onPointerDown);

    // expose MEP toggle helper to window
    window._ochigaToggleMEP = (k, v) => {
      const root = sceneObjects.mep[k];
      if (!root) return;
      root.traverse((m) => { if (m.isMesh) m.visible = v; });
    };

    // fallback: if no GLB and no MEP, user can toggle mechanical visualization
    window._ochigaShowProcedural = (v) => {
      // no-op here; procedural is visible by default
    };

    // mock live updater
    const live = {};
    function startMock() {
      setInterval(() => {
        if (clickable.length === 0) return;
        const u = clickable[Math.floor(Math.random() * clickable.length)];
        const uid = u.userData?.uid || u.name;
        live[uid] = {
          kwh: (Math.random() * 5 + 2).toFixed(2),
          water: (Math.random() * 0.05 + 0.01).toFixed(3),
          temp: (22 + Math.random() * 4).toFixed(1)
        };
        window.dispatchEvent(new CustomEvent("ochiga-live-update", { detail: { uid, data: live[uid] } }));
      }, 1500);
    }
    startMock();

    // focus floor event (from UI chips)
    function onFocusFloor(e) {
      const floor = e.detail;
      const y = (floor - 0.5) * 3.2;
      controls.target.set(0, y + 0.8, 0);
      controls.update();
    }
    window.addEventListener("ochiga-focus-floor", onFocusFloor);

    // resize
    function onResize() {
      const w = mount.clientWidth, h = mount.clientHeight;
      camera.aspect = w/h; camera.updateProjectionMatrix();
      renderer.setSize(w,h); composer.setSize(w,h);
    }
    window.addEventListener("resize", onResize);

    (function animate() { requestAnimationFrame(animate); controls.update(); composer.render(); })();

    // cleanup
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("ochiga-focus-floor", onFocusFloor);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      try { mount.removeChild(renderer.domElement); } catch (e){ }
    };
  }, [modelUrl, mepUrls, onSelectUnit]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />
      {!ready && (
        <div style={{
          position: "absolute", left: 12, top: 12, padding: "8px 12px",
          background: "rgba(0,0,0,0.4)", color: "#fff", borderRadius: 8
        }}>Loading scene...</div>
      )}
    </div>
  );
}
