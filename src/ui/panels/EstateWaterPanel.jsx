export function EstateWaterPanel({ data }) {
  return (
    <div className="panel">
      <h3>💧 Water & Sewage</h3>

      <div className="metric">
        <span>Daily Water Usage</span>
        <strong>{data.waterUsage} m³</strong>
      </div>

      <div className="metric">
        <span>Sewage Output</span>
        <strong>{data.sewageOutput} m³</strong>
      </div>

      <div className="metric">
        <span>Pressure Status</span>
        <strong>{data.pressure}</strong>
      </div>

      {/* Flow graph */}
      <svg width="100%" height="120">
        <polyline
          points="0,90 40,70 80,75 120,55 160,60 200,45"
          fill="none"
          stroke="#3498db"
          strokeWidth="3"
        />
      </svg>

      <p className="small">
        All plumbing infrastructure is centrally monitored and
        estate-controlled.
      </p>
    </div>
  );
}
