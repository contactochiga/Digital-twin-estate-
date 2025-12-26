export function EstatePowerPanel({ data }) {
  return (
    <div className="panel">
      <h3>⚡ Estate Power Network</h3>

      <div className="metric">
        <span>Total Load</span>
        <strong>{data.totalLoad} kW</strong>
      </div>

      <div className="metric">
        <span>Active Meters</span>
        <strong>{data.meters}</strong>
      </div>

      <div className="metric">
        <span>Peak Today</span>
        <strong>{data.peak} kW</strong>
      </div>

      <svg width="100%" height="120">
        {/* illustrative load curve */}
        <polyline
          points="0,90 40,60 80,70 120,40 160,50 200,30"
          fill="none"
          stroke="#ffb703"
          strokeWidth="3"
        />
      </svg>
    </div>
  );
}
