// src/App.jsx
import { useEffect } from "react";
import { startApp } from "./startApp";
import "./styles.css";

export default function App() {
  useEffect(() => {
    startApp();
  }, []);

  return (
    <div id="app">
      {/* LEFT / MAIN AREA */}
      <div id="canvas-wrapper">
        {/* Three.js mounts here */}
        <div id="ochiga-canvas-root" />
      </div>

      {/* RIGHT UI PANEL */}
      <div id="ui-pane">
        <div
          className="drawer-handle"
          onClick={() =>
            document.getElementById("ui-pane")?.classList.toggle("open")
          }
        />

        <h2>Ochiga Estate</h2>
        <p className="small">
          Digital Twin • Estate Level Control
        </p>

        <div className="info-box">
          <strong>Inspector</strong>
          <p className="small">
            Tap a building, floor, or zone to inspect live data.
          </p>
        </div>

        <button className="btn">Estate Overview</button>
        <button className="btn">Power Network</button>
        <button className="btn">Water & Sewage</button>
        <button className="btn">Security</button>
      </div>
    </div>
  );
}
