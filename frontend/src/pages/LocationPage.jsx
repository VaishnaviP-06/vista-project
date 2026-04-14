// src/pages/LocationPage.jsx
// Redesigned: two-column layout matching Home page design language
import React, { useState } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';
import LocationMap from '../components/LocationMap';
import { Btn } from '../components/UI';
import {
  getNearestStation, getNearestBusStop,
  distanceText, walkTime, haversine,
} from '../utils/helpers';

/* ── Design tokens (matches HomePage) ──────────────────── */
const G      = '#6BAF45';
const G_DARK = '#4a8a2a';
const G_BG   = 'rgba(107,175,69,.07)';
const G_BOR  = 'rgba(107,175,69,.22)';

/* ── Small reusable pieces ──────────────────────────────── */

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: '.6rem', fontWeight: 700, letterSpacing: '2px',
      textTransform: 'uppercase', color: '#bbb', marginBottom: 10,
    }}>{children}</div>
  );
}

function InfoCard({ icon, label, value, sub, highlight }) {
  return (
    <div style={{
      background: '#fff',
      border: `1px solid ${highlight ? G_BOR : 'rgba(0,0,0,.07)'}`,
      borderRadius: 12, padding: '14px 16px',
      display: 'flex', gap: 14, alignItems: 'flex-start',
      transition: 'box-shadow .2s',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: highlight ? G_BG : '#f6f6f4',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.1rem', flexShrink: 0,
      }}>{icon}</div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: '.65rem', color: '#bbb', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 3 }}>
          {label}
        </div>
        <div style={{
          fontWeight: 700, fontSize: '.88rem', color: highlight ? G_DARK : '#1a1a18',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{value}</div>
        {sub && <div style={{ fontSize: '.72rem', color: '#9a9a94', marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

function RouteStep({ number, icon, label, detail, isLast }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      {/* Timeline column */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: G_BG, border: `1.5px solid ${G_BOR}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '.75rem', fontWeight: 700, color: G_DARK,
        }}>{number}</div>
        {!isLast && (
          <div style={{
            width: 1.5, flex: 1, minHeight: 22,
            background: `linear-gradient(${G_BOR}, transparent)`,
            margin: '4px 0',
          }} />
        )}
      </div>
      {/* Content */}
      <div style={{ paddingBottom: isLast ? 0 : 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 2 }}>
          <span style={{ fontSize: '1rem' }}>{icon}</span>
          <span style={{ fontWeight: 600, fontSize: '.88rem', color: '#1a1a18' }}>{label}</span>
        </div>
        <div style={{ fontSize: '.76rem', color: '#9a9a94' }}>{detail}</div>
      </div>
    </div>
  );
}

function VoiceCommand({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: '#fff',
        border: '1px solid rgba(0,0,0,.08)',
        borderRadius: 20, padding: '7px 14px',
        fontSize: '.76rem', color: '#4a4a48',
        fontFamily: 'Inter, sans-serif',
        cursor: 'pointer', transition: 'all .2s',
        display: 'flex', alignItems: 'center', gap: 6,
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = G_BOR; e.currentTarget.style.color = G_DARK; e.currentTarget.style.background = G_BG; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,.08)'; e.currentTarget.style.color = '#4a4a48'; e.currentTarget.style.background = '#fff'; }}
    >
      <span style={{ fontSize: '.8rem', opacity: .7 }}>▶</span>
      "{text}"
    </button>
  );
}

function StatusBadge({ detected, detecting }) {
  const label  = detecting ? 'Detecting…' : detected ? 'Location Detected' : 'Location Not Detected';
  const color  = detecting ? '#e8a000'    : detected ? G                   : '#9a9a94';
  const bg     = detecting ? 'rgba(232,160,0,.09)' : detected ? G_BG : 'rgba(0,0,0,.04)';
  const border = detecting ? 'rgba(232,160,0,.3)'  : detected ? G_BOR : 'rgba(0,0,0,.1)';

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 7,
      background: bg, border: `1px solid ${border}`,
      borderRadius: 20, padding: '5px 13px',
      fontSize: '.7rem', fontWeight: 600, color, letterSpacing: '.5px',
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: color, display: 'inline-block',
        animation: detecting || detected ? 'pulse 2s ease-in-out infinite' : 'none',
      }} />
      {label}
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────── */
export default function LocationPage({ appState, setAppState, onNavigate, speak, startListening, isListening }) {
  const isMobile = useIsMobile();
  const [detecting, setDetecting] = useState(false);
  const [detected,  setDetected]  = useState(!!appState.nearestStation);

  /* ── Geolocation handler ─────────────────────────── */
  const applyLocation = (lat, lng, address) => {
    const ns  = getNearestStation(lat, lng);
    const nbs = getNearestBusStop(lat, lng);
    setAppState(s => ({ ...s, userLat: lat, userLng: lng, userAddress: address, nearestStation: ns, nearestBusStop: nbs }));
    setDetected(true);
    setDetecting(false);
    const d = distanceText(haversine(lat, lng, ns.lat, ns.lng));
    speak(`Location detected. You are near ${ns.name} station, about ${d} away.`);
  };

  const detectLocation = () => {
    if (!navigator.geolocation) { useDemo(); return; }
    setDetecting(true);
    speak('Detecting your current location. Please wait.');
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude: lat, longitude: lng } = pos.coords;
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`, {
          headers: { 'User-Agent': 'VISTA-App/1.0' },
        })
          .then(r => r.json())
          .then(d => {
            const address = d.display_name
              ? d.display_name.split(',').slice(0, 3).join(', ')
              : `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            applyLocation(lat, lng, address);
          })
          .catch(() => applyLocation(lat, lng, `${lat.toFixed(4)}, ${lng.toFixed(4)}`));
      },
      () => { setDetecting(false); useDemo(); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const useDemo = () => {
    speak('GPS unavailable. Using demo location near Borivali station.');
    applyLocation(19.2307, 72.8567, 'Borivali West, Mumbai, Maharashtra');
  };

  /* ── Derived values ──────────────────────────────── */
  const { nearestStation: ns, nearestBusStop: bs, userAddress, userLat, userLng } = appState;
  const stDist = ns && userLat ? haversine(userLat, userLng, ns.lat, ns.lng) : null;
  const bsDist = bs && userLat ? haversine(userLat, userLng, bs.lat, bs.lng) : null;

  const suggestedMode =
    !stDist    ? null
    : stDist > 1500            ? { icon: '🛺', label: 'Auto-Rickshaw',  note: 'Too far to walk comfortably' }
    : bsDist && bsDist < 400   ? { icon: '🚌', label: 'Take the Bus',   note: `Bus stop is ${distanceText(bsDist)} away` }
    :                            { icon: '🚶', label: 'Walk to Station', note: `Only ${distanceText(stDist)} away` };

  const routeSteps = ns ? [
    { icon: suggestedMode?.icon || '🚶', label: suggestedMode?.label || 'Walk', detail: suggestedMode?.note || `${distanceText(stDist)} to station` },
    { icon: '🚉', label: `Board at ${ns.name}`,  detail: `Western Line platform · Towards Borivali` },
    { icon: '🎯', label: 'Reach Destination',    detail: 'Tap Continue to set your stop' },
  ] : [];

  const voiceCommands = [
    { text: 'Take me to Borivali',   action: () => speak('Navigating to Borivali station.') },
    { text: 'Find nearest station',  action: () => ns ? speak(`Nearest station is ${ns.name}, about ${distanceText(stDist)} away.`) : speak('Please detect your location first.') },
    { text: 'Best route to Virar',   action: () => speak('Finding best route to Virar station.') },
  ];

  return (
    <div style={{ display: isMobile ? 'flex' : 'grid', flexDirection: 'column', gridTemplateColumns: isMobile ? undefined : '45% 55%', minHeight: '100vh', background: '#fff' }}>

      {/* ══ LEFT PANEL ═══════════════════════════════════════════ */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        padding: isMobile ? '70px 16px 24px' : '80px 44px 48px 52px',
        borderRight: '1px solid rgba(0,0,0,.06)',
        overflowY: 'auto',
      }}>

        {/* Page header */}
        <div style={{
          marginBottom: 28,
          animation: 'fadeUp .55s ease-out both',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 10,
          }}>
            <h1 style={{
              fontFamily: 'Playfair Display, serif', fontWeight: 900,
              fontSize: '1.75rem', color: '#1a1a18', letterSpacing: 1,
              lineHeight: 1.15,
            }}>Your Location</h1>
            <StatusBadge detected={detected} detecting={detecting} />
          </div>
          <p style={{ color: '#9a9a94', fontSize: '.86rem', lineHeight: 1.6, maxWidth: 340 }}>
            Detect where you are to find the nearest Western Line station and plan your journey.
          </p>
        </div>

        {/* ── DETECT BUTTON ─── */}
        <div style={{ marginBottom: 24, animation: 'fadeUp .55s ease-out .08s both' }}>
          {!detected ? (
            <button
              onClick={detectLocation}
              disabled={detecting}
              style={{
                width: '100%', padding: '16px 24px',
                background: detecting ? '#f0f0ee' : `linear-gradient(135deg, ${G}, #5a9a38)`,
                border: detecting ? `1px solid ${G_BOR}` : 'none',
                borderRadius: 14, cursor: detecting ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                transition: 'all .25s', opacity: detecting ? 0.8 : 1,
                boxShadow: detecting ? 'none' : '0 6px 24px rgba(107,175,69,.3)',
              }}
              onMouseEnter={e => { if (!detecting) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(107,175,69,.35)'; }}}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = detecting ? 'none' : '0 6px 24px rgba(107,175,69,.3)'; }}
            >
              {detecting ? (
                <>
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%',
                    border: `2px solid ${G_BOR}`, borderTopColor: G,
                    animation: 'spin 0.8s linear infinite',
                    flexShrink: 0,
                  }} />
                  <span style={{ fontWeight: 600, fontSize: '.92rem', color: G_DARK }}>Detecting location…</span>
                </>
              ) : (
                <>
                  <span style={{ fontWeight: 700, fontSize: '.92rem', color: '#fff', letterSpacing: '.3px' }}>
                    Detect My Location
                  </span>
                </>
              )}
            </button>
          ) : (
            <div style={{
              display: 'flex', gap: 10,
            }}>
              <button
                onClick={detectLocation}
                style={{
                  flex: 1, padding: '12px 20px',
                  background: '#fff', border: `1.5px solid ${G_BOR}`,
                  borderRadius: 12, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  color: G_DARK, fontWeight: 600, fontSize: '.85rem',
                  fontFamily: 'Inter, sans-serif', transition: 'all .2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = G_BG; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
              >
                🔄 Re-Detect
              </button>
              <button
                onClick={useDemo}
                style={{
                  flex: 1, padding: '12px 20px',
                  background: '#fff', border: '1.5px solid rgba(0,0,0,.1)',
                  borderRadius: 12, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  color: '#6a6a64', fontWeight: 600, fontSize: '.85rem',
                  fontFamily: 'Inter, sans-serif', transition: 'all .2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f7f7f5'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
              >
                🗺️ Use Demo
              </button>
            </div>
          )}
        </div>

        {/* ── LOCATION INFO CARDS ─── */}
        <div style={{ marginBottom: 24, animation: 'fadeUp .55s ease-out .15s both' }}>
          <SectionLabel>Location Details</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <InfoCard
              icon="📍" label="Current Address"
              value={userAddress || 'Not detected yet'}
              highlight={!!userAddress}
            />
            <InfoCard
              icon="🚉" label="Nearest Station"
              value={ns ? ns.name : '—'}
              sub={ns ? `${distanceText(stDist)} · ~${walkTime(stDist)} min walk` : 'Detect location to find stations'}
              highlight={!!ns}
            />
            <InfoCard
              icon="🚌" label="Nearest Bus Stop"
              value={bs ? bs.name : '—'}
              sub={bs ? `${distanceText(bsDist)} · Buses: ${bs.buses.slice(0,3).join(', ')}` : '—'}
              highlight={!!bs}
            />
            {suggestedMode && (
              <InfoCard
                icon={suggestedMode.icon} label="Suggested Transport"
                value={suggestedMode.label}
                sub={suggestedMode.note}
                highlight
              />
            )}
          </div>
        </div>

        {/* ── SUGGESTED ROUTE STEPS ─── */}
        {detected && routeSteps.length > 0 && (
          <div style={{ marginBottom: 24, animation: 'fadeUp .55s ease-out .22s both' }}>
            <SectionLabel>Suggested Route</SectionLabel>
            <div style={{
              background: '#fff', border: '1px solid rgba(0,0,0,.07)',
              borderRadius: 12, padding: '16px 18px',
            }}>
              {routeSteps.map((step, i) => (
                <RouteStep
                  key={i}
                  number={i + 1}
                  icon={step.icon}
                  label={step.label}
                  detail={step.detail}
                  isLast={i === routeSteps.length - 1}
                />
              ))}
            </div>
          </div>
        )}

        
        {/* ── CONTINUE CTA ─── */}
        {detected && (
          <div style={{ animation: 'fadeUp .5s ease-out .38s both' }}>
            <button
              onClick={() => { onNavigate('dest'); speak('Now tell me your destination.'); }}
              style={{
                width: '100%', padding: '15px 24px',
                background: `linear-gradient(135deg,${G},#5a9a38)`,
                border: 'none', borderRadius: 14, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                fontFamily: 'Inter, sans-serif', fontWeight: 700,
                fontSize: '.92rem', color: '#fff', letterSpacing: '.3px',
                boxShadow: '0 6px 24px rgba(107,175,69,.3)',
                transition: 'all .25s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(107,175,69,.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(107,175,69,.3)'; }}
            >
              Continue to Destination →
            </button>
          </div>
        )}
      </div>

      {/* ══ RIGHT PANEL — MAP ════════════════════════════════════ */}
      <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
        <LocationMap
          userLat={userLat}
          userLng={userLng}
          nearestStation={ns}
        />

        {/* Overlay card: station info (shows after detection) */}
        {detected && ns && (
          <div style={{
            position: 'absolute', bottom: 48, left: 32, zIndex: 900,
            background: 'rgba(255,255,255,.97)',
            border: '1px solid rgba(0,0,0,.08)',
            borderRadius: 14, padding: '14px 18px',
            boxShadow: '0 4px 24px rgba(0,0,0,.1)',
            minWidth: 200,
            animation: 'fadeUp .45s ease-out both',
          }}>
            <div style={{ fontSize: '.6rem', color: '#bbb', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>
              Nearest Station
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#1a1a18', marginBottom: 4 }}>
              {ns.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%', background: G,
                animation: 'pulse 2.5s ease-in-out infinite',
              }} />
              <span style={{ fontSize: '.74rem', color: '#7a7a74' }}>
                {distanceText(stDist)} · ~{walkTime(stDist)} min walk
              </span>
            </div>
            {ns.exits && ns.exits[0] && (
              <div style={{
                marginTop: 10, paddingTop: 10,
                borderTop: '1px solid rgba(0,0,0,.07)',
                fontSize: '.72rem', color: '#9a9a94', lineHeight: 1.5,
              }}>
                <span style={{ fontWeight: 600, color: '#5a5a54' }}>{ns.exits[0].gate}: </span>
                {ns.exits[0].direction.split('→')[0].trim()}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Global keyframes ── */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 860px) {
          /* Stack vertically on tablet/mobile */
          [data-location-grid] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
