// src/services/trainsApi.js
// Uses trainSchedule.json (stops[] format) for accurate per-station timing.
// No server fallback for trains — local schedule is always accurate.

import SCHEDULE from '../data/trainSchedule.json';

/* ── Current time as HH:MM ─────────────────────────────── */
function nowHHMM() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/* ── Compare two HH:MM strings ─────────────────────────── */
function toMins(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}


export async function fetchNextTrains(fromStation, toStation, limit = 3) {
  const fromName = (fromStation?.name || fromStation || '').trim();
  const toName   = (toStation?.name   || toStation   || '').trim();

  if (!fromName || !toName) return { source: 'local', trains: [] };

  const now     = nowHHMM();
  const nowMins = toMins(now);

  // Direction: southbound = toward Borivali, northbound = toward Virar
  const LINE_ORDER = [
    'Virar', 'Nalasopara', 'Vasai Road', 'Naigaon',
    'Bhayandar', 'Mira Road', 'Dahisar', 'Borivali',
  ];
  const fromIdx = LINE_ORDER.indexOf(fromName);
  const toIdx   = LINE_ORDER.indexOf(toName);
  const goingSouth = fromIdx < toIdx;

  const results = [];

  for (const train of SCHEDULE) {
    // Direction filter
    if (goingSouth  && train.direction !== 'southbound') continue;
    if (!goingSouth && train.direction !== 'northbound') continue;

    const stops = train.stops;

    // Find boarding station in this train's stops
    const boardingIdx  = stops.findIndex(s => s.station === fromName);
    const alightingIdx = stops.findIndex(s => s.station === toName);

    // Train must serve both stations, boarding before alighting
    if (boardingIdx === -1 || alightingIdx === -1) continue;
    if (boardingIdx >= alightingIdx) continue;

    const boardingTime  = stops[boardingIdx].time;
    const alightingTime = stops[alightingIdx].time;

    // Only include trains that haven't left the boarding station yet
    if (toMins(boardingTime) <= nowMins) continue;

    results.push({
      trainNumber:  train.trainNumber,
      name:         train.name,
      type:         train.type,          // "Fast" | "Slow"
      direction:    train.direction,
      departure:    boardingTime,        // time AT the user's boarding station
      nextTime:     boardingTime,
      arrival:      alightingTime,       // time AT the destination station
      platform:     resolvePlatform(train.type, goingSouth, fromName),
      boardingStop: stops[boardingIdx],
      alightingStop: stops[alightingIdx],
      stops,
      // Human-readable label for display
      displayLabel: `${train.name} – Arriving at ${fromName} at ${boardingTime}`,
    });
  }

  results.sort((a, b) => toMins(a.departure) - toMins(b.departure));
  return { source: 'local', trains: results.slice(0, limit) };
}

/* ── Per-station platform data (sourced from WR timetable reference)
 *
 *  Each entry: { north: [slow, fast], south: [slow, fast] }
 *  "north" = towards Virar (Northbound)
 *  "south" = towards Churchgate/Borivali (Southbound)
 *
 *  Nalla Sopara : North PF 1 & 3  | South PF 2 & 4
 *  Vasai Road   : North PF 2 & 4  | South PF 3 & 5
 *  Naigaon      : North PF 1 & 3  | South PF 2 & 4
 *  Bhayandar    : North PF 1 & 2  | South PF 4 & 6
 *  Mira Road    : North PF 1 & 3  | South PF 2 & 4
 *  Dahisar      : North PF 1 & 3  | South PF 2 & 4
 *  Borivali     : North PF 4,5,6  | South PF 1,2,3,7,8
 *  Virar        : Terminus – arrival only; South PF 1,2,3,5,8
 * ─────────────────────────────────────────────────────────── */
const STATION_PLATFORMS = {
  //                          north         south
  //                       [slow, fast]  [slow, fast]
  'Nalasopara':  { north: [1, 3], south: [2, 4] },
  'Nalla Sopara':{ north: [1, 3], south: [2, 4] },
  'Vasai Road':  { north: [2, 4], south: [3, 5] },
  'Naigaon':     { north: [1, 3], south: [2, 4] },
  'Bhayandar':   { north: [1, 2], south: [4, 6] },
  'Mira Road':   { north: [1, 3], south: [2, 4] },
  'Dahisar':     { north: [1, 3], south: [2, 4] },
  // Borivali: slow locals use PF 1-3 southbound; fast/outstation PF 7-10
  'Borivali':    { north: [5, 4], south: [1, 7] },
  // Virar is terminus — southbound departures
  'Virar':       { north: [2, 5], south: [1, 3] },
};

function resolvePlatform(type, goingSouth, station) {
  const entry = STATION_PLATFORMS[station];
  if (!entry) {
    // Generic fallback for any unlisted station
    return goingSouth ? (type === 'Fast' ? 2 : 1) : (type === 'Fast' ? 2 : 1);
  }
  const dir  = goingSouth ? entry.south : entry.north;
  // dir[0] = slow platform, dir[1] = fast platform
  return type === 'Fast' ? dir[1] : dir[0];
}

/* ── Health check (kept for compatibility) ──────────────── */
export async function checkServerHealth() {
  return false; // trains are fully local now
}
