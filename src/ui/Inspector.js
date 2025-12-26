// src/ui/Inspector.js
export function setupInspector() {
  const panel = document.getElementById("ui-pane");
  if (!panel) return;

  const content = document.createElement("div");
  content.id = "inspector-content";
  content.style.marginTop = "12px";
  panel.appendChild(content);

  window.addEventListener("ochiga-select", (e) => {
    const data = e.detail;

    content.innerHTML = `
      <div class="info-box">
        <div><b>Entity:</b> ${data.entity}</div>
        <div><b>Building Type:</b> ${data.type || data.buildingType}</div>
        <div><b>Building ID:</b> ${data.buildingId}</div>
        ${data.floor ? `<div><b>Floor:</b> ${data.floor}</div>` : ""}
        ${data.rooms ? `<div><b>Rooms:</b> ${data.rooms.join(", ")}</div>` : ""}
        <div><b>Estate Controlled:</b> ${data.estateControlled ? "Yes" : "Yes (Central)"}</div>
      </div>
    `;
  });
}
