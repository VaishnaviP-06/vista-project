// src/utils/helpers.js
import { STATIONS, TRAINS, BUS_STOPS } from '../data/transitData';

// ── Distance ─────────────────────────────────────────────
export function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const toR = x => (x * Math.PI) / 180;
  const dLat = toR(lat2 - lat1), dLng = toR(lng2 - lng1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toR(lat1))*Math.cos(toR(lat2))*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export function distanceText(m) {
  return m < 1000 ? `${Math.round(m)} m` : `${(m/1000).toFixed(1)} km`;
}

export function walkTime(m) {
  return Math.max(1, Math.round(m / 80));
}

export function getNearestStation(lat, lng) {
  return STATIONS.reduce((a,b) =>
    haversine(lat,lng,a.lat,a.lng) < haversine(lat,lng,b.lat,b.lng) ? a : b
  );
}

export function getNearestBusStop(lat, lng) {
  return BUS_STOPS.reduce((a,b) =>
    haversine(lat,lng,a.lat,a.lng) < haversine(lat,lng,b.lat,b.lng) ? a : b
  );
}

export function getCurrentTime() {
  const n = new Date();
  return `${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`;
}

export function getNextTrains(fromId, toId, limit = 3) {
  const now        = getCurrentTime();
  const goingSouth = fromId < toId;

  // Minutes per station (approximate travel time between consecutive stations)
  const MINS_PER_STATION_FAST = 4;  // fast trains ~4 min per station
  const MINS_PER_STATION_SLOW = 6;  // slow trains ~6 min per station

  // Add minutes to a HH:MM time string
  function addMins(timeStr, mins) {
    const [h, m] = timeStr.split(':').map(Number);
    const total  = h * 60 + m + mins;
    return `${String(Math.floor(total / 60) % 24).padStart(2,'0')}:${String(total % 60).padStart(2,'0')}`;
  }

  return TRAINS
    .filter(t => {
      const minStop = Math.min(...t.stops);
      const maxStop = Math.max(...t.stops);
      // Train covers this route if it passes through both boarding and destination stations
      if (goingSouth) {
        return minStop <= fromId && maxStop >= toId;
      } else {
        return minStop <= toId && maxStop >= fromId;
      }
    })
    .map(t => {
      const minsPerStn = t.type === 'Slow' ? MINS_PER_STATION_SLOW : MINS_PER_STATION_FAST;

      // How many stations from train origin (stop[0]) to fromId?
      // Fast trains: stops=[1,8], so stationsFromOrigin = fromId - stops[0]
      const originId          = goingSouth ? Math.min(...t.stops) : Math.max(...t.stops);
      const stationsFromOrigin = Math.abs(fromId - originId);
      const offsetMins         = stationsFromOrigin * minsPerStn;

      // Adjust times: add offset so we see departure FROM the boarding station, not from Virar
      const adjustedTimes = t.times.map(tm => addMins(tm, offsetMins));

      // Find next upcoming train after current time
      const upcoming  = adjustedTimes.filter(x => x >= now);
      const nextTime  = upcoming.length ? upcoming[0] : adjustedTimes[0];

      // Arrival: stations from fromId to toId
      const stationsOnLeg = Math.abs(toId - fromId);
      const arrival        = addMins(nextTime, stationsOnLeg * minsPerStn);

      return {
        ...t,
        nextTime,
        departure:     nextTime,
        arrival,
        platform:      goingSouth ? t.platform_south : t.platform_north,
      };
    })
    .sort((a, b) => a.nextTime.localeCompare(b.nextTime))
    .slice(0, limit);
}

export function getLastMileBusStop(destStation) {
  const direct = BUS_STOPS.find(b => b.near === destStation.name);
  if (direct) return direct;
  return BUS_STOPS.reduce((a,b) =>
    haversine(destStation.lat,destStation.lng,a.lat,a.lng) <
    haversine(destStation.lat,destStation.lng,b.lat,b.lng) ? a : b
  );
}

// ── NLP: Parse natural sentence ───────────────────────────
// Handles: "Kala Ghoda Festival, Churchgate"
//          "I want to go to Gateway of India"
//          "Take me to Siddhivinayak Temple"
//          "Juhu Beach"
export function parseJourneyInput(rawText) {
  const text = rawText.trim();
  const lower = text.toLowerCase();

  // Try to detect station name inside the text
  let matchedStation = null;
  for (const s of STATIONS) {
    if (lower.includes(s.name.toLowerCase())) {
      matchedStation = s;
      break;
    }
  }

  // Strip common filler phrases
  const FILLERS = [
    'i want to go to','i want to go','take me to','navigate to',
    'how do i get to','how to reach','directions to','going to',
    'please take me to','can you take me to','go to','get to',
  ];
  let cleaned = text;
  FILLERS.forEach(f => {
    const re = new RegExp(f, 'gi');
    cleaned = cleaned.replace(re, '');
  });

  // Extract place: everything before the comma (if comma present) = place name
  // e.g. "Kala Ghoda Festival, Churchgate" → "Kala Ghoda Festival"
  let placeName = cleaned.trim();
  if (cleaned.includes(',')) {
    placeName = cleaned.split(',')[0].trim();
  } else if (matchedStation) {
    // Remove station name from the end if no comma
    const re = new RegExp(matchedStation.name, 'gi');
    placeName = cleaned.replace(re, '').trim();
  }

  // Clean up leftover noise
  placeName = placeName.replace(/\s+/g, ' ').trim();
  if (!placeName) placeName = text; // fallback to full text

  return { placeName, station: matchedStation, rawText: text };
}

// ── Nominatim geocoding (OpenStreetMap, free) ─────────────
// Mumbai centre — used to validate geocoding results are actually nearby
const MUMBAI_LAT = 19.076;
const MUMBAI_LNG = 72.877;
const MAX_DIST_FROM_MUMBAI_KM = 100; // anything beyond this is a wrong geocode result

function isNearMumbai(lat, lng) {
  const R = 6371;
  const toR = x => x * Math.PI / 180;
  const dLat = toR(lat - MUMBAI_LAT);
  const dLng = toR(lng - MUMBAI_LNG);
  const a = Math.sin(dLat/2)**2 + Math.cos(toR(MUMBAI_LAT)) * Math.cos(toR(lat)) * Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) <= 100;
}

// ── Nominatim geocoding (OpenStreetMap, free) ─────────────
export async function geocodePlace(placeName) {
  try {
    const q = encodeURIComponent(`${placeName}, Mumbai, Maharashtra, India`);
    const url = `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=5&countrycodes=in&addressdetails=1`;
    const res = await fetch(url, {
      headers: {
        'Accept-Language': 'en',
        'User-Agent': 'VISTA-TransitApp/1.0 (student project)',
      }
    });
    const results = await res.json();
    if (results && results.length > 0) {
      const valid = results.find(r => isNearMumbai(parseFloat(r.lat), parseFloat(r.lon)));
      if (!valid) return { found: false };
      const shortName = valid.display_name.split(',').slice(0, 3).join(', ');
      return {
        found: true,
        lat: parseFloat(valid.lat),
        lng: parseFloat(valid.lon),
        name: shortName,
        fullAddress: valid.display_name,
        placeType: valid.type || valid.class,
      };
    }
    return { found: false };
  } catch (e) {
    console.error('Nominatim error:', e);
    return { found: false };
  }
}

// Retry with Thane district context if first attempt finds nothing near Mumbai
export async function geocodePlaceSafe(placeName) {
  let result = await geocodePlace(placeName);
  if (result.found) return result;
  try {
    const q = encodeURIComponent(`${placeName}, Thane district, Maharashtra, India`);
    const url = `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=3&countrycodes=in`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'en', 'User-Agent': 'VISTA/1.0' } });
    const data = await res.json();
    if (data && data.length > 0) {
      const valid = data.find(r => isNearMumbai(parseFloat(r.lat), parseFloat(r.lon)));
      if (valid) {
        return {
          found: true,
          lat: parseFloat(valid.lat),
          lng: parseFloat(valid.lon),
          name: valid.display_name.split(',').slice(0, 3).join(', '),
          fullAddress: valid.display_name,
        };
      }
    }
  } catch {}
  return { found: false };
}

// ── Smart exit gate selection ─────────────────────────────
// Given station exits[] and destination coordinates,
// pick the best exit gate using bearing/direction logic
export function getBestExit(station, destLat, destLng) {
  if (!station.exits || station.exits.length === 0) return null;
  if (station.exits.length === 1) return station.exits[0];

  // Calculate bearing from station to destination
  const bearing = getBearing(station.lat, station.lng, destLat, destLng);
  // bearing 0=North, 90=East, 180=South, 270=West

  const isEast  = bearing >= 45  && bearing < 135;
  const isWest  = bearing >= 225 && bearing < 315;
  const isNorth = bearing < 45   || bearing >= 315;
  const isSouth = bearing >= 135 && bearing < 225;

  // Try to find a gate matching the direction
  let best = null;

  if (isEast) {
    best = station.exits.find(e => e.side === 'East') ||
           station.exits.find(e => e.gate.toLowerCase().includes('east'));
  } else if (isWest) {
    best = station.exits.find(e => e.side === 'West') ||
           station.exits.find(e => e.gate.toLowerCase().includes('west'));
  } else if (isNorth) {
    best = station.exits.find(e => e.gate.toLowerCase().includes('north')) ||
           station.exits[0];
  } else if (isSouth) {
    best = station.exits.find(e => e.gate.toLowerCase().includes('south')) ||
           station.exits[station.exits.length - 1];
  }

  // If direction matching didn't work, pick by proximity using each exit's side
  if (!best) best = station.exits[0];

  return best;
}

// Calculate compass bearing between two coords (degrees 0-360)
export function getBearing(lat1, lng1, lat2, lng2) {
  const toR = x => x * Math.PI / 180;
  const dLng = toR(lng2 - lng1);
  const y = Math.sin(dLng) * Math.cos(toR(lat2));
  const x = Math.cos(toR(lat1)) * Math.sin(toR(lat2)) -
            Math.sin(toR(lat1)) * Math.cos(toR(lat2)) * Math.cos(dLng);
  const bearing = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
  return bearing;
}

export function bearingToCompass(deg) {
  const dirs = ['North','North-East','East','South-East','South','South-West','West','North-West'];
  return dirs[Math.round(deg / 45) % 8];
}

// ── Last mile decision ────────────────────────────────────
export function getLastMileSuggestion(stLat, stLng, destLat, destLng, nearbyBusStop) {
  const dist = haversine(stLat, stLng, destLat, destLng);
  const wt = walkTime(dist);

  // Only recommend walking if ≤ 3 min (~240m) — otherwise auto/cab
  if (dist <= 240) return {
    mode: 'walk', icon: '🚶', label: 'Walk',
    detail: `Only ${distanceText(dist)} — about ${wt} min walk`, fare: 'Free',
  };
  if (dist <= 2000) return {
    mode: 'auto', icon: '🛺', label: 'Auto-Rickshaw',
    detail: `${distanceText(dist)} — ~${Math.round(dist/200)} min ride`,
    fare: `₹${Math.max(25,Math.round(dist/40))}–₹${Math.round(dist/30)}`,
  };
  if (dist <= 5000 && nearbyBusStop) return {
    mode: 'bus', icon: '🚌', label: `Bus from ${nearbyBusStop.name}`,
    detail: `${distanceText(dist)} — bus ${nearbyBusStop.buses.slice(0,2).join('/')}`,
    fare: '₹5–₹15',
  };
  return {
    mode: 'cab', icon: '🚕', label: 'Cab / Taxi',
    detail: `${distanceText(dist)} — book Ola or Uber`, fare: `₹${Math.round(dist/50)}+`,
  };
}

export function getAllLastMileOptions(stLat, stLng, destLat, destLng, nearbyBusStop) {
  const dist = haversine(stLat, stLng, destLat, destLng);
  const wt = walkTime(dist);
  return [
    { mode:'walk', icon:'🚶', label:'Walk',         detail:`${distanceText(dist)} · ~${wt} min`,                    fare:'Free',        recommended: dist <= 240 },
    { mode:'auto', icon:'🛺', label:'Auto-Rickshaw', detail:`~${Math.round(dist/200)} min ride`,                     fare:`₹${Math.max(25,Math.round(dist/40))}–₹${Math.round(dist/30)}`, recommended: dist > 240 && dist <= 2000 },
    { mode:'bus',  icon:'🚌', label:'Bus',           detail: nearbyBusStop ? `${nearbyBusStop.buses.slice(0,2).join(', ')} from nearby` : 'Check routes', fare:'₹5–₹15', recommended: dist > 2000 && dist <= 5000 },
    { mode:'cab',  icon:'🚕', label:'Cab / Taxi',    detail:`Ola / Uber · ~${Math.round(dist/400)} min`,             fare:`₹${Math.round(dist/50)}+`,   recommended: dist > 5000 },
  ];
}
