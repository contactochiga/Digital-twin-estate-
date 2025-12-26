// src/ui/Inspector.js

import { EstateOverviewPanel } from "./panels/EstateOverviewPanel";
import { EstatePowerPanel } from "./panels/EstatePowerPanel";
import { EstateWaterPanel } from "./panels/EstateWaterPanel";
import { EstateFiberPanel } from "./panels/EstateFiberPanel";
import { EstateSecurityPanel } from "./panels/EstateSecurityPanel";

export function setupInspector() {
  const panel = document.getElementById("ui-pane");
  if (!panel) return;

  // Clear existing
  panel.innerHTML = "";

  // -------------------------
  // HEADER
  // -------------------------
  const header = document.createElement("div");
  header.innerHTML = `
    <h2>Ochiga Estate</h2>
    <div class="small">Digital Twin · Estate Level Control</div>
    <div class="info-box small">
      Tap a building, floor, or zone to inspect live data.
    </div>
  `;
  panel.appendChild(header);

  // -------------------------
  // BUTTONS
  // -------------------------
  const buttons = document.createElement("div");
  buttons.innerHTML = `
    <button class="btn" data-mode="OVERVIEW">Estate Overview</button>
    <button class="btn" data-mode="POWER">Power Network</button>
    <button class="btn" data-mode="WATER">Water & Sewage</button>
    <button class="btn" data-mode="FIBER">Fiber Network</button>
    <button class="btn" data-mode="SECURITY">Security</button>
  `;
  panel.appendChild(buttons);

  // -------------------------
  // CONTENT AREA
  // -------------------------
  const content = document.createElement("div");
  content.id = "inspector-content";
  content.style.marginTop = "12px";
  panel.appendChild(content);

  // -------------------------
  // ESTATE DATA (mock → live later)
  // -------------------------
  const estateData = {
    overview: {
      buildings: 14,
      units: 220,
      residents: 680,
      occupancy: 92
    },
    power: {
      load: 2.4,
      capacity: 5,
      uptime: 99.98
    },
    water: {
      waterUsage: 480,
      sewageOutput: 455,
      pressure: "Normal"
    },
    fiber: {
      totalGbps: 40,
      buildings: 14,
      units: 220,
      latency: 8
    },
    security: {
      cameras: 96,
      accessPoints: 28,
      alerts: 0
    }
  };

  // -------------------------
  // RENDER HELPERS
  // -------------------------
  function renderPanel(node) {
    content.innerHTML = "";
    content.appendChild(node);
  }

  function renderEstatePanel(mode) {
    switch (mode) {
      case "OVERVIEW":
        renderPanel(EstateOverviewPanel({ data: estateData.overview }));
        break;
      case "POWER":
        renderPanel(EstatePowerPanel({ data: estateData.power }));
        break;
      case "WATER":
        renderPanel(EstateWaterPanel({ data: estateData.water }));
        break;
      case "FIBER":
        renderPanel(EstateFiberPanel({ data: estateData.fiber }));
        break;
      case "SECURITY":
        renderPanel(EstateSecurityPanel({ data: estateData.security }));
        break;
    }
  }

  // -------------------------
  // BUTTON HANDLERS
  // -------------------------
  buttons.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = btn.dataset.mode;
      renderEstatePanel(mode);
    });
  });

  // -------------------------
  // SELECTION HANDLER (BUILDINGS / FLOORS)
  // -------------------------
  window.addEventListener("ochiga-select", (e) => {
    const data = e.detail;

    content.innerHTML = `
      <div class="info-box">
        <div><b>Entity:</b> ${data.entity}</div>
        ${data.buildingType ? `<div><b>Building Type:</b> ${data.buildingType}</div>` : ""}
        ${data.buildingId ? `<div><b>Building ID:</b> ${data.buildingId}</div>` : ""}
        ${data.floor ? `<div><b>Floor:</b> ${data.floor}</div>` : ""}
        ${data.rooms ? `<div><b>Rooms:</b> ${data.rooms.join(", ")}</div>` : ""}
        <div><b>Estate Controlled:</b> Yes (Central)</div>
      </div>
    `;
  });

  // -------------------------
  // DEFAULT VIEW
  // -------------------------
  renderEstatePanel("OVERVIEW");
}
