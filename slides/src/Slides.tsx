import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame, interpolate} from 'remotion';
import {Centered, KineticText, Reveal} from './components';
import {LordiconIcon} from './LordiconIcon';
import {COLORS, FONT_FAMILY} from './theme';

// Durée par slide : 5 secondes à 30 fps. Alex parle dessus en présentation
// (navigation au clavier, le Deck pause à la fin de chaque slide).
export const SLIDE = 150;

// Mapping noms Lordicon (déposés dans public/) → concepts.
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
  // Icônes ajoutées pour les slides plus expressives
  coin: 'wired-flat-291-coin-dollar-hover-pinch.json',
  alert: 'wired-flat-2263-alert-hover-pinch.json',
  cogs: 'wired-flat-40-cogs-hover-mechanic.json',
  globe: 'wired-flat-735-world-globe-hover-roll.json',
  // À télécharger pour les 2 nouvelles slides (sinon affichage vide / placeholder)
  calendar: 'wired-flat-28-calendar-day-hover-line.json',
  trophy: 'wired-flat-1340-trophy-hover-pinch.json',
};

// ---------- Layouts ----------

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
  extra?: React.ReactNode;
}> = ({file, color, kicker, label, side = 'left', extra}) => {
  const icon = (
    <Reveal delay={8}>
      <LordiconIcon file={file} color={color} width={300} height={300} />
    </Reveal>
  );
  const text = (
    <div style={{display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 760}}>
      <KineticText text={kicker} fontSize={30} color={COLORS.orange} align="left" />
      <KineticText text={label} delay={20} fontSize={60} align="left" />
      {extra}
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

// Composant chiffre géant + libellé en dessous
const BigStat: React.FC<{value: string; unit: string; delay?: number}> = ({
  value,
  unit,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [delay, delay + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const s = interpolate(frame, [delay, delay + 12], [0.85, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: o, transform: `scale(${s})`}}>
      <span
        style={{
          fontFamily: FONT_FAMILY,
          fontWeight: 900,
          fontSize: 180,
          color: COLORS.orange,
          lineHeight: 1,
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontFamily: FONT_FAMILY,
          fontWeight: 600,
          fontSize: 28,
          color: COLORS.text,
          letterSpacing: 2,
          textTransform: 'uppercase',
        }}
      >
        {unit}
      </span>
    </div>
  );
};

// Petits chips de prix (Sonnet $3 / $15, etc.)
const PriceChip: React.FC<{model: string; input: string; output: string; delay?: number; color?: string}> = ({
  model,
  input,
  output,
  delay = 0,
  color = COLORS.text,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [delay, delay + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const y = interpolate(frame, [delay, delay + 10], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '14px 28px',
        border: `2px solid ${color}33`,
        borderRadius: 14,
        opacity: o,
        transform: `translateY(${y}px)`,
        background: `${color}08`,
      }}
    >
      <span
        style={{
          fontFamily: FONT_FAMILY,
          fontWeight: 700,
          fontSize: 22,
          color,
          letterSpacing: 1,
        }}
      >
        {model}
      </span>
      <span
        style={{
          fontFamily: FONT_FAMILY,
          fontWeight: 800,
          fontSize: 34,
          color: COLORS.text,
          marginTop: 4,
        }}
      >
        {input} / {output}
      </span>
    </div>
  );
};

// Bloc de code stylé (pour skill + script en S7)
const CodeChip: React.FC<{text: string; delay?: number}> = ({text, delay = 0}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [delay, delay + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <span
      style={{
        fontFamily: '"JetBrains Mono", "Fira Code", Menlo, monospace',
        fontWeight: 700,
        fontSize: 44,
        color: COLORS.orange,
        background: '#1a2030',
        padding: '8px 22px',
        borderRadius: 10,
        opacity: o,
      }}
    >
      {text}
    </span>
  );
};

// ---------- Les slides J1 théorie ----------

// S0 — Titre
const S0: React.FC = () => (
  <Centered>
    <Reveal delay={6}>
      <LordiconIcon file={ICON.sparkles} color={COLORS.orange} width={220} height={220} />
    </Reveal>
    <KineticText text="Le LLM, sous le capot." delay={20} fontSize={92} />
    <KineticText
      text="Avant de coder, comprendre vraiment."
      delay={48}
      fontSize={32}
      color={COLORS.blue}
    />
  </Centered>
);

// S1 — Bloc A : c'est quoi un LLM (avec lien cliquable vers tiktokenizer)
const S1: React.FC = () => {
  const frame = useCurrentFrame();
  const linkOpacity = interpolate(frame, [60, 72], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <>
      <Split
        side="left"
        file={ICON.brackets}
        color={COLORS.blue}
        kicker="SOUS LE CAPOT"
        label="Un prédicteur de tokens autoregressif."
        extra={
          <a
            href="https://tiktokenizer.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              opacity: linkOpacity,
              marginTop: 24,
              padding: '14px 28px',
              border: `2px solid ${COLORS.orange}`,
              borderRadius: 10,
              fontFamily: FONT_FAMILY,
              fontWeight: 700,
              fontSize: 26,
              color: COLORS.orange,
              textDecoration: 'none',
              background: `${COLORS.orange}10`,
              alignSelf: 'flex-start',
              transition: 'all .2s ease',
            }}
          >
            ▶ Démo : tiktokenizer.vercel.app
          </a>
        }
      />
    </>
  );
};

// S2 — Bloc B : context window — gros chiffre 200 000 (Sonnet 4.6)
const S2: React.FC = () => (
  <AbsoluteFill
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 120,
      padding: '0 150px',
    }}
  >
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
      <BigStat value="200 000" unit="Tokens max — Sonnet 4.6" delay={10} />
      <span
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 22,
          color: COLORS.blue,
          marginTop: 18,
          opacity: 0.85,
        }}
      >
        (Opus 4.8 et Haiku 4.5 : ~200k aussi · Gemini 2.5 Pro : 2M)
      </span>
    </div>
    <div style={{display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 620}}>
      <KineticText text="LE CONTEXTE" fontSize={30} color={COLORS.orange} align="left" />
      <KineticText
        text="Tout compte : prompt, tools, fichiers, historique."
        delay={20}
        fontSize={48}
        align="left"
      />
    </div>
  </AbsoluteFill>
);

// S3 — Bloc C : dégradation
const S3: React.FC = () => (
  <CenterHero
    file={ICON.thermo}
    color={COLORS.orange}
    kicker="DÉGRADATION — LOST IN THE MIDDLE"
    label="Plus le contexte gonfle, moins le LLM est précis."
    labelSize={52}
  />
);

// S4 — Bloc D intro : pricing — chiffres clés visibles
const S4: React.FC = () => {
  const frame = useCurrentFrame();
  const cacheOp = interpolate(frame, [70, 85], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 40}}>
      <Reveal delay={6}>
        <LordiconIcon file={ICON.coin} color={COLORS.orange} width={170} height={170} />
      </Reveal>
      <KineticText text="L'ÉCONOMIE — par million de tokens" delay={20} fontSize={30} color={COLORS.orange} />
      <div style={{display: 'flex', gap: 30, marginTop: 12}}>
        <PriceChip model="HAIKU 4.5" input="$1" output="$5" delay={36} color={COLORS.blue} />
        <PriceChip model="SONNET 4.6" input="$3" output="$15" delay={48} color={COLORS.orange} />
        <PriceChip model="OPUS 4.8" input="$15" output="$75" delay={60} color="#FF4D4D" />
      </div>
      <span
        style={{
          fontFamily: FONT_FAMILY,
          fontWeight: 800,
          fontSize: 42,
          color: COLORS.text,
          marginTop: 18,
          opacity: cacheOp,
        }}
      >
        ➜ Cache read : <span style={{color: COLORS.orange}}>-90 %</span>
      </span>
    </AbsoluteFill>
  );
};

// S5 — Bloc D détail : explosion, sous-titre chiffré
const S5: React.FC = () => (
  <Centered>
    <KineticText text="SANS CADRAGE" fontSize={30} color={COLORS.orange} />
    <Reveal delay={14}>
      <LordiconIcon file={ICON.flame} color={COLORS.orange} width={250} height={250} />
    </Reveal>
    <KineticText text="Ça part en flammes en une après-midi." delay={34} fontSize={56} />
    <KineticText
      text="30 à 50 $ / jour / dev, sans s'en rendre compte."
      delay={68}
      fontSize={32}
      color={COLORS.blue}
    />
  </Centered>
);

// S6 — Bloc E intro : limites du LLM seul (3 mots clés en gros)
const S6: React.FC = () => {
  const frame = useCurrentFrame();
  const words = ['Non-déterminisme.', 'Hallucinations.', 'Coûts.'];
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 36}}>
      <Reveal delay={6}>
        <LordiconIcon file={ICON.alert} color={COLORS.orange} width={170} height={170} />
      </Reveal>
      <KineticText text="LA LIMITE DU LLM SEUL" delay={20} fontSize={30} color={COLORS.orange} />
      <div style={{display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center'}}>
        {words.map((w, i) => {
          const delay = 38 + i * 16;
          const o = interpolate(frame, [delay, delay + 12], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const y = interpolate(frame, [delay, delay + 12], [30, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <span
              key={i}
              style={{
                fontFamily: FONT_FAMILY,
                fontWeight: 800,
                fontSize: 64,
                color: COLORS.text,
                opacity: o,
                transform: `translateY(${y}px)`,
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// S7 ⭐ — Bloc E réponse : skill + script — cogs + code stylé
const S7: React.FC = () => (
  <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 40}}>
    <Reveal delay={6}>
      <LordiconIcon file={ICON.cogs} color={COLORS.orange} width={240} height={240} />
    </Reveal>
    <KineticText text="LA RÉPONSE" delay={22} fontSize={30} color={COLORS.orange} />
    <div style={{display: 'flex', alignItems: 'center', gap: 24, marginTop: 8}}>
      <CodeChip text="SKILL.md" delay={42} />
      <span style={{fontSize: 60, color: COLORS.text, fontFamily: FONT_FAMILY, fontWeight: 800}}>+</span>
      <CodeChip text="script.py" delay={54} />
    </div>
    <KineticText text="Le LLM décide. Le script exécute." delay={72} fontSize={36} />
  </AbsoluteFill>
);

// S8 — Bloc F : écosystème — globe
const S8: React.FC = () => (
  <CenterHero
    file={ICON.globe}
    color={COLORS.blue}
    kicker="L'ÉCOSYSTÈME 2026"
    label="Claude Code. OpenClaw. Hermes. Ralph Loop."
    labelSize={48}
  />
);

// S9 — Programme de la semaine (4 jours)
const S9: React.FC = () => {
  const frame = useCurrentFrame();
  const days = [
    {label: 'J1 — Lundi', detail: 'Vibe coding. Le mur.', color: COLORS.orange},
    {label: 'J2 — Mardi', detail: 'Cadrage. Skills. Scripts.', color: COLORS.text},
    {label: 'J3 — Mercredi', detail: 'Workflows avancés. MCP.', color: COLORS.text},
    {label: 'J4 — Jeudi', detail: 'Audit. Soutenance.', color: COLORS.blue},
  ];
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 28}}>
      <Reveal delay={6}>
        <LordiconIcon file={ICON.calendar} color={COLORS.orange} width={140} height={140} />
      </Reveal>
      <KineticText text="PROGRAMME — 4 JOURS" delay={20} fontSize={30} color={COLORS.orange} />
      <div style={{display: 'flex', flexDirection: 'column', gap: 14, marginTop: 10}}>
        {days.map((d, i) => {
          const delay = 38 + i * 12;
          const o = interpolate(frame, [delay, delay + 12], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const x = interpolate(frame, [delay, delay + 12], [-30, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 28,
                opacity: o,
                transform: `translateX(${x}px)`,
              }}
            >
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 800,
                  fontSize: 36,
                  color: d.color,
                  minWidth: 280,
                }}
              >
                {d.label}
              </span>
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 500,
                  fontSize: 32,
                  color: COLORS.text,
                  opacity: 0.85,
                }}
              >
                {d.detail}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// S10 — Rendu final : soutenance + repo
const S10: React.FC = () => {
  const frame = useCurrentFrame();
  const items = [
    {value: '8 min', label: 'Soutenance individuelle', delay: 36},
    {value: '1 repo', label: 'Code + cadrage + skills', delay: 52},
    {value: '15 j', label: 'Délai notation', delay: 68},
  ];
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 32}}>
      <Reveal delay={6}>
        <LordiconIcon file={ICON.trophy} color={COLORS.orange} width={170} height={170} />
      </Reveal>
      <KineticText text="LE RENDU FINAL" delay={20} fontSize={30} color={COLORS.orange} />
      <KineticText text="Jeudi après-midi." delay={32} fontSize={56} />
      <div style={{display: 'flex', gap: 30, marginTop: 14}}>
        {items.map((it, i) => {
          const o = interpolate(frame, [it.delay, it.delay + 12], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const y = interpolate(frame, [it.delay, it.delay + 12], [20, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '16px 30px',
                border: `2px solid ${COLORS.orange}33`,
                borderRadius: 14,
                background: `${COLORS.orange}08`,
                opacity: o,
                transform: `translateY(${y}px)`,
              }}
            >
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 900,
                  fontSize: 56,
                  color: COLORS.orange,
                  lineHeight: 1,
                }}
              >
                {it.value}
              </span>
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 600,
                  fontSize: 22,
                  color: COLORS.text,
                  marginTop: 8,
                  textAlign: 'center',
                }}
              >
                {it.label}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// S11 — Closing
const S11: React.FC = () => (
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

export const SLIDE_COMPONENTS = [S0, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11];
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
