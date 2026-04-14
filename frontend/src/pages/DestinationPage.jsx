// src/pages/DestinationPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';
import { STATIONS } from '../data/transitData';
import { parseJourneyInput, geocodePlaceSafe, getNearestStation } from '../utils/helpers';
import { searchPOI } from '../data/poiData';

const G      = '#6BAF45';
const G_DARK = '#4a8a2a';
const G_BG   = 'rgba(107,175,69,.07)';
const G_BOR  = 'rgba(107,175,69,.22)';

// ── Fallback coords for places that Nominatim sometimes misses ───────────────
const FALLBACK_COORDS = {
  'Water Kingdom':               { lat: 19.2314, lng: 72.8058 },
  'Essel World':                 { lat: 19.2296, lng: 72.8063 },
  'Gorai Beach':                 { lat: 19.2350, lng: 72.7960 },
  'Sanjay Gandhi National Park': { lat: 19.2147, lng: 72.9100 },
  'Mandapeshwar Caves':          { lat: 19.2560, lng: 72.8460 },
  'Tungareshwar Temple':         { lat: 19.5100, lng: 72.9200 },
  'Vasai Fort':                  { lat: 19.3940, lng: 72.8060 },
  'Chinchoti Waterfalls':        { lat: 19.4750, lng: 72.8850 },
  'Suruchi Beach':               { lat: 19.2900, lng: 72.8500 },
};

// ── Geocode a popular place using Nominatim + fallback ───────────────────────
async function geocodePopularPlace(place) {
  // Build a specific query: "Water Kingdom, Gorai, Borivali, Mumbai, Maharashtra, India"
  const query = `${place.name}, ${place.area}, Mumbai, Maharashtra, India`;
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=in&bounded=1&viewbox=72.75,19.35,73.05,18.85`;
    const res  = await fetch(url, {
      headers: { 'Accept-Language': 'en', 'User-Agent': 'VISTA-TransitApp/1.0' },
    });
    const data = await res.json();
    if (data && data.length > 0) {
      return {
        found: true,
        lat:   parseFloat(data[0].lat),
        lng:   parseFloat(data[0].lon),
        name:  `${place.area}, Mumbai`,
        source: 'nominatim',
      };
    }
  } catch (e) {
    console.warn('Nominatim failed for', place.name, e);
  }

  // Fallback — use hardcoded coords if available
  const fb = FALLBACK_COORDS[place.name];
  if (fb) {
    return { found: true, lat: fb.lat, lng: fb.lng, name: `${place.area}, Mumbai`, source: 'fallback' };
  }

  // Last resort — use the destination station's coords
  return { found: false };
}

// ── Recommend last-mile mode based on distance ───────────────────────────────
function recommendMode(distMeters) {
  if (distMeters < 500)  return { mode: 'walk',   label: 'Walking distance',        icon: '🚶' };
  if (distMeters < 3000) return { mode: 'auto',   label: 'Auto / Rapido (3 km)',    icon: '🛺' };
  return                        { mode: 'cab',    label: 'Cab recommended (>3 km)', icon: '🚕' };
}

/* ══════════════════════════════════════════════════════════
   ROBOT ILLUSTRATION
══════════════════════════════════════════════════════════ */
function RobotIllustration({ size = 110 }) {
  return (
    <svg width={size} height={Math.round(size * 1.45)} viewBox="0 0 110 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="55" y1="2"  x2="55" y2="18" stroke="#9dd87a" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="55" cy="2" r="4" fill={G}/>
      <circle cx="55" cy="2" r="2" fill="white" opacity=".7"/>
      <rect x="22" y="18" width="66" height="46" rx="14" fill="#f0f7ea"/>
      <rect x="22" y="18" width="66" height="46" rx="14" stroke={G} strokeWidth="1.5" opacity=".4"/>
      <rect x="26" y="22" width="58" height="15" rx="8" fill="white" opacity=".5"/>
      <rect x="31" y="30" width="20" height="16" rx="5" fill="white" opacity=".9"/>
      <rect x="33" y="32" width="16" height="12" rx="4" fill="#e8f5e0"/>
      <circle cx="41" cy="38" r="5" fill={G}/>
      <circle cx="41" cy="38" r="3" fill="#1a3a0a"/>
      <circle cx="43" cy="36" r="1.5" fill="white" opacity=".9"/>
      <rect x="59" y="30" width="20" height="16" rx="5" fill="white" opacity=".9"/>
      <rect x="61" y="32" width="16" height="12" rx="4" fill="#e8f5e0"/>
      <circle cx="69" cy="38" r="5" fill={G}/>
      <circle cx="69" cy="38" r="3" fill="#1a3a0a"/>
      <circle cx="71" cy="36" r="1.5" fill="white" opacity=".9"/>
      <path d="M42 52 Q55 60 68 52" stroke={G} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <rect x="47" y="64" width="16" height="8" rx="4" fill="#d4edd8"/>
      <rect x="14" y="72" width="82" height="52" rx="16" fill="#edf7e8"/>
      <rect x="14" y="72" width="82" height="52" rx="16" stroke={G} strokeWidth="1.5" opacity=".3"/>
      <rect x="18" y="76" width="74" height="14" rx="8" fill="white" opacity=".45"/>
      <rect x="28" y="84" width="54" height="32" rx="10" fill="white" opacity=".7"/>
      <rect x="28" y="84" width="54" height="32" rx="10" stroke={G} strokeWidth="1" opacity=".3"/>
      <circle cx="38" cy="94" r="4" fill={G} opacity=".8"/>
      <circle cx="38" cy="94" r="2" fill="white" opacity=".6"/>
      <circle cx="52" cy="94" r="4" fill="#9dd87a" opacity=".7"/>
      <circle cx="66" cy="94" r="4" fill="#c8f0a0" opacity=".5"/>
      <rect x="34" y="103" width="42" height="4" rx="2" fill={G} opacity=".15"/>
      <rect x="34" y="103" width="26" height="4" rx="2" fill={G} opacity=".4"/>
      <rect x="1"  y="75" width="14" height="36" rx="7" fill="#edf7e8" stroke={G} strokeWidth="1.2" opacity=".8"/>
      <ellipse cx="8"  cy="114" rx="6" ry="5" fill="#d4edd8"/>
      <rect x="95" y="75" width="14" height="36" rx="7" fill="#edf7e8" stroke={G} strokeWidth="1.2" opacity=".8"/>
      <ellipse cx="102" cy="114" rx="6" ry="5" fill="#d4edd8"/>
      <rect x="22" y="124" width="66" height="8" rx="4" fill="#d4edd8"/>
      <rect x="24" y="130" width="24" height="22" rx="8" fill="#edf7e8" stroke={G} strokeWidth="1.2" opacity=".7"/>
      <rect x="20" y="148" width="32" height="10" rx="6" fill="#c8e8b8"/>
      <rect x="62" y="130" width="24" height="22" rx="8" fill="#edf7e8" stroke={G} strokeWidth="1.2" opacity=".7"/>
      <rect x="58" y="148" width="32" height="10" rx="6" fill="#c8e8b8"/>
    </svg>
  );
}

function PaperAirplane({ size = 80 }) {
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,.18))' }}>
      <path d="M2 30 L78 4 L48 56 L36 36 Z" fill="white" stroke="#d4d4d0" strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M36 36 L48 56 L44 40 Z" fill="#e8e8e4" stroke="#c8c8c4" strokeWidth=".9" strokeLinejoin="round"/>
      <path d="M2 30 L36 36" stroke="#c0c0bc" strokeWidth=".9" opacity=".8"/>
      <path d="M36 36 L78 4" stroke="#cacac6" strokeWidth=".9" strokeDasharray="3 3" opacity=".7"/>
      <path d="M20 18 L60 10" stroke="#d8d8d4" strokeWidth=".7" opacity=".5"/>
      <path d="M2 30 L12 26 L10 32 Z" fill="#e0e0dc" opacity=".6"/>
    </svg>
  );
}

function RobotAssistant() {
  const [showPlane,   setShowPlane]   = useState(false);
  const [planeActive, setPlaneActive] = useState(false);
  const [planeDone,   setPlaneDone]   = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowPlane(true),   800);
    const t2 = setTimeout(() => setPlaneActive(true), 1000);
    const t3 = setTimeout(() => setPlaneDone(true),   5600);
    return () => [t1,t2,t3].forEach(clearTimeout);
  }, []);

  return (
    <>
      <div style={{
        position: 'fixed', bottom: 0, left: 20, zIndex: 400,
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
        animation: 'robotSlideUp .8s cubic-bezier(.34,1.56,.64,1) .15s both',
        pointerEvents: 'none', userSelect: 'none',
      }}>
        <div style={{ animation: 'robotFloat 4s ease-in-out 2s infinite' }}>
          <RobotIllustration size={100} />
        </div>
      </div>

      {showPlane && !planeDone && (
        <div style={{
          position: 'fixed', bottom: 120, left: 100, zIndex: 500,
          pointerEvents: 'none',
          animation: planeActive ? 'planeCircleArc 4.5s cubic-bezier(.42,0,.58,1) forwards' : 'none',
          transformOrigin: 'center center',
        }}>
          <PaperAirplane size={72} />
        </div>
      )}

      <style>{`
        @keyframes robotSlideUp {
          from { transform: translateY(110%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes robotFloat {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-8px); }
        }
        @keyframes planeCircleArc {
          0%   { transform: translate(0px, 0px) rotate(-20deg) scale(1); opacity: 1; }
          12%  { transform: translate(-40px, -120px) rotate(-45deg) scale(1.08); opacity: 1; }
          28%  { transform: translate(18vw, -52vh) rotate(-15deg) scale(1.18); opacity: 1; }
          45%  { transform: translate(42vw, -40vh) rotate(10deg) scale(1.22); opacity: 1; }
          62%  { transform: translate(55vw, -58vh) rotate(-8deg) scale(1.14); opacity: 1; }
          78%  { transform: translate(66vw, -68vh) rotate(-14deg) scale(.92); opacity: .75; }
          90%  { transform: translate(73vw, -74vh) rotate(-18deg) scale(.6); opacity: .4; }
          100% { transform: translate(78vw, -78vh) rotate(-22deg) scale(.15); opacity: 0; }
        }
      `}</style>
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   POPULAR PLACES
══════════════════════════════════════════════════════════ */
const POPULAR_PLACES = [
  { name: 'Sanjay Gandhi National Park', area: 'Borivali East',   station: 'Borivali',   cat: 'Nature'   },
  { name: 'Gorai Beach',                 area: 'Borivali West',   station: 'Borivali',   cat: 'Beach'    },
  { name: 'Essel World',                 area: 'Gorai, Borivali', station: 'Borivali',   cat: 'Leisure'  },
  { name: 'Water Kingdom',               area: 'Gorai, Borivali', station: 'Borivali',   cat: 'Leisure'  },
  { name: 'Mandapeshwar Caves',          area: 'Borivali West',   station: 'Borivali',   cat: 'Heritage' },
  { name: 'Tungareshwar Temple',         area: 'Vasai-Virar',     station: 'Virar',      cat: 'Temple'   },
  { name: 'Vasai Fort',                  area: 'Vasai West',      station: 'Vasai Road', cat: 'Heritage' },
  { name: 'Chinchoti Waterfalls',        area: 'Virar East',      station: 'Virar',      cat: 'Nature'   },
  { name: 'Suruchi Beach',               area: 'Mira Road',       station: 'Mira Road',  cat: 'Beach'    },
];

function CatIcon({ cat, size = 18 }) {
  if (cat === 'Nature') return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M10 2 Q6 6 6 11 Q10 15 10 15 Q10 15 14 11 Q14 6 10 2Z" fill="#16a34a"/>
      <path d="M10 7 Q8 9 8 12 Q10 14 10 14" fill="#4ade80" opacity=".6"/>
      <line x1="10" y1="14" x2="10" y2="19" stroke="#15803d" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M7 17 Q10 15 13 17" stroke="#15803d" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
    </svg>
  );
  if (cat === 'Beach') return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="7" r="4.5" fill="#f59e0b"/>
      <path d="M2 14 Q6 11 10 13 Q14 15 18 12" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M2 16.5 Q6 14 10 16 Q14 18 18 15" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity=".6"/>
    </svg>
  );
  if (cat === 'Leisure') return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" stroke="#7c3aed" strokeWidth="1.5" fill="none"/>
      <path d="M10 2 L10 18" stroke="#7c3aed" strokeWidth="1.2" opacity=".5"/>
      <path d="M2 10 L18 10" stroke="#7c3aed" strokeWidth="1.2" opacity=".5"/>
      <circle cx="10" cy="10" r="4" fill="#8b5cf6" opacity=".4"/>
      <circle cx="10" cy="10" r="1.5" fill="#7c3aed"/>
    </svg>
  );
  if (cat === 'Heritage') return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M4 17 L4 9 L7 6 L10 3 L13 6 L16 9 L16 17 Z" fill="#b45309" opacity=".8"/>
      <path d="M4 9 L10 3 L16 9" fill="#92400e" opacity=".5"/>
      <rect x="7.5" y="12" width="5" height="5" fill="white" opacity=".7"/>
      <rect x="8.5" y="7" width="3" height="3" fill="#fef3c7" opacity=".8"/>
    </svg>
  );
  if (cat === 'Temple') return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <rect x="4" y="9" width="12" height="8" fill="#dc2626" opacity=".7"/>
      <path d="M10 2 L5 9 L15 9 Z" fill="#dc2626"/>
      <path d="M10 1 L10 3" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="10" cy="1" r="1" fill="#f59e0b"/>
      <rect x="7.5" y="12" width="5" height="5" fill="white" opacity=".7"/>
    </svg>
  );
  return <svg width={size} height={size} viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" fill="#6BAF45" opacity=".7"/></svg>;
}

function PlaceCard({ place, isSelected, isLoading, onSelect }) {
  return (
    <div
      onClick={() => !isLoading && onSelect(place)}
      style={{
        background: isSelected ? 'rgba(255,255,255,.95)' : 'rgba(255,255,255,.75)',
        backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
        border: `1.5px solid ${isSelected ? G : 'rgba(255,255,255,.6)'}`,
        borderRadius: 14, padding: '11px 14px',
        cursor: isLoading ? 'wait' : 'pointer', transition: 'all .22s',
        display: 'flex', alignItems: 'center', gap: 12,
        boxShadow: isSelected
          ? `0 6px 24px rgba(107,175,69,.18), 0 2px 8px rgba(0,0,0,.06)`
          : '0 2px 8px rgba(0,0,0,.05)',
        marginBottom: 7,
        opacity: isLoading && !isSelected ? 0.6 : 1,
      }}
      onMouseEnter={e => {
        if (!isSelected && !isLoading) {
          e.currentTarget.style.transform   = 'translateX(3px)';
          e.currentTarget.style.boxShadow   = '0 6px 20px rgba(0,0,0,.09)';
          e.currentTarget.style.borderColor = G_BOR;
          e.currentTarget.style.background  = 'rgba(255,255,255,.92)';
        }
      }}
      onMouseLeave={e => {
        if (!isSelected && !isLoading) {
          e.currentTarget.style.transform   = 'none';
          e.currentTarget.style.boxShadow   = '0 2px 8px rgba(0,0,0,.05)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,.6)';
          e.currentTarget.style.background  = 'rgba(255,255,255,.75)';
        }
      }}
    >
      <div style={{
        width: 34, height: 34, borderRadius: 9, flexShrink: 0,
        background: isSelected ? G_BG : 'rgba(240,240,238,.9)',
        border: `1px solid ${isSelected ? G_BOR : 'rgba(0,0,0,.06)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all .2s',
      }}>
        {isSelected && isLoading
          ? <div style={{ width:14, height:14, borderRadius:'50%', border:`2px solid ${G_BOR}`, borderTopColor:G, animation:'spin .7s linear infinite' }}/>
          : CatIcon({ cat: place.cat, size: 18 })
        }
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontWeight: 700, fontSize: '.82rem',
          color: isSelected ? G_DARK : '#1a1a18',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{place.name}</div>
        <div style={{ fontSize: '.65rem', color: '#aaa', marginTop: 1 }}>{place.area}</div>
      </div>

      <div style={{
        fontSize: '.58rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20,
        background: isSelected ? G : 'rgba(0,0,0,.05)',
        color: isSelected ? '#fff' : '#9a9a94', letterSpacing: '.4px', flexShrink: 0,
        transition: 'all .2s', whiteSpace: 'nowrap',
      }}>{place.station}</div>
    </div>
  );
}

function StationCard({ station, isSelected, isBoardingStation, onSelect }) {
  return (
    <button
      onClick={() => !isBoardingStation && onSelect(station)}
      disabled={isBoardingStation}
      style={{
        width: '100%', textAlign: 'left',
        background: isSelected ? 'rgba(255,255,255,.95)' : 'rgba(255,255,255,.72)',
        backdropFilter: 'blur(8px)',
        border: `1.5px solid ${isSelected ? G : 'rgba(255,255,255,.5)'}`,
        borderRadius: 12, padding: '10px 14px',
        cursor: isBoardingStation ? 'not-allowed' : 'pointer',
        transition: 'all .2s', opacity: isBoardingStation ? .4 : 1,
        fontFamily: 'Inter, sans-serif',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 7,
        boxShadow: isSelected ? `0 4px 18px rgba(107,175,69,.14)` : '0 1px 4px rgba(0,0,0,.05)',
      }}
      onMouseEnter={e => { if (!isBoardingStation && !isSelected) { e.currentTarget.style.borderColor = G_BOR; e.currentTarget.style.background = 'rgba(255,255,255,.88)'; }}}
      onMouseLeave={e => { if (!isBoardingStation && !isSelected) { e.currentTarget.style.borderColor = 'rgba(255,255,255,.5)'; e.currentTarget.style.background = 'rgba(255,255,255,.72)'; }}}
    >
      <div>
        <div style={{ fontWeight: 700, fontSize: '.84rem', color: isSelected ? G_DARK : '#1a1a18' }}>
          {station.name}
        </div>
        {isBoardingStation && (
          <div style={{ fontSize: '.62rem', color: '#bbb', marginTop: 1 }}>Your boarding station</div>
        )}
      </div>
      {isSelected && (
        <div style={{
          width: 18, height: 18, borderRadius: '50%', background: G,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5 L4.2 7.2 L8 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
    </button>
  );
}

function MicIcon({ size = 22, color = 'white' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="9" y="2" width="6" height="13" rx="3" fill={color}/>
      <path d="M5 11a7 7 0 0 0 14 0" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <line x1="12" y1="18" x2="12" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <line x1="9"  y1="22" x2="15" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════ */
export default function DestinationPage({
  appState, setAppState, onNavigate, speak, startListening, isListening,
}) {
  const isMobile = useIsMobile();
  const [inputText,    setInputText]    = useState('');
  const [voiceHint,    setVoiceHint]    = useState('');
  const [searching,    setSearching]    = useState(false);
  const [geocoding,    setGeocoding]    = useState(false); // for place card geocoding
  const [result,       setResult]       = useState(null);
  const [error,        setError]        = useState('');
  const [activeTab,    setActiveTab]    = useState('places');
  const [selPlace,     setSelPlace]     = useState(null);
  const [suggestions,  setSuggestions]  = useState([]);
  const [showSugg,     setShowSugg]     = useState(false);
  const [activeSuggIdx,setActiveSuggIdx]= useState(-1);
  const inputRef  = useRef(null);
  const suggRef   = useRef(null);

  const boarding = appState.nearestStation;

  useEffect(() => {
    const t = setTimeout(() => speak('Please speak your destination or type it below.'), 1200);
    return () => clearTimeout(t);
  }, []);

  const handleVoice = () => {
    speak('Please say your destination.', () => {
      startListening(
        text => { setInputText(text); setVoiceHint(`Heard: "${text}"`); runSearch(text); },
        ()   => speak('Microphone not available. Please type your destination.')
      );
    });
  };

  // ── Popular place selected → geocode it with Nominatim ──────────────────
  const handlePlaceSelect = async (place) => {
    setSelPlace(place);
    setResult(null);
    setError('');
    setGeocoding(true);
    speak(`Finding exact location of ${place.name}.`);

    const coords = await geocodePopularPlace(place);
    setGeocoding(false);

    if (!coords.found) {
      // Absolute fallback — use destination station coords
      const nearStation = STATIONS.find(s => s.name === place.station);
      setResult({
        placeName:   place.name,
        coords:      { found: true, lat: nearStation?.lat || 19.23, lng: nearStation?.lng || 72.85, name: `${place.area}, Mumbai` },
        destStation: nearStation || STATIONS[STATIONS.length - 1],
        recommendation: null,
      });
      speak(`${place.name} selected. Nearest station: ${place.station}.`);
      return;
    }

    // Use browser geolocation to calculate real distance from user → destination
    const nearStation = STATIONS.find(s => s.name === place.station)
      || getNearestStation(coords.lat, coords.lng);

    let recommendation = null;
    if (appState.userLat && appState.userLng) {
      // Distance from destination STATION to the actual place
      const R    = 6371000;
      const toR  = x => x * Math.PI / 180;
      const dLat = toR(coords.lat - nearStation.lat);
      const dLng = toR(coords.lng - nearStation.lng);
      const a    = Math.sin(dLat/2)**2 + Math.cos(toR(nearStation.lat)) * Math.cos(toR(coords.lat)) * Math.sin(dLng/2)**2;
      const distM = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      recommendation = recommendMode(distM);
    }

    setResult({ placeName: place.name, coords, destStation: nearStation, recommendation });
    const recMsg = recommendation ? ` ${recommendation.icon} ${recommendation.label} from the station.` : '';
    speak(`${place.name} found.${recMsg} Nearest station: ${nearStation.name}.`);
  };

  const handleStationSelect = (station) => {
    setSelPlace(null);
    setResult({
      placeName:   station.name,
      coords:      { found: true, lat: station.lat, lng: station.lng, name: station.name },
      destStation: station,
      recommendation: null,
    });
    setError('');
    speak(`${station.name} selected.`);
  };

  // ── Text / voice search ──────────────────────────────────────────────────
  const runSearch = async (raw) => {
    if (!raw.trim()) return;
    setSearching(true); setError(''); setResult(null); setSelPlace(null);
    const { placeName, station: hint } = parseJourneyInput(raw);
    speak(`Searching for ${placeName}.`);
    const coords = await geocodePlaceSafe(placeName);
    if (!coords.found) {
      setError(`Could not find "${placeName}". Try a more specific name.`);
      speak(`Sorry, could not find ${placeName}.`);
      setSearching(false); return;
    }
    const dest = hint || getNearestStation(coords.lat, coords.lng);

    // Calculate distance from dest station to place for recommendation
    const R    = 6371000;
    const toR  = x => x * Math.PI / 180;
    const dLat = toR(coords.lat - dest.lat);
    const dLng = toR(coords.lng - dest.lng);
    const a    = Math.sin(dLat/2)**2 + Math.cos(toR(dest.lat)) * Math.cos(toR(coords.lat)) * Math.sin(dLng/2)**2;
    const distM = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const recommendation = recommendMode(distM);

    setResult({ placeName, coords, destStation: dest, recommendation });
    setSearching(false);
    speak(`Found ${placeName}. Nearest station is ${dest.name}. ${recommendation.icon} ${recommendation.label}.`);
  };

  // ── POI suggestion selected ─────────────────────────────────────────────
  const handleSuggestionSelect = async (poi) => {
    setShowSugg(false);
    setSuggestions([]);
    setInputText(poi.name);
    setSelPlace(null);
    setResult(null);
    setError('');
    setGeocoding(true);
    speak(`Finding ${poi.name}.`);

    // Try Nominatim geocode first, fall back to station coords
    const query = `${poi.name}, ${poi.area}, Mumbai, Maharashtra, India`;
    let coords = { found: false };
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=in`;
      const res = await fetch(url, { headers: { 'Accept-Language': 'en', 'User-Agent': 'VISTA-TransitApp/1.0' } });
      const data = await res.json();
      if (data && data.length > 0) {
        coords = { found: true, lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), name: poi.area + ", Mumbai" };
      }
    } catch(e) {}

    const nearStation = STATIONS.find(s => s.name === poi.station) || STATIONS[STATIONS.length - 1];

    if (!coords.found) {
      coords = { found: true, lat: nearStation.lat, lng: nearStation.lng, name: poi.area + ", Mumbai" };
    }

    const R = 6371000, toR = x => x * Math.PI / 180;
    const dLat = toR(coords.lat - nearStation.lat);
    const dLng = toR(coords.lng - nearStation.lng);
    const a = Math.sin(dLat/2)**2 + Math.cos(toR(nearStation.lat)) * Math.cos(toR(coords.lat)) * Math.sin(dLng/2)**2;
    const distM = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const recommendation = recommendMode(distM);

    setGeocoding(false);
    setResult({ placeName: poi.name, coords, destStation: nearStation, recommendation });
    speak(`${poi.name} found. Get down at ${nearStation.name}. ${recommendation.icon} ${recommendation.label}.`);
  };

  const handleConfirm = () => {
    if (!result) { speak('Please select a destination first.'); return; }
    if (!boarding) { speak('Please detect your location first.'); return; }
    if (boarding.id === result.destStation.id) {
      speak('Source and destination are the same. Choose a different station.');
      return;
    }
    setAppState(s => ({ ...s, destStation: result.destStation, destPlaceName: result.placeName, destPlaceCoords: result.coords }));
    onNavigate('trains');
    speak(`Finding trains to ${result.destStation.name}.`);
  };

  return (
    <>
      <RobotAssistant />

      <div style={{
        display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '50% 50%',
        minHeight: '100vh',
        background: 'linear-gradient(145deg, #f4f7f0 0%, #eef5e8 30%, #f8fbf6 65%, #ffffff 100%)',
      }}>

        {/* ══ LEFT ══════════════════════════════════════════ */}
        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '80px 44px 120px 52px',
          borderRight: '1px solid rgba(107,175,69,.1)',
        }}>

          <div style={{ marginBottom: 28, animation: 'fadeUp .5s ease-out both' }}>
            <h1 style={{
              fontFamily: 'Playfair Display, serif', fontWeight: 900,
              fontSize: '2rem', color: '#1a1a18', marginBottom: 8, lineHeight: 1.1,
            }}>Where To?</h1>
            <p style={{ color: '#8a8a84', fontSize: '.86rem', lineHeight: 1.65 }}>
              Speak or type any place, landmark, or area in Mumbai
            </p>
          </div>

          {/* Boarding chip */}
          <div style={{
            background: 'rgba(255,255,255,.8)', backdropFilter: 'blur(8px)',
            border: `1px solid ${G_BOR}`, borderRadius: 12,
            padding: '11px 16px', marginBottom: 26,
            animation: 'fadeUp .5s ease-out .08s both',
          }}>
            <div style={{ fontSize: '.57rem', color: '#bbb', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 3 }}>Boarding From</div>
            <div style={{ fontWeight: 700, fontSize: '.92rem', color: G_DARK }}>
              {boarding?.name || 'Not detected — go back to Location'}
            </div>
          </div>

          {/* Mic */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            marginBottom: 26, animation: 'fadeUp .5s ease-out .15s both',
          }}>
            <button
              onClick={handleVoice}
              style={{
                width: 68, height: 68, borderRadius: '50%', border: 'none', cursor: 'pointer',
                background: isListening
                  ? 'linear-gradient(135deg,#e05252,#c03030)'
                  : `linear-gradient(135deg,${G},#5a9a38)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 10,
                boxShadow: isListening
                  ? '0 6px 28px rgba(224,82,82,.4)'
                  : `0 6px 28px rgba(107,175,69,.38)`,
                animation: isListening ? 'micPulse 1s ease infinite' : 'none',
                transition: 'all .25s',
              }}
            ><MicIcon size={24} /></button>
            <span style={{ fontSize: '.68rem', color: '#bbb', letterSpacing: 1.2, textTransform: 'uppercase' }}>
              {isListening ? 'Listening…' : 'Tap to Speak'}
            </span>
            {voiceHint && (
              <div style={{
                marginTop: 8, fontSize: '.76rem', color: G_DARK,
                background: G_BG, border: `1px solid ${G_BOR}`,
                borderRadius: 8, padding: '5px 13px',
              }}>{voiceHint}</div>
            )}
          </div>

          {/* Search input */}
          <div style={{ position: 'relative', marginBottom: 14, animation: 'fadeUp .5s ease-out .22s both' }}>
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              placeholder="Type destination — landmark, area, address…"
              onChange={e => {
                const v = e.target.value;
                setInputText(v);
                setActiveSuggIdx(-1);
                if (v.trim().length >= 2) {
                  const hits = searchPOI(v, 8);
                  setSuggestions(hits);
                  setShowSugg(hits.length > 0);
                } else {
                  setSuggestions([]);
                  setShowSugg(false);
                }
              }}
              onKeyDown={e => {
                if (showSugg && suggestions.length > 0) {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setActiveSuggIdx(i => Math.min(i + 1, suggestions.length - 1));
                    return;
                  }
                  if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setActiveSuggIdx(i => Math.max(i - 1, -1));
                    return;
                  }
                  if (e.key === 'Enter' && activeSuggIdx >= 0) {
                    e.preventDefault();
                    const pick = suggestions[activeSuggIdx];
                    setInputText(pick.name);
                    setSuggestions([]);
                    setShowSugg(false);
                    handleSuggestionSelect(pick);
                    return;
                  }
                  if (e.key === 'Escape') {
                    setShowSugg(false);
                    return;
                  }
                }
                if (e.key === 'Enter') runSearch(inputText);
              }}
              onBlur={() => setTimeout(() => setShowSugg(false), 150)}
              onFocus={() => { if (suggestions.length > 0) setShowSugg(true); }}
              style={{
                width: '100%', padding: '13px 90px 13px 16px',
                background: 'rgba(255,255,255,.85)', backdropFilter: 'blur(8px)',
                border: '1.5px solid rgba(0,0,0,.1)', borderRadius: 12,
                color: '#1a1a18', fontFamily: 'Inter, sans-serif', fontSize: '.88rem',
                outline: 'none', transition: 'border-color .2s, box-shadow .2s',
                boxSizing: 'border-box',
              }}
              on_Focus={e => { e.target.style.borderColor = G; e.target.style.boxShadow = `0 0 0 3px ${G_BG}`; }}
              on_Blur={e  => { e.target.style.borderColor = 'rgba(0,0,0,.1)'; e.target.style.boxShadow = 'none'; }}
            />
            <button
              onClick={() => runSearch(inputText)}
              style={{
                position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                background: `linear-gradient(135deg,${G},#5a9a38)`,
                border: 'none', borderRadius: 8, padding: '7px 14px',
                cursor: 'pointer', color: '#fff', fontSize: '.78rem', fontWeight: 600,
                fontFamily: 'Inter, sans-serif',
              }}
            >Search</button>

            {/* ── Autocomplete Suggestions Dropdown ── */}
            {showSugg && suggestions.length > 0 && (
              <div ref={suggRef} style={{
                position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 999,
                background: 'rgba(255,255,255,0.98)',
                backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                border: `1.5px solid ${G_BOR}`,
                borderRadius: 12, marginTop: 4,
                boxShadow: '0 12px 40px rgba(0,0,0,0.14), 0 4px 12px rgba(107,175,69,0.1)',
                overflow: 'hidden',
                maxHeight: 320, overflowY: 'auto',
              }}>
                {suggestions.map((poi, idx) => {
                  const isActive = idx === activeSuggIdx;
                  const catColors = {
                    Food:'#f59e0b', Cafe:'#a16207', Hospital:'#ef4444',
                    Mall:'#7c3aed', Shopping:'#7c3aed', Temple:'#dc2626',
                    Church:'#2563eb', Bank:'#059669', Pharmacy:'#0891b2',
                    School:'#d97706', College:'#d97706', Nature:'#16a34a',
                    Beach:'#0284c7', Heritage:'#b45309', Hotel:'#4f46e5',
                    Gym:'#ea580c', Park:'#15803d', Leisure:'#9333ea', Office:'#64748b',
                  };
                  const dotColor = catColors[poi.cat] || G;
                  return (
                    <div
                      key={poi.name + idx}
                      onMouseDown={e => { e.preventDefault(); setInputText(poi.name); setShowSugg(false); handleSuggestionSelect(poi); }}
                      onMouseEnter={() => setActiveSuggIdx(idx)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '10px 14px', cursor: 'pointer',
                        background: isActive ? G_BG : 'transparent',
                        borderBottom: idx < suggestions.length - 1 ? '1px solid rgba(0,0,0,.04)' : 'none',
                        transition: 'background .12s',
                      }}
                    >
                      <div style={{
                        width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                        background: dotColor,
                      }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontWeight: 600, fontSize: '.83rem',
                          color: isActive ? G_DARK : '#1a1a18',
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>{poi.name}</div>
                        <div style={{ fontSize: '.65rem', color: '#9a9a94', marginTop: 1 }}>
                          {poi.area}
                        </div>
                      </div>
                      <div style={{
                        fontSize: '.58rem', fontWeight: 700, padding: '2px 8px',
                        borderRadius: 20, flexShrink: 0,
                        background: isActive ? G : 'rgba(0,0,0,.05)',
                        color: isActive ? '#fff' : '#9a9a94',
                        letterSpacing: '.4px', whiteSpace: 'nowrap',
                        transition: 'all .12s',
                      }}>{poi.station}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* States */}
          {(searching || geocoding) && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: G_BG, border: `1px solid ${G_BOR}`,
              borderRadius: 10, padding: '10px 14px', marginBottom: 12,
            }}>
              <div style={{
                width: 14, height: 14, borderRadius: '50%',
                border: `2px solid ${G_BOR}`, borderTopColor: G,
                animation: 'spin .7s linear infinite', flexShrink: 0,
              }} />
              <span style={{ fontSize: '.82rem', color: G_DARK }}>
                {geocoding ? 'Fetching exact coordinates via Nominatim…' : 'Searching…'}
              </span>
            </div>
          )}

          {error && (
            <div style={{
              background: 'rgba(224,82,82,.06)', border: '1px solid rgba(224,82,82,.2)',
              borderRadius: 10, padding: '10px 14px', marginBottom: 12,
              fontSize: '.8rem', color: '#c03030',
            }}>{error}</div>
          )}

          {result && !searching && !geocoding && (
            <div style={{
              background: 'rgba(255,255,255,.88)', backdropFilter: 'blur(8px)',
              border: `1px solid ${G_BOR}`, borderRadius: 12, padding: '14px 16px', marginBottom: 18,
              animation: 'fadeUp .3s ease-out both',
            }}>
              <div style={{ fontSize: '.56rem', color: '#bbb', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>Destination Found</div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12, marginBottom: result.recommendation ? 10 : 0 }}>
                <div>
                  <div style={{ fontSize: '.6rem', color: '#bbb', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>Place</div>
                  <div style={{ fontWeight: 700, fontSize: '.88rem', color: '#1a1a18' }}>{result.placeName}</div>
                  <div style={{ fontSize: '.7rem', color: '#9a9a94', marginTop: 2 }}>{result.coords.name}</div>
                </div>
                <div>
                  <div style={{ fontSize: '.6rem', color: '#bbb', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>Get Down At</div>
                  <div style={{ fontWeight: 700, fontSize: '.88rem', color: G_DARK }}>{result.destStation.name}</div>
                  <div style={{ fontSize: '.7rem', color: '#9a9a94', marginTop: 2 }}>Western Line</div>
                </div>
              </div>

              {/* ── Last-mile recommendation ── */}
              {result.recommendation && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: G_BG, border: `1px solid ${G_BOR}`,
                  borderRadius: 8, padding: '7px 12px', marginTop: 4,
                }}>
                  <span style={{ fontSize: '1rem' }}>{result.recommendation.icon}</span>
                  <div>
                    <div style={{ fontSize: '.7rem', fontWeight: 700, color: G_DARK }}>From {result.destStation.name} station</div>
                    <div style={{ fontSize: '.66rem', color: '#6a6a64' }}>{result.recommendation.label}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 10, animation: 'fadeUp .5s ease-out .3s both' }}>
            <button
              onClick={() => onNavigate('location')}
              style={{
                flex: 1, padding: '13px 0', borderRadius: 12,
                background: 'rgba(255,255,255,.8)', border: '1.5px solid rgba(0,0,0,.1)',
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                fontWeight: 600, fontSize: '.84rem', color: '#6a6a64', transition: 'all .2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.95)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,.8)'}
            >← Back</button>
            <button
              onClick={handleConfirm}
              disabled={!result || searching || geocoding}
              style={{
                flex: 2, padding: '13px 0', borderRadius: 12,
                background: result && !searching && !geocoding ? `linear-gradient(135deg,${G},#5a9a38)` : '#e0e0de',
                border: 'none', cursor: result && !searching && !geocoding ? 'pointer' : 'not-allowed',
                fontFamily: 'Inter, sans-serif', fontWeight: 700,
                fontSize: '.88rem', color: result && !searching && !geocoding ? '#fff' : '#aaa',
                boxShadow: result && !searching && !geocoding ? '0 4px 18px rgba(107,175,69,.3)' : 'none',
                transition: 'all .22s',
              }}
              onMouseEnter={e => { if (result && !searching && !geocoding) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 22px rgba(107,175,69,.42)'; }}}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = result && !searching && !geocoding ? '0 4px 18px rgba(107,175,69,.3)' : 'none'; }}
            >Find Trains →</button>
          </div>
        </div>

        {/* ══ RIGHT ══════════════════════════════════════════ */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          padding: '80px 40px 48px 32px',
          overflowY: 'auto',
        }}>
          <div style={{ marginBottom: 14, animation: 'fadeUp .5s ease-out .1s both' }}>
            <div style={{ fontSize: '.57rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#bbb', marginBottom: 6 }}>
              Choose Destination
            </div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1.25rem', color: '#1a1a18', marginBottom: 4 }}>
              Popular Places
            </h2>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex', gap: 4,
            background: 'rgba(240,240,238,.8)', backdropFilter: 'blur(6px)',
            borderRadius: 10, padding: 4, marginBottom: 14,
            animation: 'fadeUp .5s ease-out .16s both',
          }}>
            {[{ id:'places', label:'Popular Places' }, { id:'stations', label:'Stations' }].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1, padding: '8px 0', borderRadius: 8, border: 'none',
                  background: activeTab === tab.id ? 'rgba(255,255,255,.95)' : 'transparent',
                  color: activeTab === tab.id ? '#1a1a18' : '#9a9a94',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: activeTab === tab.id ? 600 : 500,
                  fontSize: '.78rem', cursor: 'pointer',
                  boxShadow: activeTab === tab.id ? '0 1px 6px rgba(0,0,0,.08)' : 'none',
                  transition: 'all .2s',
                }}
              >{tab.label}</button>
            ))}
          </div>

          {activeTab === 'places' && (
            <div style={{ animation: 'fadeUp .4s ease-out .2s both' }}>
              {POPULAR_PLACES.map(place => (
                <PlaceCard
                  key={place.name}
                  place={place}
                  isSelected={selPlace?.name === place.name}
                  isLoading={geocoding && selPlace?.name === place.name}
                  onSelect={handlePlaceSelect}
                />
              ))}
            </div>
          )}

          {activeTab === 'stations' && (
            <div style={{ animation: 'fadeUp .4s ease-out .2s both' }}>
              <div style={{
                display: 'flex', alignItems: 'center', overflowX: 'auto',
                marginBottom: 14, padding: '4px 0',
              }}>
                {STATIONS.map((st, i) => (
                  <React.Fragment key={st.id}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 50 }}>
                      <div style={{
                        width: 8, height: 8, borderRadius: '50%', flexShrink: 0, transition: 'all .2s',
                        background: st.id === boarding?.id ? '#1a1a18' : result?.destStation?.id === st.id ? G : '#ccc',
                        border: `2px solid ${st.id === boarding?.id ? '#1a1a18' : result?.destStation?.id === st.id ? G : '#ddd'}`,
                      }} />
                      <div style={{
                        fontSize: '.5rem', marginTop: 3, textAlign: 'center', maxWidth: 46,
                        color: st.id === boarding?.id ? '#1a1a18' : result?.destStation?.id === st.id ? G_DARK : '#bbb',
                        fontWeight: (st.id === boarding?.id || result?.destStation?.id === st.id) ? 700 : 400,
                        lineHeight: 1.2,
                      }}>{st.name}</div>
                    </div>
                    {i < STATIONS.length - 1 && (
                      <div style={{ height: 1.5, flex: 1, minWidth: 10, background: G, opacity: .25, marginBottom: 12, flexShrink: 0 }} />
                    )}
                  </React.Fragment>
                ))}
              </div>
              {STATIONS.map(st => (
                <StationCard
                  key={st.id} station={st}
                  isSelected={result?.destStation?.id === st.id && !selPlace}
                  isBoardingStation={st.id === boarding?.id}
                  onSelect={handleStationSelect}
                />
              ))}
            </div>
          )}

          <div style={{
            marginTop: 12, padding: '10px 14px',
            background: 'rgba(255,255,255,.7)', backdropFilter: 'blur(6px)',
            border: '1px solid rgba(0,0,0,.06)', borderRadius: 10,
            fontSize: '.7rem', color: '#9a9a94',
          }}>
            You can also type any Mumbai landmark on the left panel to search.
          </div>
        </div>
      </div>
    </>
  );
}
