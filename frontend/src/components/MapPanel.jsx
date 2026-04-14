// src/components/MapPanel.jsx — Home page map, matches screenshot style
import React, { useEffect, useRef } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

// Corrected real-world coordinates — Western Line Virar→Borivali
const STATIONS = [
  { name: 'Virar',      lat: 19.4544, lng: 72.8114 },
  { name: 'Nalasopara', lat: 19.4189, lng: 72.8165 },
  { name: 'Vasai Road', lat: 19.3820, lng: 72.8317 },
  { name: 'Naigaon',    lat: 19.3510, lng: 72.8441 },
  { name: 'Bhayandar',  lat: 19.3101, lng: 72.8533 },
  { name: 'Mira Road',  lat: 19.2812, lng: 72.8692 },
  { name: 'Dahisar',    lat: 19.2547, lng: 72.8600 },
  { name: 'Borivali',   lat: 19.2307, lng: 72.8567 },
];

const GREEN = '#6BAF45';

export default function MapPanel({ style = {} }) {
  const isMobile = useIsMobile();
  const mapRef         = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (mapInstanceRef.current || !mapRef.current) return;

    import('leaflet').then(L => {
      delete L.Icon.Default.prototype._getIconUrl;

      const map = L.map(mapRef.current, {
        zoomControl:        false,
        scrollWheelZoom:    false,
        dragging:           false,
        touchZoom:          false,
        doubleClickZoom:    false,
        attributionControl: false,
      });
      mapInstanceRef.current = map;

      // Same tile style as screenshot — light CartoDB
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(map);

      const coords = STATIONS.map(s => [s.lat, s.lng]);

      // Dashed green route line
      L.polyline(coords, {
        color:     '#1a1a19',
        weight:    2.5,
        opacity:   0.85,
        dashArray: '8 7',
        lineCap:   'round',
        lineJoin:  'round',
      }).addTo(map);

      // Station markers — matching screenshot style
      STATIONS.forEach((st, i) => {
        const isTerminal = i === 0 || i === STATIONS.length - 1;

        // Terminal glow halo
        if (isTerminal) {
          L.circleMarker([st.lat, st.lng], {
            radius:      18,
            color:       GREEN,
            weight:      1,
            opacity:     0.18,
            fillColor:   GREEN,
            fillOpacity: 0.08,
          }).addTo(map);
        }

        // Outer ring
        L.circleMarker([st.lat, st.lng], {
          radius:      isTerminal ? 9 : 6,
          color:       GREEN,
          weight:      2,
          opacity:     0.5,
          fillColor:   GREEN,
          fillOpacity: 0.1,
        }).addTo(map);

        // Core dot — white border, green fill (matches screenshot)
        L.circleMarker([st.lat, st.lng], {
          radius:      isTerminal ? 6 : 4,
          color:       '#fff',
          weight:      2.5,
          fillColor:   GREEN,
          fillOpacity: 1,
        }).addTo(map)
          .bindTooltip(st.name, {
            permanent:  true,
            direction:  'right',
            offset:     [isTerminal ? 10 : 7, 0],
            className:  'vista-tooltip',
          });
      });

      // Fit with padding — keep route well centered
      map.fitBounds(L.latLngBounds(coords), {
        paddingTopLeft:     [60, 80],
        paddingBottomRight: [80, 80],
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{
      position: 'absolute', inset: 0,
      padding: isMobile ? '12px' : '40px 40px 40px 20px',
      background: '#eef0eb',
      boxSizing: 'border-box',
      ...style,
    }}>
      <div style={{
        width: '100%', height: '100%',
        borderRadius: 16, overflow: 'hidden',
        boxShadow: '0 4px 32px rgba(0,0,0,.10)',
        position: 'relative',
      }}>
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

        {/* Live badge — top left */}
        <div style={{
          position: 'absolute', top: 14, left: 14, zIndex: 1000,
          background: 'rgba(255,255,255,0.97)',
          borderRadius: 8, padding: '6px 12px',
          display: 'flex', alignItems: 'center', gap: 7,
          boxShadow: '0 2px 10px rgba(0,0,0,.09)',
          border: '1px solid rgba(0,0,0,.06)',
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: GREEN, animation: 'pulse 2.5s ease-in-out infinite',
          }} />
          <span style={{ fontWeight: 700, fontSize: '.72rem', color: '#1a1a19', letterSpacing: '.8px' }}>
            WESTERN LINE
          </span>
          <span style={{
            background: '#1e1e1c', color: '#fff',
            fontSize: '.58rem', fontWeight: 600,
            padding: '2px 6px', borderRadius: 20, letterSpacing: 1,
          }}>LIVE</span>
        </div>

        {/* Bottom info strip */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'rgba(255,255,255,0.97)',
          borderTop: '1px solid rgba(0,0,0,.07)',
          backdropFilter: 'blur(10px)',
          padding: '11px 18px',
          display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 16, flexWrap: 'wrap',
          zIndex: 1000,
        }}>
          <div>
            <div style={{ color: '#bbb', fontSize: '.58rem', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 1 }}>From</div>
            <div style={{ fontWeight: 700, color: '#1a1a19', fontSize: '.8rem' }}>Virar</div>
          </div>
          <div style={{ color: GREEN, fontWeight: 700, fontSize: '.9rem' }}>→</div>
          <div>
            <div style={{ color: '#bbb', fontSize: '.58rem', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 1 }}>To</div>
            <div style={{ fontWeight: 700, color: '#1a1a19', fontSize: '.8rem' }}>Borivali</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 16 }}>
            {[
              { label: 'Stations', val: '8' },
              { label: 'Distance', val: '~27 km' },
              { label: 'Line',     val: 'Western' },
            ].map(x => (
              <div key={x.label}>
                <div style={{ color: '#bbb', fontSize: '.58rem', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 1 }}>{x.label}</div>
                <div style={{ fontWeight: 700, color: '#1a1a19', fontSize: '.8rem' }}>{x.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tooltip styles matching screenshot — dark pill */}
      <style>{`
        .vista-tooltip {
          background: rgba(22,22,20,0.88) !important;
          color: #f0f0ee !important;
          border: none !important;
          border-radius: 6px !important;
          font-family: 'Inter', sans-serif !important;
          font-size: 11px !important;
          font-weight: 600 !important;
          padding: 4px 10px !important;
          box-shadow: 0 2px 8px rgba(0,0,0,.25) !important;
          white-space: nowrap !important;
          letter-spacing: .3px !important;
        }
        .vista-tooltip::before { display: none !important; }
        .leaflet-tooltip-right.vista-tooltip { margin-left: 6px !important; }
        .leaflet-tooltip-left.vista-tooltip  { margin-left: -6px !important; }
      `}</style>
    </div>
  );
}
