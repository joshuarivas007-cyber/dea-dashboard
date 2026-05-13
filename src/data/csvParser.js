// Parses CSV text from DataCentral export and transforms into station data

export function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return null;

  const headers = parseCSVLine(lines[0]);

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
  const stationMap = {};

  rows.forEach(row => {
    const station = row.delivery_station_code;
    const transporter = row.transporter_id;
    const wk = parseInt(row.wk_number, 10);
    const standing = row.standing_bucket || '';
    // Use tbau_count if available (new query), otherwise count as 1 (old query)
    const count = parseInt(row.tbau_count, 10) || 1;

    if (!station || !transporter || isNaN(wk)) return;

    if (!stationMap[station]) {
      stationMap[station] = {};
    }
    if (!stationMap[station][transporter]) {
      stationMap[station][transporter] = { weeks: {}, weekStandings: {}, standing: standing, currentStanding: '', count: 0 };
    }

    if (!stationMap[station][transporter].weeks[wk]) {
      stationMap[station][transporter].weeks[wk] = 0;
    }
    stationMap[station][transporter].weeks[wk] += count;
    stationMap[station][transporter].count += count;

    const currentStanding = row.current_standing_bucket || standing || '';
    const weekStanding = row.week_standing_bucket || '';
    if (currentStanding && currentStanding.trim() !== '') {
      stationMap[station][transporter].standing = currentStanding;
    }
    if (weekStanding && weekStanding.trim() !== '') {
      stationMap[station][transporter].weekStandings[wk] = weekStanding;
    }
  });

  const allWeeks = new Set();
  Object.values(stationMap).forEach(transporters => {
    Object.values(transporters).forEach(t => {
      Object.keys(t.weeks).forEach(w => allWeeks.add(parseInt(w, 10)));
    });
  });
  const sortedWeeks = [...allWeeks].sort((a, b) => a - b);

  const result = {};

  Object.entries(stationMap).forEach(([stationName, transporters]) => {
    const sorted = Object.entries(transporters)
      .map(([id, data]) => ({
        id,
        weeks: buildWeekObj(data.weeks, sortedWeeks),
        weekStandings: data.weekStandings,
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

// Transform CSV rows into suburb/postcode data
export function transformToSuburbData(rows) {
  const suburbMap = {};

  rows.forEach(row => {
    const station = row.delivery_station_code;
    // Support both old (shipping_address_postal_code) and new (primary_postcode) column names
    const postcode = row.primary_postcode || row.shipping_address_postal_code || row.postcode || row['primary postcode'] || '';
    const serviceType = row.service_type || '';
    const count = parseInt(row.primary_postcode_tbau_count || row.tbau_count, 10) || 1;

    if (!station || !postcode) return;

    if (!suburbMap[station]) {
      suburbMap[station] = {};
    }
    if (!suburbMap[station][postcode]) {
      suburbMap[station][postcode] = { count: 0, serviceTypes: {} };
    }
    suburbMap[station][postcode].count += count;

    if (serviceType) {
      suburbMap[station][postcode].serviceTypes[serviceType] = (suburbMap[station][postcode].serviceTypes[serviceType] || 0) + count;
    }
  });

  const result = {};

  Object.entries(suburbMap).forEach(([stationName, postcodes]) => {
    const sorted = Object.entries(postcodes)
      .map(([postcode, data]) => {
        let topServiceType = 'N/A';
        const entries = Object.entries(data.serviceTypes);
        if (entries.length > 0) {
          topServiceType = entries.sort((a, b) => b[1] - a[1])[0][0];
        }
        return {
          postcode,
          notAttempted: data.count,
          serviceType: topServiceType
        };
      })
      .sort((a, b) => b.notAttempted - a.notAttempted)
      .slice(0, 5);

    result[stationName] = {
      name: stationName,
      postcodes: sorted
    };
  });

  return result;
}

// Merge new rows into existing raw data (for incremental uploads)
export function mergeRawRows(existingRows, newRows) {
  const seen = new Set();
  const merged = [];

  if (existingRows) {
    existingRows.forEach(row => {
      const key = (row.transporter_id || '') + '|' + (row.event_date || '') + '|' + (row.delivery_station_code || '') + '|' + (row.wk_number || '');
      if (!seen.has(key)) {
        seen.add(key);
        merged.push(row);
      }
    });
  }

  newRows.forEach(row => {
    const key = (row.transporter_id || '') + '|' + (row.event_date || '') + '|' + (row.delivery_station_code || '') + '|' + (row.wk_number || '');
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(row);
    }
  });

  return merged;
}

// Extract which weeks are present in the raw data
export function getLoadedWeeks(rows) {
  const weeks = new Set();
  rows.forEach(row => {
    const wk = parseInt(row.wk_number, 10);
    if (!isNaN(wk)) weeks.add(wk);
  });
  return [...weeks].sort((a, b) => a - b);
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
  const s = standing.trim().toLowerCase();
  if (s.includes('fantastic')) return 'Fantastic';
  if (s.includes('great')) return 'Great';
  if (s.includes('fair')) return 'Fair';
  if (s.includes('at risk') || s.includes('at_risk')) return 'At risk';
  if (s.includes('unacceptable')) return 'Unacceptable';
  return standing.charAt(0).toUpperCase() + standing.slice(1).toLowerCase();
}

// LocalStorage helpers
const STORAGE_KEY = 'dea_dashboard_data';
const STORAGE_SUBURB_KEY = 'dea_dashboard_suburb_data';
const STORAGE_RAW_KEY = 'dea_dashboard_raw_rows';
const STORAGE_WEEKS_KEY = 'dea_dashboard_weeks';
const TIMESTAMP_KEY = 'dea_dashboard_timestamp';

export function saveToStorage(data, suburbData, rawRows, weeks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  if (suburbData) {
    localStorage.setItem(STORAGE_SUBURB_KEY, JSON.stringify(suburbData));
  }
  if (rawRows) {
    localStorage.setItem(STORAGE_RAW_KEY, JSON.stringify(rawRows));
  }
  if (weeks) {
    localStorage.setItem(STORAGE_WEEKS_KEY, JSON.stringify(weeks));
  }
  localStorage.setItem(TIMESTAMP_KEY, new Date().toISOString());
}

export function loadFromStorage() {
  const data = localStorage.getItem(STORAGE_KEY);
  const suburbData = localStorage.getItem(STORAGE_SUBURB_KEY);
  const rawRows = localStorage.getItem(STORAGE_RAW_KEY);
  const weeks = localStorage.getItem(STORAGE_WEEKS_KEY);
  const timestamp = localStorage.getItem(TIMESTAMP_KEY);
  if (data) {
    return {
      data: JSON.parse(data),
      suburbData: suburbData ? JSON.parse(suburbData) : null,
      rawRows: rawRows ? JSON.parse(rawRows) : null,
      weeks: weeks ? JSON.parse(weeks) : [],
      timestamp
    };
  }
  return null;
}

export function clearStorage() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(STORAGE_SUBURB_KEY);
  localStorage.removeItem(STORAGE_RAW_KEY);
  localStorage.removeItem(STORAGE_WEEKS_KEY);
  localStorage.removeItem(TIMESTAMP_KEY);
}