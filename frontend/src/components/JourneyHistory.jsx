// src/components/JourneyHistory.jsx
// Self-contained Journey History panel.
// - Reads/writes to localStorage key 'vista_journey_history'
// - Export saveJourney() and call it from TrainsPage when user confirms a train
// - Drop <JourneyHistory /> anywhere; it manages its own state

import React, { useState, useEffect, useCallback } from 'react';

/* ── Design tokens ───────────────────────────────────────── */
const G      = '#6BAF45';
const G_DARK = '#4a8a2a';
const G_BG   = 'rgba(107,175,69,.07)';
const G_BOR  = 'rgba(107,175,69,.22)';

const HISTORY_KEY  = 'vista_journey_history';
const MAX_ENTRIES  = 5;

/* ── Station accent colours (matches VISTA line order) ───── */
const STATION_COLOR = {
  'Virar':       '#7c3aed',
  'Nalasopara':  '#0891b2',
  'Vasai Road':  '#d97706',
  'Naigaon':     '#dc2626',
  'Bhayandar':   '#ea580c',
  'Mira Road':   '#1d4ed8',
  'Dahisar':     '#16a34a',
  'Borivali':    '#4a8a2a',
};

function stationColor(name) {
  return STATION_COLOR[name] || G_DARK;
}

/* ── Time label helpers ──────────────────────────────────── */
function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins <  1)  return 'Just now';
  if (mins < 60)  return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs  < 24)  return `${hrs} hr ago`;
  const days = Math.floor(hrs / 24);
  return days === 1 ? 'Yesterday' : `${days} days ago`;
}

function shortTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

/* ══════════════════════════════════════════════════════════
   PUBLIC API — call this from TrainsPage.jsx
══════════════════════════════════════════════════════════ */
export function saveJourney({ fromStation, toStation, placeName, trainName }) {
  if (!fromStation?.name || !toStation?.name) return;
  try {
    const existing = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');

    const entry = {
      id:          `${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
      timestamp:   Date.now(),
      from:        fromStation.name,
      to:          toStation.name,
      place:       placeName || toStation.name,
      trainName:   trainName || '',
      fromStation: { name: fromStation.name, id: fromStation.id, lat: fromStation.lat, lng: fromStation.lng },
      toStation:   { name: toStation.name,   id: toStation.id,   lat: toStation.lat,   lng: toStation.lng   },
    };

    // De-duplicate: same from+to is treated as same route
    const deduped = existing.filter(e => !(e.from === entry.from && e.to === entry.to));
    const updated = [entry, ...deduped].slice(0, MAX_ENTRIES);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));

    // Notify any mounted JourneyHistory components
    window.dispatchEvent(new Event('vista_history_updated'));
  } catch {}
}

/* ══════════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════════ */
export default function JourneyHistory({ appState, setAppState, onNavigate, speak }) {
  const [history,   setHistory]   = useState([]);
  const [clearing,  setClearing]  = useState(false);
  const [repeated,  setRepeated]  = useState(null); // id of just-repeated entry

  /* Load history */
  const loadHistory = useCallback(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
      setHistory(raw);
    } catch { setHistory([]); }
  }, []);

  useEffect(() => {
    loadHistory();
    // Listen for updates from saveJourney()
    window.addEventListener('vista_history_updated', loadHistory);
    return () => window.removeEventListener('vista_history_updated', loadHistory);
  }, [loadHistory]);

  /* Repeat a past journey */
  const handleRepeat = (entry) => {
    setRepeated(entry.id);
    setTimeout(() => setRepeated(null), 1200);

    setAppState(s => ({
      ...s,
      nearestStation:  entry.fromStation,
      destStation:     entry.toStation,
      destPlaceName:   entry.place,
      destPlaceCoords: null,   // will be re-geocoded if needed
      selectedTrain:   null,
      lastMileMode:    null,
    }));

    if (speak) speak(`Repeating journey from ${entry.from} to ${entry.to}.`);
    onNavigate('trains');
  };

  /* Clear all */
  const handleClear = () => {
    setClearing(true);
    setTimeout(() => {
      localStorage.removeItem(HISTORY_KEY);
      setHistory([]);
      setClearing(false);
      if (speak) speak('Journey history cleared.');
    }, 300);
  };

  /* ── Empty state ── */
  if (history.length === 0) {
    return (
      <div style={{
        textAlign: 'center', padding: '32px 24px',
        border: '1.5px dashed rgba(107,175,69,.25)', borderRadius: 16,
        background: 'rgba(107,175,69,.02)',
      }}>
        <div style={{ fontSize: '2.2rem', marginBottom: 10, opacity: .35 }}>🗺️</div>
        <div style={{ fontWeight: 700, fontSize: '.86rem', color: '#9a9a94', marginBottom: 5 }}>
          No journeys yet
        </div>
        <div style={{ fontSize: '.72rem', color: '#c0c0bc', lineHeight: 1.6 }}>
          Your last {MAX_ENTRIES} routes will appear here<br />after you confirm a train.
        </div>
      </div>
    );
  }

  /* ── History list ── */
  return (
    <div style={{ opacity: clearing ? 0 : 1, transition: 'opacity .3s' }}>

      {/* Header row */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 12,
      }}>
        <div style={{ fontSize: '.58rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#bbb' }}>
          Recent Routes · {history.length} saved
        </div>
        <button
          onClick={handleClear}
          style={{
            padding: '3px 10px', borderRadius: 7, border: '1px solid rgba(0,0,0,.1)',
            background: 'transparent', cursor: 'pointer',
            fontFamily: 'Inter, sans-serif', fontSize: '.62rem', color: '#bbb',
            transition: 'all .18s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#dc2626'; e.currentTarget.style.borderColor = 'rgba(220,38,38,.3)'; e.currentTarget.style.background = 'rgba(220,38,38,.05)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#bbb'; e.currentTarget.style.borderColor = 'rgba(0,0,0,.1)'; e.currentTarget.style.background = 'transparent'; }}
        >Clear all</button>
      </div>

      {/* Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {history.map((entry, i) => {
          const fromCol  = stationColor(entry.from);
          const toCol    = stationColor(entry.to);
          const isFirst  = i === 0;
          const justDone = repeated === entry.id;

          return (
            <div
              key={entry.id}
              style={{
                background: justDone
                  ? 'rgba(107,175,69,.1)'
                  : isFirst
                    ? 'rgba(255,255,255,.95)'
                    : 'rgba(255,255,255,.78)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                border: `1.5px solid ${justDone ? G_BOR : isFirst ? 'rgba(107,175,69,.18)' : 'rgba(0,0,0,.07)'}`,
                borderRadius: 14,
                padding: '13px 15px',
                display: 'flex', alignItems: 'center', gap: 12,
                transition: 'all .22s',
                boxShadow: isFirst ? '0 3px 14px rgba(0,0,0,.06)' : 'none',
                animation: `historyFadeUp .3s ease-out ${i * 0.055}s both`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform   = 'translateY(-2px)';
                e.currentTarget.style.boxShadow   = '0 6px 22px rgba(0,0,0,.09)';
                e.currentTarget.style.borderColor = G_BOR;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform   = 'none';
                e.currentTarget.style.boxShadow   = isFirst ? '0 3px 14px rgba(0,0,0,.06)' : 'none';
                e.currentTarget.style.borderColor = justDone ? G_BOR : isFirst ? 'rgba(107,175,69,.18)' : 'rgba(0,0,0,.07)';
              }}
            >
              {/* Index dot */}
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                background: isFirst ? G : 'rgba(0,0,0,.05)',
                border: `1.5px solid ${isFirst ? G : 'rgba(0,0,0,.1)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '.7rem', fontWeight: 800, color: isFirst ? '#fff' : '#9a9a94',
              }}>{i + 1}</div>

              {/* Route info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* From → To badges */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5, flexWrap: 'wrap' }}>
                  <span style={{
                    padding: '2px 9px', borderRadius: 20, fontSize: '.68rem', fontWeight: 700,
                    background: `${fromCol}10`, color: fromCol, border: `1px solid ${fromCol}28`,
                    whiteSpace: 'nowrap',
                  }}>{entry.from}</span>

                  <span style={{ color: '#ccc', fontSize: '.7rem', flexShrink: 0 }}>→</span>

                  <span style={{
                    padding: '2px 9px', borderRadius: 20, fontSize: '.68rem', fontWeight: 700,
                    background: `${toCol}10`, color: toCol, border: `1px solid ${toCol}28`,
                    whiteSpace: 'nowrap',
                  }}>{entry.to}</span>
                </div>

                {/* Meta row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  {entry.place && entry.place !== entry.to && (
                    <span style={{
                      fontSize: '.63rem', color: '#9a9a94',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 130,
                    }}>📍 {entry.place}</span>
                  )}
                  {entry.trainName && (
                    <span style={{ fontSize: '.6rem', color: '#bbb' }}>· 🚆 {entry.trainName}</span>
                  )}
                  <span style={{ fontSize: '.6rem', color: '#ccc' }}>·</span>
                  <span style={{ fontSize: '.6rem', color: '#c0c0bc', whiteSpace: 'nowrap' }}>
                    {timeAgo(entry.timestamp)}
                  </span>
                  {isFirst && (
                    <span style={{
                      fontSize: '.52rem', fontWeight: 700, color: G,
                      background: G_BG, padding: '1px 7px', borderRadius: 20,
                      border: `1px solid ${G_BOR}`, letterSpacing: .5, whiteSpace: 'nowrap',
                    }}>LAST USED</span>
                  )}
                </div>
              </div>

              {/* Repeat button */}
              <button
                onClick={() => handleRepeat(entry)}
                style={{
                  flexShrink: 0,
                  padding: '8px 13px', borderRadius: 10, border: 'none', cursor: 'pointer',
                  background: justDone
                    ? G
                    : `linear-gradient(135deg, ${G}, #5a9a38)`,
                  color: '#fff',
                  fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '.72rem',
                  letterSpacing: '.2px', whiteSpace: 'nowrap',
                  boxShadow: '0 3px 12px rgba(107,175,69,.28)',
                  transition: 'all .2s',
                  display: 'flex', alignItems: 'center', gap: 5,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform  = 'scale(1.05)';
                  e.currentTarget.style.boxShadow  = '0 5px 18px rgba(107,175,69,.42)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform  = 'scale(1)';
                  e.currentTarget.style.boxShadow  = '0 3px 12px rgba(107,175,69,.28)';
                }}
              >
                <span style={{ fontSize: '.9rem' }}>{justDone ? '✓' : '↻'}</span>
                {justDone ? 'Going!' : 'Repeat'}
              </button>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes historyFadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
