import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame, interpolate} from 'remotion';
import {Centered, KineticText, Reveal} from './components';
import {LordiconIcon} from './LordiconIcon';
import {COLORS, FONT_FAMILY} from './theme';

// Durée par slide : 5 secondes à 30 fps. Alex parle dessus en présentation
// (navigation au clavier, le Deck pause à la fin de chaque slide).
export const SLIDE = 150;

// Mapping noms Lordicon (déposés dans public/) → concepts.
// Seules ces icônes sont nécessaires pour le J1 théorie.
const ICON = {
  sparkles: 'wired-flat-2474-sparkles-glitter-hover-pinch.json',
  brackets: 'wired-flat-2287-web-development-brackets-hover-pinch.json',
  document: 'wired-flat-56-document-hover-swipe.json',
  thermo: 'wired-flat-442-thermometer-hover-changing.json',
  rocket: 'wired-flat-489-rocket-space-hover-flying.json',
  flame: 'wired-flat-2804-fire-flame-hover-pinch.json',
  lab: 'wired-flat-439-lab-bottle-triangle-hover-oscillate.json',
  bulb: 'wired-flat-36-bulb-hover-blink.json',
  polygon: 'wired-flat-1422-polygon-hover-pinch.json',
};

// ---------- Layouts (variés pour ne pas être monotone) ----------

const CenterHero: React.FC<{
  file: string;
  color: string;
  label: string;
  kicker?: string;
  size?: number;
  labelSize?: number;
}> = ({file, color, label, kicker, size = 250, labelSize = 56}) => (
  <Centered>
    {kicker ? <KineticText text={kicker} fontSize={30} color={COLORS.orange} /> : null}
    <Reveal delay={kicker ? 14 : 6}>
      <LordiconIcon file={file} color={color} width={size} height={size} />
    </Reveal>
    <KineticText text={label} delay={kicker ? 34 : 26} fontSize={labelSize} />
  </Centered>
);

const Split: React.FC<{
  file: string;
  color: string;
  kicker: string;
  label: string;
  side?: 'left' | 'right';
}> = ({file, color, kicker, label, side = 'left'}) => {
  const icon = (
    <Reveal delay={8}>
      <LordiconIcon file={file} color={color} width={300} height={300} />
    </Reveal>
  );
  const text = (
    <div style={{display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 760}}>
      <KineticText text={kicker} fontSize={30} color={COLORS.orange} align="left" />
      <KineticText text={label} delay={20} fontSize={60} align="left" />
    </div>
  );
  return (
    <AbsoluteFill
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 90,
        padding: '0 150px',
      }}
    >
      {side === 'left' ? (
        <>
          {icon}
          {text}
        </>
      ) : (
        <>
          {text}
          {icon}
        </>
      )}
    </AbsoluteFill>
  );
};

// ---------- Les slides J1 théorie ----------

// S0 — Titre — sparkles
const S0: React.FC = () => (
  <Centered>
    <Reveal delay={6}>
      <LordiconIcon file={ICON.sparkles} color={COLORS.orange} width={220} height={220} />
    </Reveal>
    <KineticText text="Comprendre le LLM en 1h" delay={20} fontSize={84} />
    <KineticText text="M1 IWID — IIM" delay={48} fontSize={32} color={COLORS.blue} />
  </Centered>
);

// S1 — Bloc A : c'est quoi un LLM
const S1: React.FC = () => (
  <Split
    side="left"
    file={ICON.brackets}
    color={COLORS.blue}
    kicker="SOUS LE CAPOT"
    label="Un prédicteur de tokens autoregressif."
  />
);

// S2 — Bloc B : tokens et contexte
const S2: React.FC = () => (
  <Split
    side="right"
    file={ICON.document}
    color={COLORS.orange}
    kicker="LE CONTEXTE"
    label="200 000 tokens max. Tout compte : prompt, tools, fichiers, historique."
  />
);

// S3 — Bloc C : dégradation quand le contexte explose
const S3: React.FC = () => (
  <CenterHero
    file={ICON.thermo}
    color={COLORS.orange}
    kicker="DÉGRADATION"
    label="Plus le contexte gonfle, moins le LLM est précis."
    labelSize={52}
  />
);

// S4 — Bloc D intro : pricing
const S4: React.FC = () => (
  <Split
    side="left"
    file={ICON.rocket}
    color={COLORS.orange}
    kicker="L'ÉCONOMIE"
    label="Sonnet : 3 $ in, 15 $ out / MTok. Caching : -90 %."
  />
);

// S5 — Bloc D détail : sans cadrage = explosion
const S5: React.FC = () => (
  <CenterHero
    file={ICON.flame}
    color={COLORS.orange}
    kicker="SANS CADRAGE"
    label="Ça part en flammes en une après-midi."
    labelSize={56}
  />
);

// S6 — Bloc E intro : limites du LLM seul
const S6: React.FC = () => (
  <Split
    side="right"
    file={ICON.lab}
    color={COLORS.blue}
    kicker="LA LIMITE DU LLM SEUL"
    label="Non-déterminisme. Hallucinations. Coûts incontrôlables."
  />
);

// S7 — Bloc E réponse : le pattern central
const S7: React.FC = () => (
  <CenterHero
    file={ICON.brackets}
    color={COLORS.orange}
    kicker="LA RÉPONSE"
    label="Skills + scripts déterministes."
    size={260}
  />
);

// S8 — Bloc F : écosystème agentique 2026
const S8: React.FC = () => (
  <CenterHero
    file={ICON.polygon}
    color={COLORS.blue}
    kicker="L'ÉCOSYSTÈME 2026"
    label="Claude Code. OpenClaw. Hermes. Ralph Loop."
    labelSize={48}
  />
);

// S9 — Closing : teaser de la semaine
const S9: React.FC = () => (
  <CenterHero
    file={ICON.bulb}
    color={COLORS.orange}
    label="Cette semaine, on apprend à cadrer."
    labelSize={64}
  />
);

// Fondu d'entrée par slide (crossfade)
const SlideFade: React.FC<{children: React.ReactNode}> = ({children}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

export const SLIDE_COMPONENTS = [S0, S1, S2, S3, S4, S5, S6, S7, S8, S9];
export const SLIDE_COUNT = SLIDE_COMPONENTS.length;
export const TOTAL = SLIDE * SLIDE_COUNT;

export const SlidesComp: React.FC = () => (
  <AbsoluteFill
    style={{background: `radial-gradient(circle at 50% 45%, #1a2030 0%, ${COLORS.bg} 70%)`}}
  >
    {SLIDE_COMPONENTS.map((S, i) => (
      <Sequence key={i} from={i * SLIDE} durationInFrames={SLIDE}>
        <SlideFade>
          <S />
        </SlideFade>
      </Sequence>
    ))}
  </AbsoluteFill>
);
