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

  // make drawer toggle callable from InventoryLoader
  window._ochigaToggleDrawer = toggleDrawer;

  return (
    <div id="app" style={{ height: "100vh", display: "flex" }}>

      {/* LEFT → PHOTOREAL 3D VIEWER */}
      <div id="canvas-wrapper" style={{ flex: 1 }}>
        <PhotorealViewer
          modelUrl="/pt1_building.glb"
          onSelectUnit={(unit) => {
            window.dispatchEvent(
              new CustomEvent("ochiga-select-unit", { detail: unit })
            );
          }}
        />
      </div>

      {/* RIGHT → UI PANEL */}
      <div id="ui-pane" className="">
        <div className="drawer-handle" onClick={() => toggleDrawer()} />

        <div
          style={{
            padding: 16,
           color: "#fff",
            background: "#6f2020",
            height: "100%",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h2 style={{ margin: 0 }}>Ochiga PT1 — Digital Twin</h2>

          <div style={{ fontSize: 13, opacity: 0.9, marginTop: 6 }}>
            Photoreal 3D view + live Oyi OS data integration.
          </div>

          <InventoryLoader />
        </div>
      </div>
    </div>
  );
}
