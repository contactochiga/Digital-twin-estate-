// src/startApp.js
import * as THREE from "three";
import { createScene } from "./core/scene";
import { createCamera } from "./core/camera";
import { createRenderer } from "./core/renderer";
import { createControls } from "./core/controls";
import { createEstate } from "./estate/Estate";
import { setupInspector } from "./ui/Inspector";

export function startApp() {
  const container = document.getElementById("ochiga-canvas-root");
  if (!container) return;

  // -------------------------
  // CORE
  // -------------------------
  const scene = createScene();
  const camera = createCamera();
  const renderer = createRenderer(container);
  const controls = createControls(camera, renderer);

  // -------------------------
  // LIGHTS
  // -------------------------
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));

  const sun = new THREE.DirectionalLight(0xffffff, 1);
  sun.position.set(80, 120, 80);
  sun.castShadow = true;
  scene.add(sun);

  // -------------------------
  // GROUND
  // -------------------------
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(2000, 2000),
    new THREE.MeshStandardMaterial({
      color: 0xf2f2f2,
      roughness: 1
    })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // -------------------------
  // ESTATE
  // -------------------------
  const estate = createEstate();
  scene.add(estate);

  // -------------------------
  // UI
  // -------------------------
  setupInspector();

  // -------------------------
  // RESIZE (MOBILE SAFE)
  // -------------------------
  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;

    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  window.addEventListener("resize", resize);
  resize();

  // -------------------------
  // RENDER LOOP
  // -------------------------
  let running = true;

  function animate() {
    if (!running) return;
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  animate();

  // -------------------------
  // CLEANUP (REACT SAFE)
  // -------------------------
  return () => {
    running = false;
    window.removeEventListener("resize", resize);
    container.innerHTML = "";
    renderer.dispose();
  };
}
