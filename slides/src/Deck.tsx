import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Player, PlayerRef} from '@remotion/player';
import {SlidesComp, SLIDE, SLIDE_COUNT, TOTAL} from './Slides';

/**
 * Deck de présentation type PowerPoint :
 * - Espace / → : slide suivante (déclenche son animation, puis pause à la fin)
 * - ← : slide précédente
 * - F : plein écran
 */
export const Deck: React.FC = () => {
  const ref = useRef<PlayerRef>(null);
  const [cur, setCur] = useState(0);

  const goTo = useCallback((i: number) => {
    const clamped = Math.max(0, Math.min(SLIDE_COUNT - 1, i));
    setCur(clamped);
    const p = ref.current;
    if (!p) return;
    p.seekTo(clamped * SLIDE);
    p.play();
  }, []);

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

  // Clavier
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'ArrowRight') {
        e.preventDefault();
        goTo(cur + 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goTo(cur - 1);
      } else if (e.key === 'f' || e.key === 'F') {
        ref.current?.requestFullscreen();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cur, goTo]);

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
      }}
    >
      <Player
        ref={ref}
        component={SlidesComp}
        durationInFrames={TOTAL}
        compositionWidth={1920}
        compositionHeight={1080}
        fps={30}
        controls={false}
        clickToPlay={false}
        doubleClickToFullscreen
        style={{width: '100%', maxWidth: '100vw', aspectRatio: '16 / 9'}}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 28,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 12,
        }}
      >
        {Array.from({length: SLIDE_COUNT}).map((_, i) => (
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
    </div>
  );
};
