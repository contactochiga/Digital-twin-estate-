// src/ui/panels/EstateWaterPanel.jsx

export function EstateWaterPanel() {
  return `
    <div class="info-box">
      <h3>Estate Water & Sewage</h3>
      <div class="small">Central water supply & wastewater management</div>

      <hr/>

      <div><b>Water Source:</b> Borehole + Municipal Backup</div>
      <div><b>Storage:</b> Central Overhead & Ground Tanks</div>
      <div><b>Distribution:</b> Zoned Pressure Lines</div>

      <hr/>

      <div class="small">Live Water Status</div>

      <div style="margin-top:10px">
        <div>Tank Capacity</div>
        <div style="background:#222;height:10px;border-radius:6px;">
          <div style="width:74%;height:10px;background:#0ea5e9;border-radius:6px;"></div>
        </div>
      </div>

      <div style="margin-top:10px">
        <div>Network Pressure</div>
        <div style="background:#222;height:10px;border-radius:6px;">
          <div style="width:82%;height:10px;background:#22c55e;border-radius:6px;"></div>
        </div>
      </div>

      <div style="margin-top:10px">
        <div>Daily Consumption</div>
        <div style="background:#222;height:10px;border-radius:6px;">
          <div style="width:61%;height:10px;background:#f59e0b;border-radius:6px;"></div>
        </div>
      </div>

      <hr/>

      <div class="small">Sewage System</div>

      <div style="margin-top:10px">
        <div>Sewage Flow</div>
        <div style="background:#222;height:10px;border-radius:6px;">
          <div style="width:56%;height:10px;background:#7c2d12;border-radius:6px;"></div>
        </div>
      </div>

      <div style="margin-top:10px">
        <div>Treatment Load</div>
        <div style="background:#222;height:10px;border-radius:6px;">
          <div style="width:48%;height:10px;background:#a16207;border-radius:6px;"></div>
        </div>
      </div>

      <hr/>

      <ul style="margin-top:8px; padding-left:16px;">
        <li>PT Buildings: <b>Connected</b></li>
        <li>DT Buildings: <b>Connected</b></li>
        <li>Storm Drainage: <b>Separated</b></li>
        <li>Leak Detection: <b>Planned</b></li>
      </ul>

      <hr/>

      <div class="small">
        All water and sewage systems are centrally monitored and estate-controlled.
      </div>
    </div>
  `;
}
