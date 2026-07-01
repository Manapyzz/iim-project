import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame, interpolate} from 'remotion';
import {Centered, KineticText, Reveal} from './components';
import {LordiconIcon} from './LordiconIcon';
import {COLORS, FONT_FAMILY} from './theme';

// Slides J2 — Cadrage / Scripts / Gates
// Format : 5 secondes par slide à 30 fps, navigation au clavier dans Deck.
export const SLIDE = 150;

// Icônes Lordicon (toutes présentes dans public/).
const ICON = {
  sparkles: 'wired-flat-2474-sparkles-glitter-hover-pinch.json',
  brackets: 'wired-flat-2287-web-development-brackets-hover-pinch.json',
  document: 'wired-flat-56-document-hover-swipe.json',
  rocket: 'wired-flat-489-rocket-space-hover-flying.json',
  flame: 'wired-flat-2804-fire-flame-hover-pinch.json',
  bulb: 'wired-flat-36-bulb-hover-blink.json',
  polygon: 'wired-flat-1422-polygon-hover-pinch.json',
  coin: 'wired-flat-291-coin-dollar-hover-pinch.json',
  alert: 'wired-flat-2263-alert-hover-pinch.json',
  cogs: 'wired-flat-40-cogs-hover-mechanic.json',
  globe: 'wired-flat-735-world-globe-hover-roll.json',
  trophy: 'wired-flat-3263-trophy-circle-hover-roll.json',
  // Nouvelles icônes spécifiques au J2
  shield: 'wired-flat-3278-shield-checkered-hover-pinch.json',
  target: 'wired-flat-458-goal-target-hover-hit.json',
  robot: 'wired-flat-461-robot-hover-pinch.json',
};

// ============ COMPOSANTS DE LAYOUT ============

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

// ============ SLIDES J2 ============

// J2-S0 — Intro "J2 — Cadrage"
const J2S0: React.FC = () => (
  <CenterHero
    file={ICON.shield}
    color={COLORS.orange}
    kicker="JOUR 2 — MARDI"
    label="Cadrage. Scripts. Gates."
    labelSize={84}
  />
);

// J2-S1 — Pivot "LLM puissant mais stupide seul"
const J2S1: React.FC = () => {
  const frame = useCurrentFrame();
  const op2 = interpolate(frame, [40, 55], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <Centered>
      <Reveal delay={4}>
        <LordiconIcon file={ICON.robot} color={COLORS.blue} width={180} height={180} />
      </Reveal>
      <KineticText text="Le LLM est puissant." delay={18} fontSize={56} color={COLORS.text} />
      <KineticText text="Mais stupide seul." delay={28} fontSize={56} color={COLORS.text} />
      <div
        style={{
          marginTop: 30,
          padding: '20px 36px',
          border: `3px solid ${COLORS.orange}`,
          borderRadius: 16,
          background: `${COLORS.orange}15`,
          opacity: op2,
        }}
      >
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 800,
            fontSize: 44,
            color: COLORS.orange,
          }}
        >
          Le cadrage le rend fiable.
        </span>
      </div>
    </Centered>
  );
};

// J2-S2 — Les 3 piliers
const J2S2: React.FC = () => {
  const frame = useCurrentFrame();
  const pillars = [
    {file: ICON.document, color: COLORS.blue, label: 'CLAUDE.md', sub: 'la doctrine', delay: 14},
    {file: ICON.cogs, color: COLORS.orange, label: 'SCRIPTS', sub: 'le déterministe', delay: 28},
    {file: ICON.shield, color: '#7C4DFF', label: 'GATES', sub: 'l’antifuite', delay: 42},
  ];
  return (
    <AbsoluteFill
      style={{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 40,
      }}
    >
      <KineticText text="LES 3 PILIERS DU CADRAGE" delay={4} fontSize={32} color={COLORS.orange} />
      <div
        style={{
          display: 'flex',
          gap: 70,
          marginTop: 20,
        }}
      >
        {pillars.map((p, i) => {
          const op = interpolate(frame, [p.delay, p.delay + 12], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const y = interpolate(frame, [p.delay, p.delay + 12], [30, 0], {
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
                gap: 16,
                opacity: op,
                transform: `translateY(${y}px)`,
              }}
            >
              <LordiconIcon file={p.file} color={p.color} width={180} height={180} />
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 900,
                  fontSize: 36,
                  color: p.color,
                }}
              >
                {p.label}
              </span>
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 500,
                  fontSize: 22,
                  color: COLORS.text,
                  opacity: 0.8,
                }}
              >
                {p.sub}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// J2-S3 — Les 7 anti-patterns ingénierie
const J2S3: React.FC = () => {
  const frame = useCurrentFrame();
  const rules = [
    'Big bang refacto',
    'No stub / no TODO',
    'No silent fail',
    'No revert',
    'No god file (>250L)',
    'No magic number',
    'No vibe-prompt',
  ];
  return (
    <AbsoluteFill
      style={{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 24,
        padding: '0 200px',
      }}
    >
      <Reveal delay={4}>
        <LordiconIcon file={ICON.alert} color="#FF4D4D" width={120} height={120} />
      </Reveal>
      <KineticText
        text="LES 7 COMMANDEMENTS TRANSVERSES"
        delay={14}
        fontSize={32}
        color={COLORS.orange}
      />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
          marginTop: 16,
          width: '100%',
          maxWidth: 1200,
        }}
      >
        {rules.map((rule, i) => {
          const delay = 28 + i * 6;
          const op = interpolate(frame, [delay, delay + 10], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const x = interpolate(frame, [delay, delay + 10], [-30, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '14px 22px',
                border: `2px solid ${COLORS.text}25`,
                borderRadius: 12,
                opacity: op,
                transform: `translateX(${x}px)`,
                gridColumn: i === 6 ? '1 / span 2' : 'auto',
                justifyContent: i === 6 ? 'center' : 'flex-start',
              }}
            >
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 900,
                  fontSize: 26,
                  color: '#FF4D4D',
                  minWidth: 40,
                }}
              >
                {i + 1}
              </span>
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 700,
                  fontSize: 26,
                  color: COLORS.text,
                }}
              >
                ❌ {rule}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// J2-S4 — Tableau Scripts vs LLM
const J2S4: React.FC = () => {
  const frame = useCurrentFrame();
  const rows = [
    {llm: 'Rédige un brouillon de mail', script: 'Calcule la TVA'},
    {llm: 'Refactore ce composant', script: 'Vérifie qu\'un email est valide'},
    {llm: 'Explique ce code', script: 'Convertis en ISO 8601'},
    {llm: 'Quel pattern d\'archi ?', script: 'Lis un CSV, extrais colonnes'},
  ];
  return (
    <AbsoluteFill
      style={{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 24,
        padding: '0 100px',
      }}
    >
      <KineticText text="SCRIPTS vs LLM" delay={4} fontSize={32} color={COLORS.orange} />
      <div
        style={{
          display: 'flex',
          gap: 30,
          width: '100%',
          maxWidth: 1400,
          marginTop: 14,
        }}
      >
        {/* Colonne LLM */}
        <div
          style={{
            flex: 1,
            border: `3px solid ${COLORS.blue}`,
            borderRadius: 18,
            padding: '28px 24px',
            background: `${COLORS.blue}10`,
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16}}>
            <LordiconIcon file={ICON.brackets} color={COLORS.blue} width={72} height={72} />
            <span style={{fontFamily: FONT_FAMILY, fontWeight: 900, fontSize: 36, color: COLORS.blue}}>
              LLM
            </span>
          </div>
          <ul style={{paddingLeft: 24, margin: 0, listStyle: 'none'}}>
            {rows.map((r, i) => {
              const op = interpolate(frame, [22 + i * 6, 32 + i * 6], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });
              return (
                <li
                  key={i}
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: 22,
                    color: COLORS.text,
                    padding: '8px 0',
                    opacity: op,
                  }}
                >
                  ▸ {r.llm}
                </li>
              );
            })}
          </ul>
        </div>
        {/* Colonne Script */}
        <div
          style={{
            flex: 1,
            border: `3px solid ${COLORS.orange}`,
            borderRadius: 18,
            padding: '28px 24px',
            background: `${COLORS.orange}10`,
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16}}>
            <LordiconIcon file={ICON.cogs} color={COLORS.orange} width={72} height={72} />
            <span style={{fontFamily: FONT_FAMILY, fontWeight: 900, fontSize: 36, color: COLORS.orange}}>
              SCRIPT
            </span>
          </div>
          <ul style={{paddingLeft: 24, margin: 0, listStyle: 'none'}}>
            {rows.map((r, i) => {
              const op = interpolate(frame, [22 + i * 6, 32 + i * 6], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });
              return (
                <li
                  key={i}
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: 22,
                    color: COLORS.text,
                    padding: '8px 0',
                    opacity: op,
                  }}
                >
                  ▸ {r.script}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      {/* Règle d'or */}
      <div
        style={{
          marginTop: 18,
          padding: '14px 28px',
          border: `2px solid ${COLORS.orange}`,
          borderRadius: 12,
          background: `${COLORS.orange}15`,
          opacity: interpolate(frame, [60, 78], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 800,
            fontSize: 26,
            color: COLORS.orange,
          }}
        >
          Si tu peux écrire un test qui PROUVE le résultat → c’est un SCRIPT.
        </span>
      </div>
    </AbsoluteFill>
  );
};

// J2-S4b — Les 3 patterns universels (matchent tous les projets)
const J2S4b: React.FC = () => {
  const frame = useCurrentFrame();
  const patterns = [
    {
      icon: ICON.cogs,
      color: COLORS.orange,
      name: 'CALCUL MÉTIER',
      sub: 'TVA, scoring, total…',
      question: "Empêcher Claude d'inventer une formule",
      delay: 18,
    },
    {
      icon: ICON.polygon,
      color: COLORS.blue,
      name: "MACHINE D'ÉTAT",
      sub: 'workflow commande, paris…',
      question: "Empêcher Claude de violer un flow",
      delay: 32,
    },
    {
      icon: ICON.document,
      color: '#7C4DFF',
      name: 'DATA LOOKUP',
      sub: 'codes postaux, smokes, coefs…',
      question: "Empêcher Claude d'inventer des data",
      delay: 46,
    },
  ];
  return (
    <AbsoluteFill
      style={{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 24,
        padding: '0 100px',
      }}
    >
      <KineticText
        text="LES 3 PATTERNS UNIVERSELS"
        delay={4}
        fontSize={36}
        color={COLORS.orange}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          marginTop: 12,
          width: '100%',
          maxWidth: 1300,
        }}
      >
        {patterns.map((p, i) => {
          const op = interpolate(frame, [p.delay, p.delay + 12], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const x = interpolate(frame, [p.delay, p.delay + 12], [-30, 0], {
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
                padding: '20px 28px',
                border: `3px solid ${p.color}`,
                borderRadius: 14,
                background: `${p.color}12`,
                opacity: op,
                transform: `translateX(${x}px)`,
              }}
            >
              <LordiconIcon file={p.icon} color={p.color} width={90} height={90} />
              <div style={{display: 'flex', flexDirection: 'column', gap: 4, flex: 1}}>
                <span
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontWeight: 900,
                    fontSize: 30,
                    color: p.color,
                  }}
                >
                  {p.name}
                </span>
                <span
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: 18,
                    color: COLORS.text,
                    opacity: 0.6,
                    fontStyle: 'italic',
                  }}
                >
                  {p.sub}
                </span>
              </div>
              <div
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 700,
                  fontSize: 22,
                  color: COLORS.text,
                  textAlign: 'right',
                  maxWidth: 360,
                }}
              >
                → {p.question}
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 18,
          padding: '12px 28px',
          border: `2px solid ${COLORS.orange}`,
          borderRadius: 12,
          background: `${COLORS.orange}15`,
          opacity: interpolate(frame, [70, 90], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 800,
            fontSize: 22,
            color: COLORS.orange,
          }}
        >
          Chacun de vos projets tombe dans au moins 1 de ces 3 patterns.
        </span>
      </div>
    </AbsoluteFill>
  );
};

// J2-S5 — Gates (3 niveaux)
const J2S5: React.FC = () => {
  const frame = useCurrentFrame();
  const levels = [
    {
      label: 'Syntaxique',
      sub: 'ESLint · Prettier · tsc',
      example: 'ex : refuse un `any` ou un import inutilisé',
      color: COLORS.blue,
      delay: 18,
    },
    {
      label: 'Tests unitaires',
      sub: 'Vitest · Jest',
      example: 'ex : `calculatePrice(100, "standard") === 120` doit être vrai',
      color: COLORS.orange,
      delay: 32,
    },
    {
      label: 'Sémantique',
      sub: 'Linter de dette IA',
      example: 'ex : détecte un `try/except: pass` ou un god file > 250L',
      color: '#7C4DFF',
      delay: 46,
    },
  ];
  return (
    <AbsoluteFill
      style={{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 28,
      }}
    >
      <Reveal delay={4}>
        <LordiconIcon file={ICON.shield} color="#7C4DFF" width={160} height={160} />
      </Reveal>
      <KineticText text="GATES — 3 NIVEAUX" delay={12} fontSize={36} color={COLORS.orange} />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          marginTop: 12,
        }}
      >
        {levels.map((l, i) => {
          const op = interpolate(frame, [l.delay, l.delay + 12], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const x = interpolate(frame, [l.delay, l.delay + 12], [-30, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 22,
                padding: '18px 30px',
                border: `3px solid ${l.color}`,
                borderRadius: 14,
                background: `${l.color}15`,
                minWidth: 760,
                opacity: op,
                transform: `translateX(${x}px)`,
              }}
            >
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 900,
                  fontSize: 36,
                  color: l.color,
                  minWidth: 60,
                }}
              >
                {i + 1}.
              </span>
              <div style={{display: 'flex', flexDirection: 'column', gap: 4, flex: 1}}>
                <span
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontWeight: 800,
                    fontSize: 30,
                    color: COLORS.text,
                  }}
                >
                  {l.label}
                </span>
                <span
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: 20,
                    color: COLORS.text,
                    opacity: 0.7,
                  }}
                >
                  {l.sub}
                </span>
                <span
                  style={{
                    fontFamily: '"JetBrains Mono", Menlo, monospace',
                    fontSize: 17,
                    color: l.color,
                    opacity: 0.95,
                    marginTop: 4,
                  }}
                >
                  {l.example}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// J2-S5b — Gate par feature (TDD avec le LLM)
const J2S5b: React.FC = () => {
  const frame = useCurrentFrame();
  const steps = [
    {n: 1, label: 'Tu décris la feature à Claude', delay: 14},
    {n: 2, label: '"Écris UN test qui valide cette feature. NE CODE PAS l\'impl."', delay: 24},
    {n: 3, label: 'Tu relis le test, tu l\'amendes', delay: 34},
    {n: 4, label: 'Tu lances le test → il échoue (normal)', delay: 44},
    {n: 5, label: '"Maintenant implémente." → tu re-lances → ça passe ✓', delay: 54},
  ];
  return (
    <AbsoluteFill
      style={{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 22,
        padding: '0 100px',
      }}
    >
      <Reveal delay={4}>
        <LordiconIcon file={ICON.target} color={COLORS.orange} width={130} height={130} />
      </Reveal>
      <KineticText text="GATE PAR FEATURE — TDD AVEC LE LLM" delay={10} fontSize={32} color={COLORS.orange} />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          marginTop: 8,
          width: '100%',
          maxWidth: 1300,
        }}
      >
        {steps.map((s, i) => {
          const op = interpolate(frame, [s.delay, s.delay + 10], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const x = interpolate(frame, [s.delay, s.delay + 10], [-20, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 22,
                padding: '14px 24px',
                border: `2px solid ${COLORS.orange}40`,
                borderRadius: 12,
                background: `${COLORS.orange}08`,
                opacity: op,
                transform: `translateX(${x}px)`,
              }}
            >
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 900,
                  fontSize: 28,
                  color: COLORS.orange,
                  minWidth: 40,
                }}
              >
                {s.n}
              </span>
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 600,
                  fontSize: 22,
                  color: COLORS.text,
                }}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 8,
          padding: '12px 28px',
          border: `2px solid ${COLORS.orange}`,
          borderRadius: 12,
          background: `${COLORS.orange}15`,
          opacity: interpolate(frame, [70, 88], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 800,
            fontSize: 22,
            color: COLORS.orange,
          }}
        >
          Le test = acceptance criteria. Claude peut pas tricher : tu l'as écrit avant.
        </span>
      </div>
    </AbsoluteFill>
  );
};

// J2-S6 — 5 règles de bon prompting
const J2S6: React.FC = () => {
  const frame = useCurrentFrame();
  const rules = [
    '1 prompt = 1 objectif',
    'Pointe les fichiers',
    'Décris le résultat attendu',
    '/clear après chaque feature',
    'Cas complexes : plan d\'abord',
  ];
  return (
    <AbsoluteFill
      style={{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 24,
        padding: '0 200px',
      }}
    >
      <Reveal delay={4}>
        <LordiconIcon file={ICON.target} color={COLORS.orange} width={140} height={140} />
      </Reveal>
      <KineticText
        text="5 RÈGLES DE BON PROMPTING"
        delay={14}
        fontSize={36}
        color={COLORS.orange}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          marginTop: 18,
          width: '100%',
          maxWidth: 1000,
        }}
      >
        {rules.map((rule, i) => {
          const delay = 26 + i * 8;
          const op = interpolate(frame, [delay, delay + 10], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 22,
                padding: '14px 28px',
                border: `2px solid ${COLORS.orange}40`,
                borderRadius: 12,
                background: `${COLORS.orange}08`,
                opacity: op,
              }}
            >
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 900,
                  fontSize: 32,
                  color: COLORS.orange,
                  minWidth: 44,
                }}
              >
                {i + 1}
              </span>
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 700,
                  fontSize: 28,
                  color: COLORS.text,
                }}
              >
                {rule}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// J2-S7 — Outro "À vous"
const J2S7: React.FC = () => (
  <CenterHero
    file={ICON.rocket}
    color={COLORS.orange}
    kicker="ATELIER 3H30 — GO"
    label="À vous de cadrer."
    labelSize={84}
  />
);

// ============ EXPORT ============

const SlideFade: React.FC<{children: React.ReactNode}> = ({children}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

export const J2_SLIDE_COMPONENTS = [J2S0, J2S1, J2S2, J2S3, J2S4, J2S4b, J2S5, J2S5b, J2S6, J2S7];
export const J2_SLIDE_COUNT = J2_SLIDE_COMPONENTS.length;
export const J2_TOTAL = SLIDE * J2_SLIDE_COUNT;

export const J2SlidesComp: React.FC = () => (
  <AbsoluteFill
    style={{background: `radial-gradient(circle at 50% 45%, #1a2030 0%, ${COLORS.bg} 70%)`}}
  >
    {J2_SLIDE_COMPONENTS.map((S, i) => (
      <Sequence key={i} from={i * SLIDE} durationInFrames={SLIDE}>
        <SlideFade>
          <S />
        </SlideFade>
      </Sequence>
    ))}
  </AbsoluteFill>
);
