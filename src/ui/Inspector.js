// src/ui/Inspector.js
import { EstateOverviewPanel } from "./panels/EstateOverviewPanel";

export function setupInspector() {
  const panel = document.getElementById("ui-pane");
  if (!panel) return;

  panel.innerHTML = `
    <h2>Ochiga Estate</h2>
    <div class="small">Digital Twin · Estate Level Control</div>

    <div class="info-box small">
      Tap a building, floor, or zone to inspect live data.
    </div>

    <button class="btn" id="estate-overview">Estate Overview</button>
    <button class="btn" id="estate-power">Power Network</button>
    <button class="btn" id="estate-water">Water & Sewage</button>
    <button class="btn" id="estate-fiber">Fiber Network</button>
    <button class="btn" id="estate-security">Security</button>

    <div id="inspector-content" class="info-box"></div>
  `;

  const content = document.getElementById("inspector-content");

  // ✅ Estate Overview (LIVE PANEL)
  document.getElementById("estate-overview").onclick = () => {
    content.innerHTML = EstateOverviewPanel();
  };

  // Temporary placeholders (safe)
  document.getElementById("estate-power").onclick = () => {
    content.innerHTML = "<b>Power Network</b><br/>Panel coming next.";
  };

  document.getElementById("estate-water").onclick = () => {
    content.innerHTML = "<b>Water & Sewage</b><br/>Panel coming next.";
  };

  document.getElementById("estate-fiber").onclick = () => {
    content.innerHTML = "<b>Fiber Network</b><br/>Panel coming next.";
  };

  document.getElementById("estate-security").onclick = () => {
    content.innerHTML = "<b>Security</b><br/>Panel coming next.";
  };

  // ---- Selection handler (buildings / floors / units)
  window.addEventListener("ochiga-select", (e) => {
    const d = e.detail;
    content.innerHTML = `
      <b>Entity:</b> ${d.entity}<br/>
      ${d.buildingId ? `<b>Building:</b> ${d.buildingId}<br/>` : ""}
      ${d.floor ? `<b>Floor:</b> ${d.floor}<br/>` : ""}
      <b>Estate Controlled:</b> Yes
    `;
  });
}
