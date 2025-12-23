// src/startApp.js
import { createScene } from "./core/scene";
import { createCamera } from "./core/camera";
import { createRenderer } from "./core/renderer";
import { createEstate } from "./estate/Estate";
import { setupInspector } from "./ui/Inspector";
import * as THREE from "three";

export function startApp() {
  const scene = createScene();
  const camera = createCamera();
  const renderer = createRenderer();

  // Attach renderer to DOM
  const container = document.getElementById("ochiga-canvas-root");
  container.appendChild(renderer.domElement);

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const sun = new THREE.DirectionalLight(0xffffff, 1);
  sun.position.set(80, 120, 80);
  scene.add(sun);

  // Ground
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(500, 500),
    new THREE.MeshStandardMaterial({ color: 0xeaeaea })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  // Estate
  const estate = createEstate();
  scene.add(estate);

  // UI
  setupInspector();

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  animate();
}
