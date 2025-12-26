// src/ui/panels/EstateSecurityPanel.jsx

export function EstateSecurityPanel() {
  return `
    <div class="info-box">
      <h3>Estate Security</h3>
      <div class="small">Central surveillance & access control</div>

      <hr/>

      <div><b>Security Model:</b> Central SOC</div>
      <div><b>Monitoring:</b> 24/7</div>
      <div><b>Response:</b> On-site + Remote Escalation</div>

      <hr/>

      <div class="small">Surveillance Coverage</div>

      <div style="margin-top:10px">
        <div>CCTV Coverage</div>
        <div style="background:#222;height:10px;border-radius:6px;">
          <div style="width:96%;height:10px;background:#22c55e;border-radius:6px;"></div>
        </div>
      </div>

      <div style="margin-top:10px">
        <div>Blind Spot Risk</div>
        <div style="background:#222;height:10px;border-radius:6px;">
          <div style="width:4%;height:10px;background:#ef4444;border-radius:6px;"></div>
        </div>
      </div>

      <hr/>

      <div class="small">Access Control</div>

      <ul style="margin-top:8px; padding-left:16px;">
        <li>Estate Gates: <b>Biometric + RFID</b></li>
        <li>PT Buildings: <b>Controlled</b></li>
        <li>DT Buildings: <b>Controlled</b></li>
        <li>Visitors: <b>Logged & Timed</b></li>
      </ul>

      <hr/>

      <div class="small">Live Status</div>

      <div style="margin-top:8px">
        <div>Active Cameras: <b>96</b></div>
        <div>Access Points: <b>28</b></div>
        <div>Open Incidents: <b style="color:#22c55e">0</b></div>
      </div>

      <hr/>

      <div class="small">
        Security infrastructure is estate-owned and centrally audited.
      </div>
    </div>
  `;
}
