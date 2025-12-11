// src/components/PhotorealViewer.jsx
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

    // PMREM HDRI for realistic lighting
    const pmremGen = new PMREMGenerator(renderer);
    const rgbl = new RGBELoader();
    // Use a lightweight HDRI; place HDRI file at /hdr/urban_small_1.hdr
    rgbl.load("/hdr/royal_esplanade_1k.hdr", (hdr) => {
      const envMap = pmremGen.fromEquirectangular(hdr).texture;
      scene.environment = envMap;
      hdr.dispose();
      pmremGen.dispose();
    });

    // lights (fill/directional)
    const sun = new THREE.DirectionalLight(0xffffff, 1.0);
    sun.position.set(-50, 60, 20);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -80;
    sun.shadow.camera.right = 80;
    sun.shadow.camera.top = 80;
    sun.shadow.camera.bottom = -80;
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

    // postprocessing for depth/ambient occlusion + bloom subtle
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const ssaoPass = new SSAOPass(scene, camera, mount.clientWidth, mount.clientHeight);
    ssaoPass.kernelRadius = 16;
    ssaoPass.minDistance = 0.001;
    ssaoPass.maxDistance = 0.1;
    composer.addPass(ssaoPass);
    const bloom = new UnrealBloomPass(new THREE.Vector2(mount.clientWidth, mount.clientHeight), 0.15, 1, 0.7);
    composer.addPass(bloom);

    // loaders
    const gltfLoader = new GLTFLoader();

    // we keep references
    const sceneObjects = { building: null, mep: {} };
    const clickable = [];

    function applyPBRFixes(node) {
      // ensure materials are sRGB where needed and cast/receive shadows
      node.traverse((c) => {
        if (c.isMesh) {
          c.castShadow = true;
          c.receiveShadow = true;
          if (Array.isArray(c.material)) {
            c.material.forEach((m) => (m.metalness = 0.0));
          } else {
            c.material.metalness = c.material.metalness ?? 0.0;
            c.material.roughness = c.material.roughness ?? 0.6;
          }
        }
      });
    }

    // load main building glb
    gltfLoader.load(modelUrl, (g) => {
      const root = g.scene;
      applyPBRFixes(root);
      root.name = "PT1_BUILDING";
      // ensure real scale and orientation are correct in Blender (Z forward)
      // rotate if necessary
      // root.rotation.y = Math.PI; // only if model built with opposite front
      scene.add(root);
      sceneObjects.building = root;

      // find units and register clickable
      root.traverse((n) => {
        if (n.name && n.name.startsWith("UNIT_")) {
          clickable.push(n);
          // ensure userData has uid etc (from glTF extras)
          // If not present, fallback to node name
          n.userData = n.userData || {};
          n.userData.uid = n.userData.uid || n.name.split("UNIT_")[1];
        }
      });

      setReady(true);
    });

    // load MEP layers (optional)
    Object.keys(mepUrls).forEach((k) => {
      const url = mepUrls[k];
      gltfLoader.load(url, (g) => {
        const root = g.scene;
        root.name = `MEP_${k.toUpperCase()}`;
        // color override by map
        root.traverse((m) => {
          if (m.isMesh) {
            m.castShadow = true;
            m.receiveShadow = true;
            m.material = m.material.clone();
            // color mapping
            if (k === "power") {
              m.material.color = new THREE.Color(0xe74c3c);
            } else if (k === "water") {
              m.material.color = new THREE.Color(0x2E86DE);
            } else if (k === "sewage") {
              m.material.color = new THREE.Color(0x7f5539);
            } else if (k === "gas") {
              m.material.color = new THREE.Color(0xd35400);
            } else if (k === "fiber") {
              m.material.color = new THREE.Color(0x6f42c1);
            }
            m.visible = false; // default off
          }
        });
        scene.add(root);
        sceneObjects.mep[k] = root;
      });
    });

    // click handling
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    function onPointerDown(ev) {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);

      const hits = raycaster.intersectObjects(clickable, true);
      if (hits.length) {
        let node = hits[0].object;
        // walk up to find unit group
        while (node && !node.name.startsWith("UNIT_")) node = node.parent;
        if (node) {
          // highlight and fire event
          node.scale.set(1.03, 1.03, 1.03);
          onSelectUnit(node.userData);
          // dispatch global event for InventoryLoader
          window.dispatchEvent(new CustomEvent("ochiga-select-unit", { detail: node.userData }));
        }
      }
    }
    renderer.domElement.addEventListener("pointerdown", onPointerDown);

    // toggle function (exposed via window for quick debug)
    window._ochigaToggleMEP = (k, v) => {
      const root = sceneObjects.mep[k];
      if (!root) return;
      root.traverse((m) => {
        if (m.isMesh) m.visible = v;
      });
    };

    // live data hook (mock)
    // Replace with WebSocket or MQTT to push real Oyi OS data -> map to nodes by uid/meterId
    const live = {};
    function startMock() {
      setInterval(() => {
        // pick random unit
        const u = clickable[Math.floor(Math.random() * clickable.length)];
        if (!u) return;
        const uid = u.userData.uid || u.name;
        live[uid] = {
          kwh: (Math.random() * 5 + 2).toFixed(2),
          water: (Math.random() * 0.05 + 0.01).toFixed(3),
          temp: (22 + Math.random() * 4).toFixed(1)
        };
        // optionally pulse visual (tiny emissive flash)
        u.traverse((m) => {
          if (m.isMesh) {
            const old = m.material.emissive ? m.material.emissive.clone() : new THREE.Color(0x000000);
            if (m.material.emissive) {
              m.material.emissive.setHex(0x223311);
              setTimeout(() => m.material.emissive.copy(old), 200);
            }
          }
        });
        // publish event
        window.dispatchEvent(new CustomEvent("ochiga-live-update", { detail: { uid, data: live[uid] } }));
      }, 1700);
    }
    startMock();

    // responsive resize
    function onResize() {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
    }
    window.addEventListener("resize", onResize);

    // animation render
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      composer.render();
    }
    animate();

    // cleanup
    return () => {
      window.removeEventListener("resize", onResize);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      mount.removeChild(renderer.domElement);
      pmremGen.dispose();
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
