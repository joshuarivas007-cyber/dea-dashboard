import { getStandingColor } from '../data/stationData';

function getWeekStandingColor(standing) {
  if (!standing) return null;
  const s = standing.trim().toUpperCase();
  if (s.includes('FANTASTIC')) return { color: '#2e7d32' };
  if (s.includes('GREAT')) return { color: '#4caf50' };
  if (s.includes('GOOD')) return { color: '#66bb6a' };
  if (s.includes('FAIR')) return { color: '#ff9800' };
  if (s.includes('AT_RISK') || s.includes('AT RISK')) return { color: '#f44336' };
  if (s.includes('UNACCEPTABLE')) return { color: '#ff1744', fontWeight: 700 };
  return null;
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
              const weekKeys = Object.keys(t.weeks);
              return (
                <tr key={t.id}>
                  <td className="rank">{idx + 1}</td>
                  <td className="transporter-id">{t.id}</td>
                  {weekKeys.map((wk, i) => {
                    const val = t.weeks[wk];
                    const weekStanding = t.weekStandings ? t.weekStandings[wk] : null;
                    const weekStyle = weekStanding ? getWeekStandingColor(weekStanding) : null;
                    return (
                      <td key={i} className="wk-cell" style={weekStyle || undefined} title={weekStanding ? weekStanding.replace('_', ' ') : ''}>
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