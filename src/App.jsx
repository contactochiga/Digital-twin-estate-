import React from "react";
import ThreeScene from "./components/ThreeScene";
import InventoryLoader from "./components/InventoryLoader";

export default function App() {
  return (
    <div id="app" style={{height: "100vh", display: "flex"}}>
      <div id="canvas-wrapper" style={{flex:1}}>
        <ThreeScene />
      </div>
      <div id="ui-pane">
        <div style={{padding:16, color:"#fff", background:"#6f2020", height:"100%", boxSizing:"border-box", display:"flex", flexDirection:"column"}}>
          <h2 style={{margin:0}}>Ochiga PT1 — Demo</h2>
          <div style={{fontSize:13, opacity:0.95, marginTop:6}}>React demo (mock live data). Click units on the 3D view.</div>
          <InventoryLoader />
        </div>
      </div>
    </div>
  );
}
