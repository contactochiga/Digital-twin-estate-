// src/core/focus.js
import * as THREE from "three";

let activeTween = null;

function animateCamera(camera, controls, targetPos, camPos) {
  if (activeTween) cancelAnimationFrame(activeTween);

  const startCam = camera.position.clone();
  const startTarget = controls.target.clone();

  const duration = 600; // ms
  const start = performance.now();

  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    const ease = t * (2 - t); // easeOutQuad

    camera.position.lerpVectors(startCam, camPos, ease);
    controls.target.lerpVectors(startTarget, targetPos, ease);
    controls.update();

    if (t < 1) {
      activeTween = requestAnimationFrame(step);
    }
  }

  activeTween = requestAnimationFrame(step);
}

export function setupCameraFocus(camera, controls) {
  window.addEventListener("ochiga-select", (e) => {
    const d = e.detail;
    if (!d || !d.entity) return;

    let target = new THREE.Vector3();
    let camPos = new THREE.Vector3();

    // -------------------------
    // UNIT
    // -------------------------
    if (d.entity === "UNIT") {
      target.set(d.__world?.x || 0, d.__world?.y || 6, d.__world?.z || 0);
      camPos.set(
        target.x + 14,
        target.y + 10,
        target.z + 14
      );
    }

    // -------------------------
    // FLOOR
    // -------------------------
    else if (d.entity === "FLOOR") {
      target.set(0, d.floor * 3.6 - 1.8, 0);
      camPos.set(28, target.y + 18, 28);
    }

    // -------------------------
    // BUILDING
    // -------------------------
    else if (d.entity === "BUILDING") {
      target.set(0, 8, 0);
      camPos.set(60, 50, 60);
    }

    animateCamera(camera, controls, target, camPos);
  });
}
