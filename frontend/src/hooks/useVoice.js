// src/hooks/useVoice.js
// Enhanced voice hook — supports en-IN, hi-IN, mr-IN.
// Language is read from localStorage key 'vista_lang' so it stays in sync
// with whatever LanguageSelector.jsx writes. No prop-drilling needed.

import { useState, useCallback, useRef } from 'react';

/* ── helpers ─────────────────────────────────────────────── */
function getLang() {
  try { return localStorage.getItem('vista_lang') || 'en-IN'; } catch { return 'en-IN'; }
}

function pickVoice(lang) {
  if (!window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find(v => v.lang === lang) ||
    voices.find(v => v.lang.startsWith(lang.split('-')[0])) ||
    voices.find(v => v.lang === 'en-IN') ||
    voices.find(v => v.lang.startsWith('en')) ||
    null
  );
}

/* ── sanitise text before speaking ──────────────────────── */
function sanitise(text) {
  return text
    .replace(/₹(\d+)/g,          '$1 rupees')
    .replace(/(\d+)\s*km\b/g,    '$1 kilometers')
    .replace(/(\d+)\s*m\b/g,     '$1 meters')
    .replace(/\bmin\b/g,         'minutes')
    .replace(/\bPF\s*(\d)/g,     'Platform $1')
    .replace(/\bWR\b/g,          'Western Railway')
    .replace(/[📍🎤🚆🗺️🚉🚌🛺🚕🚶🔊✅⭐📋📡🔍⚠️]/g, '');
}

/* ══════════════════════════════════════════════════════════
   HOOK
══════════════════════════════════════════════════════════ */
export function useVoice() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking,  setIsSpeaking]  = useState(false);
  const recognitionRef = useRef(null);

  /* speak(text, onEnd?)
     Reads from localStorage on every call so a language change
     takes effect immediately without re-mounting. */
  const speak = useCallback((text, onEnd) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(true);

    const lang      = getLang();
    const cleaned   = sanitise(text);
    const utterance = new SpeechSynthesisUtterance(cleaned);
    utterance.lang  = lang;
    utterance.rate  = 0.92;
    utterance.pitch = 1.05;

    // Voice must be set after voices load (async on first call)
    const assignVoice = () => {
  const v = pickVoice(lang);

  console.log("Selected language:", lang);    
  console.log("Selected voice:", v);           
  console.log("All voices:", window.speechSynthesis.getVoices()); 

  if (v) {
    utterance.voice = v;
  } else {
    console.warn("No matching voice found, fallback happening ⚠️");
  }
};
    assignVoice();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = assignVoice;
    }

    utterance.onend  = () => { setIsSpeaking(false); if (onEnd) onEnd(); };
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, []);

  /* startListening — uses current language for recognition too */
  const startListening = useCallback((onResult, onError) => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      if (onError) onError('Speech recognition not supported. Please use Google Chrome.');
      return;
    }

    const lang = getLang();
    recognitionRef.current = new SR();
    recognitionRef.current.lang             = lang;
    recognitionRef.current.interimResults   = false;
    recognitionRef.current.maxAlternatives  = 1;
    recognitionRef.current.onstart  = () => setIsListening(true);
    recognitionRef.current.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setIsListening(false);
      if (onResult) onResult(transcript);
    };
    recognitionRef.current.onerror  = (e) => {
      setIsListening(false);
      // Fallback: if language not supported, retry in English
      if ((e.error === 'language-not-supported' || e.error === 'no-speech') && lang !== 'en-IN') {
        const fallback = new SR();
        fallback.lang            = 'en-IN';
        fallback.interimResults  = false;
        fallback.maxAlternatives = 1;
        fallback.onstart  = () => setIsListening(true);
        fallback.onresult = (ev) => {
          setIsListening(false);
          if (onResult) onResult(ev.results[0][0].transcript);
        };
        fallback.onerror = () => {
          setIsListening(false);
          if (onError) onError('Microphone error. Please try again.');
        };
        fallback.onend = () => setIsListening(false);
        fallback.start();
        recognitionRef.current = fallback;
      } else {
        if (onError) onError(e.error);
      }
    };
    recognitionRef.current.onend = () => setIsListening(false);
    recognitionRef.current.start();
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  return { speak, stopSpeaking, startListening, stopListening, isListening, isSpeaking };
}
