// Region configuration
export const REGIONS = {
  north: {
    name: 'North',
    stations: ['DNS4', 'DNS5', 'DNS6', 'DQD2', 'XGC1', 'XWG1', 'XNC1']
  },
  south: {
    name: 'South',
    stations: ['DVT1', 'DVT4', 'DQQ1', 'XGE4', 'DWT1']
  }
};

export function getRegionForStation(stationCode) {
  if (REGIONS.north.stations.includes(stationCode)) return 'north';
  if (REGIONS.south.stations.includes(stationCode)) return 'south';
  return 'unknown';
}

export function filterStationsByRegion(stations, region) {
  if (!stations) return null;
  if (region === 'all') return stations;
  const regionStations = REGIONS[region]?.stations || [];
  const filtered = {};
  Object.entries(stations).forEach(([key, station]) => {
    if (regionStations.includes(station.name)) {
      filtered[key] = station;
    }
  });
  return filtered;
}

