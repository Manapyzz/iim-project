import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Player, PlayerRef} from '@remotion/player';
import {SlidesComp, SLIDE, SLIDE_COUNT, TOTAL} from './Slides';
import {J2SlidesComp, J2_SLIDE_COUNT, J2_TOTAL} from './J2Slides';
import {J3SlidesComp, J3_SLIDE_COUNT, J3_TOTAL} from './J3Slides';
import {J4SlidesComp, J4_SLIDE_COUNT, J4_TOTAL} from './J4Slides';

/**
 * Deck de présentation type PowerPoint.
 *
 * Desktop :
 * - Espace / → : slide suivante
 * - ← : slide précédente
 * - F : plein écran
 *
 * Mobile (Safari / Chrome iOS / Android) :
 * - Tap moitié gauche → précédent
 * - Tap moitié droite → suivant
 * - Boutons flèches affichés en bas
 * - Swipe horizontal (gauche / droite)
 *
 * Choix du deck via URL :
 * - / ou /?j=1 → deck J1 (théorie)
 * - /?j=2 → deck J2 (cadrage)
 */
export const Deck: React.FC = () => {
  const ref = useRef<PlayerRef>(null);
  const [cur, setCur] = useState(0);

  // Détermine quel deck afficher en fonction de l'URL.
  // J3 est public (mercredi 01/07 : le J3 démarre, plus besoin de protection).
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const jParam = params?.get('j');
  const isJ4 = jParam === '4';
  const isJ3 = !isJ4 && jParam === '3';
  const isJ2 = !isJ4 && !isJ3 && jParam === '2';
  const ActiveComp = isJ4 ? J4SlidesComp : isJ3 ? J3SlidesComp : isJ2 ? J2SlidesComp : SlidesComp;
  const ActiveCount = isJ4 ? J4_SLIDE_COUNT : isJ3 ? J3_SLIDE_COUNT : isJ2 ? J2_SLIDE_COUNT : SLIDE_COUNT;
  const ActiveTotal = isJ4 ? J4_TOTAL : isJ3 ? J3_TOTAL : isJ2 ? J2_TOTAL : TOTAL;

  const goTo = useCallback((i: number) => {
    const clamped = Math.max(0, Math.min(ActiveCount - 1, i));
    setCur(clamped);
    const p = ref.current;
    if (!p) return;
    p.seekTo(clamped * SLIDE);
    p.play();
  }, [ActiveCount]);

  const goNext = useCallback(() => goTo(cur + 1), [goTo, cur]);
  const goPrev = useCallback(() => goTo(cur - 1), [goTo, cur]);

  // Met en pause à la fin de la slide courante (pour attendre l'appui suivant).
  useEffect(() => {
    const p = ref.current;
    if (!p) return;
    const onFrame = (e: {detail: {frame: number}}) => {
      const end = (cur + 1) * SLIDE - 1;
      if (e.detail.frame >= end) {
        p.pause();
        p.seekTo(end);
      }
    };
    p.addEventListener('frameupdate', onFrame);
    return () => p.removeEventListener('frameupdate', onFrame);
  }, [cur]);

  // Clavier (desktop)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'f' || e.key === 'F') {
        ref.current?.requestFullscreen();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev]);

  // Swipe horizontal (mobile) — seuil 50px pour éviter les faux positifs (scroll vertical)
  useEffect(() => {
    let startX: number | null = null;
    let startY: number | null = null;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (startX === null || startY === null) return;
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const dx = endX - startX;
      const dy = endY - startY;
      startX = null;
      startY = null;
      // Doit être un mouvement horizontal franc (pas un scroll vertical)
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        if (dx < 0) goNext();
        else goPrev();
      }
    };

    window.addEventListener('touchstart', onTouchStart, {passive: true});
    window.addEventListener('touchend', onTouchEnd, {passive: true});
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [goNext, goPrev]);

  // Joue la première slide au montage.
  useEffect(() => {
    const t = setTimeout(() => goTo(0), 200);
    return () => clearTimeout(t);
  }, [goTo]);

  return (
    <div
      style={{
        position: 'relative',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000',
        // Empêche le double-tap zoom iOS qui peut interférer avec la nav
        touchAction: 'pan-y',
      }}
    >
      <Player
        ref={ref}
        component={ActiveComp}
        durationInFrames={ActiveTotal}
        compositionWidth={1920}
        compositionHeight={1080}
        fps={30}
        controls={false}
        clickToPlay={false}
        doubleClickToFullscreen
        style={{width: '100%', maxWidth: '100vw', aspectRatio: '16 / 9'}}
      />

      {/* Tap zones invisibles : moitié gauche/droite. Au-dessus du Player. */}
      <div
        onClick={goPrev}
        aria-label="Slide précédente"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '40%',
          height: '100%',
          cursor: 'w-resize',
          // En cas de besoin de debug : background: 'rgba(255,0,0,0.05)',
          zIndex: 5,
        }}
      />
      <div
        onClick={goNext}
        aria-label="Slide suivante"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '40%',
          height: '100%',
          cursor: 'e-resize',
          zIndex: 5,
        }}
      />

      {/* Badge J1 / J2 en haut à droite (au-dessus des tap zones) */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          right: 28,
          padding: '6px 14px',
          borderRadius: 6,
          background: 'rgba(0,0,0,0.5)',
          color: '#FF7A1A',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontWeight: 800,
          fontSize: 14,
          letterSpacing: 1,
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        {isJ4 ? 'J4 — WORKFLOWS' : isJ3 ? 'J3 — SKILLS' : isJ2 ? 'J2 — CADRAGE' : 'J1 — THÉORIE'}
      </div>

      {/* Dots progression + boutons mobile en bas */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        {/* Dots */}
        <div style={{display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', maxWidth: '90%'}}>
          {Array.from({length: ActiveCount}).map((_, i) => (
            <div
              key={i}
              style={{
                width: i === cur ? 26 : 10,
                height: 10,
                borderRadius: 6,
                background: i === cur ? '#FF7A1A' : 'rgba(245,245,240,0.28)',
                transition: 'all .25s ease',
              }}
            />
          ))}
        </div>

        {/* Boutons flèches — visibles sur mobile uniquement (max-width: 900px) */}
        <div
          className="deck-mobile-nav"
          style={{
            display: 'flex',
            gap: 18,
            pointerEvents: 'auto',
          }}
        >
          <NavButton onClick={goPrev} disabled={cur === 0} label="‹" />
          <NavButton onClick={goNext} disabled={cur === ActiveCount - 1} label="›" />
        </div>
      </div>

      {/* CSS pour cacher les boutons sur desktop */}
      <style>{`
        @media (min-width: 900px) {
          .deck-mobile-nav {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

const NavButton: React.FC<{onClick: () => void; disabled: boolean; label: string}> = ({onClick, disabled, label}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={label === '‹' ? 'Slide précédente' : 'Slide suivante'}
    style={{
      width: 56,
      height: 56,
      borderRadius: 28,
      border: 'none',
      background: disabled ? 'rgba(255,122,26,0.25)' : '#FF7A1A',
      color: '#fff',
      fontSize: 32,
      fontWeight: 800,
      lineHeight: 1,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      cursor: disabled ? 'default' : 'pointer',
      boxShadow: disabled ? 'none' : '0 4px 12px rgba(0,0,0,0.35)',
      opacity: disabled ? 0.5 : 1,
      transition: 'all .15s ease',
      WebkitTapHighlightColor: 'transparent',
    }}
  >
    {label}
  </button>
);
