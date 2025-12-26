export function EstateOverviewPanel({ data }) {
  return (
    <div className="panel">
      <h3>🏘 Estate Overview</h3>

      <div className="metric">
        <span>Total Buildings</span>
        <strong>{data.buildings}</strong>
      </div>

      <div className="metric">
        <span>Total Units</span>
        <strong>{data.units}</strong>
      </div>

      <div className="metric">
        <span>Residents</span>
        <strong>{data.residents}</strong>
      </div>

      <div className="metric">
        <span>Occupancy Rate</span>
        <strong>{data.occupancy}%</strong>
      </div>

      <div className="info-box">
        <p className="small">
          Estate overview aggregates live data from power, water, fiber,
          and security systems.
        </p>
      </div>
    </div>
  );
}
