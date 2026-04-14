// src/components/LanguageSelector.jsx
// Minimal 3-way language toggle: English · हिन्दी · मराठी
// Writes to localStorage key 'vista_lang'.
// useVoice.js reads that key on every speak() / startListening() call,
// so the change takes effect immediately — no prop drilling required.



import React, { useState, useEffect, useRef } from 'react';

const G      = '#6BAF45';
const G_DARK = '#4a8a2a';
const G_BG   = 'rgba(107,175,69,.09)';
const G_BOR  = 'rgba(107,175,69,.25)';

export const LANGUAGES = [
  { code: 'en-IN', short: 'EN', label: 'English',  native: 'English'  },
  { code: 'hi-IN', short: 'हि', label: 'Hindi',    native: 'हिन्दी'   },
  { code: 'mr-IN', short: 'म',  label: 'Marathi',  native: 'मराठी'    },
];

/* Confirmation messages shown briefly after switching */
const SWITCH_MSGS = {
  'en-IN': 'Language set to English.',
  'hi-IN': 'भाषा हिन्दी में बदली गई।',
  'mr-IN': 'भाषा मराठीत बदलली.',
};

function getLang() {
  try { return localStorage.getItem('vista_lang') || 'en-IN'; } catch { return 'en-IN'; }
}

/* ─────────────────────────────────────────────────────────
   Component — renders as a compact pill group
───────────────────────────────────────────────────────── */
export default function LanguageSelector({ speak, compact = false }) {
  const [selected,   setSelected]   = useState(getLang);
  const [toast,      setToast]      = useState('');
  const [open,       setOpen]       = useState(false); // for compact dropdown mode
  const toastTimer  = useRef(null);
  const dropdownRef = useRef(null);

  // Sync if another tab / component changes localStorage
  useEffect(() => {
    const handler = () => setSelected(getLang());
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleSelect = (code) => {
    setSelected(code);
    setOpen(false);
    try { localStorage.setItem('vista_lang', code); } catch {}

    // Brief toast
    clearTimeout(toastTimer.current);
    setToast(SWITCH_MSGS[code] || '');
    toastTimer.current = setTimeout(() => setToast(''), 2800);

    // Speak confirmation in the new language
    if (speak && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const msg  = SWITCH_MSGS[code];
      const utt  = new SpeechSynthesisUtterance(msg);
      utt.lang   = code;
      utt.rate   = 0.92;
      const setV = () => {
        const voices = window.speechSynthesis.getVoices();
        const v = voices.find(v => v.lang === code)
               || voices.find(v => v.lang.startsWith(code.split('-')[0]))
               || voices.find(v => v.lang.startsWith('en'));
        if (v) utt.voice = v;
      };
      setV();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = setV;
      }
      window.speechSynthesis.speak(utt);
    }
  };

  const currentLang = LANGUAGES.find(l => l.code === selected) || LANGUAGES[0];

  /* ── COMPACT mode (used inside Navbar — shows a dropdown) ── */
  if (compact) {
    return (
      <div ref={dropdownRef} style={{ position: 'relative' }}>
        {/* Trigger pill */}
        <button
          onClick={() => setOpen(o => !o)}
          title="Change voice language"
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '6px 11px', borderRadius: 20,
            border: `1.5px solid ${open ? G_BOR : 'rgba(0,0,0,.1)'}`,
            background: open ? G_BG : '#fff',
            cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            fontSize: '.75rem', fontWeight: 700,
            color: open ? G_DARK : '#4a4a48',
            transition: 'all .18s', userSelect: 'none',
          }}
          onMouseEnter={e => { if (!open) { e.currentTarget.style.borderColor = G_BOR; e.currentTarget.style.color = G_DARK; e.currentTarget.style.background = G_BG; }}}
          onMouseLeave={e => { if (!open) { e.currentTarget.style.borderColor = 'rgba(0,0,0,.1)'; e.currentTarget.style.color = '#4a4a48'; e.currentTarget.style.background = '#fff'; }}}
        >
          <span style={{ fontSize: '.8rem' }}>🌐</span>
          <span>{currentLang.short}</span>
          <span style={{
            display: 'inline-block', transition: 'transform .18s',
            transform: open ? 'rotate(180deg)' : 'none', color: '#aaa', fontSize: '.6rem',
          }}>▾</span>
        </button>

        {/* Dropdown */}
        {open && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 6000,
            background: '#fff',
            border: '1px solid rgba(0,0,0,.1)',
            borderRadius: 12,
            boxShadow: '0 8px 32px rgba(0,0,0,.13)',
            overflow: 'hidden', minWidth: 150,
            animation: 'langDropIn .18s ease',
          }}>
            {LANGUAGES.map((lang, i) => {
              const isActive = lang.code === selected;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  style={{
                    width: '100%', textAlign: 'left',
                    padding: '11px 15px',
                    background: isActive ? G_BG : '#fff',
                    border: 'none',
                    borderBottom: i < LANGUAGES.length - 1 ? '1px solid rgba(0,0,0,.05)' : 'none',
                    cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                    display: 'flex', alignItems: 'center', gap: 10,
                    transition: 'background .15s',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(0,0,0,.03)'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = '#fff'; }}
                >
                  <span style={{
                    width: 26, height: 26, borderRadius: 7, flexShrink: 0,
                    background: isActive ? G : 'rgba(0,0,0,.06)',
                    color: isActive ? '#fff' : '#4a4a48',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '.72rem', fontWeight: 800, transition: 'all .15s',
                  }}>{lang.short}</span>
                  <div>
                    <div style={{ fontWeight: isActive ? 700 : 500, fontSize: '.8rem', color: isActive ? G_DARK : '#1a1a18' }}>{lang.label}</div>
                    <div style={{ fontSize: '.62rem', color: '#9a9a94' }}>{lang.native}</div>
                  </div>
                  {isActive && <span style={{ marginLeft: 'auto', color: G, fontSize: '.8rem' }}>✓</span>}
                </button>
              );
            })}

            {/* Footer note */}
            <div style={{
              padding: '8px 15px', background: 'rgba(0,0,0,.02)',
              borderTop: '1px solid rgba(0,0,0,.05)',
              fontSize: '.58rem', color: '#bbb', lineHeight: 1.5,
            }}>
              Hindi & Marathi require Chrome browser
            </div>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div style={{
            position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
            zIndex: 9999, background: '#1a1a18', color: '#fff',
            padding: '10px 20px', borderRadius: 24,
            fontSize: '.8rem', fontWeight: 600, whiteSpace: 'nowrap',
            boxShadow: '0 4px 20px rgba(0,0,0,.25)',
            animation: 'langToastIn .22s ease',
            pointerEvents: 'none',
          }}>{toast}</div>
        )}

        <style>{`
          @keyframes langDropIn {
            from { opacity: 0; transform: translateY(-6px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes langToastIn {
            from { opacity: 0; transform: translate(-50%, 8px); }
            to   { opacity: 1; transform: translate(-50%, 0); }
          }
        `}</style>
      </div>
    );
  }

  /* ── FULL mode (used on a settings / help page — pill group) ── */
  return (
    <div>
      {/* Pill toggle row */}
      <div style={{
        display: 'inline-flex', gap: 4,
        background: 'rgba(0,0,0,.04)', borderRadius: 12, padding: 4,
      }}>
        {LANGUAGES.map(lang => {
          const isActive = lang.code === selected;
          return (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              style={{
                padding: '8px 16px', borderRadius: 9, border: 'none', cursor: 'pointer',
                background: isActive ? G : 'transparent',
                color: isActive ? '#fff' : '#6a6a64',
                fontFamily: 'Inter, sans-serif',
                fontWeight: isActive ? 700 : 500,
                fontSize: '.8rem',
                transition: 'all .2s',
                boxShadow: isActive ? '0 2px 8px rgba(107,175,69,.35)' : 'none',
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(0,0,0,.06)'; e.currentTarget.style.color = '#1a1a18'; }}}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6a6a64'; }}}
            >
              <span style={{ marginRight: 5, fontSize: '.85rem' }}>{lang.short}</span>
              {lang.label}
            </button>
          );
        })}
      </div>

      {/* Active language label */}
      <div style={{ marginTop: 8, fontSize: '.68rem', color: '#9a9a94' }}>
        Voice & recognition set to <strong style={{ color: G_DARK }}>{currentLang.label} ({currentLang.native})</strong>
      </div>

      {toast && (
        <div style={{
          marginTop: 10, padding: '8px 13px', borderRadius: 8,
          background: G_BG, border: `1px solid ${G_BOR}`,
          fontSize: '.74rem', color: G_DARK, fontWeight: 500,
          animation: 'langFadeUp .2s ease',
        }}>{toast}</div>
      )}

      <style>{`
        @keyframes langFadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
