// src/ui/charts/UnitCharts.js

export function renderUnitCharts(unit) {
  const container = document.getElementById("unit-charts");
  if (!container) return;

  container.innerHTML = `
    <b>Live Usage</b>
    <div class="small">Mock real-time (estate controlled)</div>

    <div class="chart">
      <label>⚡ Power (kWh)</label>
      <progress id="power-chart" value="40" max="100"></progress>
    </div>

    <div class="chart">
      <label>🚰 Water (m³)</label>
      <progress id="water-chart" value="30" max="100"></progress>
    </div>

    <div class="chart">
      <label>🌐 Fiber (Mbps)</label>
      <progress id="fiber-chart" value="60" max="100"></progress>
    </div>
  `;

  // Mock live updates
  setInterval(() => {
    document.getElementById("power-chart").value = 20 + Math.random() * 80;
    document.getElementById("water-chart").value = 10 + Math.random() * 60;
    document.getElementById("fiber-chart").value = 40 + Math.random() * 60;
  }, 1500);
}
