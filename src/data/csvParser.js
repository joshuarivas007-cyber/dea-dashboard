// Parses CSV text from DataCentral export and transforms into station data

export function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return null;

  // Parse header
  const headers = parseCSVLine(lines[0]);
  
  // Parse rows
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '') continue;
    const values = parseCSVLine(lines[i]);
    const row = {};
    headers.forEach((h, idx) => {
      row[h.trim().toLowerCase().replace(/\s+/g, '_')] = values[idx] ? values[idx].trim() : '';
    });
    rows.push(row);
  }

  return rows;
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

export function transformToStationData(rows) {
  // Group by station
  const stationMap = {};

  rows.forEach(row => {
    const station = row.delivery_station_code;
    const transporter = row.transporter_id;
    const wk = parseInt(row.wk_number, 10);
    const standing = row.standing_bucket || '';

    if (!station || !transporter || isNaN(wk)) return;

    if (!stationMap[station]) {
      stationMap[station] = {};
    }
    if (!stationMap[station][transporter]) {
      stationMap[station][transporter] = { weeks: {}, standing: standing, count: 0 };
    }

    // Count not-attempted per transporter per week
    if (!stationMap[station][transporter].weeks[wk]) {
      stationMap[station][transporter].weeks[wk] = 0;
    }
    stationMap[station][transporter].weeks[wk]++;
    stationMap[station][transporter].count++;

    // Update standing if we get a non-empty one
    if (standing && standing.trim() !== '') {
      stationMap[station][transporter].standing = standing;
    }
  });

  // Find all week numbers across the dataset
  const allWeeks = new Set();
  Object.values(stationMap).forEach(transporters => {
    Object.values(transporters).forEach(t => {
      Object.keys(t.weeks).forEach(w => allWeeks.add(parseInt(w, 10)));
    });
  });
  const sortedWeeks = [...allWeeks].sort((a, b) => a - b);

  // Build final structure with top 5 per station
  const result = {};

  Object.entries(stationMap).forEach(([stationName, transporters]) => {
    // Sort by total count descending, take top 5
    const sorted = Object.entries(transporters)
      .map(([id, data]) => ({
        id,
        weeks: buildWeekObj(data.weeks, sortedWeeks),
        grandTotal: data.count,
        standing: formatStanding(data.standing),
        slsTickets: '',
        comments: ''
      }))
      .sort((a, b) => b.grandTotal - a.grandTotal)
      .slice(0, 5);

    const stationTotal = Object.values(transporters).reduce((sum, t) => sum + t.count, 0);

    result[stationName] = {
      name: stationName,
      transporters: sorted,
      total: stationTotal
    };
  });

  return result;
}

function buildWeekObj(weekData, sortedWeeks) {
  const obj = {};
  sortedWeeks.forEach(wk => {
    obj[wk] = weekData[wk] || null;
  });
  return obj;
}

function formatStanding(standing) {
  if (!standing || standing.trim() === '') return 'Unknown';
  // Normalize common variations
  const s = standing.trim().toLowerCase();
  if (s.includes('fantastic')) return 'Fantastic';
  if (s.includes('great')) return 'Great';
  if (s.includes('fair')) return 'Fair';
  if (s.includes('at risk') || s.includes('at_risk')) return 'At risk';
  if (s.includes('unacceptable')) return 'Unacceptable';
  // Return as-is with first letter capitalized
  return standing.charAt(0).toUpperCase() + standing.slice(1).toLowerCase();
}

// LocalStorage helpers
const STORAGE_KEY = 'dea_dashboard_data';
const TIMESTAMP_KEY = 'dea_dashboard_timestamp';

export function saveToStorage(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  localStorage.setItem(TIMESTAMP_KEY, new Date().toISOString());
}

export function loadFromStorage() {
  const data = localStorage.getItem(STORAGE_KEY);
  const timestamp = localStorage.getItem(TIMESTAMP_KEY);
  if (data) {
    return { data: JSON.parse(data), timestamp };
  }
  return null;
}

export function clearStorage() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(TIMESTAMP_KEY);
}
