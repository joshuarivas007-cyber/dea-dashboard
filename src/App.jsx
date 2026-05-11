import { useState, useEffect, useRef } from 'react';
import { fetchStationData } from './data/stationData';
import { parseCSV, transformToStationData, saveToStorage, loadFromStorage } from './data/csvParser';
import StationCard from './components/StationCard';
import './App.css';

function App() {
  const [stations, setStations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [dataSource, setDataSource] = useState('sample');
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Load saved data or fall back to sample
  useEffect(() => {
    const saved = loadFromStorage();
    if (saved) {
      setStations(saved.data);
      setLastRefresh(new Date(saved.timestamp));
      setDataSource('csv');
      setLoading(false);
    } else {
      loadSampleData();
    }
  }, []);

  const loadSampleData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchStationData();
      setStations(data);
      setLastRefresh(new Date());
      setDataSource('sample');
    } catch (err) {
      setError('Failed to load sample data');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target.result;
        const rows = parseCSV(csvText);
        if (!rows || rows.length === 0) {
          setError('CSV file appears empty or invalid');
          setLoading(false);
          return;
        }
        const data = transformToStationData(rows);
        if (Object.keys(data).length === 0) {
          setError('No station data found in CSV. Check column names match the query output.');
          setLoading(false);
          return;
        }
        setStations(data);
        setLastRefresh(new Date());
        setDataSource('csv');
        saveToStorage(data);
        setError(null);
      } catch (err) {
        setError('Error parsing CSV: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
    // Reset input so same file can be re-uploaded
    event.target.value = '';
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleClearData = () => {
    loadSampleData();
    localStorage.removeItem('dea_dashboard_data');
    localStorage.removeItem('dea_dashboard_timestamp');
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Not Attempted Trend: North Region</h1>
          <p className="subtitle">DEA Top 5 Offenders by Station</p>
        </div>
        <div className="header-right">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv"
            style={{ display: 'none' }}
          />
          <button className="refresh-btn upload-btn" onClick={handleUploadClick} disabled={loading}>
            Upload CSV
          </button>
          {dataSource === 'csv' && (
            <button className="refresh-btn clear-btn" onClick={handleClearData}>
              Reset to Sample
            </button>
          )}
          {lastRefresh && (
            <span className="last-refresh">
              {dataSource === 'csv' ? 'Data uploaded' : 'Sample data'}: {lastRefresh.toLocaleString()}
            </span>
          )}
        </div>
      </header>

      {dataSource === 'sample' && (
        <div className="info-banner">
          Showing sample data. Export your query from <a href="https://datacentral.a2z.com/workbench/query-explorer?queryId=fdc6c039-059c-4f45-a419-b9e0a4433bc8" target="_blank" rel="noopener noreferrer">DataCentral</a> as CSV and upload for live data.
        </div>
      )}

      {error && <div className="error-banner">{error}</div>}

      <div className="legend">
        <span className="legend-item"><span className="dot" style={{background:'#2e7d32'}}></span> Fantastic</span>
        <span className="legend-item"><span className="dot" style={{background:'#4caf50'}}></span> Great</span>
        <span className="legend-item"><span className="dot" style={{background:'#ff9800'}}></span> Fair</span>
        <span className="legend-item"><span className="dot" style={{background:'#f44336'}}></span> At Risk</span>
        <span className="legend-item"><span className="dot" style={{background:'#b71c1c'}}></span> Unacceptable</span>
      </div>

      {loading && !stations ? (
        <div className="loading">Loading station data...</div>
      ) : stations ? (
        <div className="stations-grid">
          {Object.values(stations).map(station => (
            <StationCard key={station.name} station={station} />
          ))}
        </div>
      ) : (
        <div className="error">Failed to load data. Try uploading a CSV.</div>
      )}
    </div>
  );
}

export default App;
