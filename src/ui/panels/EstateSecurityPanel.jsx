export function EstateSecurityPanel({ data }) {
  return (
    <div className="panel">
      <h3>🔐 Security</h3>

      <div className="metric">
        <span>Active Cameras</span>
        <strong>{data.cameras}</strong>
      </div>

      <div className="metric">
        <span>Access Points</span>
        <strong>{data.accessPoints}</strong>
      </div>

      <div className="metric">
        <span>Security Alerts</span>
        <strong>{data.alerts}</strong>
      </div>

      <div className="info-box">
        <p className="small">
          CCTV, access control, and perimeter monitoring are routed
          through the estate fiber backbone.
        </p>
      </div>
    </div>
  );
}
