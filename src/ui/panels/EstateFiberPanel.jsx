// src/ui/panels/EstateFiberPanel.jsx

export function EstateFiberPanel() {
  return `
    <div class="info-box">
      <h3>Estate Fiber Network</h3>
      <div class="small">Centralised broadband & data backbone</div>

      <hr/>

      <div><b>Backbone Type:</b> Single-Mode Fiber</div>
      <div><b>Provider:</b> Estate Core (Multi-ISP Ready)</div>
      <div><b>Topology:</b> Ring + Redundant Spines</div>

      <hr/>

      <div class="small">Live Network Health</div>

      <div style="margin-top:10px">
        <div>Backbone Capacity</div>
        <div style="background:#222;height:10px;border-radius:6px;">
          <div style="width:92%;height:10px;background:#8b5cf6;border-radius:6px;"></div>
        </div>
      </div>

      <div style="margin-top:10px">
        <div>Distribution Load</div>
        <div style="background:#222;height:10px;border-radius:6px;">
          <div style="width:68%;height:10px;background:#22c55e;border-radius:6px;"></div>
        </div>
      </div>

      <div style="margin-top:10px">
        <div>Latency (Avg)</div>
        <div style="background:#222;height:10px;border-radius:6px;">
          <div style="width:85%;height:10px;background:#3b82f6;border-radius:6px;"></div>
        </div>
      </div>

      <hr/>

      <div class="small">Coverage Status</div>

      <ul style="margin-top:8px; padding-left:16px;">
        <li>PT Buildings: <b>Connected</b></li>
        <li>DT Buildings: <b>Connected</b></li>
        <li>Security Systems: <b>Dedicated VLAN</b></li>
        <li>Future Expansion: <b>Available</b></li>
      </ul>

      <hr/>

      <div class="small">
        All fiber infrastructure is estate-owned and centrally monitored.
      </div>
    </div>
  `;
}
