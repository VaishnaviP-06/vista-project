// src/pages/LastMilePage.jsx
import React, { useEffect, useState } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';
import {
  getLastMileBusStop, getLastMileSuggestion, getAllLastMileOptions,
  haversine, distanceText, walkTime, getBestExit, getBearing, bearingToCompass,
} from '../utils/helpers';
import walkImg from '../assets/icons/walk.png';
import autoImg from '../assets/icons/auto.png';
import busImg from '../assets/icons/bus.png';
import cabImg from '../assets/icons/cab.png';
import bikeImg from '../assets/icons/bike.png';


const G      = '#6BAF45';
const G_DARK = '#4a8a2a';
const G_BG   = 'rgba(107,175,69,.08)';
const G_BOR  = 'rgba(107,175,69,.22)';

// ── Shared glass card style
const CARD = {
  background:          'rgba(255,255,255,.72)',
  backdropFilter:      'blur(18px)',
  WebkitBackdropFilter:'blur(18px)',
  border:              '1px solid rgba(255,255,255,.65)',
  boxShadow:           '0 2px 18px rgba(0,0,0,.06), 0 1px 4px rgba(0,0,0,.04)',
  borderRadius:        16,
};

// ── Fare estimate
function estimateFare(mode, distMeters) {
  // Cap at 50 km — anything beyond is a geocoding error, not a real distance
  const km = Math.min(distMeters / 1000, 50);
  if (!distMeters || distMeters < 50) {
    const defaults = { walk:'Free', auto:'₹30–₹60', bus:'₹5–₹15', cab:'₹80–₹150', bike:'₹25–₹50' };
    return defaults[mode] || '—';
  }
  switch (mode) {
    case 'walk':  return 'Free';
    case 'auto': { const b = Math.max(30, Math.round(km * 15)); return `₹${b}–₹${Math.round(b * 1.5)}`; }
    case 'bus':   return km < 5 ? '₹5–₹10' : '₹10–₹20';
    case 'cab':  { const b = Math.max(80, Math.round(km * 18 + 40)); return `₹${b}–₹${Math.round(b * 1.35)}`; }
    case 'bike': { const b = Math.max(25, Math.round(km * 10 + 15)); return `₹${b}–₹${Math.round(b * 1.4)}`; }
    default: return '—';
  }
}

/* ── Icons ─────────────────────────────────────────────── */


const TRANSPORT_META = {
  walk: {
    label: 'Walk',
    color: '#374151',
    bg: 'rgba(55,65,81,.06)',
    border: 'rgba(55,65,81,.12)',
    image: walkImg,
  },
  auto: {
    label: 'Auto-Rickshaw',
    color: G_DARK,
    bg: G_BG,
    border: G_BOR,
    image: autoImg,
  },
  bus: {
    label: 'Bus',
    color: '#1d4ed8',
    bg: 'rgba(29,78,216,.05)',
    border: 'rgba(29,78,216,.15)',
    image: busImg,
  },
  cab: {
    label: 'Cab / Taxi',
    color: '#b45309',
    bg: 'rgba(180,83,9,.05)',
    border: 'rgba(180,83,9,.14)',
    image: cabImg,
  },
  bike: {
    label: 'Bike',
    color: '#c2410c',
    bg: 'rgba(194,65,12,.05)',
    border: 'rgba(194,65,12,.14)',
    image: bikeImg,
  },
};

const RIDE_LINKS = {
  uber:  { label:'Uber',  bg:'#111',    fg:'#fff', url:'https://uber.com/app' },
  ola:   { label:'Ola',   bg:'#16a34a', fg:'#fff', url:'https://olacabs.com'  },
  rapido:{ label:'Rapido',bg:'#ea580c', fg:'#fff', url:'https://rapido.bike'  },
};

function RideBtn({ p }) {
  const c = RIDE_LINKS[p];
  return (
    <a href={c.url} target="_blank" rel="noreferrer" style={{
      padding:'3px 9px', borderRadius:7, fontSize:'.6rem', fontWeight:700,
      background:c.bg, color:c.fg, textDecoration:'none',
      display:'inline-block', letterSpacing:'.3px', transition:'opacity .18s',
    }}
      onMouseEnter={e=>e.currentTarget.style.opacity='.75'}
      onMouseLeave={e=>e.currentTarget.style.opacity='1'}
    >{c.label}↗</a>
  );
}

/* ── Transport card ─────────────────────────────────────── */
function TransportCard({ mode, detail, fare, recommended, isSelected, onSelect, distMeters }) {
  const meta       = TRANSPORT_META[mode] || TRANSPORT_META.auto;
  const actualFare = fare || estimateFare(mode, distMeters);
  const rides      = mode==='cab'?['uber','ola']:mode==='auto'?['ola','rapido']:mode==='bike'?['rapido']:[];

  return (
    <div
      onClick={() => onSelect(mode)}
      style={{
        ...CARD,
        borderRadius:14, padding:'12px 14px', cursor:'pointer', marginBottom:8,
        border: isSelected ? `1.5px solid ${meta.color}44` : '1px solid rgba(255,255,255,.65)',
        boxShadow: isSelected
          ? `0 4px 20px ${meta.border}, 0 1px 6px rgba(0,0,0,.05)`
          : '0 2px 14px rgba(0,0,0,.05)',
        transition:'all .22s cubic-bezier(.4,0,.2,1)',
        position:'relative', overflow:'hidden',
      }}
      onMouseEnter={e => {
        if (!isSelected) {
          e.currentTarget.style.transform='translateY(-2px)';
          e.currentTarget.style.boxShadow='0 6px 22px rgba(0,0,0,.08)';
          e.currentTarget.style.borderColor=`${meta.color}33`;
        }
      }}
      onMouseLeave={e => {
        if (!isSelected) {
          e.currentTarget.style.transform='none';
          e.currentTarget.style.boxShadow='0 2px 14px rgba(0,0,0,.05)';
          e.currentTarget.style.borderColor='rgba(255,255,255,.65)';
        }
      }}
    >
      {isSelected && (
        <div style={{
          position:'absolute', top:0, left:0, right:0, height:2,
          background:`linear-gradient(90deg,${meta.color}cc,transparent)`,
          borderRadius:'14px 14px 0 0',
        }} />
      )}
      {recommended && !isSelected && (
        <div style={{
          position:'absolute', top:9, right:10,
          background:`${meta.color}14`, color:meta.color,
          fontSize:'.5rem', fontWeight:700, padding:'2px 8px',
          borderRadius:20, letterSpacing:'.5px', border:`1px solid ${meta.color}28`,
        }}>BEST</div>
      )}

      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <div style={{
          width:42, height:42, borderRadius:11, flexShrink:0,
          background: isSelected ? meta.bg : 'rgba(248,248,246,.9)',
          border:`1px solid ${isSelected ? meta.border : 'rgba(0,0,0,.05)'}`,
          display:'flex', alignItems:'center', justifyContent:'center',
          transition:'all .22s',
        }}>
          <img
            src={meta.image}
            alt={meta.label}
            style={{
             width: 22,
             height: 22,
             objectFit: 'contain',
            }}
          />
        </div>

        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontWeight:700, fontSize:'.84rem', color:'#1a1a18', marginBottom:2 }}>{meta.label}</div>
          <div style={{ fontSize:'.68rem', color:'#9a9a94', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
            {detail || 'From station exit'}
          </div>
        </div>

        <div style={{ textAlign:'right', flexShrink:0 }}>
          <div style={{
            fontSize:'.76rem', fontWeight:800,
            color: isSelected ? meta.color : '#3a3a34',
            marginBottom: rides.length ? 5 : 0,
          }}>{actualFare}</div>
          {rides.length > 0 && (
            <div style={{ display:'flex', gap:4, justifyContent:'flex-end' }}>
              {rides.map(r => <RideBtn key={r} p={r} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Journey step ───────────────────────────────────────── */
function Step({ n, label, detail, isLast }) {
  return (
    <div style={{ display:'flex', gap:10 }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
        <div style={{
          width:22, height:22, borderRadius:'50%', background:G_BG, border:`1.5px solid ${G_BOR}`,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:'.62rem', fontWeight:700, color:G_DARK, flexShrink:0,
        }}>{n}</div>
        {!isLast && <div style={{ width:1.5, flex:1, minHeight:14, background:G_BOR, margin:'3px 0' }} />}
      </div>
      <div style={{ paddingBottom: isLast ? 0 : 12 }}>
        <div style={{ fontWeight:600, fontSize:'.8rem', color:'#1a1a18', marginBottom:2 }}>{label}</div>
        <div style={{ fontSize:'.68rem', color:'#9a9a94', lineHeight:1.5 }}>{detail}</div>
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize:'.55rem', fontWeight:700, letterSpacing:'2px',
      textTransform:'uppercase', color:'#bbb', marginBottom:12,
    }}>{children}</div>
  );
}

/* ════════════════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════════════════ */
export default function LastMilePage({ appState, setAppState, onNavigate, speak }) {
  const { destStation, nearestStation, nearestBusStop, selectedTrain, destPlaceName, destPlaceCoords } = appState;

  const isMobile = useIsMobile();
  const [selMode,    setSelMode]    = useState(null);
  const [busStop,    setBusStop]    = useState(null);
  const [suggestion, setSuggestion] = useState(null);
  const [allOptions, setAllOptions] = useState([]);
  const [destDist,   setDestDist]   = useState(null);
  const [bestExit,   setBestExit]   = useState(null);
  const [compass,    setCompass]    = useState('');
  const [navSteps,   setNavSteps]   = useState([]);

  useEffect(() => {
    if (!destStation) return;
    const bs = getLastMileBusStop(destStation);
    setBusStop(bs);

    if (destPlaceCoords?.found) {
      let dist = haversine(destStation.lat, destStation.lng, destPlaceCoords.lat, destPlaceCoords.lng);
      if (dist < 50) dist = 350;
      if (dist > 30000) dist = 800; // geocoding returned wrong city — use neutral default
      setDestDist(dist);

      const sug      = getLastMileSuggestion(destStation.lat, destStation.lng, destPlaceCoords.lat, destPlaceCoords.lng, bs);
      const opts     = getAllLastMileOptions(destStation.lat, destStation.lng, destPlaceCoords.lat, destPlaceCoords.lng, bs);
      const withBike = [...opts, { mode:'bike', label:'Bike', detail:'Fast 2-wheeler ride', fare:estimateFare('bike',dist), recommended:false }];
      setSuggestion(sug);
      setAllOptions(withBike);
      setSelMode(sug.mode);
      setAppState(s => ({ ...s, lastMileMode:sug.mode }));

      const exit = getBestExit(destStation, destPlaceCoords.lat, destPlaceCoords.lng);
      const bear = getBearing(destStation.lat, destStation.lng, destPlaceCoords.lat, destPlaceCoords.lng);
      setBestExit(exit);
      setCompass(bearingToCompass(bear));

      const steps = [];
      if (exit) {
        steps.push(`Exit towards the ${exit.side} side of the station`);
        exit.direction.split('→').forEach(p => { const t=p.trim(); if(t) steps.push(t); });
      }
      steps.push(`Walk ${distanceText(dist)} heading ${bearingToCompass(bear)}`);
      if (destPlaceName) steps.push(`Arrive at ${destPlaceName}`);
      setNavSteps(steps);

      let msg = `Arrived at ${destStation.name} station. `;
      if (exit) msg += `Take the ${exit.side} exit. `;
      if (sug.mode==='walk')       msg += `Your destination is just a short walk away. `;
      else if (sug.mode==='auto')  msg += `Auto-rickshaw recommended. Estimated fare ${estimateFare('auto',dist)}. `;
      else if (sug.mode==='bus')   msg += `Take bus number ${bs?.buses?.[0]} from ${bs?.name}. `;
      else                         msg += `Book a cab. Estimated fare ${estimateFare('cab',dist)}. `;
      speak(msg);
    } else {
      speak(`Arrived at ${destStation.name}. Choose your transport.`);
    }
  }, [destStation?.id]);

  const handleSelect = mode => {
    setSelMode(mode);
    setAppState(s => ({ ...s, lastMileMode:mode }));
  };

  const fallback = [
    { mode:'walk', label:'Walk',          detail:'If nearby',           recommended:false },
    { mode:'auto', label:'Auto-Rickshaw', detail:'Quick ride',           recommended:true  },
    { mode:'bus',  label:'Bus',           detail:'Most economical',      recommended:false },
    { mode:'cab',  label:'Cab / Taxi',    detail:'Comfortable & direct', recommended:false },
    { mode:'bike', label:'Bike',          detail:'Fast 2-wheeler',       recommended:false },
  ];
  const displayOptions = allOptions.length > 0 ? allOptions : fallback;

  /* ── empty state ── */
  if (!destStation) return (
    <div style={{
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      minHeight:'100vh', padding:'0 24px', textAlign:'center',
      background:'linear-gradient(180deg,#f8f8f4 0%,#f3f6ee 100%)',
    }}>
      <p style={{ color:'#9a9a94', marginBottom:20, fontSize:'.9rem' }}>Complete your journey plan first.</p>
      <button
        onClick={() => onNavigate('home')}
        style={{
          padding:'12px 28px', borderRadius:50, border:'none', cursor:'pointer',
          background:`linear-gradient(135deg,${G},#5a9a38)`, color:'#fff',
          fontFamily:'Inter, sans-serif', fontWeight:700,
          boxShadow:'0 4px 16px rgba(107,175,69,.28)',
        }}
      >← Go Home</button>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', position:'relative', overflow:'hidden' }}>

      {/* ── Smooth vertical background gradient ── */}
      <div style={{
        position:'fixed', inset:0, zIndex:0,
        background:'linear-gradient(180deg, #f8f8f4 0%, #f5f7f1 45%, #f3f6ee 100%)',
      }} />

      {/* ── Radial glow — bottom-right ── */}
      <div style={{
        position:'fixed', zIndex:0, pointerEvents:'none',
        bottom:'-140px', right:'-80px',
        width:'560px', height:'560px', borderRadius:'50%',
        background:'radial-gradient(circle, rgba(107,175,69,.12) 0%, rgba(107,175,69,.04) 50%, transparent 72%)',
      }} />

      {/* ── Faint secondary glow — top-right ── */}
      <div style={{
        position:'fixed', zIndex:0, pointerEvents:'none',
        top:'-60px', right:'18%',
        width:'380px', height:'380px', borderRadius:'50%',
        background:'radial-gradient(circle, rgba(107,175,69,.06) 0%, transparent 68%)',
      }} />

      {/* ── Page content ── */}
      <div style={{ position:'relative', zIndex:1, paddingTop:72 }}>

        {/* Sub-header */}
        <div style={{
          background:'rgba(255,255,255,.78)',
          backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)',
          borderBottom:'1px solid rgba(0,0,0,.055)',
          padding:'13px 48px 13px 52px',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          position:'sticky', top:72, zIndex:100,
        }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:2 }}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="5" r="2.5" stroke={G} strokeWidth="1.5" fill="none"/>
                <path d="M8 7.5 L8 13" stroke={G} strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M5 15 Q8 13 11 15" stroke={G} strokeWidth="1.2" strokeLinecap="round" fill="none"/>
              </svg>
              <h1 style={{
                fontFamily:'Playfair Display, serif', fontWeight:900,
                fontSize:'1.4rem', color:'#1a1a18', letterSpacing:.3,
              }}>Last Mile Guide</h1>
            </div>
            <p style={{ color:'#9a9a94', fontSize:'.76rem' }}>
              Arrived at{' '}
              <strong style={{ color:G_DARK, fontWeight:700 }}>{destStation.name}</strong>
              {destDist && destDist > 50 && (
                <span style={{ color:'#bbb' }}> · {distanceText(destDist)} to {destPlaceName || 'destination'}</span>
              )}
            </p>
          </div>

          <div style={{
            display:'flex', alignItems:'center', gap:6,
            background:'rgba(107,175,69,.09)', border:`1px solid ${G_BOR}`,
            borderRadius:20, padding:'5px 14px',
          }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:G, animation:'pulse 2.5s ease-in-out infinite' }} />
            <span style={{ fontSize:'.67rem', fontWeight:700, color:G_DARK, letterSpacing:.4 }}>Arrived</span>
          </div>
        </div>

        {/* Two-column grid */}
       <div style={{
        display:'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        minHeight:'calc(100vh - 128px)'
        }}>
          {/* ── LEFT ── */}
          <div style={{
          padding: isMobile ? '20px' : '28px 30px 44px 52px',
          borderRight: isMobile ? 'none' : '1px solid rgba(107,175,69,.1)'
        }}>

            {/* Recommendation banner */}
            {suggestion && (
              <div style={{
                background:'rgba(107,175,69,.07)',
                border:'1px solid rgba(107,175,69,.18)',
                borderRadius:12, padding:'10px 14px', marginBottom:18,
                display:'flex', alignItems:'center', gap:9,
              }}>
                <div style={{ width:7, height:7, borderRadius:'50%', background:G, animation:'pulse 2.5s ease-in-out infinite', flexShrink:0 }} />
                <span style={{ fontSize:'.72rem' }}>
                  <span style={{ fontWeight:700, color:G_DARK }}>VISTA recommends: </span>
                  <span style={{ color:'#6a6a64' }}>
                    {TRANSPORT_META[suggestion.mode]?.label} · {estimateFare(suggestion.mode, destDist||0)}
                  </span>
                </span>
              </div>
            )}

            {/* Exit & Navigation */}
            <div style={{ ...CARD, padding:'18px 20px', marginBottom:14 }}>
              <SectionLabel>Exit & Navigation</SectionLabel>

              {bestExit && (
                <div style={{
                  display:'flex', alignItems:'center', gap:12, marginBottom:16,
                  background:'rgba(107,175,69,.06)', border:'1px solid rgba(107,175,69,.15)',
                  borderRadius:12, padding:'12px 14px',
                }}>
                  <div style={{
                    width:44, height:44, borderRadius:'50%', flexShrink:0,
                    background:`linear-gradient(135deg,${G},#5a9a38)`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:'1.3rem', fontWeight:900, color:'white',
                    boxShadow:'0 4px 14px rgba(107,175,69,.28)',
                  }}>
                    {bestExit.side==='West'?'←':bestExit.side==='East'?'→':bestExit.side==='North'?'↑':'↓'}
                  </div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:'.88rem', color:'#1a1a18', marginBottom:2 }}>
                      Exit towards the {bestExit.side} side
                    </div>
                    <div style={{ fontSize:'.7rem', color:'#9a9a94' }}>
                      {destStation.name} · Head {compass}
                    </div>
                  </div>
                </div>
              )}

              {navSteps.length > 0 && (
                <div>
                  {navSteps.map((step, i) => (
                    <div key={i} style={{ display:'flex', gap:10, marginBottom:i<navSteps.length-1?9:0 }}>
                      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
                        <div style={{
                          width:20, height:20, borderRadius:'50%',
                          background: i===0 ? G : G_BG,
                          border:`1.5px solid ${i===0 ? G : G_BOR}`,
                          display:'flex', alignItems:'center', justifyContent:'center',
                          fontSize:'.6rem', fontWeight:700,
                          color: i===0 ? '#fff' : G_DARK,
                        }}>{String.fromCharCode(65+i)}</div>
                        {i<navSteps.length-1 && <div style={{ width:1.5, height:14, background:G_BOR, margin:'3px 0' }} />}
                      </div>
                      <div style={{ paddingTop:1 }}>
                        <div style={{
                          fontSize:'.76rem', lineHeight:1.5,
                          color: i===0 ? '#1a1a18' : '#6a6a64',
                          fontWeight: i===0 ? 600 : 400,
                        }}>{step}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {bestExit?.landmarks && (
                <div style={{
                  marginTop:14, display:'flex', alignItems:'flex-start', gap:7,
                  padding:'8px 11px', borderRadius:9,
                  background:'rgba(107,175,69,.05)', border:'1px solid rgba(107,175,69,.13)',
                }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink:0, marginTop:1 }}>
                    <circle cx="6" cy="4" r="2.5" stroke={G_DARK} strokeWidth="1.3" fill="none"/>
                    <path d="M6 6.5 L6 11" stroke={G_DARK} strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                  <span style={{ fontSize:'.67rem', color:'#6a6a64', lineHeight:1.55 }}>
                    Nearby: {bestExit.landmarks}
                  </span>
                </div>
              )}
            </div>

            {isMobile && (
              <div style={{ marginBottom: 14 }}>
                <SectionLabel>Transport Options</SectionLabel>

                {displayOptions.map(opt => (
                  <TransportCard
                    key={opt.mode}
                    mode={opt.mode}
                    detail={opt.detail}
                    fare={opt.fare}
                    recommended={opt.recommended}
                    isSelected={selMode===opt.mode}
                    onSelect={handleSelect}
                    distMeters={destDist||0}
                  />
                ))}

                {busStop && (
                  <div style={{ ...CARD, borderRadius:12, padding:'14px 16px', marginTop:8 }}>
                    <SectionLabel>Nearest Bus Stop</SectionLabel>
                    <div style={{ fontWeight:700, fontSize:'.86rem', color:'#1a1a18', marginBottom:8 }}>
                      {busStop.name}
                    </div>
                    <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
                      {busStop.buses.map(b => (
                        <span key={b} style={{
                          padding:'3px 10px', borderRadius:20, fontSize:'.66rem', fontWeight:600,
                          background:'rgba(107,175,69,.07)', color:G_DARK, border:'1px solid rgba(107,175,69,.18)',
                        }}>{b}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}      
          
            {/* Journey summary */}
            <div style={{ ...CARD, padding:'16px 20px', marginBottom:14 }}>
              <SectionLabel>Journey Summary</SectionLabel>
              <Step n="1" label="First Mile"
                detail={nearestBusStop ? `${nearestBusStop.name} → Bus ${nearestBusStop.buses[0]} → ${nearestStation?.name}` : `To ${nearestStation?.name}`}
              />
              <Step n="2" label="Board Train"
                detail={selectedTrain ? `${selectedTrain.trainName||selectedTrain.name} · ${selectedTrain.departureTime||selectedTrain.nextTime||''} · Plat ${selectedTrain.platform||selectedTrain.platform_south||1}` : 'See Train Schedule'}
              />
              <Step n="3" label={`Exit at ${destStation.name}`}
                detail={bestExit ? `Take the ${bestExit.side} exit · ${bestExit.direction.split('→')[0].trim()}` : destStation.name}
              />
              <Step n="4" label={`Reach ${destPlaceName||'Destination'}`}
                detail={destDist && destDist > 50 ? `${distanceText(destDist)} · ${TRANSPORT_META[selMode||'auto']?.label}` : 'Select a transport option'}
                isLast
              />
            </div>

            {/* Buttons */}
            <div style={{ display:'flex', gap:10 }}>
              <button
                onClick={() => speak([
                  `Arrived at ${destStation.name} station.`,
                  bestExit ? `Take the ${bestExit.side} exit.` : '',
                  selMode==='walk' ? 'Your destination is a short walk from the exit.'
                  : selMode==='auto' ? `Take an auto-rickshaw. Estimated fare ${estimateFare('auto',destDist||0)}.`
                  : selMode==='cab' ? `Book a cab. Estimated fare ${estimateFare('cab',destDist||0)}.` : '',
                ].filter(Boolean).join(' '))}
                style={{
                  flex:1, padding:'11px 0', borderRadius:12, cursor:'pointer',
                  background:'rgba(107,175,69,.09)', border:'1px solid rgba(107,175,69,.2)',
                  fontFamily:'Inter, sans-serif', fontWeight:600, fontSize:'.82rem',
                  color:G_DARK, transition:'all .2s',
                }}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(107,175,69,.16)'}
                onMouseLeave={e=>e.currentTarget.style.background='rgba(107,175,69,.09)'}
              >Hear Summary</button>

              <button
                onClick={() => {
                  setAppState(s=>({...s,destStation:null,selectedTrain:null,lastMileMode:null,destPlaceName:null,destPlaceCoords:null}));
                  onNavigate('home');
                  speak('Starting a new journey.');
                }}
                style={{
                  flex:2, padding:'11px 0', borderRadius:12, cursor:'pointer', border:'none',
                  background:`linear-gradient(135deg,${G},#5a9a38)`, color:'#fff',
                  fontFamily:'Inter, sans-serif', fontWeight:700, fontSize:'.88rem',
                  boxShadow:'0 4px 16px rgba(107,175,69,.28)', transition:'all .22s',
                }}
                onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(107,175,69,.4)'; }}
                onMouseLeave={e=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 4px 16px rgba(107,175,69,.28)'; }}
              >Plan New Journey</button>
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div style={{
            padding:'28px 52px 44px 24px',
            display: isMobile ? 'none' : 'block'
          }}>
            <SectionLabel>Transport Options</SectionLabel>

            {displayOptions.map(opt => (
              <TransportCard
                key={opt.mode}
                mode={opt.mode}
                detail={opt.detail}
                fare={opt.fare}
                recommended={opt.recommended}
                isSelected={selMode===opt.mode}
                onSelect={handleSelect}
                distMeters={destDist||0}
              />
            ))}

            {busStop && (
              <div style={{ ...CARD, borderRadius:12, padding:'14px 16px', marginTop:8 }}>
                <SectionLabel>Nearest Bus Stop</SectionLabel>
                <div style={{ fontWeight:700, fontSize:'.86rem', color:'#1a1a18', marginBottom:8 }}>
                  {busStop.name}
                </div>
                <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
                  {busStop.buses.map(b => (
                    <span key={b} style={{
                      padding:'3px 10px', borderRadius:20, fontSize:'.66rem', fontWeight:600,
                      background:'rgba(107,175,69,.07)', color:G_DARK, border:'1px solid rgba(107,175,69,.18)',
                    }}>{b}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
