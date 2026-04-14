// src/pages/HelpPage.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ── Design tokens (matches VISTA system) ─────────────────── */
const G      = '#6BAF45';
const G_DARK = '#4a8a2a';
const G_BG   = 'rgba(107,175,69,.07)';
const G_BOR  = 'rgba(107,175,69,.22)';
const CARD = {
  background: 'rgba(255,255,255,.82)',
  backdropFilter: 'blur(18px)',
  WebkitBackdropFilter: 'blur(18px)',
  border: '1px solid rgba(255,255,255,.7)',
  boxShadow: '0 2px 18px rgba(0,0,0,.06)',
  borderRadius: 16,
};

/* ══════════════════════════════════════════════════════════════
   SECTION 1 — EMERGENCY HELP DRAWER
══════════════════════════════════════════════════════════════ */

const EMERGENCY_CONTACTS = [
  { id: 'rpf',      icon: '🚔', label: 'RPF Helpline',        number: '182',  desc: 'Railway Protection Force — 24/7',   color: '#dc2626' },
  { id: 'police',   icon: '👮', label: 'Police',              number: '100',  desc: 'Mumbai Police emergency line',       color: '#1d4ed8' },
  { id: 'ambulance',icon: '🚑', label: 'Ambulance',           number: '108',  desc: 'Medical emergency services',         color: '#ea580c' },
  { id: 'women',    icon: '👩', label: "Women's Helpline",    number: '1091', desc: 'Women safety & distress',            color: '#7c3aed' },
  { id: 'railway',  icon: '🚆', label: 'Railway Enquiry',     number: '139',  desc: 'Train info, complaints & help',      color: G_DARK   },
  { id: 'child',    icon: '🧒', label: 'Child Helpline',      number: '1098', desc: 'CHILDLINE — child protection',      color: '#0891b2' },
];

const MISSED_STOP_STEPS = [
  { icon: '🛑', title: 'Stay calm — don\'t panic', detail: 'You can reach your station easily. The Western Line runs frequently.' },
  { icon: '📍', title: 'Note your current station', detail: 'Check the station board as you pass or look at the route map inside the train.' },
  { icon: '🔄', title: 'Get off at the next station', detail: 'Do not try to jump off between stations. Wait for the next stop safely.' },
  { icon: '🚉', title: 'Cross the platform', detail: 'Take the FOB (Foot Over Bridge) to reach the opposite platform.' },
  { icon: '🎫', title: 'Your ticket is still valid', detail: 'On Western Line local trains, your ticket covers the return trip within the same journey.' },
  { icon: '🚆', title: 'Board a train going back', detail: 'Wait for a train going toward your original destination. Trains run every 15–20 minutes.' },
];

const LOST_FOUND_STEPS = [
  { icon: '🕐', title: 'Act immediately', detail: 'Report within 24 hours for best recovery chances.' },
  { icon: '📞', title: 'Call Railway Enquiry: 139', detail: 'Provide your train number, coach number, and item description.' },
  { icon: '🏢', title: 'Visit Station Master\'s Office', detail: 'Lost items are handed over to the SM on duty at the next terminal station.' },
  { icon: '📝', title: 'File a complaint at RPF post', detail: 'The RPF post is located on every major station platform. Bring your ID proof.' },
  { icon: '🌐', title: 'Check online portal', detail: 'Visit railmadad.indianrailways.gov.in to lodge a lost property complaint.' },
  { icon: '📱', title: 'Use RailMadad app', detail: 'Download the RailMadad app for real-time tracking of your complaint.' },
];

function EmergencyDrawer({ isOpen, onClose, speak }) {
  const [activeGuide, setActiveGuide] = useState(null); // 'missed' | 'lost'

  const handleCall = (contact) => {
    speak(`Calling ${contact.label} at ${contact.number}.`);
    window.location.href = `tel:${contact.number}`;
  };

  const handleGuide = (type) => {
    setActiveGuide(prev => prev === type ? null : type);
    if (type === 'missed') speak('Missed stop guide. Stay calm. Get off at the next station and board a return train.');
    if (type === 'lost')   speak('Lost and found guide. Act immediately. Call 139 or visit the Station Master\'s office.');
  };

  const steps = activeGuide === 'missed' ? MISSED_STOP_STEPS : LOST_FOUND_STEPS;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 8000,
          background: 'rgba(0,0,0,.45)',
          backdropFilter: 'blur(4px)',
          animation: 'fadeIn .2s ease',
        }}
      />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 9000,
        width: 'min(460px, 100vw)',
        background: 'linear-gradient(160deg, #fff9f9 0%, #fff 60%)',
        boxShadow: '-4px 0 40px rgba(0,0,0,.18)',
        display: 'flex', flexDirection: 'column',
        animation: 'slideInRight .3s cubic-bezier(.34,1.2,.64,1)',
        overflowY: 'auto',
      }}>

        {/* Header */}
        <div style={{
          padding: '24px 24px 18px',
          borderBottom: '1px solid rgba(220,38,38,.12)',
          background: 'linear-gradient(135deg, rgba(220,38,38,.04), rgba(255,255,255,0))',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 12,
                background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem', boxShadow: '0 4px 14px rgba(220,38,38,.3)',
              }}>🆘</div>
              <div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: '1.15rem', color: '#1a0a0a' }}>
                  Emergency Help
                </div>
                <div style={{ fontSize: '.65rem', color: '#9a4a4a', letterSpacing: 1, textTransform: 'uppercase' }}>
                  Quick access · Always available
                </div>
              </div>
            </div>
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: 8, border: '1px solid rgba(0,0,0,.1)',
              background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', color: '#666', transition: 'all .2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
            >✕</button>
          </div>
        </div>

        <div style={{ padding: '18px 24px', flex: 1 }}>

          {/* Emergency contacts */}
          <div style={{ fontSize: '.58rem', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#bbb', marginBottom: 10 }}>
            Emergency Contacts
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 22 }}>
            {EMERGENCY_CONTACTS.map(c => (
              <button
                key={c.id}
                onClick={() => handleCall(c)}
                style={{
                  background: '#fff', border: `1.5px solid ${c.color}22`,
                  borderRadius: 12, padding: '11px 12px', cursor: 'pointer',
                  textAlign: 'left', transition: 'all .2s', fontFamily: 'Inter, sans-serif',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = `${c.color}08`; e.currentTarget.style.borderColor = `${c.color}44`; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = `${c.color}22`; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ fontSize: '1.2rem', marginBottom: 4 }}>{c.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '.78rem', color: '#1a1a18', marginBottom: 1 }}>{c.label}</div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: c.color, marginBottom: 2 }}>{c.number}</div>
                <div style={{ fontSize: '.58rem', color: '#9a9a94', lineHeight: 1.4 }}>{c.desc}</div>
              </button>
            ))}
          </div>

          {/* Guides */}
          <div style={{ fontSize: '.58rem', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#bbb', marginBottom: 10 }}>
            Situation Guides
          </div>
          {[
            { id: 'missed', icon: '🚆', label: 'Missed My Stop', desc: 'Step-by-step on what to do next', color: '#d97706' },
            { id: 'lost',   icon: '🎒', label: 'Lost Something', desc: 'How to recover lost items', color: '#7c3aed' },
          ].map(g => (
            <div key={g.id} style={{ marginBottom: 10 }}>
              <button
                onClick={() => handleGuide(g.id)}
                style={{
                  width: '100%', textAlign: 'left', padding: '13px 16px',
                  background: activeGuide === g.id ? `${g.color}08` : '#fff',
                  border: `1.5px solid ${activeGuide === g.id ? g.color + '44' : 'rgba(0,0,0,.08)'}`,
                  borderRadius: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all .22s',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: '1.3rem' }}>{g.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '.84rem', color: activeGuide === g.id ? g.color : '#1a1a18' }}>{g.label}</div>
                    <div style={{ fontSize: '.65rem', color: '#9a9a94' }}>{g.desc}</div>
                  </div>
                </div>
                <span style={{ color: '#ccc', transition: 'transform .2s', display: 'inline-block', transform: activeGuide === g.id ? 'rotate(90deg)' : 'none' }}>›</span>
              </button>

              {activeGuide === g.id && (
                <div style={{
                  background: '#fafaf8', border: '1px solid rgba(0,0,0,.06)',
                  borderRadius: '0 0 12px 12px', padding: '14px 16px',
                  borderTop: 'none', marginTop: -1,
                  animation: 'fadeUp .25s ease-out',
                }}>
                  {steps.map((step, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, marginBottom: i < steps.length - 1 ? 12 : 0 }}>
                      <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: '50%',
                          background: G_BG, border: `1.5px solid ${G_BOR}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.85rem',
                        }}>{step.icon}</div>
                        {i < steps.length - 1 && <div style={{ width: 1.5, flex: 1, minHeight: 10, background: G_BOR, margin: '3px 0' }} />}
                      </div>
                      <div style={{ paddingBottom: i < steps.length - 1 ? 6 : 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '.8rem', color: '#1a1a18', marginBottom: 2 }}>{step.title}</div>
                        <div style={{ fontSize: '.68rem', color: '#6a6a64', lineHeight: 1.5 }}>{step.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
      `}</style>
    </>
  );
}

/* Floating emergency button — shown on HelpPage */
function EmergencyFAB({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'fixed', bottom: 32, right: 32, zIndex: 7000,
        width: 58, height: 58, borderRadius: '50%', border: 'none', cursor: 'pointer',
        background: 'linear-gradient(135deg, #dc2626, #ef4444)',
        boxShadow: '0 6px 24px rgba(220,38,38,.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.4rem', transition: 'all .25s',
        animation: 'pulse 2.5s ease-in-out infinite',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(220,38,38,.55)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(220,38,38,.45)'; }}
      title="Emergency Help"
    >🆘</button>
  );
}

/* ══════════════════════════════════════════════════════════════
   SECTION 2 — MULTI-LANGUAGE VOICE SUPPORT
══════════════════════════════════════════════════════════════ */

const LANGUAGES = [
  {
    code: 'en-IN', label: 'English', native: 'English', flag: '🇬🇧',
    phrases: {
      greeting:    'Hello! VISTA is ready to help you.',
      location:    'Finding your nearest station.',
      destination: 'Where would you like to go?',
      trains:      'Searching for trains.',
      help:        'Opening help and support.',
    },
    commands: ['go to', 'find trains', 'my location', 'help', 'destination'],
  },
  {
    code: 'hi-IN', label: 'Hindi', native: 'हिन्दी', flag: '🇮🇳',
    phrases: {
      greeting:    'नमस्ते! VISTA आपकी सहायता के लिए तैयार है।',
      location:    'आपका नज़दीकी स्टेशन ढूंढा जा रहा है।',
      destination: 'आप कहाँ जाना चाहते हैं?',
      trains:      'ट्रेनें खोजी जा रही हैं।',
      help:        'सहायता खोली जा रही है।',
    },
    commands: ['जाना है', 'ट्रेन खोजो', 'मेरी लोकेशन', 'मदद', 'गंतव्य'],
  },
  {
    code: 'mr-IN', label: 'Marathi', native: 'मराठी', flag: '🇮🇳',
    phrases: {
      greeting:    'नमस्कार! VISTA तुमच्या मदतीसाठी तयार आहे।',
      location:    'तुमचे जवळचे स्थानक शोधत आहे।',
      destination: 'तुम्हाला कुठे जायचे आहे?',
      trains:      'गाड्या शोधत आहे।',
      help:        'मदत उघडत आहे।',
    },
    commands: ['जायचे आहे', 'गाडी शोधा', 'माझे ठिकाण', 'मदत', 'गंतव्य'],
  },
];

function useMultiLangVoice(selectedLang) {
  const speak = useCallback((phraseKey, customText) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const lang = LANGUAGES.find(l => l.code === selectedLang) || LANGUAGES[0];
    const text = customText || lang.phrases[phraseKey] || phraseKey;

    const cleaned = text.replace(/[📍🎤🚆🗺️🚉🚌🛺🚕🚶🔊✅⭐]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleaned);
    utterance.lang = selectedLang;
    utterance.rate = 0.9;
    utterance.pitch = 1.05;

    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const preferred =
        voices.find(v => v.lang === selectedLang) ||
        voices.find(v => v.lang.startsWith(selectedLang.split('-')[0])) ||
        voices.find(v => v.lang.startsWith('en'));
      if (preferred) utterance.voice = preferred;
    };
    setVoice();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = setVoice;
    }
    window.speechSynthesis.speak(utterance);
  }, [selectedLang]);

  const listen = useCallback((onResult, onError) => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { if (onError) onError('not-supported'); return; }
    const rec = new SR();
    rec.lang = selectedLang;
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = e => { if (onResult) onResult(e.results[0][0].transcript); };
    rec.onerror  = e => { if (onError) onError(e.error); };
    rec.start();
  }, [selectedLang]);

  return { speak, listen };
}

function LanguageSection({ selectedLang, setSelectedLang, speak }) {
  const [testResult, setTestResult]   = useState('');
  const [listening,  setListening]    = useState(false);
  const { speak: mlSpeak, listen }    = useMultiLangVoice(selectedLang);

  const handleTest = (phraseKey) => {
    const lang = LANGUAGES.find(l => l.code === selectedLang);
    mlSpeak(phraseKey);
    speak(lang.phrases[phraseKey]);
    setTestResult(`Playing: "${lang.phrases[phraseKey]}"`);
    setTimeout(() => setTestResult(''), 4000);
  };

  const handleListen = () => {
    setListening(true);
    setTestResult('Listening…');
    listen(
      text => { setListening(false); setTestResult(`Heard: "${text}"`); },
      ()   => { setListening(false); setTestResult('Mic unavailable or language not supported. Try English.'); }
    );
  };

  const lang = LANGUAGES.find(l => l.code === selectedLang) || LANGUAGES[0];

  return (
    <div style={{ ...CARD, padding: '22px 24px', marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, background: G_BG, border: `1px solid ${G_BOR}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem',
        }}>🌐</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '.92rem', color: '#1a1a18' }}>Voice Language</div>
          <div style={{ fontSize: '.68rem', color: '#9a9a94' }}>Select language for voice commands & responses</div>
        </div>
      </div>

      {/* Language selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 18 }}>
        {LANGUAGES.map(l => (
          <button
            key={l.code}
            onClick={() => { setSelectedLang(l.code); speak(`Language changed to ${l.label}.`); }}
            style={{
              padding: '12px 8px', borderRadius: 12, border: `1.5px solid ${selectedLang === l.code ? G : 'rgba(0,0,0,.08)'}`,
              background: selectedLang === l.code ? G_BG : '#fff',
              cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all .2s',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '1.4rem', marginBottom: 4 }}>{l.flag}</div>
            <div style={{ fontWeight: 700, fontSize: '.78rem', color: selectedLang === l.code ? G_DARK : '#1a1a18' }}>{l.label}</div>
            <div style={{ fontSize: '.65rem', color: '#9a9a94', marginTop: 2 }}>{l.native}</div>
            {selectedLang === l.code && (
              <div style={{ marginTop: 5, fontSize: '.55rem', fontWeight: 700, color: G, letterSpacing: 1, textTransform: 'uppercase' }}>Active</div>
            )}
          </button>
        ))}
      </div>

      {/* Sample commands */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: '.58rem', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#bbb', marginBottom: 8 }}>
          Voice Commands in {lang.label}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {lang.commands.map(cmd => (
            <span key={cmd} style={{
              padding: '4px 12px', borderRadius: 20, fontSize: '.7rem', fontWeight: 600,
              background: G_BG, border: `1px solid ${G_BOR}`, color: G_DARK,
            }}>"{cmd}"</span>
          ))}
        </div>
      </div>

      {/* Test buttons */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: '.58rem', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#bbb', marginBottom: 8 }}>
          Test Voice Output
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {Object.keys(lang.phrases).map(key => (
            <button
              key={key}
              onClick={() => handleTest(key)}
              style={{
                padding: '6px 13px', borderRadius: 8, border: '1px solid rgba(0,0,0,.1)',
                background: '#fff', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                fontSize: '.72rem', fontWeight: 600, color: '#4a4a48', transition: 'all .18s',
                textTransform: 'capitalize',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = G_BOR; e.currentTarget.style.color = G_DARK; e.currentTarget.style.background = G_BG; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,.1)'; e.currentTarget.style.color = '#4a4a48'; e.currentTarget.style.background = '#fff'; }}
            >▶ {key}</button>
          ))}
        </div>
      </div>

      {/* Mic test */}
      <button
        onClick={handleListen}
        disabled={listening}
        style={{
          width: '100%', padding: '11px', borderRadius: 10, border: `1.5px solid ${G_BOR}`,
          background: listening ? G_BG : '#fff', cursor: listening ? 'not-allowed' : 'pointer',
          fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '.82rem',
          color: G_DARK, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all .2s',
        }}
      >
        <span style={{ fontSize: '1rem', animation: listening ? 'pulse 1s ease infinite' : 'none' }}>🎤</span>
        {listening ? 'Listening…' : `Test Mic in ${lang.label}`}
      </button>

      {testResult && (
        <div style={{
          marginTop: 10, padding: '8px 12px', borderRadius: 8,
          background: G_BG, border: `1px solid ${G_BOR}`,
          fontSize: '.75rem', color: G_DARK, fontWeight: 500,
          animation: 'fadeUp .2s ease',
        }}>{testResult}</div>
      )}

      <div style={{ marginTop: 12, fontSize: '.66rem', color: '#bbb', lineHeight: 1.5 }}>
        ⚠️ Hindi & Marathi voice recognition requires Chrome browser. Falls back to English if unsupported.
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SECTION 3 — JOURNEY HISTORY
══════════════════════════════════════════════════════════════ */

const HISTORY_KEY = 'vista_journey_history';

export function saveJourneyToHistory(nearestStation, destStation, destPlaceName) {
  if (!nearestStation || !destStation) return;
  try {
    const existing = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    const entry = {
      id:          Date.now(),
      from:        nearestStation.name,
      to:          destStation.name,
      place:       destPlaceName || destStation.name,
      fromStation: nearestStation,
      destStation: destStation,
      timestamp:   Date.now(),
      label:       timeAgoLabel(Date.now()),
    };
    // Remove duplicate same route
    const deduped = existing.filter(e => !(e.from === entry.from && e.to === entry.to));
    const updated = [entry, ...deduped].slice(0, 5);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch {}
}

function timeAgoLabel(ts) {
  const mins = Math.floor((Date.now() - ts) / 60000);
  if (mins < 1)  return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)} days ago`;
}

function JourneyHistorySection({ appState, setAppState, onNavigate, speak }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
      // Refresh labels
      const refreshed = stored.map(e => ({ ...e, label: timeAgoLabel(e.timestamp) }));
      setHistory(refreshed);
    } catch {
      setHistory([]);
    }
  }, []);

  const handleRepeat = (entry) => {
    setAppState(s => ({
      ...s,
      nearestStation:  entry.fromStation,
      destStation:     entry.destStation,
      destPlaceName:   entry.place,
      destPlaceCoords: null,
    }));
    speak(`Repeating journey from ${entry.from} to ${entry.to}.`);
    onNavigate('trains');
  };

  const handleClear = () => {
    localStorage.removeItem(HISTORY_KEY);
    setHistory([]);
    speak('Journey history cleared.');
  };

  const STATION_COLORS = {
    'Virar': '#7c3aed', 'Nalasopara': '#0891b2', 'Vasai Road': '#d97706',
    'Naigaon': '#dc2626', 'Bhayandar': '#ea580c', 'Mira Road': '#1d4ed8',
    'Dahisar': '#16a34a', 'Borivali': G_DARK,
  };

  return (
    <div style={{ ...CARD, padding: '22px 24px', marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: G_BG, border: `1px solid ${G_BOR}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem',
          }}>🕐</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '.92rem', color: '#1a1a18' }}>Recent Journeys</div>
            <div style={{ fontSize: '.68rem', color: '#9a9a94' }}>Tap to repeat any past route instantly</div>
          </div>
        </div>
        {history.length > 0 && (
          <button
            onClick={handleClear}
            style={{
              padding: '5px 11px', borderRadius: 8, border: '1px solid rgba(0,0,0,.1)',
              background: '#fff', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              fontSize: '.66rem', color: '#9a9a94', transition: 'all .18s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#dc2626'; e.currentTarget.style.borderColor = 'rgba(220,38,38,.25)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#9a9a94'; e.currentTarget.style.borderColor = 'rgba(0,0,0,.1)'; }}
          >Clear all</button>
        )}
      </div>

      {history.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '32px 20px',
          border: '1.5px dashed rgba(0,0,0,.1)', borderRadius: 12,
        }}>
          <div style={{ fontSize: '2rem', marginBottom: 10, opacity: .4 }}>🗺️</div>
          <div style={{ fontWeight: 600, fontSize: '.84rem', color: '#9a9a94', marginBottom: 4 }}>No journeys yet</div>
          <div style={{ fontSize: '.7rem', color: '#bbb' }}>Your routes will appear here after your first trip</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {history.map((entry, i) => {
            const fromColor = STATION_COLORS[entry.from] || G_DARK;
            const toColor   = STATION_COLORS[entry.to]   || G_DARK;
            return (
              <div key={entry.id} style={{
                background: i === 0 ? 'rgba(107,175,69,.04)' : '#fafaf8',
                border: `1px solid ${i === 0 ? G_BOR : 'rgba(0,0,0,.07)'}`,
                borderRadius: 12, padding: '13px 16px',
                display: 'flex', alignItems: 'center', gap: 12,
                transition: 'all .2s',
                animation: `fadeUp .35s ease-out ${i * 0.06}s both`,
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {/* Route visual */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{
                      padding: '2px 9px', borderRadius: 20, fontSize: '.68rem', fontWeight: 700,
                      background: `${fromColor}12`, color: fromColor, border: `1px solid ${fromColor}28`,
                      whiteSpace: 'nowrap',
                    }}>{entry.from}</span>
                    <div style={{ flex: 1, height: 1.5, background: `linear-gradient(90deg,${fromColor}44,${toColor}44)`, minWidth: 12 }} />
                    <span style={{ fontSize: '.75rem' }}>→</span>
                    <div style={{ flex: 1, height: 1.5, background: `linear-gradient(90deg,${fromColor}44,${toColor}44)`, minWidth: 12 }} />
                    <span style={{
                      padding: '2px 9px', borderRadius: 20, fontSize: '.68rem', fontWeight: 700,
                      background: `${toColor}12`, color: toColor, border: `1px solid ${toColor}28`,
                      whiteSpace: 'nowrap',
                    }}>{entry.to}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {entry.place !== entry.to && (
                      <span style={{ fontSize: '.65rem', color: '#9a9a94', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 140 }}>
                        📍 {entry.place}
                      </span>
                    )}
                    <span style={{ fontSize: '.6rem', color: '#ccc' }}>·</span>
                    <span style={{ fontSize: '.62rem', color: '#bbb', whiteSpace: 'nowrap' }}>{entry.label}</span>
                    {i === 0 && <span style={{ fontSize: '.52rem', fontWeight: 700, color: G, background: G_BG, padding: '1px 7px', borderRadius: 20, border: `1px solid ${G_BOR}`, letterSpacing: .5 }}>LAST</span>}
                  </div>
                </div>

                {/* Repeat button */}
                <button
                  onClick={() => handleRepeat(entry)}
                  style={{
                    padding: '8px 14px', borderRadius: 9, border: 'none', cursor: 'pointer',
                    background: `linear-gradient(135deg,${G},#5a9a38)`, color: '#fff',
                    fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '.72rem',
                    letterSpacing: '.2px', whiteSpace: 'nowrap', flexShrink: 0,
                    boxShadow: '0 3px 12px rgba(107,175,69,.28)', transition: 'all .2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 5px 16px rgba(107,175,69,.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 3px 12px rgba(107,175,69,.28)'; }}
                >↻ Repeat</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN HELP PAGE
══════════════════════════════════════════════════════════════ */

export default function HelpPage({ appState, setAppState, onNavigate, speak }) {
  const [drawerOpen,   setDrawerOpen]   = useState(false);
  const [selectedLang, setSelectedLang] = useState(() => {
    try { return localStorage.getItem('vista_lang') || 'en-IN'; } catch { return 'en-IN'; }
  });

  useEffect(() => {
    try { localStorage.setItem('vista_lang', selectedLang); } catch {}
  }, [selectedLang]);

  useEffect(() => {
    const t = setTimeout(() => speak('Help and support page. Access emergency contacts, change voice language, and view your journey history.'), 800);
    return () => clearTimeout(t);
  }, []);

  const FAQ = [
    { q: 'How do I find the nearest station?',        a: 'Go to the Location page and tap "Detect My Location". VISTA uses your GPS to find the nearest Western Line station.' },
    { q: 'What if GPS is not working?',               a: 'Tap "Use Demo Location" on the Location page to use Borivali as a demo starting point.' },
    { q: 'How are train timings calculated?',         a: 'VISTA uses a local train schedule updated for the Western Line. Times shown are from your boarding station, not Virar.' },
    { q: 'Can I use VISTA offline?',                  a: 'Train schedules and station data work offline. Geocoding (place search) requires an internet connection.' },
    { q: 'Why is the destination distance wrong?',    a: 'This can happen if the place name matches a location outside Mumbai. Try adding the area name, e.g. "Capital Mall Nalasopara".' },
    { q: 'How does last-mile cost calculation work?', a: 'VISTA estimates auto fare at ₹15/km, cab at ₹18/km + ₹40 base, and bike at ₹10/km. These are approximate Mumbai market rates.' },
  ];

  const [openFaq, setOpenFaq] = useState(null);

  return (
    <>
      <EmergencyDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} speak={speak} />
      <EmergencyFAB onClick={() => setDrawerOpen(true)} />

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(145deg, #f4f7f0 0%, #edf4e8 35%, #f8fbf6 70%, #fff 100%)',
        paddingTop: 72,
      }}>

        {/* ── Page header ── */}
        <div style={{
          padding: '36px 52px 0',
          maxWidth: 1100, margin: '0 auto',
          animation: 'fadeUp .5s ease-out both',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
            <div>
              <div style={{ fontSize: '.58rem', fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: G, marginBottom: 8 }}>
                Help & Support
              </div>
              <h1 style={{
                fontFamily: 'Playfair Display, serif', fontWeight: 900,
                fontSize: '2rem', color: '#1a1a18', lineHeight: 1.1, marginBottom: 8,
              }}>Your Safety Net</h1>
              <p style={{ color: '#8a8a84', fontSize: '.88rem', lineHeight: 1.65, maxWidth: 480 }}>
                Emergency contacts, voice language settings, and your journey history — all in one place.
              </p>
            </div>
            <button
              onClick={() => setDrawerOpen(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 20px', borderRadius: 12, border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                color: '#fff', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '.84rem',
                boxShadow: '0 6px 20px rgba(220,38,38,.35)', transition: 'all .22s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(220,38,38,.45)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(220,38,38,.35)'; }}
            >
              <span style={{ fontSize: '1.1rem' }}>🆘</span> Open Emergency Help
            </button>
          </div>

          {/* Quick-access emergency strip */}
          <div style={{
            ...CARD, padding: '14px 20px', marginBottom: 32,
            borderLeft: '3px solid #dc2626',
            display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 14,
          }}>
            <span style={{ fontSize: '.68rem', fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', letterSpacing: 1, whiteSpace: 'nowrap' }}>Quick Dial</span>
            {EMERGENCY_CONTACTS.slice(0, 4).map(c => (
              <a key={c.id} href={`tel:${c.number}`} style={{
                display: 'flex', alignItems: 'center', gap: 5, textDecoration: 'none',
                padding: '5px 12px', borderRadius: 8, border: `1px solid ${c.color}22`,
                background: `${c.color}06`, transition: 'all .18s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = `${c.color}12`; e.currentTarget.style.borderColor = `${c.color}44`; }}
                onMouseLeave={e => { e.currentTarget.style.background = `${c.color}06`; e.currentTarget.style.borderColor = `${c.color}22`; }}
              >
                <span style={{ fontSize: '.8rem' }}>{c.icon}</span>
                <span style={{ fontWeight: 700, fontSize: '.75rem', color: c.color }}>{c.number}</span>
                <span style={{ fontSize: '.65rem', color: '#9a9a94' }}>{c.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* ── Two-column grid ── */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 24, padding: '0 52px 60px',
          maxWidth: 1100, margin: '0 auto',
        }}>
          {/* LEFT */}
          <div>
            <div style={{ fontSize: '.58rem', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#bbb', marginBottom: 12 }}>
              Voice Settings
            </div>
            <LanguageSection selectedLang={selectedLang} setSelectedLang={setSelectedLang} speak={speak} />

            {/* FAQ */}
            <div style={{ fontSize: '.58rem', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#bbb', marginBottom: 12 }}>
              Frequently Asked
            </div>
            <div style={{ ...CARD, padding: '6px 0', marginBottom: 20 }}>
              {FAQ.map((item, i) => (
                <div key={i} style={{ borderBottom: i < FAQ.length - 1 ? '1px solid rgba(0,0,0,.05)' : 'none' }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{
                      width: '100%', textAlign: 'left', padding: '13px 18px',
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                    }}
                  >
                    <span style={{ fontWeight: 600, fontSize: '.8rem', color: '#1a1a18', lineHeight: 1.4 }}>{item.q}</span>
                    <span style={{ color: '#ccc', flexShrink: 0, transition: 'transform .2s', display: 'inline-block', transform: openFaq === i ? 'rotate(90deg)' : 'none' }}>›</span>
                  </button>
                  {openFaq === i && (
                    <div style={{
                      padding: '0 18px 14px',
                      fontSize: '.75rem', color: '#6a6a64', lineHeight: 1.65,
                      animation: 'fadeUp .2s ease',
                    }}>{item.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <div style={{ fontSize: '.58rem', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#bbb', marginBottom: 12 }}>
              Journey History
            </div>
            <JourneyHistorySection appState={appState} setAppState={setAppState} onNavigate={onNavigate} speak={speak} />

            {/* Tips card */}
            <div style={{ fontSize: '.58rem', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#bbb', marginBottom: 12 }}>
              Commuter Tips
            </div>
            <div style={{ ...CARD, padding: '18px 20px' }}>
              {[
                { icon: '🎫', tip: 'Buy a monthly pass at any station counter to save up to 40% on daily commuting.' },
                { icon: '⏰', tip: 'Peak hours are 8–10 AM and 6–9 PM. Fast trains are most crowded at these times.' },
                { icon: '👜', tip: 'Keep your bag in front of you in crowded trains. Don\'t leave valuables unattended.' },
                { icon: '📱', tip: 'Save RPF (182) and Railway Enquiry (139) in your phone before boarding.' },
                { icon: '♿', tip: 'Disabled-friendly coaches are at the front/rear of each train. Look for the blue marking.' },
                { icon: '🚺', tip: 'The first coach on every train is reserved for women passengers.' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 10, marginBottom: i < 5 ? 12 : 0,
                  paddingBottom: i < 5 ? 12 : 0,
                  borderBottom: i < 5 ? '1px solid rgba(0,0,0,.05)' : 'none',
                }}>
                  <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ fontSize: '.76rem', color: '#4a4a48', lineHeight: 1.6 }}>{item.tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 6px 24px rgba(220,38,38,.45); }
          50%       { box-shadow: 0 6px 32px rgba(220,38,38,.7); }
        }
      `}</style>
    </>
  );
}
