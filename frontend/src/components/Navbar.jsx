// src/components/Navbar.jsx — RESPONSIVE VERSION
import React, { useState } from 'react';
import GlobeLogo from './GlobeLogo';
import LanguageSelector from './LanguageSelector';
import { useIsMobile } from '../hooks/useIsMobile';

const NAV_ITEMS = [
  { page: 'home',     label: 'Home'        },
  { page: 'location', label: 'Location'    },
  { page: 'dest',     label: 'Destination' },
  { page: 'trains',   label: 'Trains'      },
  { page: 'lastmile', label: 'Last Mile'   },
];

export default function Navbar({ currentPage, onNavigate, speak }) {
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (page) => { onNavigate(page); setMenuOpen(false); };

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 5000,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: isMobile ? '8px 14px' : '10px 28px',
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(22px)',
        borderBottom: '1px solid rgba(0,0,0,.07)',
        boxShadow: '0 1px 12px rgba(0,0,0,.06)',
        animation: 'slideDown .8s ease forwards',
      }}>
        <div onClick={() => handleNav('home')} style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 6 : 10, cursor: 'pointer', userSelect: 'none' }}>
          <div style={{ background: '#1e1e1c', borderRadius: '50%', padding: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GlobeLogo size={isMobile ? 28 : 36} />
          </div>
          <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: isMobile ? '1.1rem' : '1.35rem', color: '#1a1a19', letterSpacing: 5, lineHeight: 1 }}>VISTA</div>
        </div>

        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {NAV_ITEMS.map(item => (
              <button key={item.page} onClick={() => handleNav(item.page)} style={{
                background: currentPage === item.page ? '#6BAF45' : 'transparent',
                color: currentPage === item.page ? '#fff' : '#6a6a64',
                border: 'none', cursor: 'pointer', padding: '8px 14px', borderRadius: 8,
                fontSize: '.82rem', fontWeight: currentPage === item.page ? 600 : 500,
                fontFamily: 'Inter, sans-serif', transition: 'all .25s',
              }}>{item.label}</button>
            ))}
            <button onClick={() => window.dispatchEvent(new CustomEvent('vista-open-help'))} style={{
              background: 'transparent', color: '#6a6a64', border: 'none', cursor: 'pointer',
              padding: '8px 14px', borderRadius: 8, fontSize: '.82rem', fontWeight: 500, fontFamily: 'Inter, sans-serif',
            }}>Help</button>
            <div style={{ marginLeft: 4 }}><LanguageSelector speak={speak} compact={true} /></div>
            <button onClick={() => handleNav('location')} style={{
              marginLeft: 8, padding: '9px 20px', borderRadius: 50,
              background: '#1e1e1c', color: '#ffffff', border: 'none', cursor: 'pointer',
              fontFamily: 'Inter, sans-serif', fontSize: '.83rem', fontWeight: 600,
              letterSpacing: '.3px', boxShadow: '0 2px 10px rgba(0,0,0,.15)',
            }}>Start Journey</button>
          </div>
        )}

        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <LanguageSelector speak={speak} compact={true} />
            <button onClick={() => setMenuOpen(!menuOpen)} style={{
              width: 36, height: 36, borderRadius: 8, border: '1px solid rgba(0,0,0,.1)',
              background: menuOpen ? 'rgba(0,0,0,.05)' : '#fff', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
            }}>
              <div style={{ width: 18, height: 2, background: '#1a1a19', borderRadius: 2, transition: 'all .2s', transform: menuOpen ? 'rotate(45deg) translateY(6px)' : 'none' }} />
              <div style={{ width: 18, height: 2, background: '#1a1a19', borderRadius: 2, opacity: menuOpen ? 0 : 1 }} />
              <div style={{ width: 18, height: 2, background: '#1a1a19', borderRadius: 2, transition: 'all .2s', transform: menuOpen ? 'rotate(-45deg) translateY(-6px)' : 'none' }} />
            </button>
          </div>
        )}
      </nav>

      {isMobile && menuOpen && (
        <>
          <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 4998, background: 'rgba(0,0,0,.3)' }} />
          <div style={{
            position: 'fixed', top: 52, left: 0, right: 0, zIndex: 4999,
            background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(0,0,0,.08)', boxShadow: '0 8px 32px rgba(0,0,0,.12)',
            padding: '8px 12px 12px', animation: 'fadeUp .2s ease-out',
          }}>
            {NAV_ITEMS.map(item => (
              <button key={item.page} onClick={() => handleNav(item.page)} style={{
                width: '100%', textAlign: 'left',
                background: currentPage === item.page ? 'rgba(107,175,69,.08)' : 'transparent',
                color: currentPage === item.page ? '#6BAF45' : '#3a3a38',
                border: 'none', cursor: 'pointer', padding: '12px 14px', borderRadius: 10,
                fontSize: '.88rem', fontWeight: currentPage === item.page ? 700 : 500,
                fontFamily: 'Inter, sans-serif', display: 'block', marginBottom: 2,
              }}>{item.label}</button>
            ))}
            <button onClick={() => { window.dispatchEvent(new CustomEvent('vista-open-help')); setMenuOpen(false); }} style={{
              width: '100%', textAlign: 'left', background: 'transparent', color: '#3a3a38',
              border: 'none', cursor: 'pointer', padding: '12px 14px', borderRadius: 10,
              fontSize: '.88rem', fontWeight: 500, fontFamily: 'Inter, sans-serif',
            }}>Help</button>
            <button onClick={() => handleNav('location')} style={{
              width: '100%', marginTop: 6, padding: '12px 0', borderRadius: 50,
              background: '#1e1e1c', color: '#fff', border: 'none', cursor: 'pointer',
              fontFamily: 'Inter, sans-serif', fontSize: '.88rem', fontWeight: 600,
            }}>Start Journey</button>
          </div>
        </>
      )}
    </>
  );
}
