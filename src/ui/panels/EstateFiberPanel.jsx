export function EstateFiberPanel({ data }) {
  return (
    <div className="panel">
      <h3>🛜 Estate Fiber Network</h3>

      <div className="metric">
        <span>Total Bandwidth</span>
        <strong>{data.totalGbps} Gbps</strong>
      </div>

      <div className="metric">
        <span>Active Buildings</span>
        <strong>{data.buildings}</strong>
      </div>

      <div className="metric">
        <span>Connected Units</span>
        <strong>{data.units}</strong>
      </div>

      <div className="metric">
        <span>Latency (avg)</span>
        <strong>{data.latency} ms</strong>
      </div>

      {/* Traffic graph */}
      <svg width="100%" height="120">
        <polyline
          points="0,80 40,60 80,50 120,40 160,45 200,30"
          fill="none"
          stroke="#5dade2"
          strokeWidth="3"
        />
      </svg>

      <p className="small">
        Fiber feeds CCTV, smart meters, access control, and Oyi AI.
      </p>
    </div>
  );
}
