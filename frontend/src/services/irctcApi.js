// src/services/irctcApi.js
// IRCTC Live Station API via RapidAPI — uses native fetch (no axios needed)

export const STATION_CODES = {
  'Virar':      'VR',
  'Nalasopara': 'NSP',
  'Naigaon':    'NGO',
  'Vasai Road': 'BSR',
  'Bhayandar':  'BYR',
  'Mira Road':  'MRD',
  'Dahisar':    'DASR',
  'Borivali':   'BVI',
};

const API_KEY  = 'YOUR_API_KEY'; // ← Paste your RapidAPI key here
const API_HOST = 'irctc1.p.rapidapi.com';
const BASE_URL = 'https://irctc1.p.rapidapi.com';

const headers = {
  'x-rapidapi-key':  API_KEY,
  'x-rapidapi-host': API_HOST,
};

export async function fetchLiveStation(stationCode, hours = 2) {
  const url = `${BASE_URL}/api/v3/getLiveStation?stationCode=${stationCode}&hours=${hours}`;
  const response = await fetch(url, { method: 'GET', headers });
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  const data = await response.json();
  console.log('[IRCTC API] Raw response:', data);
  return data;
}

export async function fetchTrainBetweenStations(fromCode, toCode) {
  const date = getTodayDate();
  const url  = `${BASE_URL}/api/v3/trainBetweenStations?fromStationCode=${fromCode}&toStationCode=${toCode}&dateOfJourney=${date}`;
  const response = await fetch(url, { method: 'GET', headers });
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  return response.json();
}

export async function fetchTrainLiveStatus(trainNo) {
  const url = `${BASE_URL}/api/v1/liveTrainStatus?trainNo=${trainNo}&startingDate=${getTodayDate()}`;
  const response = await fetch(url, { method: 'GET', headers });
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  return response.json();
}

function getTodayDate() {
  const d  = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}-${mm}-${d.getFullYear()}`;
}

export function parseLiveStationData(rawData) {
  if (!rawData || rawData.status !== true || !Array.isArray(rawData.data)) {
    return { success: false, trains: [], message: rawData?.message || 'No data received' };
  }
  const trains = rawData.data.map(train => ({
    trainNo:       train.train_no    || train.trainNo    || '—',
    trainName:     train.train_name  || train.trainName  || 'Unknown Train',
    type:          detectTrainType(train.train_name || train.trainName || ''),
    from:          train.from_stn_name || train.source   || '—',
    to:            train.to_stn_name   || train.dest     || '—',
    arrivalTime:   train.arrive_time   || train.arrTime  || '—',
    departureTime: train.depart_time   || train.dptTime  || '—',
    platform:      train.platform_number != null ? `PF ${train.platform_number}` : 'TBC',
    delay:         train.delay_info    || train.delayInfo || null,
    status:        train.train_status  || 'Scheduled',
  }));
  return { success: true, trains, count: trains.length };
}

function detectTrainType(name) {
  const n = name.toLowerCase();
  if (n.includes('fast') || n.includes('express')) return 'Fast';
  if (n.includes('slow') || n.includes('passenger')) return 'Slow';
  return 'Local';
}

export function isApiConfigured() {
  return API_KEY !== 'YOUR_API_KEY' && API_KEY.length > 10;
}
