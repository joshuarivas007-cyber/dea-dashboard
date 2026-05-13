import { getStandingColor } from '../data/stationData';

function getWeekColor(val) {
  if (!val || val === 0) return null;
  if (val <= 5) return { color: '#2e7d32' };
  if (val <= 15) return { color: '#4caf50' };
  if (val <= 30) return { color: '#ff9800' };
  if (val <= 50) return { color: '#f44336' };
  return { color: '#ff1744', fontWeight: 700 };
}

export default function StationCard({ station }) {
  return (
    <div className="station-card">
      <div className="station-header">
        <h2>{station.name}</h2>
        <span className="station-total">Total: <strong>{station.total}</strong></span>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Transporter ID</th>
              {Object.keys(station.transporters[0].weeks).map(wk => (
                <th key={wk} className="wk-col">W{wk}</th>
              ))}
              <th>Total</th>
              <th>Standing</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            {station.transporters.map((t, idx) => {
              const colors = getStandingColor(t.standing);
              return (
                <tr key={t.id}>
                  <td className="rank">{idx + 1}</td>
                  <td className="transporter-id">{t.id}</td>
                  {Object.values(t.weeks).map((val, i) => {
                    const weekStyle = getWeekColor(val);
                    return (
                      <td key={i} className="wk-cell" style={weekStyle || undefined}>
                        {val || ''}
                      </td>
                    );
                  })}
                  <td className="grand-total">{t.grandTotal}</td>
                  <td>
                    <span className="standing-badge" style={{ backgroundColor: colors.bg, color: colors.text }}>
                      {t.standing}
                    </span>
                  </td>
                  <td className="comments">
                    {t.slsTickets ? (
                      <a href={t.slsTickets} target="_blank" rel="noopener noreferrer" className="ticket-link">
                        {t.comments || 'Ticket'}
                      </a>
                    ) : t.comments}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}