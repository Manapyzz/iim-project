import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {COLORS, FONT_FAMILY} from './theme';

/**
 * Scene : fond (dégradé radial = profondeur) + zoom lent global (effet Ken Burns).
 * À mettre à la racine de la compo. Les Sequences viennent dedans.
 */
export const Scene: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [1, 1.08]);
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 45%, #1a2030 0%, ${COLORS.bg} 70%)`,
      }}
    >
      <AbsoluteFill style={{transform: `scale(${scale})`}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Centre son contenu (vertical + horizontal). */
export const Centered: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill
    style={{
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      gap: 24,
      padding: 140,
    }}
  >
    {children}
  </AbsoluteFill>
);

/**
 * KineticText : texte qui apparaît mot par mot (translate + fondu, easing spring).
 * C'est ton style "texte Feynman".
 */
export const KineticText: React.FC<{
  text: string;
  delay?: number;
  fontSize?: number;
  color?: string;
  highlight?: string; // un mot à colorer en orange (accent)
  align?: 'center' | 'left';
}> = ({text, delay = 0, fontSize = 84, color = COLORS.text, highlight, align = 'center'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = text.split(' ');
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: align === 'left' ? 'flex-start' : 'center',
        columnGap: fontSize * 0.26,
        rowGap: fontSize * 0.12,
        maxWidth: 1500,
        textAlign: align,
        fontFamily: FONT_FAMILY,
        fontWeight: 800,
        fontSize,
        lineHeight: 1.1,
        color,
      }}
    >
      {words.map((w, i) => {
        const start = delay + i * 4;
        const p = spring({frame: frame - start, fps, config: {damping: 18, mass: 0.6}});
        const y = interpolate(p, [0, 1], [fontSize * 0.5, 0]);
        const blur = interpolate(p, [0, 1], [10, 0], {extrapolateRight: 'clamp'});
        const isHi =
          highlight && w.replace(/[.,?!]/g, '').toLowerCase() === highlight.toLowerCase();
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              transform: `translateY(${y}px)`,
              opacity: p,
              filter: `blur(${blur}px)`,
              color: isHi ? COLORS.orange : undefined,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

/**
 * Reveal : fait apparaître un élément (montée + léger rebond + fondu).
 * `delay` en frames. Le rebond (damping bas) = le "ease" qui fait pro.
 */
export const Reveal: React.FC<{delay?: number; children: React.ReactNode}> = ({
  delay = 0,
  children,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - delay, fps, config: {damping: 14, mass: 0.8}});
  const y = interpolate(p, [0, 1], [70, 0]);
  const s = interpolate(p, [0, 1], [0.88, 1]);
  const o = interpolate(frame, [delay, delay + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div style={{transform: `translateY(${y}px) scale(${s})`, opacity: o}}>{children}</div>
  );
};

// Lueur orange douce (sensation de chaleur), derrière la flamme. Pulse léger.
export const Glow: React.FC<{delay?: number; size?: number}> = ({delay = 0, size = 440}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [delay, delay + 25], [0, 0.5], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const pulse = 1 + 0.05 * Math.sin(frame / 7);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${COLORS.orange}55 0%, transparent 65%)`,
        filter: 'blur(22px)',
        opacity: o,
        transform: `scale(${pulse})`,
      }}
    />
  );
};

// ---------------------------------------------------------------------------
// ICÔNES PLACEHOLDER (SVG simples) — pour que la démo tourne sans rien télécharger.
// À remplacer par les Lottie Lordicon (voir README, section "Swap Lordicon").
// ---------------------------------------------------------------------------

export const GlassIcon: React.FC = () => (
  <svg width={180} height={210} viewBox="0 0 100 120">
    <path d="M22 10 H78 L70 110 H30 Z" fill={COLORS.blue} />
    <rect x="30" y="20" width="40" height="12" fill={COLORS.bg} opacity={0.85} />
  </svg>
);

export const FlameIcon: React.FC = () => (
  <svg width={150} height={180} viewBox="0 0 100 120">
    <path
      d="M50 5 C62 35 86 46 70 82 C65 100 50 112 50 112 C50 112 35 100 30 82 C16 50 38 46 50 5 Z"
      fill={COLORS.orange}
    />
  </svg>
);

// Thermomètre dont le MERCURE MONTE (piloté par le temps = on exprime "l'eau chauffe").
// La montée démarre ~frame 90 (après l'apparition de la flamme) sur ~80 frames.
export const ThermoIcon: React.FC = () => {
  const frame = useCurrentFrame();
  const fill = interpolate(frame, [90, 170], [8, 50], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <svg width={72} height={185} viewBox="0 0 40 110">
      <rect x="13" y="6" width="14" height="80" rx="7" fill="none" stroke={COLORS.orange} strokeWidth="5" />
      <circle cx="20" cy="92" r="14" fill={COLORS.orange} />
      <rect x="16" y={86 - fill} width="8" height={fill} rx="4" fill={COLORS.orange} />
    </svg>
  );
};
