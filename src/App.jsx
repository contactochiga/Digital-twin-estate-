// src/App.jsx
import { useEffect } from "react";
import { startApp } from "./startApp"; // move engine logic here

export default function App() {
  useEffect(() => {
    startApp();
  }, []);

  return (
    <div
      id="ochiga-canvas-root"
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#0b0d11"
      }}
    />
  );
}
