import { useState, useEffect, useRef } from 'react';
import { parseCSV, transformToStationData, transformToSuburbData, mergeRawRows, getLoadedWeeks, saveToStorage, loadFromStorage, clearStorage } from './data/csvParser';
import { filterStationsByRegion } from './data/regions';
import { getStandingColor } from './data/stationData';
import StationCard from './components/StationCard';
import SuburbTab from './components/SuburbTab';
import './App.css';

const TABS = [
  { id: 'overall', label: 'Overall' },
  { id: 'north', label: 'North' },
  { id: 'south', label: 'South' },
  { id: 'suburb', label: 'Suburb' }
];

function App() {
  const [stations, setStations] = useState(null);
  const [suburbData, setSuburbData] = useState(null);
  const [rawRows, setRawRows] = useState(null);
  const [loadedWeeks, setLoadedWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [dataSource, setDataSource] = useState('published');
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overall');
  const fileInputRef = useRef(null);
  const appendInputRef = useRef(null);

  useEffect(() => {
    loadPublishedData();
  }, []);

  const loadPublishedData = async () => {
    setLoading(true);
    setError(null);
    try {
      const base = import.meta.env.BASE_URL || '/';
      const response = await fetch(base + 'data.json');
      const json = await response.json();
      if (json.stations && Object.keys(json.stations).length > 0) {
        setStations(json.stations);
        setSuburbData(json.suburbData || null);
        setLoadedWeeks(json.weeks || []);
        setLastRefresh(json.lastUpdated ? new Date(json.lastUpdated) : new Date());
        setDataSource('published');
      } else {
        setStations(null);
        setDataSource('empty');
      }
    } catch (err) {
      setStations(null);
      setDataSource('empty');
    } finally {
      setLoading(false);
    }
  };

  const processRows = (rows) => {
    const data = transformToStationData(rows);
    const suburbs = transformToSuburbData(rows);
    const weeks = getLoadedWeeks(rows);
    setStations(data);
    setSuburbData(suburbs);
    setRawRows(rows);
    setLoadedWeeks(weeks);
    setLastRefresh(new Date());
    setDataSource('csv');
    setError(null);
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
        if (Object.keys(transformToStationData(rows)).length === 0) {
          setError('No station data found in CSV. Check column names match the query output.');
          setLoading(false);
          return;
        }
        processRows(rows);
      } catch (err) {
        setError('Error parsing CSV: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleAppendUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target.result;
        const newRows = parseCSV(csvText);
        if (!newRows || newRows.length === 0) {
          setError('CSV file appears empty or invalid');
          setLoading(false);
          return;
        }
        const merged = mergeRawRows(rawRows, newRows);
        processRows(merged);
      } catch (err) {
        setError('Error parsing CSV: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleAppendClick = () => {
    appendInputRef.current.click();
  };

  const handlePublish = () => {
    if (!stations) return;
    const publishData = {
      stations,
      suburbData,
      weeks: loadedWeeks,
      lastUpdated: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(publishData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSV = () => {
    if (!stations) return;
    const rows = [];
    const firstStation = Object.values(stations)[0];
    if (!firstStation || !firstStation.transporters[0]) return;
    const headers = ['Station', 'Rank', 'Transporter ID', ...Object.keys(firstStation.transporters[0].weeks).map(w => 'W' + w), 'Total', 'Standing'];
    rows.push(headers.join(','));
    Object.values(stations).sort((a, b) => b.total - a.total).forEach(station => {
      station.transporters.forEach((t, idx) => {
        const weekVals = Object.values(t.weeks).map(v => v || '');
        rows.push([station.name, idx + 1, t.id, ...weekVals, t.grandTotal, t.standing].join(','));
      });
    });
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dea_dashboard_data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getFilteredStations = () => {
    if (activeTab === 'overall') return filterStationsByRegion(stations, 'all');
    if (activeTab === 'north') return filterStationsByRegion(stations, 'north');
    if (activeTab === 'south') return filterStationsByRegion(stations, 'south');
    return stations;
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'overall': return 'Not Attempted Trend: All Regions';
      case 'north': return 'Not Attempted Trend: North Region';
      case 'south': return 'Not Attempted Trend: South Region';
      case 'suburb': return 'Suburb / Postcode Trends';
      default: return 'DEA Dashboard';
    }
  };

  const filteredStations = getFilteredStations();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>{getTabTitle()}</h1>
          <p className="subtitle">DEA Top 5 Offenders by Station</p>
          {loadedWeeks.length > 0 && (
            <p className="weeks-loaded">Weeks loaded: {loadedWeeks.join(', ')}</p>
          )}
        </div>
        <div className="header-right">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv"
            style={{ display: 'none' }}
          />
          <input
            type="file"
            ref={appendInputRef}
            onChange={handleAppendUpload}
            accept=".csv"
            style={{ display: 'none' }}
          />
          <button className="refresh-btn upload-btn" onClick={handleUploadClick} disabled={loading}>
            Upload CSV
          </button>
          {dataSource === 'csv' && (
            <button className="refresh-btn append-btn" onClick={handleAppendClick} disabled={loading}>
              + Add Week
            </button>
          )}
          {stations && dataSource === 'csv' && (
            <button className="refresh-btn publish-btn" onClick={handlePublish}>
              Publish Data
            </button>
          )}
          {stations && (
            <button className="refresh-btn download-btn" onClick={handleDownloadCSV}>
              Download CSV
            </button>
          )}
          {lastRefresh && (
            <span className="last-refresh">
              {dataSource === 'published' ? 'Published' : 'Uploaded'}: {lastRefresh.toLocaleString()}{loadedWeeks.length > 0 && (' | Weeks: ' + loadedWeeks.join(', '))}
            </span>
          )}
        </div>
      </header>

      <nav className="tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={"tab-btn" + (activeTab === tab.id ? " active" : "")}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {dataSource === 'empty' && (
        <div className="info-banner">
          No data published yet. Upload a CSV to get started.
        </div>
      )}

      {error && <div className="error-banner">{error}</div>}

      {activeTab !== 'suburb' && (
        <div className="legend">
          <span className="legend-item"><span className="dot" style={{background:'#2e7d32'}}></span> Fantastic</span>
          <span className="legend-item"><span className="dot" style={{background:'#4caf50'}}></span> Great</span>
          <span className="legend-item"><span className="dot" style={{background:'#ff9800'}}></span> Fair</span>
          <span className="legend-item"><span className="dot" style={{background:'#f44336'}}></span> At Risk</span>
          <span className="legend-item"><span className="dot" style={{background:'#b71c1c'}}></span> Unacceptable</span>
        </div>
      )}

      {activeTab === 'suburb' ? (
        <SuburbTab suburbData={suburbData} />
      ) : loading && !stations ? (
        <div className="loading">Loading station data...</div>
      ) : filteredStations && Object.keys(filteredStations).length > 0 ? (
        <div className="stations-grid">
          {Object.values(filteredStations).sort((a, b) => b.total - a.total).map(station => (
            <StationCard key={station.name} station={station} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No stations found for this region. Upload a CSV with data for these stations.</p>
        </div>
      )}
    </div>
  );
}

export default App;