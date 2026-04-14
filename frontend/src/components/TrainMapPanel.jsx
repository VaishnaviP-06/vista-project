// src/components/TrainMapPanel.jsx — Animated Mumbai local train on route map
import React, { useEffect, useRef, useState } from 'react';

// Corrected coordinates — same as MapPanel
const STATION_COORDS = {
  'Virar':      [19.4544, 72.8114],
  'Nalasopara': [19.4189, 72.8165],
  'Vasai Road': [19.3820, 72.8317],
  'Naigaon':    [19.3510, 72.8441],
  'Bhayandar':  [19.3101, 72.8533],
  'Mira Road':  [19.2812, 72.8692],
  'Dahisar':    [19.2547, 72.8600],
  'Borivali':   [19.2307, 72.8567],
};
const ALL_STATIONS = Object.keys(STATION_COORDS);
const G = '#6BAF45';

/* ── Mumbai local train — canvas-drawn icon ────────────────
   Draws a realistic green local train facing right (or left for northbound)
   Returns a data: URL used as a Leaflet icon image               */
function buildTrainIconURL(goingDown = true) {
  const W = 56, H = 38;
  const canvas = document.createElement('canvas');
  canvas.width  = W * 2;
  canvas.height = H * 2;
  const ctx = canvas.getContext('2d');
  ctx.scale(2, 2);

  if (!goingDown) { ctx.translate(W, 0); ctx.scale(-1, 1); }

  // Body
  ctx.beginPath(); ctx.roundRect(2, 5, 50, 26, [5,5,3,3]);
  ctx.fillStyle = '#1e6e2f'; ctx.fill();

  // Roof stripe (green)
  ctx.beginPath(); ctx.roundRect(2, 5, 50, 7, [5,5,0,0]);
  ctx.fillStyle = G; ctx.fill();

  // Side stripe
  ctx.beginPath(); ctx.rect(2, 12, 50, 2);
  ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fill();

  // Cab / front nose
  ctx.beginPath(); ctx.roundRect(40, 6, 12, 22, [0,5,3,0]);
  ctx.fillStyle = '#155a22'; ctx.fill();

  // Windshield
  ctx.beginPath(); ctx.roundRect(42, 8, 8, 11, 2);
  ctx.fillStyle = '#b8f0cc'; ctx.globalAlpha = .85; ctx.fill(); ctx.globalAlpha = 1;

  // Windows × 3
  [[5,13],[15,13],[25,13]].forEach(([x,y]) => {
    ctx.beginPath(); ctx.roundRect(x, y, 9, 9, 2);
    ctx.fillStyle = '#c8f2d8'; ctx.globalAlpha = .9; ctx.fill(); ctx.globalAlpha = 1;
  });

  // Door separators
  ctx.beginPath();
  ctx.rect(13, 14, 1.5, 17); ctx.rect(23, 14, 1.5, 17);
  ctx.fillStyle = 'rgba(255,255,255,.2)'; ctx.fill();

  // Under-carriage
  ctx.beginPath(); ctx.rect(2, 31, 50, 4);
  ctx.fillStyle = '#0f3d18'; ctx.fill();

  // Wheels (5)
  [7, 15, 23, 31, 46].forEach(x => {
    ctx.beginPath(); ctx.arc(x, 35, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = '#222'; ctx.fill();
    ctx.beginPath(); ctx.arc(x, 35, 1.4, 0, Math.PI * 2);
    ctx.fillStyle = '#777'; ctx.fill();
  });

  // Headlight
  ctx.beginPath(); ctx.arc(51, 26, 2.2, 0, Math.PI * 2);
  ctx.fillStyle = '#fff9c4'; ctx.fill();

  // Number board on cab
  ctx.fillStyle = 'rgba(255,255,255,.35)';
  ctx.fillRect(41, 23, 10, 5);

  return canvas.toDataURL('image/png');
}

/* ── Build sub-route coords between two stations ────────── */
function buildRouteCoords(src, dest) {
  const srcName  = src?.name;
  const destName = dest?.name;
  if (!srcName || !destName) return Object.values(STATION_COORDS);
  const srcIdx  = ALL_STATIONS.indexOf(srcName);
  const destIdx = ALL_STATIONS.indexOf(destName);
  if (srcIdx === -1 || destIdx === -1) return Object.values(STATION_COORDS);
  const going = srcIdx < destIdx;
  const slice = going
    ? ALL_STATIONS.slice(srcIdx, destIdx + 1)
    : ALL_STATIONS.slice(destIdx, srcIdx + 1).reverse();
  return slice.map(n => STATION_COORDS[n]);
}

export default function TrainMapPanel({ srcStation, destStation, selectedTrain, style = {} }) {
  const mapRef         = useRef(null);
  const mapInstanceRef = useRef(null);
  const trainMarkerRef = useRef(null);
  const animFrameRef   = useRef(null);
  const [trainPos, setTrainPos] = useState(0);

  // ── Init map ───────────────────────────────────────────
  useEffect(() => {
    if (mapInstanceRef.current || !mapRef.current) return;

    import('leaflet').then(L => {
      delete L.Icon.Default.prototype._getIconUrl;

      const routeCoords = buildRouteCoords(srcStation, destStation);
      const map = L.map(mapRef.current, {
        zoomControl: false, scrollWheelZoom: false,
        dragging: true, touchZoom: false,
        doubleClickZoom: false, attributionControl: false,
      });
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map);

      const allCoords = ALL_STATIONS.map(n => STATION_COORDS[n]);

      // Background full route (dim)
      L.polyline(allCoords, { color: '#d0d0cc', weight: 2, dashArray: '6 8' }).addTo(map);

      // Active route segment
      L.polyline(routeCoords, {
        color: '#1a1a19', weight: 2.5, opacity: 0.85,
        dashArray: '8 7', lineCap: 'round',
      }).addTo(map);

      // All station markers — matching MapPanel style
      ALL_STATIONS.forEach((name, i) => {
        const coords     = STATION_COORDS[name];
        const isSrc      = name === srcStation?.name;
        const isDest     = name === destStation?.name;
        const isTerminal = i === 0 || i === ALL_STATIONS.length - 1;
        const isActive   = isSrc || isDest;

        if (isActive || isTerminal) {
          L.circleMarker(coords, {
            radius: 14, color: isSrc ? '#1a1a18' : G,
            weight: 1, opacity: 0.2,
            fillColor: isSrc ? '#1a1a18' : G, fillOpacity: 0.07,
          }).addTo(map);
        }

        L.circleMarker(coords, {
          radius: isActive ? 6 : 4,
          color:  '#fff', weight: 2.5,
          fillColor:   isSrc ? '#1a1a18' : isDest ? G : '#aaa',
          fillOpacity: 1,
        }).addTo(map)
          .bindTooltip(name, {
            permanent:  isActive || isTerminal,
            direction:  'right',
            offset:     [isActive ? 10 : 7, 0],
            className:  'tmpl-tooltip',
          });
      });

      // Train marker at start position
      const goingDown = (srcStation?.id || 0) < (destStation?.id || 1);
      const iconURL   = buildTrainIconURL(goingDown);
      const trainIcon = L.icon({ iconUrl: iconURL, iconSize: [56,38], iconAnchor: [28,32] });
      trainMarkerRef.current = L.marker(routeCoords[0] || allCoords[0], {
        icon: trainIcon, zIndexOffset: 1000,
      }).addTo(map);

      // Fit to active segment with padding
      map.fitBounds(L.latLngBounds(routeCoords), {
        paddingTopLeft: [80, 80], paddingBottomRight: [60, 80],
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);
      L.control.attribution({ prefix: '© CartoDB | OSM', position: 'bottomleft' }).addTo(map);
    });

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; }
    };
  }, []);

  // ── Animate train along route ──────────────────────────
  useEffect(() => {
    if (!selectedTrain || !mapInstanceRef.current) return;
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    const routeCoords = buildRouteCoords(srcStation, destStation);
    if (routeCoords.length < 2) return;

    const DURATION = 10000; // 10 s per full trip
    let startTime  = null;

    const animate = (ts) => {
      if (!startTime) startTime = ts;
      const progress  = ((ts - startTime) / DURATION) % 1;
      const totalSegs = routeCoords.length - 1;
      const segIdx    = Math.min(Math.floor(progress * totalSegs), totalSegs - 1);
      const segProg   = (progress * totalSegs) - segIdx;
      const [lat1, lng1] = routeCoords[segIdx];
      const [lat2, lng2] = routeCoords[Math.min(segIdx + 1, totalSegs)];
      const lat = lat1 + (lat2 - lat1) * segProg;
      const lng = lng1 + (lng2 - lng1) * segProg;
      if (trainMarkerRef.current) trainMarkerRef.current.setLatLng([lat, lng]);
      setTrainPos(progress);
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);
    return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); };
  }, [selectedTrain, srcStation?.id, destStation?.id]);

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#eef0eb', ...style }}>
      <div style={{
        position: 'absolute', inset: '28px 28px 28px 12px',
        borderRadius: 18, overflow: 'hidden',
        boxShadow: '0 4px 32px rgba(0,0,0,.10)', background: '#fff',
      }}>
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

        {/* Route progress bar (shows when train is selected) */}
        {selectedTrain && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'rgba(255,255,255,.97)', borderTop: '1px solid rgba(0,0,0,.07)',
            padding: '10px 18px', zIndex: 1000,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: '.66rem', color: '#9a9a94' }}>
              <span style={{ fontWeight: 700, color: '#1a1a18' }}>{srcStation?.name}</span>
              <span style={{ fontWeight: 700, color: G }}>{Math.round(trainPos * 100)}%</span>
              <span style={{ fontWeight: 700, color: '#1a1a18' }}>{destStation?.name}</span>
            </div>
            <div style={{ height: 4, background: '#f0f0ee', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${trainPos * 100}%`,
                background: `linear-gradient(90deg,${G},#5a9a38)`,
                borderRadius: 2, transition: 'width .1s',
              }} />
            </div>
          </div>
        )}

        {/* Top badge */}
        <div style={{
          position: 'absolute', top: 14, left: 14, zIndex: 800,
          background: 'rgba(255,255,255,.97)', border: '1px solid rgba(0,0,0,.07)',
          borderRadius: 8, padding: '6px 12px',
          display: 'flex', alignItems: 'center', gap: 7,
          boxShadow: '0 2px 10px rgba(0,0,0,.08)',
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: G, animation: 'pulse 2.5s infinite' }} />
          <span style={{ fontWeight: 700, fontSize: '.7rem', color: '#1a1a19', letterSpacing: '.8px' }}>ROUTE MAP</span>
        </div>
      </div>

      {/* Tooltip + train animation styles */}
      <style>{`
        .tmpl-tooltip {
          background: rgba(22,22,20,.88) !important;
          color: #ededed !important;
          border: none !important;
          border-radius: 6px !important;
          font-family: 'Inter', sans-serif !important;
          font-size: 10.5px !important;
          font-weight: 600 !important;
          padding: 4px 9px !important;
          box-shadow: 0 2px 8px rgba(0,0,0,.2) !important;
          white-space: nowrap !important;
          letter-spacing: .3px !important;
        }
        .tmpl-tooltip::before { display: none !important; }
        .leaflet-tooltip-right.tmpl-tooltip { margin-left: 6px !important; }
      `}</style>
    </div>
  );
}
