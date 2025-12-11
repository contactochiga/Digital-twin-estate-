import React from "react";
import InventoryLoader from "./components/InventoryLoader";
import PhotorealViewer from "./components/PhotorealViewer";

export default function App() {
  function toggleDrawer(open) {
    const pane = document.getElementById("ui-pane");
    if (!pane) return;
    if (open === undefined) pane.classList.toggle("open");
    else if (open) pane.classList.add("open");
    else pane.classList.remove("open");
  }

  // expose toggle for other components (InventoryLoader will call it)
  window._ochigaToggleDrawer = toggleDrawer;

  return (
    <div id="app" style={{ height: "100vh", display: "flex" }}>
      <div id="canvas-wrapper" style={{ flex: 1 }}>
        <PhotorealViewer
          modelUrl="/pt1_building.glb"
          mepUrls={{
            power: "/pt1_mep_power.glb",
            water: "/pt1_mep_water.glb",
            sewage: "/pt1_mep_sewage.glb",
            gas: "/pt1_mep_gas.glb",
            fiber: "/pt1_mep_fiber.glb"
          }}
          onSelectUnit={(unit) => {
            // forward to inventory UI
            window.dispatchEvent(new CustomEvent("ochiga-select-unit", { detail: unit }));
            // auto-open drawer on selection
            if (window._ochigaToggleDrawer) window._ochigaToggleDrawer(true);
          }}
        />
      </div>

      <div id="ui-pane" className="">
        <div className="drawer-handle" onClick={() => toggleDrawer()} />
        <div style={{ padding: 16, color: "#fff", background: "#6f2020", height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
          <h2 style={{ margin: 0 }}>Ochiga PT1 — Demo</h2>
          <div style={{ fontSize: 13, opacity: 0.95, marginTop: 6 }}>React demo (mock live data). Click units on the 3D view.</div>
          <InventoryLoader />
        </div>
      </div>
    </div>
  );
}
