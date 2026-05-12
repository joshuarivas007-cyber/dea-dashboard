import { REGIONS } from '../data/regions';

export default function SuburbTab({ suburbData }) {
  if (!suburbData || Object.keys(suburbData).length === 0) {
    return (
      <div className="empty-state">
        <p>No suburb/postcode data available. Upload a CSV with postcode data to see trends.</p>
      </div>
    );
  }

  const northStations = Object.entries(suburbData).filter(([name]) =>
    REGIONS.north.stations.includes(name)
  );
  const southStations = Object.entries(suburbData).filter(([name]) =>
    REGIONS.south.stations.includes(name)
  );

  return (
    <div className="suburb-tab">
      <h2 className="region-title">North Region - Postcode Trends</h2>
      {northStations.length > 0 ? (
        <div className="suburb-grid">
          {northStations.map(([name, station]) => (
            <SuburbCard key={name} station={station} />
          ))}
        </div>
      ) : (
        <p className="no-data">No North region postcode data available.</p>
      )}

      <h2 className="region-title">South Region - Postcode Trends</h2>
      {southStations.length > 0 ? (
        <div className="suburb-grid">
          {southStations.map(([name, station]) => (
            <SuburbCard key={name} station={station} />
          ))}
        </div>
      ) : (
        <p className="no-data">No South region postcode data available.</p>
      )}
    </div>
  );
}

function SuburbCard({ station }) {
  return (
    <div className="station-card">
      <div className="station-header">
        <h2>{station.name}</h2>
        <span className="station-total">Top 5 Postcodes</span>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Postcode</th>
              <th>Not Attempted</th>
              <th>Service Type</th>
            </tr>
          </thead>
          <tbody>
            {station.postcodes.map((p, idx) => (
              <tr key={p.postcode}>
                <td className="rank">{idx + 1}</td>
                <td className="postcode">{p.postcode}</td>
                <td className="grand-total">{p.notAttempted}</td>
                <td className="service-type">{p.serviceType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

