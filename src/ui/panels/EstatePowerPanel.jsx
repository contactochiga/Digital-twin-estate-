// src/ui/panels/EstatePowerPanel.jsx

export function EstatePowerPanel() {
  return `
    <div class="info-box">
      <h3>Estate Power Network</h3>
      <div class="small">Centralised power distribution & monitoring</div>

      <hr/>

      <div><b>Primary Source:</b> Utility Grid (NEPA)</div>
      <div><b>Secondary Source:</b> Estate Generators</div>
      <div><b>Tertiary Source:</b> Inverter / Solar (Planned)</div>

      <hr/>

      <div class="small">Live Availability</div>

      <div style="margin-top:10px">
        <div>Grid Supply</div>
        <div style="background:#222;height:10px;border-radius:6px;">
          <div style="width:70%;height:10px;background:#facc15;border-radius:6px;"></div>
        </div>
      </div>

      <div style="margin-top:10px">
        <div>Generator Capacity</div>
        <div style="background:#222;height:10px;border-radius:6px;">
          <div style="width:95%;height:10px;background:#4ade80;border-radius:6px;"></div>
        </div>
      </div>

      <div style="margin-top:10px">
        <div>Inverter / Backup</div>
        <div style="background:#222;height:10px;border-radius:6px;">
          <div style="width:40%;height:10px;background:#60a5fa;border-radius:6px;"></div>
        </div>
      </div>

      <hr/>

      <div class="small">Distribution Status</div>

      <ul style="margin-top:8px; padding-left:16px;">
        <li>PT Buildings: <b>Stable</b></li>
        <li>DT Buildings: <b>Stable</b></li>
        <li>Street Lighting: <b>Online</b></li>
        <li>Security Systems: <b>Protected</b></li>
      </ul>

      <hr/>

      <div class="small">
        Estate power is centrally metered and load-balanced.
      </div>
    </div>
  `;
}
