// src/components/UI.jsx
import React from 'react';

export function Btn({ children, variant = 'primary', onClick, style = {}, disabled = false }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 9,
    padding: '13px 28px', borderRadius: 50,
    fontFamily: 'Inter, sans-serif', fontSize: '.92rem', fontWeight: 600,
    letterSpacing: '.5px', cursor: disabled ? 'not-allowed' : 'pointer',
    border: 'none', transition: 'all .25s ease', opacity: disabled ? 0.55 : 1,
  };
  const variants = {
    primary:   { background: 'linear-gradient(135deg,#6BAF45,#5a9a38)', color: '#fff', boxShadow: '0 4px 18px rgba(107,175,69,.32)', fontWeight: 700 },
    secondary: { background: '#fff', color: '#3a3a38', border: '1.5px solid rgba(0,0,0,.12)', boxShadow: '0 2px 8px rgba(0,0,0,.06)' },
    green:     { background: 'linear-gradient(135deg,#6BAF45,#5a9a38)', color: '#fff', boxShadow: '0 4px 18px rgba(107,175,69,.32)', fontWeight: 700 },
    red:       { background: 'linear-gradient(135deg,#e05252,#c03030)', color: 'white', boxShadow: '0 0 22px rgba(224,82,82,.3)' },
  };
  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{ ...base, ...variants[variant], ...style }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
    >{children}</button>
  );
}

export function Card({ children, style = {}, glowColor = 'rgba(0,0,0,.09)' }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.88)',
      border: `1px solid ${glowColor}`,
      borderRadius: 18, padding: 22,
      backdropFilter: 'blur(16px)', boxShadow: '0 4px 24px rgba(0,0,0,.08)',
      ...style,
    }}>{children}</div>
  );
}

export function VoiceStatus({ text, color = '#7aaa00' }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '13px 18px',
      background: 'rgba(195,248,50,.14)', border: '1px solid rgba(122,170,0,.28)',
      borderRadius: 12, marginBottom: 18,
    }}>
      <div style={{
        width: 9, height: 9, background: color, borderRadius: '50%',
        animation: 'pulse 1s ease infinite', boxShadow: `0 0 10px ${color}`, flexShrink: 0,
      }} />
      <span style={{ fontSize: '.88rem', color: '#9a9a94' }}>{text}</span>
    </div>
  );
}

export function MicBtn({ listening, onClick, size = 70 }) {
  return (
    <button onClick={onClick} style={{
      width: size, height: size, borderRadius: '50%', border: 'none', cursor: 'pointer',
      background: listening
        ? 'linear-gradient(135deg,#e05252,#c03030)'
        : 'linear-gradient(135deg,#c3f832,#aad929)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.34, transition: 'all .25s ease',
      boxShadow: listening ? '0 0 35px rgba(224,82,82,.5)' : '0 0 28px rgba(195,248,50,.45)',
      animation: listening ? 'micPulse 1s ease infinite' : 'none',
    }}>🎤</button>
  );
}

export function Badge({ children, type = 'fast' }) {
  const styles = {
    fast: { background: 'rgba(195,248,50,.25)', border: '1px solid #aad929', color: '#4a7000' },
    slow: { background: 'rgba(0,0,0,.05)',      border: '1px solid rgba(0,0,0,.15)', color: '#5a5a54' },
    next: { background: 'rgba(195,248,50,.15)',  border: '1px solid #4a7000', color: '#1a1a19' },
  };
  return (
    <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: '.73rem', fontWeight: 600, letterSpacing: '.8px', ...(styles[type] || styles.fast) }}>
      {children}
    </span>
  );
}

export function InfoRow({ label, value, valueColor = '#2a6a00' }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '9px 0', borderBottom: '1px solid rgba(0,0,0,.07)',
    }}>
      <span style={{ color: '#7a7a74', fontSize: '.82rem' }}>{label}</span>
      <span style={{ color: valueColor, fontSize: '.88rem', fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{value}</span>
    </div>
  );
}

export function GlowLine() {
  return (
    <div style={{
      width: 180, height: 2, margin: '0 auto 28px', borderRadius: 2,
      background: 'linear-gradient(90deg,transparent,#4a7000,rgba(195,248,50,.5),transparent)',
    }} />
  );
}

export function Pill({ children, dotColor = '#7aaa00' }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px',
      background: 'rgba(255,255,255,0.88)', border: '1px solid rgba(0,0,0,.09)',
      borderRadius: 50, fontSize: '.78rem', color: '#9a9a94', backdropFilter: 'blur(10px)',
    }}>
      <div style={{ width: 7, height: 7, borderRadius: '50%', background: dotColor, boxShadow: `0 0 6px ${dotColor}`, flexShrink: 0 }} />
      {children}
    </div>
  );
}

export function VoiceWave() {
  const heights = [12,25,40,52,60,48,35,55,45,30,20,10,25,38,50,58,42,28,15,8];
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, height: 60 }}>
      {heights.map((h, i) => (
        <div key={i} style={{
          width: 4, borderRadius: 4, height: h,
          background: 'linear-gradient(180deg,#5a9a38,#6BAF45)',
          animation: 'wave 1.4s ease-in-out infinite',
          animationDelay: `${(i * 0.07).toFixed(2)}s`,
          opacity: 0.85,
        }} />
      ))}
    </div>
  );
}
