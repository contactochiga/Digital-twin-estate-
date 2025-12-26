// src/ui/Inspector.js

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

  // ---- Estate buttons (temporary content)
  document.getElementById("estate-overview").onclick = () => {
    content.innerHTML = `
      <b>Estate Overview</b><br/>
      Buildings: 14<br/>
      Units: 220<br/>
      Occupancy: 92%
    `;
  };

  document.getElementById("estate-power").onclick = () => {
    content.innerHTML = `
      <b>Power Network</b><br/>
      Load: 2.4MW<br/>
      Capacity: 5MW<br/>
      Uptime: 99.98%
    `;
  };

  document.getElementById("estate-water").onclick = () => {
    content.innerHTML = `
      <b>Water & Sewage</b><br/>
      Water Usage: 480m³/day<br/>
      Sewage Output: 455m³/day
    `;
  };

  document.getElementById("estate-fiber").onclick = () => {
    content.innerHTML = `
      <b>Fiber Network</b><br/>
      Backbone: 40Gbps<br/>
      Avg Latency: 8ms
    `;
  };

  document.getElementById("estate-security").onclick = () => {
    content.innerHTML = `
      <b>Security</b><br/>
      Cameras: 96<br/>
      Access Points: 28<br/>
      Alerts: 0
    `;
  };

  // ---- Selection handler (buildings / floors)
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
