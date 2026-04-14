// src/components/EmergencyDrawer.jsx
// Globally reusable Emergency Help Drawer.
// Usage in App.js:
//   import EmergencyDrawer from './components/EmergencyDrawer';
//   <EmergencyDrawer speak={speak} />
// That's it — the ⚠️ trigger button renders itself fixed to the screen.

import React, { useState, useEffect, useCallback } from 'react';

/* ── Design tokens ───────────────────────────────────────── */
const G      = '#6BAF45';
const G_DARK = '#4a8a2a';
const G_BG   = 'rgba(107,175,69,.07)';
const G_BOR  = 'rgba(107,175,69,.22)';
const RED    = '#dc2626';
const RED_BG = 'rgba(220,38,38,.06)';
const RED_BOR= 'rgba(220,38,38,.2)';

/* ── Data ────────────────────────────────────────────────── */
const CONTACTS = [
  {
    id: 'rpf',
    icon: '🚔',
    label: 'RPF Helpline',
    number: '182',
    desc: 'Railway Protection Force · 24 / 7',
    color: RED,
    bg: RED_BG,
    border: RED_BOR,
  },
  {
    id: 'emergency',
    icon: '🆘',
    label: 'National Emergency',
    number: '112',
    desc: 'Police · Fire · Ambulance unified',
    color: '#b45309',
    bg: 'rgba(180,83,9,.06)',
    border: 'rgba(180,83,9,.2)',
  },
  {
    id: 'railway',
    icon: '🚆',
    label: 'Railway Helpline',
    number: '139',
    desc: 'Train info · complaints · help',
    color: '#1d4ed8',
    bg: 'rgba(29,78,216,.05)',
    border: 'rgba(29,78,216,.18)',
  },
  {
    id: 'women',
    icon: '👩',
    label: "Women's Helpline",
    number: '1091',
    desc: 'Women safety & distress',
    color: '#7c3aed',
    bg: 'rgba(124,58,237,.05)',
    border: 'rgba(124,58,237,.18)',
  },
];

const MISSED_STOP = [
  {
    icon: '😮‍💨',
    title: "Don't panic",
    detail: 'Missed stops happen to everyone. You can get back quickly — trains run every 15–20 min.',
    speak: "Don't panic. Missed stops are common and easy to fix.",
  },
  {
    icon: '🛑',
    title: 'Get down at the next station',
    detail: 'Do NOT jump off between stations. Wait calmly and exit at the very next stop.',
    speak: 'Get down safely at the very next station.',
  },
  {
    icon: '🔄',
    title: 'Cross to the opposite platform',
    detail: 'Use the Foot Over Bridge (FOB) to switch sides. Follow the signs or ask a porter.',
    speak: 'Cross to the opposite platform using the foot over bridge.',
  },
  {
    icon: '🚆',
    title: 'Board a return train',
    detail: 'Your original ticket is still valid for the return. Board any train going back toward your stop.',
    speak: 'Board any train going back toward your station. Your ticket is still valid.',
  },
  {
    icon: '🙋',
    title: 'Ask the help desk if needed',
    detail: 'Every major station has an inquiry counter and RPF post. Station staff are there to assist you.',
    speak: 'If confused, ask the help desk or RPF post at the station. Staff will guide you.',
  },
];

const LOST_FOUND = [
  {
    icon: '📢',
    title: 'Report to the Station Master',
    detail: 'Go to the Station Master\'s Office on the platform. Lost items are brought there by rail staff.',
    speak: 'Report to the Station Master\'s office immediately. Lost items are collected there.',
  },
  {
    icon: '🚔',
    title: 'Contact the RPF post',
    detail: 'File a written complaint at the RPF post on the platform. Carry your ID proof.',
    speak: 'Contact the RPF post on the platform to file a lost property complaint.',
  },
  {
    icon: '📞',
    title: 'Call Railway Helpline 139',
    detail: 'Describe the item, your train number, coach, and seat. They log and coordinate recovery.',
    speak: 'Call 1 3 9, the Railway Helpline, and describe your lost item and train details.',
  },
  {
    icon: '🌐',
    title: 'File online at RailMadad',
    detail: 'Visit railmadad.indianrailways.gov.in or use the RailMadad app to track your complaint.',
    speak: 'You can also file a complaint online at Rail Madad dot Indian Railways dot gov dot in.',
  },
];

/* ── Tiny sub-components ─────────────────────────────────── */

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: '.55rem', fontWeight: 700, letterSpacing: '2.5px',
      textTransform: 'uppercase', color: '#bbb', marginBottom: 10,
    }}>{children}</div>
  );
}

function ContactBtn({ c, onCall }) {
  return (
    <button
      onClick={() => onCall(c)}
      style={{
        width: '100%', textAlign: 'left', padding: '13px 14px',
        background: c.bg, border: `1.5px solid ${c.border}`,
        borderRadius: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
        display: 'flex', alignItems: 'center', gap: 12, transition: 'all .2s',
        marginBottom: 8,
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(3px)'; e.currentTarget.style.boxShadow = `0 4px 16px ${c.border}`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      {/* Icon circle */}
      <div style={{
        width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
        background: '#fff', border: `1.5px solid ${c.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.15rem', boxShadow: `0 2px 8px ${c.border}`,
      }}>{c.icon}</div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: '.83rem', color: '#1a1a18', marginBottom: 1 }}>{c.label}</div>
        <div style={{ fontSize: '.62rem', color: '#9a9a94', lineHeight: 1.4 }}>{c.desc}</div>
      </div>

      {/* Number badge */}
      <div style={{
        padding: '5px 12px', borderRadius: 20, flexShrink: 0,
        background: c.color, color: '#fff',
        fontWeight: 800, fontSize: '.88rem', letterSpacing: '.3px',
        boxShadow: `0 3px 10px ${c.border}`,
        display: 'flex', alignItems: 'center', gap: 5,
      }}>
        <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
          <path d="M2 2h3l1.5 3.5-1.8 1.1a7.5 7.5 0 003.7 3.7l1.1-1.8L13 10v3a1 1 0 01-1 1C5.4 14 0 8.6 0 2a1 1 0 011-1h1z" fill="white"/>
        </svg>
        {c.number}
      </div>
    </button>
  );
}

function GuideStep({ step, index, total, onSpeak }) {
  return (
    <div style={{ display: 'flex', gap: 11, marginBottom: index < total - 1 ? 0 : 0 }}>
      {/* Timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <div style={{
          width: 30, height: 30, borderRadius: '50%',
          background: index === 0 ? G : G_BG,
          border: `1.5px solid ${index === 0 ? G : G_BOR}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '.9rem', flexShrink: 0,
          boxShadow: index === 0 ? `0 3px 10px rgba(107,175,69,.3)` : 'none',
        }}>{step.icon}</div>
        {index < total - 1 && (
          <div style={{
            width: 1.5, flex: 1, minHeight: 18,
            background: `linear-gradient(${G_BOR}, transparent)`,
            margin: '3px 0',
          }} />
        )}
      </div>

      {/* Content */}
      <div style={{ paddingBottom: index < total - 1 ? 14 : 0, flex: 1 }}>
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8,
        }}>
          <div style={{ fontWeight: 600, fontSize: '.8rem', color: '#1a1a18', marginBottom: 2 }}>
            {step.title}
          </div>
          <button
            onClick={() => onSpeak(step.speak)}
            title="Hear this step"
            style={{
              flexShrink: 0, width: 22, height: 22, borderRadius: 6,
              background: G_BG, border: `1px solid ${G_BOR}`,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '.65rem', transition: 'all .18s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = G_BOR; }}
            onMouseLeave={e => { e.currentTarget.style.background = G_BG; }}
          >🔊</button>
        </div>
        <div style={{ fontSize: '.7rem', color: '#6a6a64', lineHeight: 1.55 }}>{step.detail}</div>
      </div>
    </div>
  );
}

function GuideSection({ title, icon, steps, color, expanded, onToggle, onSpeak, onSpeakAll }) {
  return (
    <div style={{
      borderRadius: 12,
      border: `1.5px solid ${expanded ? color + '33' : 'rgba(0,0,0,.08)'}`,
      background: expanded ? `${color}05` : '#fff',
      overflow: 'hidden', transition: 'all .25s', marginBottom: 10,
    }}>
      {/* Header */}
      <button
        onClick={onToggle}
        style={{
          width: '100%', textAlign: 'left', padding: '13px 16px',
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'Inter, sans-serif',
          display: 'flex', alignItems: 'center', gap: 10,
        }}
      >
        <div style={{
          width: 34, height: 34, borderRadius: 9, flexShrink: 0,
          background: expanded ? `${color}14` : 'rgba(0,0,0,.04)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1rem', transition: 'all .2s',
        }}>{icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontWeight: 700, fontSize: '.84rem',
            color: expanded ? color : '#1a1a18', transition: 'color .2s',
          }}>{title}</div>
          <div style={{ fontSize: '.62rem', color: '#9a9a94', marginTop: 1 }}>
            {steps.length} steps · tap to {expanded ? 'collapse' : 'expand'}
          </div>
        </div>
        <div style={{
          width: 24, height: 24, borderRadius: 6,
          background: expanded ? `${color}12` : 'rgba(0,0,0,.04)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '.75rem', color: expanded ? color : '#9a9a94',
          transform: expanded ? 'rotate(90deg)' : 'none', transition: 'all .22s',
        }}>›</div>
      </button>

      {/* Steps */}
      {expanded && (
        <div style={{ padding: '0 16px 14px', animation: 'drawerFadeUp .22s ease' }}>
          {/* Hear all button */}
          <button
            onClick={onSpeakAll}
            style={{
              marginBottom: 14, padding: '6px 14px', borderRadius: 20,
              background: G_BG, border: `1px solid ${G_BOR}`, cursor: 'pointer',
              fontFamily: 'Inter, sans-serif', fontSize: '.7rem',
              fontWeight: 600, color: G_DARK, display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <span style={{ fontSize: '.8rem' }}>🔊</span> Hear all steps
          </button>

          {steps.map((step, i) => (
            <GuideStep
              key={i}
              step={step}
              index={i}
              total={steps.length}
              onSpeak={onSpeak}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
export default function EmergencyDrawer({ speak }) {
  const [open,        setOpen]        = useState(false);
  const [openGuide,   setOpenGuide]   = useState(null); // 'missed' | 'lost' | null
  const [callFeedback,setCallFeedback]= useState('');

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Open when Navbar "Help" is clicked
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('vista-open-help', handler);
    return () => window.removeEventListener('vista-open-help', handler);
  }, []);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleOpen = () => {
    setOpen(true);
    speak && speak('Emergency help drawer opened. Swipe or press Escape to close.');
  };

  const handleCall = useCallback((contact) => {
    speak && speak(`Calling ${contact.label} at ${contact.number}.`);
    setCallFeedback(`Calling ${contact.label} — ${contact.number}`);
    setTimeout(() => setCallFeedback(''), 3500);
    window.location.href = `tel:${contact.number}`;
  }, [speak]);

  const handleSpeak = useCallback((text) => {
    speak && speak(text);
  }, [speak]);

  const handleSpeakAll = useCallback((steps) => {
    if (!speak) return;
    const text = steps.map((s, i) => `Step ${i + 1}. ${s.speak}`).join(' ');
    speak(text);
  }, [speak]);

  const toggleGuide = (id) => setOpenGuide(prev => prev === id ? null : id);

  return (
    <>
      {/* ── Floating trigger button ─────────────────────── */}
      <button
        onClick={handleOpen}
        aria-label="Open Emergency Help"
        style={{
          position: 'fixed',
          bottom: 28,
          right: 28,
          zIndex: 7500,
          width: 54,
          height: 54,
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
          boxShadow: '0 4px 20px rgba(220,38,38,.5), 0 0 0 0 rgba(220,38,38,.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.3rem',
          transition: 'transform .2s, box-shadow .2s',
          animation: 'emergencyPulse 2.8s ease-in-out infinite',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.12)';
          e.currentTarget.style.boxShadow = '0 8px 28px rgba(220,38,38,.6)';
          e.currentTarget.style.animation = 'none';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(220,38,38,.5)';
          e.currentTarget.style.animation = 'emergencyPulse 2.8s ease-in-out infinite';
        }}
      >⚠️</button>

      {/* ── Backdrop ────────────────────────────────────── */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 8000,
            background: 'rgba(10,10,10,.55)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
            animation: 'drawerFadeIn .22s ease',
          }}
        />
      )}

      {/* ── Drawer panel ────────────────────────────────── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Emergency Help"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 9000,
          width: 'min(420px, 100vw)',
          background: 'linear-gradient(160deg, #fff8f8 0%, #ffffff 55%)',
          boxShadow: '-6px 0 48px rgba(0,0,0,.2)',
          display: 'flex',
          flexDirection: 'column',
          transform: open ? 'translateX(0)' : 'translateX(105%)',
          transition: 'transform .32s cubic-bezier(.34,1.1,.64,1)',
          willChange: 'transform',
        }}
      >
        {/* ─ Drawer header ─ */}
        <div style={{
          padding: '20px 20px 16px',
          borderBottom: '1px solid rgba(220,38,38,.1)',
          background: 'linear-gradient(135deg, rgba(220,38,38,.04) 0%, transparent 60%)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
              {/* Red icon badge */}
              <div style={{
                width: 42, height: 42, borderRadius: 13, flexShrink: 0,
                background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.25rem',
                boxShadow: '0 4px 16px rgba(220,38,38,.35)',
              }}>🆘</div>
              <div>
                <div style={{
                  fontFamily: 'Playfair Display, serif', fontWeight: 900,
                  fontSize: '1.1rem', color: '#1a0808', letterSpacing: .3,
                }}>Emergency Help</div>
                <div style={{
                  fontSize: '.6rem', color: '#c08080',
                  letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 1,
                }}>Quick access · Always available</div>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              style={{
                width: 34, height: 34, borderRadius: 9,
                border: '1px solid rgba(0,0,0,.1)', background: '#fff',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '.95rem', color: '#888', transition: 'all .18s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = RED; e.currentTarget.style.borderColor = RED_BOR; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#888'; e.currentTarget.style.borderColor = 'rgba(0,0,0,.1)'; }}
            >✕</button>
          </div>

          {/* Call feedback toast */}
          {callFeedback && (
            <div style={{
              marginTop: 12, padding: '8px 12px', borderRadius: 8,
              background: 'rgba(220,38,38,.08)', border: '1px solid rgba(220,38,38,.2)',
              fontSize: '.74rem', fontWeight: 600, color: RED,
              display: 'flex', alignItems: 'center', gap: 7,
              animation: 'drawerFadeUp .2s ease',
            }}>
              <span>📞</span> {callFeedback}
            </div>
          )}
        </div>

        {/* ─ Scrollable body ─ */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px 32px' }}>

          {/* Emergency contacts */}
          <SectionLabel>Emergency Contacts</SectionLabel>
          {CONTACTS.map(c => (
            <ContactBtn key={c.id} c={c} onCall={handleCall} />
          ))}

          {/* Divider */}
          <div style={{
            margin: '18px 0 16px',
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(0,0,0,.08), transparent)',
          }} />

          {/* Situation guides */}
          <SectionLabel>Situation Guides</SectionLabel>

          <GuideSection
            title="Missed My Stop"
            icon="🚆"
            steps={MISSED_STOP}
            color="#d97706"
            expanded={openGuide === 'missed'}
            onToggle={() => toggleGuide('missed')}
            onSpeak={handleSpeak}
            onSpeakAll={() => handleSpeakAll(MISSED_STOP)}
          />

          <GuideSection
            title="Lost Something on the Train"
            icon="🎒"
            steps={LOST_FOUND}
            color="#7c3aed"
            expanded={openGuide === 'lost'}
            onToggle={() => toggleGuide('lost')}
            onSpeak={handleSpeak}
            onSpeakAll={() => handleSpeakAll(LOST_FOUND)}
          />

          {/* Bottom tip */}
          <div style={{
            marginTop: 18, padding: '12px 14px', borderRadius: 10,
            background: G_BG, border: `1px solid ${G_BOR}`,
            display: 'flex', gap: 9, alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: '1rem', flexShrink: 0 }}>💡</span>
            <div style={{ fontSize: '.7rem', color: '#4a6a34', lineHeight: 1.6 }}>
              <strong>Pro tip:</strong> Save RPF (182) and Railway Helpline (139) in your phone contacts before boarding. Every Western Line station has an RPF post and an inquiry counter.
            </div>
          </div>
        </div>

        {/* ─ Sticky footer ─ */}
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid rgba(0,0,0,.06)',
          background: 'rgba(255,255,255,.96)',
          backdropFilter: 'blur(12px)',
          flexShrink: 0,
          display: 'flex', gap: 8,
        }}>
          <a
            href="tel:182"
            style={{
              flex: 1, padding: '11px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
              color: '#fff', fontFamily: 'Inter, sans-serif', fontWeight: 700,
              fontSize: '.82rem', textAlign: 'center', textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(220,38,38,.3)', transition: 'all .2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(220,38,38,.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(220,38,38,.3)'; }}
            onClick={() => speak && speak('Calling RPF helpline 182.')}
          >
            📞 Call RPF — 182
          </a>
          <a
            href="tel:112"
            style={{
              flex: 1, padding: '11px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: '#fff', border: '1.5px solid rgba(0,0,0,.1)',
              color: '#1a1a18', fontFamily: 'Inter, sans-serif', fontWeight: 700,
              fontSize: '.82rem', textAlign: 'center', textDecoration: 'none',
              transition: 'all .2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.borderColor = RED_BOR; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = 'rgba(0,0,0,.1)'; }}
            onClick={() => speak && speak('Calling national emergency 112.')}
          >
            🆘 Emergency — 112
          </a>
        </div>
      </div>

      {/* ── Keyframes ──────────────────────────────────── */}
      <style>{`
        @keyframes emergencyPulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(220,38,38,.5), 0 0 0 0 rgba(220,38,38,.35); }
          50%       { box-shadow: 0 4px 20px rgba(220,38,38,.5), 0 0 0 10px rgba(220,38,38,.0); }
        }
        @keyframes drawerFadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes drawerFadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
