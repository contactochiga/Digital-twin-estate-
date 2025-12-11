import React, {useEffect, useState} from "react";

export default function InventoryLoader(){
  const [inventory, setInventory] = useState(null);
  const [selected, setSelected] = useState(null);
  const [live, setLive] = useState({}); // live values map uid -> {kwh, water, temp, alarm}

  useEffect(()=>{
    fetch("/PT1_inventory.json").then(r=>r.json()).then(j=>{
      setInventory(j);
      // initialize live map with defaults
      const map = {};
      j.floors.forEach(f => f.units.forEach(u=>{
        map[u.uid] = {kwh: (Math.random()*5 + 1).toFixed(2), water: (Math.random()*0.3+0.02).toFixed(3), temp: (22+Math.random()*4).toFixed(1), leak:false, smoke:false};
      }));
      setLive(map);
    });
  },[]);

  // mock live updates every 1.5s
  useEffect(()=>{
    if(!inventory) return;
    const t = setInterval(()=>{
      setLive(prev => {
        const next = {...prev};
        Object.keys(next).forEach(uid=>{
          // small random walk
          next[uid] = {
            ...next[uid],
            kwh: (parseFloat(next[uid].kwh) + (Math.random()*0.05)).toFixed(2),
            water: (parseFloat(next[uid].water) + (Math.random()*0.002)).toFixed(3),
            temp: (22 + Math.random()*6).toFixed(1),
            leak: Math.random() < 0.002 ? true : false,
            smoke: Math.random() < 0.001 ? true : false
          };
        });
        return next;
      });
    }, 1500);
    return ()=>clearInterval(t);
  },[inventory]);

  // listen for custom event dispatched by ThreeScene to set selected unit
  useEffect(()=>{
    function onSel(e){
      setSelected(e.detail);
      // open mobile drawer when a unit is selected
      if(window._ochigaToggleDrawer) window._ochigaToggleDrawer(true);
    }
    window.addEventListener("ochiga-select-unit", onSel);
    return ()=>window.removeEventListener("ochiga-select-unit", onSel);
  },[]);

  if(!inventory) return <div className="info-box">Loading inventory...</div>;

  const selData = selected ? { ...selected, live: live[selected.uid] || {} } : null;

  return (
    <div style={{marginTop:12}}>
      <div style={{display:"flex", gap:8, alignItems:"center"}}>
        <div style={{fontWeight:700}}>Floors</div>
      </div>
      <div style={{marginTop:8}}>
        {inventory.floors.map(f => (
          <div key={f.floor}>
            <div style={{fontWeight:700, marginTop:8}}>Floor {f.floor}</div>
            <div>
              {f.units.map(u => (
                <div
                  key={u.uid}
                  className="chip"
                  onClick={()=>window.dispatchEvent(new CustomEvent("ochiga-focus-floor", {detail: f.floor}))}
                >
                  {u.uid.split("-").slice(-1)[0]}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="info-box">
        {!selData && <div>No unit selected. Click a unit in the 3D view.</div>}
        {selData && (
          <div>
            <div style={{fontWeight:800, fontSize:16}}>{selData.uid} — {selData.type}</div>
            <div style={{marginTop:8}}><b>Floor:</b> {selData.floor}</div>
            <div style={{marginTop:6}}><b>Livemeters (mock):</b></div>
            <ul>
              <li>Electricity (kWh): <b>{selData.live?.kwh ?? "—"}</b></li>
              <li>Water (m³): <b>{selData.live?.water ?? "—"}</b></li>
              <li>Temp (°C): <b>{selData.live?.temp ?? "—"}</b></li>
              <li>Leak: <b>{selData.live?.leak ? "YES" : "no"}</b></li>
              <li>Smoke: <b>{selData.live?.smoke ? "YES" : "no"}</b></li>
            </ul>
            <div style={{marginTop:8}}>
              <button className="btn" onClick={()=>alert("Simulated control: toggle power (demo)")}>Toggle Power</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
