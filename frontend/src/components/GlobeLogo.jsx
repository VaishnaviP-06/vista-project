// src/components/GlobeLogo.jsx
// Professional soft-green palette — no neon glow, smooth fade-in only
import React from 'react';

const G1 = '#6BAF45';  // primary soft green
const G2 = '#7FBF5F';  // mid soft green
const G3 = '#9FD080';  // light soft green

export default function GlobeLogo({ size = 165, animated = false }) {
  const cx = size / 2, cy = size / 2, r = size * 0.46;
  const id = `gl-${size}`;

  return (
    <svg
      width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none"
      style={animated ? { animation: 'logoFadeIn 0.6s ease-out both' } : {}}
    >
      <defs>
        <linearGradient id={`${id}-g1`} x1="0" y1="0" x2={size} y2={size} gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor={G3} />
          <stop offset="50%"  stopColor={G1} />
          <stop offset="100%" stopColor={G2} />
        </linearGradient>
        <linearGradient id={`${id}-g2`} x1="0" y1={cy} x2={size} y2={cy} gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor={G1} stopOpacity="0" />
          <stop offset="28%"  stopColor={G1} stopOpacity="0.85" />
          <stop offset="72%"  stopColor={G1} stopOpacity="0.85" />
          <stop offset="100%" stopColor={G1} stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-ig`} cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor={G1} stopOpacity=".07" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        {/* Minimal soft blur — NO heavy glow */}
        <filter id={`${id}-f`} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="0.8" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Inner fill */}
      <circle cx={cx} cy={cy} r={r} fill={`url(#${id}-ig)`} />
      {/* Outer ring — clean, thin */}
      <circle cx={cx} cy={cy} r={r} stroke={`url(#${id}-g1)`} strokeWidth="1.8" fill="none" opacity=".8" />
      <circle cx={cx} cy={cy} r={r} stroke={`url(#${id}-g1)`} strokeWidth="6"   fill="none" opacity=".06" />
      {/* Longitude ellipses */}
      <ellipse cx={cx} cy={cy} rx={r*0.62} ry={r} stroke={`url(#${id}-g1)`} strokeWidth="1"   fill="none" opacity=".32" />
      <ellipse cx={cx} cy={cy} rx={r*0.33} ry={r} stroke={`url(#${id}-g1)`} strokeWidth=".85" fill="none" opacity=".22" />
      <ellipse cx={cx} cy={cy} rx={r*0.11} ry={r} stroke={`url(#${id}-g1)`} strokeWidth=".65" fill="none" opacity=".15" />
      {/* Latitude arcs */}
      <path d={`M${cx-r} ${cy} Q${cx} ${cy-r*.27} ${cx+r} ${cy}`}                    stroke={`url(#${id}-g2)`} strokeWidth=".85" fill="none" opacity=".4" />
      <path d={`M${cx-r} ${cy} Q${cx} ${cy+r*.27} ${cx+r} ${cy}`}                    stroke={`url(#${id}-g2)`} strokeWidth=".85" fill="none" opacity=".4" />
      <path d={`M${cx-r*.8} ${cy-r*.37} Q${cx} ${cy-r*.55} ${cx+r*.8} ${cy-r*.37}`} stroke={`url(#${id}-g2)`} strokeWidth=".65" fill="none" opacity=".25" />
      <path d={`M${cx-r*.8} ${cy+r*.37} Q${cx} ${cy+r*.55} ${cx+r*.8} ${cy+r*.37}`} stroke={`url(#${id}-g2)`} strokeWidth=".65" fill="none" opacity=".25" />
      {/* Centre equator line */}
      <line x1={cx-r} y1={cy} x2={cx+r} y2={cy} stroke={`url(#${id}-g2)`} strokeWidth="2" filter={`url(#${id}-f)`} />
      {/* VISTA text */}
      <text x={cx} y={cy + size*0.042} textAnchor="middle"
        fontFamily="Playfair Display, serif" fontWeight="900"
        fontSize={size * 0.13} fill={`url(#${id}-g2)`}
        letterSpacing={size * 0.028} filter={`url(#${id}-f)`}
      >VISTA</text>
      {/* Centre dot */}
      <circle cx={cx} cy={cy} r={size*0.028} fill={G1} opacity=".88" />
      <circle cx={cx} cy={cy} r={size*0.013} fill="white" opacity=".9" />
      {/* Orbital dashed ring */}
      <ellipse cx={cx} cy={cy} rx={r*1.12} ry={r*0.26}
        stroke="rgba(107,175,69,.16)" strokeWidth="1" fill="none"
        strokeDasharray="4 7" transform={`rotate(-15 ${cx} ${cy})`}
      />
      {/* Orbit dots — soft, no glow */}
      <circle cx={cx+r*1.04} cy={cy-r*.21} r={size*0.018} fill={G1} opacity=".6" />
      <circle cx={cx-r*.98}  cy={cy+r*.17} r={size*0.015} fill={G1} opacity=".5" />
    </svg>
  );
}
