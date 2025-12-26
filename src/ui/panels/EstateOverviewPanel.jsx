// src/ui/panels/EstateOverviewPanel.jsx

export function EstateOverviewPanel() {
  return `
    <div class="info-box">
      <h3>Estate Overview</h3>

      <div class="small">Real-time estate health snapshot</div>

      <hr/>

      <div><b>Total Buildings:</b> 14</div>
      <div><b>Total Units:</b> 220</div>
      <div><b>Occupancy:</b> 92%</div>
      <div><b>Active Residents:</b> 610</div>

      <hr/>

      <div class="small">System Health</div>

      <div style="margin-top:8px">
        <div>Power Availability</div>
        <div style="background:#222;height:8px;border-radius:4px;">
          <div style="width:92%;height:8px;background:#4ade80;border-radius:4px;"></div>
        </div>
      </div>

      <div style="margin-top:8px">
        <div>Water Supply</div>
        <div style="background:#222;height:8px;border-radius:4px;">
          <div style="width:88%;height:8px;background:#60a5fa;border-radius:4px;"></div>
        </div>
      </div>

      <div style="margin-top:8px">
        <div>Network Uptime</div>
        <div style="background:#222;height:8px;border-radius:4px;">
          <div style="width:99%;height:8px;background:#c084fc;border-radius:4px;"></div>
        </div>
      </div>
    </div>
  `;
}
