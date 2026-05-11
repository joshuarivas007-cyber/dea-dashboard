import { getStandingColor } from '../data/stationData';

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
                  {Object.values(t.weeks).map((val, i) => (
                    <td key={i} className={"wk-cell" + (val && val >= 100 ? " high" : val && val >= 50 ? " medium" : "")}>
                      {val || ''}
                    </td>
                  ))}
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
