// src/ui/Inspector.js

import { EstateOverviewPanel } from "./panels/EstateOverviewPanel";
import { EstatePowerPanel } from "./panels/EstatePowerPanel";
import { EstateWaterPanel } from "./panels/EstateWaterPanel";
import { EstateFiberPanel } from "./panels/EstateFiberPanel";
import { EstateSecurityPanel } from "./panels/EstateSecurityPanel";
import { renderUnitCharts } from "./charts/UnitCharts";

export function setupInspector() {
  const panel = document.getElementById("ui-pane");
  if (!panel) return;

  panel.innerHTML = `
    <h2>Ochiga Estate</h2>
    <div class="small">Digital Twin · Estate Level Control</div>

    <div class="info-box small">
      Tap a building, floor, or unit to inspect live data.
    </div>

    <button class="btn" id="estate-overview">Estate Overview</button>
    <button class="btn" id="estate-power">Power Network</button>
    <button class="btn" id="estate-water">Water & Sewage</button>
    <button class="btn" id="estate-fiber">Fiber Network</button>
    <button class="btn" id="estate-security">Security</button>

    <div id="inspector-content" class="info-box small"></div>
  `;

  const content = document.getElementById("inspector-content");

  // -------------------------
  // ESTATE PANELS
  // -------------------------
  document.getElementById("estate-overview").onclick = () => {
    content.innerHTML = EstateOverviewPanel();
  };

  document.getElementById("estate-power").onclick = () => {
    content.innerHTML = EstatePowerPanel();
  };

  document.getElementById("estate-water").onclick = () => {
    content.innerHTML = EstateWaterPanel();
  };

  document.getElementById("estate-fiber").onclick = () => {
    content.innerHTML = EstateFiberPanel();
  };

  document.getElementById("estate-security").onclick = () => {
    content.innerHTML = EstateSecurityPanel();
  };

  // -------------------------
  // SELECTION HANDLER
  // -------------------------
  window.addEventListener("ochiga-select", (e) => {
    const d = e.detail;
    if (!d) return;

    // =========================
    // UNIT LEVEL
    // =========================
    if (d.entity === "UNIT") {
      content.innerHTML = `
        <b>🏠 Unit</b><br/>
        <b>Building:</b> ${d.buildingId}<br/>
        <b>Floor:</b> ${d.floor}<br/>
        <b>Unit:</b> ${d.unit}<br/>
        <b>Type:</b> ${d.unitType}<br/>
        <b>Estate Controlled:</b> Yes
        <hr/>
        <div id="unit-charts"></div>
      `;

      // ✅ Render live charts
      renderUnitCharts(d);
      return;
    }

    // =========================
    // FLOOR LEVEL
    // =========================
    if (d.entity === "FLOOR") {
      content.innerHTML = `
        <b>🧱 Floor</b><br/>
        <b>Building:</b> ${d.buildingId}<br/>
        <b>Floor:</b> ${d.floor}<br/>
        <b>Units:</b> 4 (2 × 3B, 2 × 2B)<br/>
        <b>Estate Controlled:</b> Yes
      `;
      return;
    }

    // =========================
    // BUILDING LEVEL
    // =========================
    if (d.entity === "BUILDING") {
      content.innerHTML = `
        <b>🏢 Building</b><br/>
        <b>ID:</b> ${d.buildingId}<br/>
        <b>Type:</b> ${d.buildingType || d.type}<br/>
        <b>Floors:</b> ${d.floors || "—"}<br/>
        <b>Estate Controlled:</b> Yes
      `;
      return;
    }

    // =========================
    // FALLBACK (DEBUG SAFE)
    // =========================
    content.innerHTML = `
      <b>Selection</b>
      <pre>${JSON.stringify(d, null, 2)}</pre>
    `;
  });
}
