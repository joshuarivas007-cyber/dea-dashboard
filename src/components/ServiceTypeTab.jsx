import { REGIONS } from '../data/regions';

export default function ServiceTypeTab({ serviceTypeData }) {
  if (!serviceTypeData || Object.keys(serviceTypeData).length === 0) {
    return (
      <div className="empty-state">
        <p>No service type data available. Upload a CSV with service type data to see trends.</p>
      </div>
    );
  }

  const northStations = Object.entries(serviceTypeData).filter(([name]) =>
    REGIONS.north.stations.includes(name)
  );
  const southStations = Object.entries(serviceTypeData).filter(([name]) =>
    REGIONS.south.stations.includes(name)
  );

  return (
    <div className="suburb-tab">
      <h2 className="region-title">North Region - Service Type Trends</h2>
      {northStations.length > 0 ? (
        <div className="suburb-grid">
          {northStations.map(([name, station]) => (
            <ServiceTypeCard key={name} station={station} />
          ))}
        </div>
      ) : (
        <p className="no-data">No North region service type data available.</p>
      )}

      <h2 className="region-title">South Region - Service Type Trends</h2>
      {southStations.length > 0 ? (
        <div className="suburb-grid">
          {southStations.map(([name, station]) => (
            <ServiceTypeCard key={name} station={station} />
          ))}
        </div>
      ) : (
        <p className="no-data">No South region service type data available.</p>
      )}
    </div>
  );
}

function ServiceTypeCard({ station }) {
  return (
    <div className="station-card">
      <div className="station-header">
        <h2>{station.name}</h2>
        <span className="station-total">Service Type Breakdown</span>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Service Type</th>
              <th>Not Attempted</th>
              <th>% of Station Total</th>
            </tr>
          </thead>
          <tbody>
            {station.serviceTypes.map((s, idx) => (
              <tr key={s.serviceType}>
                <td className="rank">{idx + 1}</td>
                <td className="service-type-name">{s.serviceType}</td>
                <td className="grand-total">{s.notAttempted}</td>
                <td className="percentage">{s.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
