import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame, interpolate} from 'remotion';
import {Centered, KineticText, Reveal} from './components';
import {LordiconIcon} from './LordiconIcon';
import {COLORS, FONT_FAMILY} from './theme';

// Slides J3 — Skills (workflow avancé)
// Durée par slide : 5 secondes à 30 fps.
export const SLIDE = 150;

const ICON = {
  sparkles: 'wired-flat-2474-sparkles-glitter-hover-pinch.json',
  brackets: 'wired-flat-2287-web-development-brackets-hover-pinch.json',
  document: 'wired-flat-56-document-hover-swipe.json',
  rocket: 'wired-flat-489-rocket-space-hover-flying.json',
  bulb: 'wired-flat-36-bulb-hover-blink.json',
  polygon: 'wired-flat-1422-polygon-hover-pinch.json',
  coin: 'wired-flat-291-coin-dollar-hover-pinch.json',
  alert: 'wired-flat-2263-alert-hover-pinch.json',
  cogs: 'wired-flat-40-cogs-hover-mechanic.json',
  globe: 'wired-flat-735-world-globe-hover-roll.json',
  trophy: 'wired-flat-3263-trophy-circle-hover-roll.json',
  lab: 'wired-flat-439-lab-bottle-triangle-hover-oscillate.json',
  flame: 'wired-flat-2804-fire-flame-hover-pinch.json',
  shield: 'wired-flat-3278-shield-checkered-hover-pinch.json',
  target: 'wired-flat-458-goal-target-hover-hit.json',
  robot: 'wired-flat-461-robot-hover-pinch.json',
};

// ============ LAYOUTS ============

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

// ============ SLIDES J3 ============

// J3-S0 — Intro "J3 — Skills"
const J3S0: React.FC = () => (
  <CenterHero
    file={ICON.bulb}
    color={COLORS.orange}
    kicker="JOUR 3 — MERCREDI"
    label="Skills. Workflows avancés."
    labelSize={80}
  />
);

// J3-S0b — Modèle + Harness = Agent (Claude Code en exemple)
const J3S0b: React.FC = () => {
  const frame = useCurrentFrame();
  const layers = [
    {
      label: 'MODÈLE',
      sub: 'Sonnet · Opus · Haiku',
      role: 'prédit des tokens',
      color: COLORS.blue,
      icon: ICON.robot,
      delay: 14,
      connector: '+',
    },
    {
      label: 'HARNESS',
      sub: 'system prompt · tools · mémoire · garde-fous',
      role: 'détermine COMMENT le modèle agit',
      color: COLORS.orange,
      icon: ICON.cogs,
      delay: 26,
      connector: '=',
    },
    {
      label: 'AGENT',
      sub: 'ex : Claude Code, Claude.ai, Cowork',
      role: 'mission ciblée qui tourne en boucle',
      color: '#7C4DFF',
      icon: ICON.sparkles,
      delay: 38,
      connector: '+',
    },
    {
      label: 'SKILL',
      sub: 'ex : accounting, task-journal',
      role: 'capacité chargée à la demande',
      color: '#2ECC71',
      icon: ICON.document,
      delay: 52,
    },
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
      <KineticText text="MODÈLE + HARNESS = AGENT · un SKILL étend l'agent" delay={4} fontSize={28} color={COLORS.orange} />
      <div style={{display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6, width: '100%', maxWidth: 1300}}>
        {layers.map((l, i) => {
          const op = interpolate(frame, [l.delay, l.delay + 10], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const x = interpolate(frame, [l.delay, l.delay + 10], [-30, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const opConnector = interpolate(frame, [l.delay + 4, l.delay + 14], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <React.Fragment key={i}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                  padding: '12px 24px',
                  border: `3px solid ${l.color}`,
                  borderRadius: 14,
                  background: `${l.color}12`,
                  opacity: op,
                  transform: `translateX(${x}px)`,
                }}
              >
                <LordiconIcon file={l.icon} color={l.color} width={64} height={64} />
                <div style={{display: 'flex', flexDirection: 'column', gap: 2, flex: 1}}>
                  <span style={{fontFamily: FONT_FAMILY, fontWeight: 900, fontSize: 26, color: l.color}}>
                    {l.label}
                  </span>
                  <span style={{fontFamily: FONT_FAMILY, fontSize: 15, color: COLORS.text, opacity: 0.7, fontStyle: 'italic'}}>
                    {l.sub}
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: '"JetBrains Mono", Menlo, monospace',
                    fontSize: 15,
                    color: l.color,
                    textAlign: 'right',
                    maxWidth: 340,
                  }}
                >
                  {l.role}
                </span>
              </div>
              {l.connector && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    opacity: opConnector,
                    margin: '-2px 0',
                  }}
                >
                  <span
                    style={{
                      fontFamily: '"JetBrains Mono", Menlo, monospace',
                      fontWeight: 900,
                      fontSize: 30,
                      color: COLORS.orange,
                      lineHeight: 1,
                    }}
                  >
                    {l.connector}
                  </span>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 10,
          padding: '12px 26px',
          border: `2px solid ${COLORS.orange}`,
          borderRadius: 12,
          background: `${COLORS.orange}15`,
          opacity: interpolate(frame, [70, 86], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        <span style={{fontFamily: FONT_FAMILY, fontWeight: 800, fontSize: 20, color: COLORS.orange}}>
          Chez nous : SKILL (ou skill hub) + contexte + objectif = un agent. « Accounting Agent ».
        </span>
      </div>
    </AbsoluteFill>
  );
};

// J3-S1 — Définition d'un SKILL
const J3S1: React.FC = () => {
  const frame = useCurrentFrame();
  const op2 = interpolate(frame, [40, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <Centered>
      <Reveal delay={4}>
        <LordiconIcon file={ICON.document} color={COLORS.blue} width={170} height={170} />
      </Reveal>
      <KineticText text="UN SKILL =" delay={16} fontSize={30} color={COLORS.orange} />
      <KineticText
        text="Une instruction atomique pour le LLM."
        delay={26}
        fontSize={48}
        color={COLORS.text}
      />
      <div
        style={{
          marginTop: 28,
          padding: '14px 28px',
          border: `2px solid ${COLORS.orange}`,
          borderRadius: 12,
          background: `${COLORS.orange}15`,
          opacity: op2,
        }}
      >
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 800,
            fontSize: 24,
            color: COLORS.orange,
          }}
        >
          WHAT · WHEN · HOW
        </span>
      </div>
    </Centered>
  );
};

// J3-S2 — SKILL vs CLAUDE.md (chargement)
const J3S2: React.FC = () => {
  const frame = useCurrentFrame();
  const items = [
    {
      label: 'CLAUDE.md',
      sub: 'Injecté TOUJOURS',
      detail: 'Lu à chaque session, en permanence',
      color: COLORS.blue,
      icon: ICON.document,
      delay: 16,
    },
    {
      label: 'SKILL',
      sub: 'Chargé À LA DEMANDE',
      detail: 'Claude le charge quand sa description matche',
      color: COLORS.orange,
      icon: ICON.lab,
      delay: 32,
    },
  ];
  return (
    <AbsoluteFill
      style={{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 30,
      }}
    >
      <KineticText
        text="CLAUDE.MD vs SKILL"
        delay={4}
        fontSize={34}
        color={COLORS.orange}
      />
      <div
        style={{
          display: 'flex',
          gap: 40,
          marginTop: 14,
        }}
      >
        {items.map((it, i) => {
          const op = interpolate(frame, [it.delay, it.delay + 12], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const y = interpolate(frame, [it.delay, it.delay + 12], [30, 0], {
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
                gap: 14,
                padding: '24px 28px',
                border: `3px solid ${it.color}`,
                borderRadius: 16,
                background: `${it.color}12`,
                minWidth: 460,
                opacity: op,
                transform: `translateY(${y}px)`,
              }}
            >
              <LordiconIcon file={it.icon} color={it.color} width={130} height={130} />
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 900,
                  fontSize: 36,
                  color: it.color,
                }}
              >
                {it.label}
              </span>
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 800,
                  fontSize: 22,
                  color: COLORS.text,
                }}
              >
                {it.sub}
              </span>
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 18,
                  color: COLORS.text,
                  opacity: 0.7,
                  textAlign: 'center',
                  maxWidth: 380,
                }}
              >
                {it.detail}
              </span>
            </div>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 14,
          padding: '12px 28px',
          border: `2px solid ${COLORS.orange}`,
          borderRadius: 12,
          background: `${COLORS.orange}15`,
          opacity: interpolate(frame, [55, 75], [0, 1], {
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
          ⇒ Vous pouvez avoir 50 skills sans saturer le contexte.
        </span>
      </div>
    </AbsoluteFill>
  );
};

// J3-S3 — Frontmatter (2 champs seulement)
const J3S3: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [16, 36], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opBan = interpolate(frame, [70, 90], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
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
      <KineticText text="FRONTMATTER — 2 CHAMPS, PAS UN DE PLUS" delay={4} fontSize={30} color={COLORS.orange} />
      <div
        style={{
          background: '#1d2433',
          border: `2px solid ${COLORS.orange}40`,
          borderRadius: 14,
          padding: '28px 36px',
          fontFamily: '"JetBrains Mono", Menlo, monospace',
          fontSize: 24,
          color: COLORS.text,
          lineHeight: 1.55,
          opacity: op,
          minWidth: 1100,
        }}
      >
        <span style={{color: '#888'}}>---</span>
        <br />
        <span style={{color: COLORS.blue, fontWeight: 700}}>name</span>
        <span style={{color: '#888'}}>:</span> compute-payout
        <br />
        <span style={{color: COLORS.blue, fontWeight: 700}}>description</span>
        <span style={{color: '#888'}}>: &gt;</span>
        <br />
        <span style={{paddingLeft: 32}}>Calcule le payout d'un parieur Bullymarket à partir</span>
        <br />
        <span style={{paddingLeft: 32}}>du stake et des odds verrouillées. Utiliser dès qu'on</span>
        <br />
        <span style={{paddingLeft: 32}}>doit afficher ou enregistrer un gain de pari.</span>
        <br />
        <span style={{color: '#888'}}>---</span>
      </div>
      <div
        style={{
          display: 'flex',
          gap: 30,
          marginTop: 4,
          opacity: opBan,
        }}
      >
        {['❌ metadata', '❌ tags', '❌ version', '❌ scripts', '❌ status'].map((b) => (
          <span
            key={b}
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight: 700,
              fontSize: 20,
              color: '#FF4D4D',
              opacity: 0.85,
            }}
          >
            {b}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// J3-S4 — Description BAD vs GOOD
const J3S4: React.FC = () => {
  const frame = useCurrentFrame();
  const opBad = interpolate(frame, [16, 32], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opGood = interpolate(frame, [36, 56], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
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
        <LordiconIcon file={ICON.target} color={COLORS.orange} width={110} height={110} />
      </Reveal>
      <KineticText text="LA DESCRIPTION = LE TRUC CLÉ" delay={10} fontSize={30} color={COLORS.orange} />
      <span
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 22,
          color: COLORS.text,
          opacity: 0.75,
          textAlign: 'center',
        }}
      >
        C'est ce que Claude lit pour décider d'invoquer ton skill.
      </span>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          marginTop: 8,
          width: '100%',
          maxWidth: 1300,
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 16,
            alignItems: 'center',
            padding: '16px 24px',
            border: `2px solid #FF4D4D`,
            borderRadius: 12,
            background: '#FF4D4D12',
            opacity: opBad,
          }}
        >
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight: 900,
              fontSize: 30,
              color: '#FF4D4D',
              minWidth: 80,
            }}
          >
            ❌ BAD
          </span>
          <span
            style={{
              fontFamily: '"JetBrains Mono", Menlo, monospace',
              fontSize: 22,
              color: COLORS.text,
            }}
          >
            "Handles billing automation"
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            gap: 16,
            alignItems: 'flex-start',
            padding: '16px 24px',
            border: `2px solid #2ECC71`,
            borderRadius: 12,
            background: '#2ECC7112',
            opacity: opGood,
          }}
        >
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight: 900,
              fontSize: 30,
              color: '#2ECC71',
              minWidth: 80,
            }}
          >
            ✅ GOOD
          </span>
          <span
            style={{
              fontFamily: '"JetBrains Mono", Menlo, monospace',
              fontSize: 20,
              color: COLORS.text,
              lineHeight: 1.5,
            }}
          >
            "Télécharge les factures OVH depuis manager.eu.ovhcloud.com via session cookies. Utiliser quand un audit comptable réclame les factures du mois en PDF."
          </span>
        </div>
      </div>
      <div
        style={{
          marginTop: 10,
          padding: '10px 24px',
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
            fontSize: 20,
            color: COLORS.orange,
          }}
        >
          Tu vends ton skill au LLM qui va le chercher. Sois précis ou il l'ignore.
        </span>
      </div>
    </AbsoluteFill>
  );
};

// J3-S5 — 3 patterns
const J3S5: React.FC = () => {
  const frame = useCurrentFrame();
  const patterns = [
    {
      icon: ICON.cogs,
      color: COLORS.orange,
      label: 'AVEC SCRIPT',
      sub: 'le skill dit QUAND, le script FAIT',
      use: 'calculs, validations, parsing, lookups',
      delay: 18,
    },
    {
      icon: ICON.bulb,
      color: COLORS.blue,
      label: 'SANS SCRIPT',
      sub: 'le skill = doctrine pure pour le LLM',
      use: "rédaction, refactor, classification floue",
      delay: 32,
    },
    {
      icon: ICON.lab,
      color: '#7C4DFF',
      label: 'MIXTE',
      sub: 'le LLM + scripts orchestrés',
      use: 'workflow multi-étapes (préparer → calculer → rédiger)',
      delay: 46,
    },
  ];
  return (
    <AbsoluteFill
      style={{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 22,
        padding: '0 80px',
      }}
    >
      <KineticText text="3 PATTERNS DE SKILL" delay={4} fontSize={32} color={COLORS.orange} />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          marginTop: 12,
          width: '100%',
          maxWidth: 1350,
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
                gap: 24,
                padding: '18px 26px',
                border: `3px solid ${p.color}`,
                borderRadius: 14,
                background: `${p.color}12`,
                opacity: op,
                transform: `translateX(${x}px)`,
              }}
            >
              <LordiconIcon file={p.icon} color={p.color} width={80} height={80} />
              <div style={{display: 'flex', flexDirection: 'column', gap: 4, flex: 1}}>
                <span
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontWeight: 900,
                    fontSize: 28,
                    color: p.color,
                  }}
                >
                  {p.label}
                </span>
                <span
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontWeight: 600,
                    fontSize: 19,
                    color: COLORS.text,
                  }}
                >
                  {p.sub}
                </span>
              </div>
              <span
                style={{
                  fontFamily: '"JetBrains Mono", Menlo, monospace',
                  fontSize: 17,
                  color: p.color,
                  opacity: 0.95,
                  textAlign: 'right',
                  maxWidth: 380,
                }}
              >
                {p.use}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// J3-S6 — SSS triplet
const J3S6: React.FC = () => {
  const frame = useCurrentFrame();
  const blocks = [
    {
      title: 'SKILL.md',
      sub: 'WHAT · WHEN · HOW',
      role: 'le LLM décide',
      color: COLORS.orange,
      icon: ICON.document,
      delay: 18,
    },
    {
      title: 'SCRIPTS',
      sub: 'logique exécutable',
      role: 'le code exécute',
      color: COLORS.blue,
      icon: ICON.cogs,
      delay: 32,
    },
    {
      title: 'SESSIONS',
      sub: 'logs des runs',
      role: 'auditabilité',
      color: '#7C4DFF',
      icon: ICON.brackets,
      delay: 46,
    },
  ];
  return (
    <AbsoluteFill
      style={{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 26,
      }}
    >
      <KineticText text="SSS — SKILL + SCRIPTS + SESSIONS" delay={4} fontSize={30} color={COLORS.orange} />
      <span
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 21,
          color: COLORS.text,
          opacity: 0.75,
        }}
      >
        Le triplet TPB pour une capacité complète.
      </span>
      <div
        style={{
          display: 'flex',
          gap: 28,
          marginTop: 16,
        }}
      >
        {blocks.map((b, i) => {
          const op = interpolate(frame, [b.delay, b.delay + 12], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const y = interpolate(frame, [b.delay, b.delay + 12], [30, 0], {
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
                gap: 12,
                padding: '24px 28px',
                border: `3px solid ${b.color}`,
                borderRadius: 16,
                background: `${b.color}12`,
                minWidth: 320,
                opacity: op,
                transform: `translateY(${y}px)`,
              }}
            >
              <LordiconIcon file={b.icon} color={b.color} width={110} height={110} />
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 900,
                  fontSize: 30,
                  color: b.color,
                }}
              >
                {b.title}
              </span>
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 700,
                  fontSize: 19,
                  color: COLORS.text,
                }}
              >
                {b.sub}
              </span>
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 17,
                  color: COLORS.text,
                  opacity: 0.65,
                  fontStyle: 'italic',
                }}
              >
                {b.role}
              </span>
            </div>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 14,
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
          Si quelque chose PEUT être un script, il DOIT être un script.
        </span>
      </div>
    </AbsoluteFill>
  );
};

// J3-S6b — Les 3 règles TPB (tier / sessions / WLGW)
const J3S6b: React.FC = () => {
  const frame = useCurrentFrame();
  const rules = [
    {
      icon: ICON.trophy,
      color: COLORS.orange,
      label: 'TIER DE MATURITÉ',
      chip: 'DRAFT → OPERATIONAL → PROVEN',
      why: 'un skill monte en maturité avec l\'usage réel',
      delay: 14,
    },
    {
      icon: ICON.brackets,
      color: COLORS.blue,
      label: 'SESSIONS LOGS',
      chip: 'sessions/YYYY-MM/log.jsonl',
      why: 'chaque exécution loguée = auditabilité',
      delay: 30,
    },
    {
      icon: ICON.alert,
      color: '#7C4DFF',
      label: 'WHAT LLMs GET WRONG',
      chip: 'AP1, AP2, AP3… BAD/GOOD/Why',
      why: 'chaque plantage → un anti-pattern ajouté',
      delay: 46,
    },
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
      <KineticText text="LES 3 RÈGLES TPB POUR UN SKILL MATURE" delay={4} fontSize={30} color={COLORS.orange} />
      <span
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 20,
          color: COLORS.text,
          opacity: 0.7,
          textAlign: 'center',
        }}
      >
        Un skill n'est pas figé. Il grandit à chaque usage.
      </span>
      <div style={{display: 'flex', flexDirection: 'column', gap: 14, marginTop: 8, width: '100%', maxWidth: 1300}}>
        {rules.map((r, i) => {
          const op = interpolate(frame, [r.delay, r.delay + 12], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const x = interpolate(frame, [r.delay, r.delay + 12], [-30, 0], {
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
                padding: '16px 24px',
                border: `3px solid ${r.color}`,
                borderRadius: 14,
                background: `${r.color}12`,
                opacity: op,
                transform: `translateX(${x}px)`,
              }}
            >
              <LordiconIcon file={r.icon} color={r.color} width={78} height={78} />
              <div style={{display: 'flex', flexDirection: 'column', gap: 4, flex: 1}}>
                <span style={{fontFamily: FONT_FAMILY, fontWeight: 900, fontSize: 26, color: r.color}}>
                  {r.label}
                </span>
                <span
                  style={{
                    fontFamily: '"JetBrains Mono", Menlo, monospace',
                    fontSize: 16,
                    color: COLORS.text,
                    opacity: 0.85,
                  }}
                >
                  {r.chip}
                </span>
              </div>
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 17,
                  color: r.color,
                  fontStyle: 'italic',
                  textAlign: 'right',
                  maxWidth: 320,
                  opacity: 0.9,
                }}
              >
                {r.why}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// J3-S3fused — Frontmatter + Description BAD/GOOD (fusion S3+S4)
const J3S3fused: React.FC = () => {
  const frame = useCurrentFrame();
  const opFront = interpolate(frame, [10, 26], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opBad = interpolate(frame, [34, 48], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opGood = interpolate(frame, [52, 68], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill
      style={{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
        padding: '0 80px',
      }}
    >
      <KineticText text="FRONTMATTER · 2 CHAMPS · LA DESCRIPTION EST LA CLÉ" delay={4} fontSize={26} color={COLORS.orange} />
      <div
        style={{
          background: '#1d2433',
          border: `2px solid ${COLORS.orange}40`,
          borderRadius: 12,
          padding: '18px 26px',
          fontFamily: '"JetBrains Mono", Menlo, monospace',
          fontSize: 20,
          color: COLORS.text,
          lineHeight: 1.5,
          opacity: opFront,
          maxWidth: 1300,
          width: '100%',
        }}
      >
        <span style={{color: '#888'}}>---</span>
        <br />
        <span style={{color: COLORS.blue, fontWeight: 700}}>name</span>
        <span style={{color: '#888'}}>:</span> accounting
        <br />
        <span style={{color: COLORS.blue, fontWeight: 700}}>description</span>
        <span style={{color: '#888'}}>: &gt;</span> <span style={{color: COLORS.text, opacity: 0.7}}>«&nbsp;vend le skill au LLM qui va le chercher&nbsp;»</span>
        <br />
        <span style={{color: '#888'}}>---</span>
      </div>
      <div
        style={{
          display: 'flex',
          gap: 16,
          alignItems: 'center',
          padding: '12px 22px',
          border: `2px solid #FF4D4D`,
          borderRadius: 10,
          background: '#FF4D4D12',
          opacity: opBad,
          width: '100%',
          maxWidth: 1300,
        }}
      >
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 900,
            fontSize: 24,
            color: '#FF4D4D',
            minWidth: 70,
          }}
        >
          ❌ BAD
        </span>
        <span
          style={{
            fontFamily: '"JetBrains Mono", Menlo, monospace',
            fontSize: 18,
            color: COLORS.text,
          }}
        >
          "Gère la comptabilité"
        </span>
      </div>
      <div
        style={{
          display: 'flex',
          gap: 16,
          alignItems: 'flex-start',
          padding: '12px 22px',
          border: `2px solid #2ECC71`,
          borderRadius: 10,
          background: '#2ECC7112',
          opacity: opGood,
          width: '100%',
          maxWidth: 1300,
        }}
      >
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 900,
            fontSize: 24,
            color: '#2ECC71',
            minWidth: 70,
          }}
        >
          ✅ GOOD
        </span>
        <span
          style={{
            fontFamily: '"JetBrains Mono", Menlo, monospace',
            fontSize: 17,
            color: COLORS.text,
            lineHeight: 1.4,
          }}
        >
          "Calcule les factures françaises (TVA + promo), résume les factures du mois, détecte les impayés. Utiliser quand : émettre une facture, préparer un bilan mensuel, relancer un impayé."
        </span>
      </div>
    </AbsoluteFill>
  );
};

// J3-S6fused — SSS triplet + 3 règles TPB (fusion S6+S6b)
const J3S6fused: React.FC = () => {
  const frame = useCurrentFrame();
  const blocks = [
    {title: 'SKILL.md', sub: 'WHAT · WHEN · HOW', color: COLORS.orange, icon: ICON.document, delay: 14},
    {title: 'SCRIPTS', sub: 'logique déterministe', color: COLORS.blue, icon: ICON.cogs, delay: 24},
    {title: 'SESSIONS', sub: 'logs auditables', color: '#7C4DFF', icon: ICON.brackets, delay: 34},
  ];
  const rules = [
    {label: 'TIER', chip: 'DRAFT → OPERATIONAL → PROVEN', color: COLORS.orange, delay: 50},
    {label: 'SESSIONS LOGS', chip: 'sessions/YYYY-MM/log.jsonl', color: COLORS.blue, delay: 60},
    {label: 'WHAT LLMs GET WRONG', chip: 'AP1, AP2 · BAD/GOOD/Why', color: '#7C4DFF', delay: 70},
  ];
  return (
    <AbsoluteFill
      style={{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 18,
        padding: '0 60px',
      }}
    >
      <KineticText text="SSS FRAMEWORK + 3 RÈGLES DE MATURITÉ" delay={4} fontSize={28} color={COLORS.orange} />

      {/* Ligne 1 — SSS triplet */}
      <div style={{display: 'flex', gap: 22, marginTop: 4}}>
        {blocks.map((b, i) => {
          const op = interpolate(frame, [b.delay, b.delay + 10], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const y = interpolate(frame, [b.delay, b.delay + 10], [20, 0], {
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
                gap: 8,
                padding: '16px 20px',
                border: `3px solid ${b.color}`,
                borderRadius: 12,
                background: `${b.color}12`,
                minWidth: 260,
                opacity: op,
                transform: `translateY(${y}px)`,
              }}
            >
              <LordiconIcon file={b.icon} color={b.color} width={70} height={70} />
              <span style={{fontFamily: FONT_FAMILY, fontWeight: 900, fontSize: 24, color: b.color}}>
                {b.title}
              </span>
              <span style={{fontFamily: FONT_FAMILY, fontSize: 15, color: COLORS.text, opacity: 0.75}}>
                {b.sub}
              </span>
            </div>
          );
        })}
      </div>

      {/* Ligne 2 — 3 règles de maturité */}
      <div style={{display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8, width: '100%', maxWidth: 1200}}>
        {rules.map((r, i) => {
          const op = interpolate(frame, [r.delay, r.delay + 10], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const x = interpolate(frame, [r.delay, r.delay + 10], [-20, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                padding: '10px 20px',
                border: `2px solid ${r.color}`,
                borderRadius: 10,
                background: `${r.color}10`,
                opacity: op,
                transform: `translateX(${x}px)`,
              }}
            >
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 900,
                  fontSize: 20,
                  color: r.color,
                  minWidth: 220,
                }}
              >
                {r.label}
              </span>
              <span
                style={{
                  fontFamily: '"JetBrains Mono", Menlo, monospace',
                  fontSize: 15,
                  color: COLORS.text,
                }}
              >
                {r.chip}
              </span>
            </div>
          );
        })}
      </div>
      <span
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 18,
          color: COLORS.orange,
          fontWeight: 700,
          marginTop: 4,
          opacity: interpolate(frame, [82, 96], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        Un skill n'est pas figé : il monte en maturité avec l'usage.
      </span>
    </AbsoluteFill>
  );
};

// J3-S6c — MONO-AGENT > MULTI-AGENT ORCHESTRÉ
const J3S6c: React.FC = () => {
  const frame = useCurrentFrame();
  const opMulti = interpolate(frame, [16, 32], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opMono = interpolate(frame, [42, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opPunch = interpolate(frame, [70, 88], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill
      style={{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        padding: '0 80px',
      }}
    >
      <KineticText text="MONO-AGENT > MULTI-AGENT ORCHESTRÉ" delay={4} fontSize={30} color={COLORS.orange} />

      {/* Multi-agent : ce qu'on VOIT partout */}
      <div
        style={{
          padding: '14px 24px',
          border: `2px solid #FF4D4D`,
          borderRadius: 12,
          background: '#FF4D4D10',
          opacity: opMulti,
          maxWidth: 1250,
        }}
      >
        <div style={{display: 'flex', gap: 12, alignItems: 'center', marginBottom: 6}}>
          <span style={{fontFamily: FONT_FAMILY, fontWeight: 900, fontSize: 22, color: '#FF4D4D'}}>
            ❌ MULTI-AGENT ORCHESTRÉ
          </span>
          <span style={{fontFamily: FONT_FAMILY, fontSize: 15, color: COLORS.text, opacity: 0.6, fontStyle: 'italic'}}>
            « superviseur → exécuteurs → coach »
          </span>
        </div>
        <span style={{fontFamily: FONT_FAMILY, fontSize: 17, color: COLORS.text}}>
          Joli sur LinkedIn. Cher en réalité : coordination lourde, perte de contexte, debug enfer.
        </span>
      </div>

      {/* Mono-agent : ce qu'on FAIT chez TPB */}
      <div
        style={{
          padding: '14px 24px',
          border: `2px solid #2ECC71`,
          borderRadius: 12,
          background: '#2ECC7110',
          opacity: opMono,
          maxWidth: 1250,
        }}
      >
        <div style={{display: 'flex', gap: 12, alignItems: 'center', marginBottom: 6}}>
          <span style={{fontFamily: FONT_FAMILY, fontWeight: 900, fontSize: 22, color: '#2ECC71'}}>
            ✅ MONO-AGENT BIEN CADRÉ
          </span>
          <span style={{fontFamily: FONT_FAMILY, fontSize: 15, color: COLORS.text, opacity: 0.6, fontStyle: 'italic'}}>
            « Claude Code + skills + playlists + scripts »
          </span>
        </div>
        <span style={{fontFamily: FONT_FAMILY, fontSize: 17, color: COLORS.text}}>
          Simple. Fiable. Débuggable. Le contexte reste dans une seule session.
        </span>
      </div>

    </AbsoluteFill>
  );
};

// J3-S6d — BONUS : Vrai agent isolé — ce qu'il faudrait vraiment
const J3S6d: React.FC = () => {
  const frame = useCurrentFrame();
  const components = [
    {label: 'Modèle', role: 'cerveau', tpb: '✅', delay: 12},
    {label: 'System prompt métier', role: 'personnalité + format', tpb: '🟡', delay: 20},
    {label: 'Objectif persistant', role: 'mission continue', tpb: '❌', delay: 28},
    {label: 'Boucle d\'exécution', role: 'cron · webhook · self-loop', tpb: '❌', delay: 36},
    {label: 'Mémoire persistante', role: 'RAG · DB · KV', tpb: '🟡', delay: 44},
    {label: 'Tools propres', role: 'API · DB · systèmes externes', tpb: '✅', delay: 52},
    {label: 'Skills chargés', role: 'capacités', tpb: '✅', delay: 60},
    {label: 'Canal + identité', role: 'Slack · email · rôle · quotas', tpb: '❌', delay: 68},
  ];
  return (
    <AbsoluteFill
      style={{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
        padding: '0 80px',
      }}
    >
      <KineticText text="BONUS — AGENT ISOLÉ AUTONOME" delay={4} fontSize={30} color={COLORS.orange} />
      <span
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 18,
          color: COLORS.text,
          opacity: 0.7,
          textAlign: 'center',
        }}
      >
        Aller plus loin que « SKILL + objectif » → un agent qui tourne SANS toi devant.
      </span>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
          marginTop: 4,
          width: '100%',
          maxWidth: 1250,
        }}
      >
        {components.map((c, i) => {
          const op = interpolate(frame, [c.delay, c.delay + 10], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const x = interpolate(frame, [c.delay, c.delay + 10], [-16, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 16px',
                border: `2px solid ${COLORS.text}20`,
                borderRadius: 10,
                background: '#00000030',
                opacity: op,
                transform: `translateX(${x}px)`,
              }}
            >
              <span style={{fontSize: 22, minWidth: 30, textAlign: 'center'}}>{c.tpb}</span>
              <div style={{display: 'flex', flexDirection: 'column', gap: 0, flex: 1}}>
                <span
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontWeight: 800,
                    fontSize: 17,
                    color: COLORS.text,
                  }}
                >
                  {c.label}
                </span>
                <span
                  style={{
                    fontFamily: '"JetBrains Mono", Menlo, monospace',
                    fontSize: 13,
                    color: COLORS.text,
                    opacity: 0.6,
                  }}
                >
                  {c.role}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 12,
          display: 'flex',
          gap: 24,
          fontFamily: FONT_FAMILY,
          fontSize: 15,
          color: COLORS.text,
          opacity: interpolate(frame, [78, 92], [0, 0.85], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        <span>✅ TPB fait déjà</span>
        <span>🟡 partiellement</span>
        <span>❌ pas fait aujourd'hui</span>
      </div>
      <div
        style={{
          marginTop: 8,
          padding: '10px 24px',
          border: `2px solid ${COLORS.orange}`,
          borderRadius: 12,
          background: `${COLORS.orange}15`,
          opacity: interpolate(frame, [90, 104], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        <span style={{fontFamily: FONT_FAMILY, fontWeight: 800, fontSize: 18, color: COLORS.orange}}>
          Chez nous : session Claude Code + skill + objectif = agent au sens ingénierie. Autonome complet = 3/8.
        </span>
      </div>
    </AbsoluteFill>
  );
};

// J3-S7 — Outro "À vous" (atelier : 2 skills pour la soutenance)
const J3S7: React.FC = () => {
  const frame = useCurrentFrame();
  const skills = [
    {
      icon: ICON.cogs,
      color: COLORS.orange,
      title: 'SKILL MÉTIER',
      sub: 'spécifique à ton projet',
      example: 'compute-payout · get-smoke-spots · apply-promo-code',
      delay: 16,
    },
    {
      icon: ICON.document,
      color: COLORS.blue,
      title: 'SKILL TRANSVERSE',
      sub: 'réutilisable dans plusieurs projets',
      example: 'task-journal · audit-repo · format-changelog',
      delay: 32,
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
      <Reveal delay={4}>
        <LordiconIcon file={ICON.rocket} color={COLORS.orange} width={140} height={140} />
      </Reveal>
      <KineticText text="ATELIER — CRÉE TES 2 SKILLS" delay={10} fontSize={36} color={COLORS.orange} />
      <span
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 20,
          color: COLORS.text,
          opacity: 0.75,
          textAlign: 'center',
        }}
      >
        Rendu obligatoire pour la soutenance de jeudi.
      </span>
      <div style={{display: 'flex', gap: 26, marginTop: 8, width: '100%', maxWidth: 1300}}>
        {skills.map((s, i) => {
          const op = interpolate(frame, [s.delay, s.delay + 12], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const y = interpolate(frame, [s.delay, s.delay + 12], [30, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div
              key={i}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                padding: '22px 24px',
                border: `3px solid ${s.color}`,
                borderRadius: 16,
                background: `${s.color}12`,
                opacity: op,
                transform: `translateY(${y}px)`,
              }}
            >
              <LordiconIcon file={s.icon} color={s.color} width={100} height={100} />
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 900,
                  fontSize: 28,
                  color: s.color,
                }}
              >
                {s.title}
              </span>
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 700,
                  fontSize: 20,
                  color: COLORS.text,
                }}
              >
                {s.sub}
              </span>
              <span
                style={{
                  fontFamily: '"JetBrains Mono", Menlo, monospace',
                  fontSize: 15,
                  color: s.color,
                  opacity: 0.9,
                  textAlign: 'center',
                }}
              >
                {s.example}
              </span>
            </div>
          );
        })}
      </div>
      <span
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 18,
          color: COLORS.orange,
          fontWeight: 700,
          marginTop: 8,
          opacity: interpolate(frame, [58, 76], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        Chaque skill = SKILL.md · description qui vend · script (si déterministe) · test.
      </span>
    </AbsoluteFill>
  );
};

// ============ EXPORT ============

const SlideFade: React.FC<{children: React.ReactNode}> = ({children}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

// Deck J3 — 8 slides (10 → 8 après restructuration)
// S1 retiré (redondant avec S0b enrichie) ; S3+S4 fusionnés dans S3fused ; S6+S6b fusionnés dans S6fused ; S6c nouveau (mono vs multi).
// Anciens composants J3S1, J3S3, J3S4, J3S6, J3S6b conservés pour référence mais pas dans le deck.
// Slide J3S6d retirée du deck : l'état des lieux TPB (partiel / pas fait) diluait le message.
// On traite le sujet "agent isolé autonome" à l'oral avec un schéma au tableau (stagiaire vs employé).
export const J3_SLIDE_COMPONENTS = [J3S0, J3S0b, J3S2, J3S3fused, J3S5, J3S6fused, J3S6c, J3S7];
export const J3_SLIDE_COUNT = J3_SLIDE_COMPONENTS.length;
export const J3_TOTAL = SLIDE * J3_SLIDE_COUNT;

export const J3SlidesComp: React.FC = () => (
  <AbsoluteFill
    style={{background: `radial-gradient(circle at 50% 45%, #1a2030 0%, ${COLORS.bg} 70%)`}}
  >
    {J3_SLIDE_COMPONENTS.map((S, i) => (
      <Sequence key={i} from={i * SLIDE} durationInFrames={SLIDE}>
        <SlideFade>
          <S />
        </SlideFade>
      </Sequence>
    ))}
  </AbsoluteFill>
);
