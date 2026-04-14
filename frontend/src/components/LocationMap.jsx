// src/components/LocationMap.jsx — Location page map, user pin + route
import React, { useEffect, useRef } from 'react';

const ALL_STATIONS = [
  { name: 'Virar',      lat: 19.4544, lng: 72.8114 },
  { name: 'Nalasopara', lat: 19.4189, lng: 72.8165 },
  { name: 'Vasai Road', lat: 19.3820, lng: 72.8317 },
  { name: 'Naigaon',    lat: 19.3510, lng: 72.8441 },
  { name: 'Bhayandar',  lat: 19.3101, lng: 72.8533 },
  { name: 'Mira Road',  lat: 19.2812, lng: 72.8692 },
  { name: 'Dahisar',    lat: 19.2547, lng: 72.8600 },
  { name: 'Borivali',   lat: 19.2307, lng: 72.8567 },
];

const GREEN      = '#6BAF45';
const GREEN_DARK = '#4a8a2a';

export default function LocationMap({ userLat, userLng, nearestStation }) {
  const mapRef         = useRef(null);
  const mapInstanceRef = useRef(null);
  const userMarkerRef  = useRef(null);
  const lineRef        = useRef(null);

  // ── Init map once ──────────────────────────────────────
  useEffect(() => {
    if (mapInstanceRef.current || !mapRef.current) return;

    import('leaflet').then(L => {
      delete L.Icon.Default.prototype._getIconUrl;

      const center = [19.355, 72.840];
      const map = L.map(mapRef.current, {
        center, zoom: 11,
        zoomControl: false, scrollWheelZoom: false,
        dragging: true, touchZoom: true,
        doubleClickZoom: false, attributionControl: false,
      });
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map);

      // Dashed route line
      const routeCoords = ALL_STATIONS.map(s => [s.lat, s.lng]);
      L.polyline(routeCoords, {
        color: '#1a1a19', weight: 2.5, opacity: 0.8,
        dashArray: '8 7', lineCap: 'round',
      }).addTo(map);

      // Station markers
      ALL_STATIONS.forEach((st, i) => {
        const isTerminal = i === 0 || i === ALL_STATIONS.length - 1;

        if (isTerminal) {
          L.circleMarker([st.lat, st.lng], {
            radius: 16, color: GREEN, weight: 1,
            opacity: 0.2, fillColor: GREEN, fillOpacity: 0.07,
          }).addTo(map);
        }

        L.circleMarker([st.lat, st.lng], {
          radius: isTerminal ? 6 : 4,
          color: '#fff', weight: 2.5,
          fillColor: GREEN, fillOpacity: 1,
        }).addTo(map)
          .bindTooltip(st.name, {
            permanent: true, direction: 'right',
            offset: [isTerminal ? 10 : 7, 0],
            className: 'lmap-tooltip',
          });
      });

      map.fitBounds(L.latLngBounds(routeCoords), {
        paddingTopLeft: [60, 50], paddingBottomRight: [60, 50],
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);
      L.control.attribution({ prefix: '© CartoDB | OSM', position: 'bottomright' }).addTo(map);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // ── Update user pin whenever location changes ──────────
  useEffect(() => {
    if (!mapInstanceRef.current || !userLat || !userLng) return;

    import('leaflet').then(L => {
      const map = mapInstanceRef.current;
      if (!map) return;

      if (userMarkerRef.current) userMarkerRef.current.remove();
      if (lineRef.current)        lineRef.current.remove();

      // Pulsing user location marker
      const userIcon = L.divIcon({
        html: `
          <div style="position:relative;width:32px;height:32px;">
            <div style="
              position:absolute;top:50%;left:50%;
              width:32px;height:32px;transform:translate(-50%,-50%);
              border-radius:50%;background:rgba(107,175,69,.2);
              animation:lmapPulse 2s ease-in-out infinite;
            "></div>
            <div style="
              position:absolute;top:50%;left:50%;
              width:14px;height:14px;transform:translate(-50%,-50%);
              border-radius:50%;background:${GREEN};
              border:3px solid #fff;
              box-shadow:0 2px 12px rgba(107,175,69,.6);
            "></div>
          </div>`,
        iconSize:   [32, 32],
        iconAnchor: [16, 16],
        className:  '',
      });

      userMarkerRef.current = L.marker([userLat, userLng], { icon: userIcon })
        .addTo(map)
        .bindTooltip('You are here', { permanent: false, direction: 'top', className: 'lmap-tooltip' });

      // Dashed walk-line to nearest station
      if (nearestStation) {
        lineRef.current = L.polyline(
          [[userLat, userLng], [nearestStation.lat, nearestStation.lng]],
          { color: GREEN_DARK, weight: 2, opacity: 0.55, dashArray: '4 5' }
        ).addTo(map);
      }

      map.flyTo([userLat, userLng], 13, { duration: 1.2 });
    });
  }, [userLat, userLng, nearestStation]);

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#f0f6eb' }}>
      <div style={{
        position: 'absolute', inset: '28px 28px 28px 12px',
        borderRadius: 18, overflow: 'hidden',
        boxShadow: '0 4px 32px rgba(0,0,0,.10)', background: '#fff',
      }}>
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

        {/* Top badge */}
        <div style={{
          position: 'absolute', top: 14, left: 14, zIndex: 800,
          background: 'rgba(255,255,255,.97)', border: '1px solid rgba(0,0,0,.07)',
          borderRadius: 8, padding: '6px 12px',
          display: 'flex', alignItems: 'center', gap: 7,
          boxShadow: '0 2px 10px rgba(0,0,0,.08)',
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: GREEN, animation: 'pulse 2.5s infinite' }} />
          <span style={{ fontWeight: 700, fontSize: '.7rem', color: '#1a1a19', letterSpacing: '.8px' }}>WESTERN LINE</span>
        </div>
      </div>

      <style>{`
        @keyframes lmapPulse {
          0%,100% { transform: translate(-50%,-50%) scale(1);   opacity:.5; }
          50%      { transform: translate(-50%,-50%) scale(1.8); opacity:.1; }
        }
        .lmap-tooltip {
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
        }
        .lmap-tooltip::before { display:none !important; }
        .leaflet-tooltip-right.lmap-tooltip { margin-left: 6px !important; }
      `}</style>
    </div>
  );
}
