// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';
import GlobeLogo from '../components/GlobeLogo';
import MapPanel from '../components/MapPanel';
import { Btn, VoiceWave } from '../components/UI';

const HOW_IT_WORKS = [
  { step: '01', icon: '📍', title: 'Detect Location',   desc: 'We detect your GPS and find the nearest Western Line station and bus stop instantly.' },
  { step: '02', icon: '🎤', title: 'Speak Destination', desc: 'Say your destination station by voice. VISTA understands natural speech in English.' },
  { step: '03', icon: '🚂', title: 'Train Guidance',    desc: 'Get the next available train, platform number, timing and direction — by voice.' },
  { step: '04', icon: '🚌', title: 'Last Mile Guide',   desc: 'After arriving, VISTA tells which bus to take, nearest stop, or cab/auto options.' },
];

export default function HomePage({ onNavigate, speak }) {
  const isMobile = useIsMobile();
  const [splashVisible, setSplashVisible] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setSplashVisible(false), 1600);
    const t2 = setTimeout(() => setContentVisible(true),  1900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <>
      {/* ══ INTRO SPLASH ════════════════════════════════════════ */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#f8f8f6',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        pointerEvents: splashVisible ? 'all' : 'none',
        opacity: splashVisible ? 1 : 0,
        transition: 'opacity 0.55s ease',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(200,200,195,.32) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200,200,195,.32) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }} />
        <div style={{ animation: 'splashLogoIn 0.6s ease-out both', position: 'relative', zIndex: 1 }}>
          <GlobeLogo size={isMobile ? 110 : 180} animated={false} />
        </div>
        <div style={{
          marginTop: 20, position: 'relative', zIndex: 1,
          fontFamily: 'Playfair Display, serif', fontWeight: 900,
          fontSize: isMobile ? '1.8rem' : '2.6rem', letterSpacing: 16, color: '#1e1e1c',
          animation: 'splashTextIn 0.5s ease-out 0.25s both',
        }}>VISTA</div>
        <div style={{
          marginTop: 8, position: 'relative', zIndex: 1,
          fontSize: '.66rem', letterSpacing: '3px', textTransform: 'uppercase', color: '#bbb',
          animation: 'splashTextIn 0.5s ease-out 0.4s both',
        }}>Voice Integrated Smart Transit Assistant</div>
      </div>

      {/* ══ MAIN PAGE ═══════════════════════════════════════════ */}
      <div style={{
        opacity: contentVisible ? 1 : 0,
        transition: 'opacity 0.55s ease',
        minHeight: '100vh',
        background: '#fff',
      }}>

        {/* ── HERO — CSS GRID two-column ── */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '45% 55%',
          minHeight: '100vh',
        }}>

          {/* LEFT COLUMN — text & actions */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: isMobile ? '24px 20px 32px' : '80px 48px 48px 56px',
            borderRight: isMobile ? 'none' : '1px solid rgba(0,0,0,.06)',
          }}>

            {/* Logo + wordmark */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 14,
              marginBottom: 30,
              animation: contentVisible ? 'fadeUp .6s ease-out .05s both' : 'none',
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'rgba(107,175,69,.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                border: '1px solid rgba(107,175,69,.15)',
              }}>
                <GlobeLogo size={44} animated={false} />
              </div>
              <div>
                <div style={{
                  fontFamily: 'Playfair Display, serif', fontWeight: 900,
                  fontSize: '1.85rem', letterSpacing: 9, color: '#1e1e1c',
                  lineHeight: 1,
                }}>VISTA</div>
                <div style={{
                  fontSize: '.5rem', color: '#bbb', letterSpacing: '2px',
                  textTransform: 'uppercase', marginTop: 4,
                }}>Voice Integrated Smart Transit Assistant</div>
              </div>
            </div>

            {/* Route pill */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: '#f4f6f2', border: '1px solid rgba(107,175,69,.28)',
              padding: '5px 14px', borderRadius: 20,
              fontSize: '.7rem', fontWeight: 600, letterSpacing: 1.5,
              color: '#4a7030', marginBottom: 20, width: 'fit-content',
              animation: contentVisible ? 'fadeUp .6s ease-out .12s both' : 'none',
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: '#6BAF45', display: 'inline-block',
                animation: 'pulse 2.5s ease-in-out infinite',
              }} />
              VIRAR → BORIVALI · 7 STATIONS
            </div>

            {/* Headline */}
            <h1 style={{
              fontFamily: 'Playfair Display, serif', fontWeight: 900,
              fontSize: 'clamp(1.75rem,2.8vw,2.5rem)', lineHeight: 1.22,
              color: '#1a1a18', marginBottom: 16,
              animation: contentVisible ? 'fadeUp .6s ease-out .2s both' : 'none',
            }}>
              Navigate Mumbai Locals<br />
              <span style={{ color: '#6BAF45' }}>Using Just Your Voice</span>
            </h1>

            {/* Description */}
            <p style={{
              color: '#7a7a74', fontSize: '.9rem', lineHeight: 1.8,
              maxWidth: 370, marginBottom: 26, fontWeight: 400,
              animation: contentVisible ? 'fadeUp .6s ease-out .28s both' : 'none',
            }}>
              Speak your destination. VISTA detects your location, finds the right train, and guides you door-to-door along Mumbai's Western Line.
            </p>

            {/* Voice wave — left-aligned to match text */}
            <div style={{
              marginBottom: 26,
              alignSelf: 'flex-start',
              animation: contentVisible ? 'fadeUp .6s ease-out .35s both' : 'none',
            }}>
              <VoiceWave />
            </div>

            {/* CTA Buttons — no emojis */}
            <div style={{
              display: 'flex', gap: 10, flexWrap: 'wrap',
              animation: contentVisible ? 'fadeUp .6s ease-out .42s both' : 'none',
            }}>
              <Btn onClick={() => { onNavigate('location'); speak('Welcome to VISTA. Detecting your current location.'); }}>
                Start Voice Navigation
              </Btn>
              <Btn variant="secondary" onClick={() => onNavigate('trains')}>
                View Train Schedule
              </Btn>
            </div>

            {/* Stats row */}
            <div style={{
              display: 'flex', gap: 24, marginTop: 34,
              paddingTop: 26, borderTop: '1px solid rgba(0,0,0,.07)',
              animation: contentVisible ? 'fadeUp .6s ease-out .5s both' : 'none',
            }}>
              {[
                { value: '7',     label: 'Stations' },
                { value: '~25km', label: 'Route' },
                { value: '3',     label: 'Train Types' },
                { value: '24/7',  label: 'Guidance' },
              ].map(s => (
                <div key={s.label}>
                  <div style={{
                    fontFamily: 'Playfair Display, serif', fontWeight: 900,
                    fontSize: '1.3rem', color: '#1a1a18', lineHeight: 1,
                  }}>{s.value}</div>
                  <div style={{
                    fontSize: '.58rem', color: '#bbb',
                    letterSpacing: 1, textTransform: 'uppercase', marginTop: 4,
                  }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN — map, full height, no gaps */}
          <div style={{
            position: 'relative',
            overflow: 'hidden',
            background: '#eef0eb',
            minHeight: isMobile ? '50vh' : '100vh',
          }}>
            <MapPanel style={{ position: 'absolute', inset: 0 }} />
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────────── */}
        <section style={{
          padding: isMobile ? '40px 16px 48px' : '72px 56px 88px',
          background: '#fafaf8',
          borderTop: '1px solid rgba(0,0,0,.05)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <h2 style={{
              fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 700,
              color: '#1a1a18', letterSpacing: 1, marginBottom: 8,
            }}>How VISTA Works</h2>
            <p style={{ color: '#bbb', fontSize: '.86rem' }}>Complete door-to-door guidance in 4 simple steps</p>
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))',
            gap: 16, maxWidth: 960, margin: '0 auto',
          }}>
            {HOW_IT_WORKS.map(item => (
              <div key={item.step} style={{
                background: '#fff', border: '1px solid rgba(0,0,0,.07)',
                borderRadius: 14, padding: '22px 20px', transition: 'all .25s',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,.07)';
                  e.currentTarget.style.borderColor = 'rgba(107,175,69,.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'rgba(0,0,0,.07)';
                }}
              >
                <div style={{ fontSize: '1.7rem', marginBottom: 12 }}>{item.icon}</div>
                <div style={{
                  fontSize: '.66rem', color: '#6BAF45', letterSpacing: 2,
                  fontWeight: 700, textTransform: 'uppercase', marginBottom: 8,
                }}>STEP {item.step}</div>
                <div style={{ fontWeight: 700, fontSize: '.93rem', marginBottom: 7, color: '#1a1a18' }}>{item.title}</div>
                <p style={{ color: '#9a9a94', fontSize: '.81rem', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── Keyframes + Leaflet tooltip styles ── */}
      <style>{`
        @keyframes splashLogoIn {
          from { opacity: 0; transform: scale(0.94); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes splashTextIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .vista-tooltip {
          background: rgba(22,22,20,0.88) !important;
          color: #ededed !important;
          border: 1px solid rgba(107,175,69,.3) !important;
          border-radius: 6px !important;
          font-family: 'Inter', sans-serif !important;
          font-size: 10.5px !important;
          font-weight: 600 !important;
          padding: 4px 9px !important;
          box-shadow: 0 2px 8px rgba(0,0,0,.18) !important;
          white-space: nowrap !important;
        }
        .leaflet-tooltip-left.vista-tooltip::before,
        .leaflet-tooltip-right.vista-tooltip::before { display: none !important; }
      `}</style>
    </>
  );
}
