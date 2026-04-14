// src/pages/TrainsPage.jsx — Smart timing, 3 glass train cards, animated map
import React, { useEffect, useState, useCallback } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';
import TrainMapPanel from '../components/TrainMapPanel';
import { STATIONS } from '../data/transitData';
import { fetchNextTrains } from '../services/trainsApi';
import { haversine, walkTime } from '../utils/helpers';

const G      = '#6BAF45';
const G_DARK = '#4a8a2a';
const G_BG   = 'rgba(107,175,69,.07)';
const G_BOR  = 'rgba(107,175,69,.22)';

/* ── Compute estimated arrival time at station ─────────── */
function addMinutes(timeStr, mins) {
  if (!timeStr || timeStr === '—') return '—';
  const [h, m] = timeStr.split(':').map(Number);
  const total  = h * 60 + m + mins;
  const nh = Math.floor(total / 60) % 24;
  const nm = total % 60;
  return `${String(nh).padStart(2,'0')}:${String(nm).padStart(2,'0')}`;
}

function timeDiffMins(t1, t2) {
  const toMins = t => { const [h,m] = t.split(':').map(Number); return h*60+m; };
  return toMins(t2) - toMins(t1);
}

function calcDuration(dep, arr) {
  if (!dep || !arr || dep === '—' || arr === '—') return null;
  let diff = timeDiffMins(dep, arr);
  if (diff < 0) diff += 24 * 60;
  return diff;
}

/* ── Train SVG icon ─────────────────────────────────────── */
function TrainLineIcon({ type }) {
  const color = type === 'Fast' ? G_DARK : '#1d4ed8';
  return (
    <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
      <rect x="1" y="2" width="26" height="13" rx="3" fill={color} opacity=".9"/>
      <rect x="1" y="2" width="26" height="4" rx="3" fill={color}/>
      {[3,9,15,21].map(x => <rect key={x} x={x} y="4" width="5" height="7" rx="1.2" fill="white" opacity=".75"/>)}
      <circle cx="6"  cy="17" r="2.8" fill={color}/>
      <circle cx="6"  cy="17" r="1.2" fill="white" opacity=".8"/>
      <circle cx="22" cy="17" r="2.8" fill={color}/>
      <circle cx="22" cy="17" r="1.2" fill="white" opacity=".8"/>
      <rect x="1" y="14" width="26" height="2.5" rx="1" fill={color} opacity=".6"/>
    </svg>
  );
}

/* ── Clock icon ────────────────────────────────────────── */
function ClockIcon({ size = 14, color = '#9a9a94' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke={color} strokeWidth="1.3" fill="none"/>
      <path d="M7 4 L7 7 L9.5 8.5" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ── Duration pill ─────────────────────────────────────── */
function DurationPill({ mins }) {
  if (!mins) return null;
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 9px', borderRadius: 20, fontSize: '.62rem', fontWeight: 600,
      background: 'rgba(0,0,0,.04)', color: '#6a6a64', border: '1px solid rgba(0,0,0,.08)',
    }}>
      <ClockIcon size={11} color="#6a6a64"/>
      {mins} min
    </div>
  );
}

/* ── Glass train card ──────────────────────────────────── */
function GlassTrainCard({ train, index, isSelected, onSelect }) {
  const name    = train.trainName || train.name || 'Local Train';
  const rawDep  = train.departureTime || train.departure || train.nextTime || '—';
  const rawArr  = train.arrivalTime   || train.arrival   || '—';
  const plat    = train.platform      || `PF ${train.platform_south || 1}`;
  const type    = train.type          || 'Local';
  const duration= calcDuration(rawDep, rawArr);

  const typeColor = type === 'Fast' ? G_DARK : '#1d4ed8';
  const typeBg    = type === 'Fast' ? G_BG   : 'rgba(29,78,216,.07)';
  const typeBor   = type === 'Fast' ? G_BOR  : 'rgba(29,78,216,.2)';

  const optLabels = ['First available', 'Second option', 'Third option'];

  return (
    <div
      onClick={() => onSelect(train)}
      style={{
        background: isSelected ? 'rgba(255,255,255,.98)' : 'rgba(255,255,255,.8)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: `1.5px solid ${isSelected ? G : 'rgba(255,255,255,.65)'}`,
        borderRadius: 18, padding: '16px 18px',
        cursor: 'pointer',
        boxShadow: isSelected
          ? `0 8px 32px rgba(107,175,69,.18), 0 2px 8px rgba(0,0,0,.07)`
          : '0 3px 14px rgba(0,0,0,.07)',
        transition: 'all .25s cubic-bezier(.4,0,.2,1)',
        position: 'relative', overflow: 'hidden',
        flex: '1 1 0', minWidth: 0,
      }}
      onMouseEnter={e => {
        if (!isSelected) {
          e.currentTarget.style.transform   = 'translateY(-3px)';
          e.currentTarget.style.boxShadow   = '0 10px 32px rgba(0,0,0,.1)';
          e.currentTarget.style.borderColor = G_BOR;
          e.currentTarget.style.background  = 'rgba(255,255,255,.92)';
        }
      }}
      onMouseLeave={e => {
        if (!isSelected) {
          e.currentTarget.style.transform   = 'none';
          e.currentTarget.style.boxShadow   = '0 3px 14px rgba(0,0,0,.07)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,.65)';
          e.currentTarget.style.background  = 'rgba(255,255,255,.8)';
        }
      }}
    >
      {isSelected && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          background: `linear-gradient(90deg,${G},#9dd87a)`,
          borderRadius: '18px 18px 0 0',
        }} />
      )}

      {/* Row 1: Numbered option + train name + type badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
            background: isSelected ? G : '#f0f0ee',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Playfair Display, serif', fontWeight: 900,
            fontSize: '.82rem',
            color: isSelected ? '#fff' : '#6a6a64',
            transition: 'all .25s',
          }}>{index + 1}</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '.84rem', color: '#1a1a18', lineHeight: 1 }}>{name}</div>
            <div style={{ fontSize: '.62rem', color: '#bbb', marginTop: 2 }}>
              {optLabels[index] || `Option ${index + 1}`}
            </div>
          </div>
        </div>
        <span style={{
          padding: '3px 10px', borderRadius: 20, fontSize: '.62rem', fontWeight: 700,
          background: typeBg, color: typeColor, border: `1px solid ${typeBor}`, letterSpacing: '.6px',
        }}>{type.toUpperCase()} LOCAL</span>
      </div>

      {/* Row 2: Departs → Arrives with duration */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <div style={{
          flex: 1, textAlign: 'center',
          background: typeBg, border: `1px solid ${typeBor}`,
          borderRadius: 10, padding: '8px 6px',
        }}>
          <div style={{ fontSize: '.55rem', color: '#bbb', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 3 }}>Departs</div>
          <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: '1.1rem', color: typeColor }}>
            {rawDep}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flexShrink: 0 }}>
          <svg width="22" height="8" viewBox="0 0 22 8" fill="none">
            <path d="M0 4 L18 4" stroke="#ddd" strokeWidth="1.5"/>
            <path d="M16 1 L20 4 L16 7" stroke="#ddd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {duration && <DurationPill mins={duration} />}
        </div>
        <div style={{ flex: 1, textAlign: 'center', background: '#f8f8f6', borderRadius: 10, padding: '8px 6px' }}>
          <div style={{ fontSize: '.55rem', color: '#bbb', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 3 }}>Arrives</div>
          <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: '1.1rem', color: '#1a1a18' }}>
            {rawArr}
          </div>
        </div>
      </div>

      {/* Row 3: Platform + tap hint */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '.7rem', color: '#7a7a74', display: 'flex', alignItems: 'center', gap: 5 }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect x="1" y="8" width="10" height="2" rx="1" fill="#ccc"/>
            <rect x="2" y="3" width="1.5" height="5" rx=".75" fill="#ccc"/>
            <rect x="8.5" y="3" width="1.5" height="5" rx=".75" fill="#ccc"/>
          </svg>
          Platform <strong style={{ color: '#1a1a18' }}>{plat}</strong>
        </div>
        {isSelected ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '.66rem', color: G_DARK, fontWeight: 600 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: G, animation: 'pulse 2.5s infinite' }} />
            Selected
          </div>
        ) : (
          <div style={{ fontSize: '.63rem', color: '#bbb' }}>Tap to select</div>
        )}
      </div>
    </div>
  );
}

function RouteStrip({ srcId, destId }) {
  if (!srcId || !destId) return null;
  const min = Math.min(srcId, destId), max = Math.max(srcId, destId);
  const stops = STATIONS.filter(s => s.id >= min && s.id <= max);
  const ordered = srcId < destId ? stops : [...stops].reverse();
  return (
    <div style={{ overflowX: 'auto', padding: '2px 0 4px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', minWidth: 'max-content' }}>
        {ordered.map((s, i) => (
          <React.Fragment key={s.id}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 56 }}>
              <div style={{
                width: s.id === srcId || s.id === destId ? 10 : 7,
                height: s.id === srcId || s.id === destId ? 10 : 7,
                borderRadius: '50%', flexShrink: 0,
                background: s.id === srcId ? '#1a1a18' : s.id === destId ? G : '#ddd',
                border: `2px solid ${s.id === srcId ? '#1a1a18' : s.id === destId ? G : '#ccc'}`,
              }} />
              <div style={{
                fontSize: '.54rem', textAlign: 'center', marginTop: 3, maxWidth: 52,
                color: s.id === srcId ? '#1a1a18' : s.id === destId ? G_DARK : '#bbb',
                fontWeight: (s.id === srcId || s.id === destId) ? 700 : 400, lineHeight: 1.2,
              }}>{s.name}</div>
            </div>
            {i < ordered.length - 1 && (
              <div style={{ height: 1.5, flex: 1, minWidth: 12, background: G, opacity: .28, marginTop: 4, flexShrink: 0 }} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/* ── Empty state ────────────────────────────────────────── */
function EmptyState({ onNavigate }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: '#fff', padding: '0 32px', textAlign: 'center',
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: '50%', background: G_BG, border: `1.5px solid ${G_BOR}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18,
      }}>
        <TrainLineIcon type="Fast" />
      </div>
      <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1.3rem', color: '#1a1a18', marginBottom: 10 }}>
        No Route Selected
      </h2>
      <p style={{ color: '#9a9a94', fontSize: '.86rem', maxWidth: 280, lineHeight: 1.6, marginBottom: 22 }}>
        Please detect your location and choose a destination first.
      </p>
      <button
        onClick={() => onNavigate('location')}
        style={{
          padding: '12px 28px', borderRadius: 50, border: 'none',
          background: `linear-gradient(135deg,${G},#5a9a38)`, color: '#fff',
          fontWeight: 700, fontSize: '.88rem', cursor: 'pointer',
          fontFamily: 'Inter, sans-serif', boxShadow: '0 4px 18px rgba(107,175,69,.3)',
        }}
      >← Detect Location First</button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════ */
export default function TrainsPage({ appState, setAppState, onNavigate, speak }) {
  const isMobile = useIsMobile();
  const { nearestStation: src, destStation: dest, userLat, userLng } = appState;
  const [trains,        setTrains]        = useState([]);
  const [selectedTrain, setSelectedTrain] = useState(appState.selectedTrain || null);
  const [loading,       setLoading]       = useState(false);
  const [dataSource,    setDataSource]    = useState('local');
  const [walkMins,      setWalkMins]      = useState(0);

  const goingSouth = src && dest ? src.id < dest.id : true;

  // ── Compute walk time to station ─────────────────────────
  useEffect(() => {
    if (src && userLat && userLng) {
      const dist = haversine(userLat, userLng, src.lat, src.lng);
      setWalkMins(walkTime(dist));
    }
  }, [src?.id, userLat, userLng]);

  // ── Load trains with smart timing ────────────────────────
  useEffect(() => {
    if (!src || !dest) return;
    setLoading(true);

    fetchNextTrains(src, dest, 3).then(({ source, trains: found }) => {
      // Filter trains that can be reached after walking
      // If walk time > 0, offset the "now" by walkMins so we only show
      // trains the user can actually catch
      let displayTrains = found;
      if (walkMins > 0 && found.length > 0) {
        // Try to show trains that depart ≥ walkMins from now
        const catchable = found.filter(t => {
          const dep = t.departureTime || t.departure || t.nextTime || '';
          if (!dep || dep === '—') return true;
          // Parse departure
          const [dh, dm] = dep.split(':').map(Number);
          const depMins  = dh * 60 + dm;
          const now      = new Date();
          const nowMins  = now.getHours() * 60 + now.getMinutes();
          const adjusted = nowMins + walkMins + 2; // 2 min buffer
          return depMins >= adjusted || depMins < 60; // wrap midnight
        });
        if (catchable.length >= 2) displayTrains = catchable.slice(0, 3);
      }

      setTrains(displayTrains);
      setDataSource(source);
      setLoading(false);

      if (!selectedTrain && displayTrains.length > 0) {
        setSelectedTrain(displayTrains[0]);
        setAppState(s => ({ ...s, selectedTrain: displayTrains[0] }));
      }
      if (displayTrains.length > 0) {
        const f   = displayTrains[0];
        const nm  = f.trainName || f.name || 'Local Train';
        const tm  = f.departureTime || f.departure || f.nextTime || '';
        const plat = f.platform || f.platform_south || 1;
        speak && speak(`${displayTrains.length} trains found. Next is ${nm} at ${tm}, Platform ${plat}.`);
      }
    });
  }, [src?.id, dest?.id, walkMins]);

  const handleSelect = (train) => {
    setSelectedTrain(train);
    setAppState(s => ({ ...s, selectedTrain: train }));
    const nm   = train.trainName || train.name || 'Train';
    const tm   = train.departureTime || train.departure || train.nextTime || '';
    const plat = train.platform || train.platform_south || 1;
    speak && speak(`${nm}. Departs at ${tm}. Board from Platform ${plat}.`);
  };

  const handleContinue = () => {
    if (!selectedTrain) { speak && speak('Please select a train first.'); return; }
    onNavigate('lastmile');
    speak && speak('Preparing last mile guidance.');
  };

  if (!src || !dest) return <EmptyState onNavigate={onNavigate} />;

  return (
    <div style={{
      display: isMobile ? 'flex' : 'grid', flexDirection: 'column', gridTemplateColumns: isMobile ? undefined : '45% 55%',
      minHeight: '100vh',
      background: 'linear-gradient(145deg,#f4f7f0 0%,#edf4e8 35%,#f8fbf6 70%,#fff 100%)',
    }}>

      {/* ══ LEFT ══════════════════════════════════════════ */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        padding: '80px 36px 48px 48px',
        borderRight: '1px solid rgba(107,175,69,.1)',
        overflowY: 'auto',
      }}>

        {/* Header */}
        <div style={{ marginBottom: 20, animation: 'fadeUp .5s ease-out both' }}>
          <h1 style={{
            fontFamily: 'Playfair Display, serif', fontWeight: 900,
            fontSize: '1.7rem', color: '#1a1a18', marginBottom: 6,
          }}>Train Schedule</h1>
          <p style={{ color: '#8a8a84', fontSize: '.84rem' }}>
            Next available trains — Western Line
          </p>
        </div>

        {/* Journey card */}
        <div style={{
          background: 'rgba(255,255,255,.82)', backdropFilter: 'blur(10px)',
          border: `1px solid ${G_BOR}`, borderRadius: 14, padding: '14px 18px', marginBottom: 16,
          animation: 'fadeUp .5s ease-out .08s both',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '.56rem', color: '#bbb', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 3 }}>From</div>
              <div style={{ fontWeight: 800, fontSize: '.95rem', color: '#1a1a18' }}>{src.name}</div>
            </div>
            <div style={{
              width: 26, height: 26, borderRadius: '50%', background: G_BG,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: G_DARK, fontSize: '.85rem', fontWeight: 700, flexShrink: 0,
            }}>→</div>
            <div style={{ flex: 1, textAlign: 'right' }}>
              <div style={{ fontSize: '.56rem', color: '#bbb', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 3 }}>To</div>
              <div style={{ fontWeight: 800, fontSize: '.95rem', color: '#1a1a18' }}>{dest.name}</div>
            </div>
          </div>

          {/* Direction pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: 'rgba(0,0,0,.04)', border: '1px solid rgba(0,0,0,.07)',
            padding: '3px 10px', borderRadius: 20, marginBottom: 12,
            fontSize: '.66rem', color: '#6a6a64', fontWeight: 600,
          }}>
            {goingSouth ? '↓ Southbound — towards Borivali' : '↑ Northbound — towards Virar'}
          </div>

          <RouteStrip srcId={src.id} destId={dest.id} />
        </div>

        {/* Train cards — label */}
        <div style={{ fontSize: '.57rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#bbb', marginBottom: 12, animation: 'fadeUp .5s ease-out .18s both' }}>
          Available Trains
        </div>

        {/* 3 cards — stacked vertically, each glass card */}
        {loading ? (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(255,255,255,.7)', backdropFilter: 'blur(8px)',
            borderRadius: 14, padding: '28px 20px',
          }}>
            <div style={{
              width: 18, height: 18, borderRadius: '50%',
              border: `2px solid ${G_BOR}`, borderTopColor: G,
              animation: 'spin .7s linear infinite',
            }} />
            <span style={{ color: '#9a9a94', fontSize: '.84rem' }}>Loading trains…</span>
          </div>
        ) : trains.length === 0 ? (
          <div style={{
            background: 'rgba(255,255,255,.7)', border: '1px solid rgba(0,0,0,.07)',
            borderRadius: 14, padding: '24px', textAlign: 'center',
            color: '#9a9a94', fontSize: '.84rem',
          }}>No trains found for this route.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
            {trains.map((t, i) => (
              <div key={t.trainNumber || t.id || i} style={{ animation: `fadeUp .5s ease-out ${0.08 * i + 0.22}s both` }}>
                <GlassTrainCard
                  train={t} index={i}
                  isSelected={
                    selectedTrain?.trainNumber === t.trainNumber ||
                    selectedTrain?.id === t.id ||
                    selectedTrain?.id === t.trainNumber
                  }
                  onSelect={handleSelect}
                />
              </div>
            ))}
          </div>
        )}

        {/* Selected summary + CTA */}
        {selectedTrain && (
          <div style={{ marginTop: 16, animation: 'fadeUp .4s ease-out both' }}>
            <div style={{
              background: G_BG, border: `1px solid ${G_BOR}`,
              borderRadius: 10, padding: '9px 14px', marginBottom: 12,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: G, animation: 'pulse 2.5s infinite' }} />
              <span style={{ fontSize: '.77rem', color: G_DARK, fontWeight: 600 }}>
                {selectedTrain.trainName || selectedTrain.name} selected
              </span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => onNavigate('dest')}
                style={{
                  flex: 1, padding: '13px 0', borderRadius: 12,
                  background: 'rgba(255,255,255,.85)', border: '1.5px solid rgba(0,0,0,.1)',
                  cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  fontWeight: 600, fontSize: '.84rem', color: '#6a6a64', transition: 'all .2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.98)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,.85)'}
              >← Change Route</button>
              <button
                onClick={handleContinue}
                style={{
                  flex: 2, padding: '13px 0', borderRadius: 12,
                  background: `linear-gradient(135deg,${G},#5a9a38)`,
                  border: 'none', cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif', fontWeight: 700,
                  fontSize: '.88rem', color: '#fff',
                  boxShadow: '0 4px 18px rgba(107,175,69,.28)',
                  transition: 'all .22s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 22px rgba(107,175,69,.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(107,175,69,.28)'; }}
              >Continue to Last Mile →</button>
            </div>
          </div>
        )}
      </div>

      {/* ══ RIGHT — animated train map ════════════════════ */}
      <div style={{ position: 'relative', overflow: 'hidden', minHeight: isMobile ? '50vh' : '100vh' }}>
        <TrainMapPanel srcStation={src} destStation={dest} selectedTrain={selectedTrain} style={{ position: 'absolute', inset: 0 }} />

        {/* Floating selected train overlay */}
        {selectedTrain && (
          <div style={{
            position: 'absolute', top: 48, right: 48, zIndex: 900,
            background: 'rgba(255,255,255,.97)', backdropFilter: 'blur(12px)',
            border: `1px solid ${G_BOR}`, borderRadius: 14, padding: '14px 18px',
            boxShadow: '0 4px 24px rgba(0,0,0,.1)',
            animation: 'fadeUp .4s ease-out both',
          }}>
            <div style={{ fontSize: '.56px', color: '#bbb', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 5, fontSize: '.56rem' }}>Selected Train</div>
            <div style={{ fontWeight: 800, fontSize: '.92rem', color: '#1a1a18', marginBottom: 8 }}>
              {selectedTrain.trainName || selectedTrain.name}
            </div>
            <div style={{ display: 'flex', gap: 14 }}>
              <div>
                <div style={{ fontSize: '.55rem', color: '#bbb', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>Departs</div>
                <div style={{ fontWeight: 700, fontSize: '.86rem', color: G_DARK }}>
                  {selectedTrain.departureTime || selectedTrain.departure || selectedTrain.nextTime || '—'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '.55rem', color: '#bbb', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>Platform</div>
                <div style={{ fontWeight: 700, fontSize: '.86rem', color: '#1a1a18' }}>
                  {selectedTrain.platform || `PF ${selectedTrain.platform_south || 1}`}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
