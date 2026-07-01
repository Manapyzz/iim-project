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
  calendar: 'wired-flat-28-calendar-hover-pinch.json',
  trophy: 'wired-flat-3263-trophy-circle-hover-roll.json',
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

// S1 — Bloc A : c'est quoi un LLM — avec démo séquence autoregressive
const S1: React.FC = () => {
  const frame = useCurrentFrame();
  // Séquence de tokens qui s'ajoutent l'un après l'autre
  const tokens = ['Le', 'chat', 'dort', 'sur', 'le', 'canapé', '.'];
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 28}}>
      <KineticText text="LE LLM, C'EST QUOI ?" fontSize={30} color={COLORS.orange} />
      <KineticText
        text="Un prédicteur de tokens autoregressif."
        delay={18}
        fontSize={52}
      />
      {/* Séquence visuelle des tokens prédits l'un après l'autre */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          marginTop: 28,
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {tokens.map((t, i) => {
          const delay = 42 + i * 8;
          const o = interpolate(frame, [delay, delay + 10], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const y = interpolate(frame, [delay, delay + 10], [16, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const isLast = i === tokens.length - 1;
          return (
            <span
              key={i}
              style={{
                fontFamily: '"JetBrains Mono", "Fira Code", Menlo, monospace',
                fontWeight: 700,
                fontSize: 32,
                color: isLast ? COLORS.orange : COLORS.text,
                background: '#1a2030',
                padding: '8px 16px',
                borderRadius: 8,
                opacity: o,
                transform: `translateY(${y}px)`,
                border: isLast ? `2px solid ${COLORS.orange}` : 'none',
              }}
            >
              {t}
            </span>
          );
        })}
      </div>
      <span
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 22,
          color: COLORS.blue,
          marginTop: 12,
          opacity: interpolate(frame, [110, 122], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        Un token à la fois. Toujours.
      </span>
      {/* Lien démo */}
      <a
        href="https://tiktokenizer.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          opacity: interpolate(frame, [125, 137], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          marginTop: 18,
          padding: '12px 24px',
          border: `2px solid ${COLORS.orange}`,
          borderRadius: 10,
          fontFamily: FONT_FAMILY,
          fontWeight: 700,
          fontSize: 22,
          color: COLORS.orange,
          textDecoration: 'none',
          background: `${COLORS.orange}10`,
        }}
      >
        ▶ Démo en live : tiktokenizer.vercel.app
      </a>
    </AbsoluteFill>
  );
};

// S1b — NOUVEAU : Modèle + Harness = Produit
const SHarness: React.FC = () => {
  const frame = useCurrentFrame();
  const harnessParts = ['System prompt', 'Tools', 'Logique agent', 'Garde-fous', 'Mémoire'];
  const products = [
    {name: 'Claude Code', tag: 'CLI dev'},
    {name: 'Claude.ai', tag: 'Chat web'},
    {name: 'Cowork', tag: 'Collaboration'},
  ];
  const productsOp = interpolate(frame, [85, 100], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 18, padding: '40px 80px'}}>
      <KineticText text="MODÈLE + HARNESS = PRODUIT" fontSize={28} color={COLORS.orange} />
      {/* Schéma : modèle au centre, harness autour */}
      <div
        style={{
          position: 'relative',
          width: 720,
          height: 360,
          border: `2px dashed ${COLORS.blue}66`,
          borderRadius: 24,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          marginTop: 8,
          opacity: interpolate(frame, [12, 24], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        {/* Label "HARNESS" en haut */}
        <span
          style={{
            position: 'absolute',
            top: -16,
            left: 32,
            background: COLORS.bg,
            padding: '0 12px',
            fontFamily: FONT_FAMILY,
            fontSize: 22,
            fontWeight: 800,
            color: COLORS.blue,
            letterSpacing: 1.5,
          }}
        >
          HARNESS (par Anthropic)
        </span>
        {/* Pièces du harness en haut */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginBottom: 18,
          }}
        >
          {harnessParts.slice(0, 3).map((p, i) => {
            const delay = 32 + i * 6;
            const o = interpolate(frame, [delay, delay + 10], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <span
                key={i}
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 18,
                  color: COLORS.text,
                  opacity: o * 0.85,
                  padding: '4px 12px',
                  border: `1px solid ${COLORS.blue}55`,
                  borderRadius: 8,
                }}
              >
                {p}
              </span>
            );
          })}
        </div>
        {/* Modèle au centre */}
        <div
          style={{
            background: COLORS.orange,
            color: COLORS.bg,
            padding: '22px 38px',
            borderRadius: 16,
            fontFamily: FONT_FAMILY,
            fontWeight: 900,
            textAlign: 'center',
          }}
        >
          <div style={{fontSize: 36, letterSpacing: 1}}>MODÈLE</div>
          <div style={{fontSize: 22, opacity: 0.85, marginTop: 4}}>
            Sonnet 4.6 (prédicteur autoregressif)
          </div>
        </div>
        {/* Pièces du harness en bas */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginTop: 18,
          }}
        >
          {harnessParts.slice(3).map((p, i) => {
            const delay = 56 + i * 6;
            const o = interpolate(frame, [delay, delay + 10], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <span
                key={i}
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 18,
                  color: COLORS.text,
                  opacity: o * 0.85,
                  padding: '4px 12px',
                  border: `1px solid ${COLORS.blue}55`,
                  borderRadius: 8,
                }}
              >
                {p}
              </span>
            );
          })}
        </div>
      </div>
      {/* 3 produits qui utilisent le même modèle avec des harnesses différents */}
      <span
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 20,
          color: COLORS.blue,
          opacity: productsOp,
          marginTop: 12,
          fontStyle: 'italic',
        }}
      >
        Même modèle, harnesses différents :
      </span>
      <div style={{display: 'flex', gap: 24, opacity: productsOp}}>
        {products.map((p, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '12px 24px',
              border: `2px solid ${COLORS.orange}55`,
              borderRadius: 12,
              minWidth: 180,
              background: `${COLORS.orange}08`,
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
              {p.name}
            </span>
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 18,
                color: COLORS.text,
                opacity: 0.75,
                marginTop: 2,
              }}
            >
              {p.tag}
            </span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// S2 — Bloc B : context window — gros chiffre + jauge stratifiée
const S2: React.FC = () => {
  const frame = useCurrentFrame();
  const sections = [
    {label: 'System prompt', tokens: 5000, color: COLORS.blue},
    {label: 'Tools defs', tokens: 20000, color: COLORS.blue},
    {label: 'CLAUDE.md', tokens: 3000, color: COLORS.blue},
    {label: 'Fichiers lus', tokens: 50000, color: COLORS.orange},
    {label: 'Historique', tokens: 100000, color: COLORS.orange},
    {label: 'Libre', tokens: 22000, color: COLORS.text},
  ];
  const total = 200000;
  return (
    <AbsoluteFill
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 100,
        padding: '0 120px',
      }}
    >
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
        <BigStat value="200 000" unit="Tokens max — Sonnet 4.6" delay={10} />
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 22,
            color: COLORS.blue,
            marginTop: 12,
            opacity: 0.85,
          }}
        >
          (Opus 4.8, Haiku 4.5 : ~200k · Gemini 2.5 Pro : 2M)
        </span>
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 26,
            color: COLORS.orange,
            fontWeight: 700,
            marginTop: 18,
            opacity: interpolate(frame, [85, 100], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
            textAlign: 'center',
          }}
        >
          → 90 % déjà occupé avant que vous tapiez quoi que ce soit.
        </span>
      </div>
      {/* Jauge stratifiée — ce qui REMPLIT le contexte */}
      <div style={{display: 'flex', flexDirection: 'column', gap: 4, width: 460}}>
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 22,
            color: COLORS.orange,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            opacity: interpolate(frame, [20, 32], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
            marginBottom: 8,
          }}
        >
          Ce qui se charge à chaque appel
        </span>
        {sections.map((s, i) => {
          const delay = 38 + i * 9;
          const o = interpolate(frame, [delay, delay + 12], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const widthPct = (s.tokens / total) * 100;
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 12, opacity: o}}>
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 600,
                  fontSize: 20,
                  color: COLORS.text,
                  width: 150,
                  textAlign: 'right',
                }}
              >
                {s.label}
              </span>
              <div
                style={{
                  width: `${widthPct * 2.4}px`,
                  height: 26,
                  background: s.color,
                  borderRadius: 4,
                  opacity: s.label === 'Libre' ? 0.25 : 0.85,
                }}
              />
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 18,
                  color: COLORS.text,
                  opacity: 0.75,
                  fontWeight: 600,
                }}
              >
                {s.tokens >= 1000 ? `${(s.tokens / 1000).toFixed(0)} k` : s.tokens}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// S3 — Bloc C : dégradation — schéma "U" attention début/milieu/fin
const S3: React.FC = () => {
  const frame = useCurrentFrame();
  // 12 segments représentant une jauge / barre de contexte. Le milieu est en orange faible.
  const segments = Array.from({length: 12}, (_, i) => i);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 28}}>
      <KineticText text="DÉGRADATION — LOST IN THE MIDDLE" fontSize={28} color={COLORS.orange} />
      <KineticText
        text="Plus le contexte gonfle, moins il est précis."
        delay={18}
        fontSize={48}
      />
      {/* Schéma "barre d'attention" : début et fin solides, milieu pâle */}
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginTop: 18}}>
        <div style={{display: 'flex', gap: 6}}>
          {segments.map((i) => {
            const delay = 40 + i * 4;
            // Intensité d'attention : forte au début et à la fin, faible au milieu (forme U inversé inversé = forme U)
            const pos = i / (segments.length - 1);
            const attention = Math.abs(pos - 0.5) * 2; // 0 au milieu, 1 aux bords
            const o = interpolate(frame, [delay, delay + 8], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            const h = 60 + attention * 60;
            return (
              <div
                key={i}
                style={{
                  width: 50,
                  height: h,
                  borderRadius: 6,
                  background: COLORS.orange,
                  opacity: o * (0.25 + attention * 0.7),
                  alignSelf: 'flex-end',
                }}
              />
            );
          })}
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', width: 670, marginTop: 4}}>
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 18,
              color: COLORS.text,
              opacity: 0.8,
              letterSpacing: 1,
            }}
          >
            DÉBUT (attention forte)
          </span>
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 18,
              color: COLORS.text,
              opacity: 0.5,
              letterSpacing: 1,
            }}
          >
            MILIEU (oublié)
          </span>
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 18,
              color: COLORS.text,
              opacity: 0.8,
              letterSpacing: 1,
            }}
          >
            FIN (attention forte)
          </span>
        </div>
      </div>
      <a
        href="https://arxiv.org/abs/2307.03172"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          opacity: interpolate(frame, [115, 127], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          marginTop: 12,
          padding: '10px 22px',
          border: `2px solid ${COLORS.blue}`,
          borderRadius: 10,
          fontFamily: FONT_FAMILY,
          fontWeight: 700,
          fontSize: 20,
          color: COLORS.blue,
          textDecoration: 'none',
          background: `${COLORS.blue}10`,
        }}
      >
        📄 Source : Liu et al. 2023 — Lost in the Middle
      </a>
      {/* Soupape : session compacting + /clear */}
      <span
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 18,
          color: COLORS.text,
          opacity: interpolate(frame, [130, 142], [0, 0.7], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          marginTop: 8,
        }}
      >
        💡 Soupape : Claude Code <strong style={{color: COLORS.orange}}>compacte</strong> auto · <span style={{fontFamily: '"JetBrains Mono", Menlo, monospace', color: COLORS.orange}}>/clear</span> pour reset manuel
      </span>
    </AbsoluteFill>
  );
};

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

// S7 ⭐ — Bloc E réponse : pattern phare + autres pièces du cadrage
const S7: React.FC = () => {
  const frame = useCurrentFrame();
  const supporting = ['CLAUDE.md', 'PROJECT_RULES', 'ARCHITECTURE.md', '.plan.md', 'DECISIONS.md'];
  const supportOp = interpolate(frame, [88, 102], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 26}}>
      <Reveal delay={6}>
        <LordiconIcon file={ICON.cogs} color={COLORS.orange} width={200} height={200} />
      </Reveal>
      <KineticText text="LA RÉPONSE — CADRER" delay={22} fontSize={30} color={COLORS.orange} />
      {/* Pattern phare au centre */}
      <div style={{display: 'flex', alignItems: 'center', gap: 24, marginTop: 4}}>
        <CodeChip text="SKILL.md" delay={42} />
        <span style={{fontSize: 56, color: COLORS.text, fontFamily: FONT_FAMILY, fontWeight: 800}}>+</span>
        <CodeChip text="script.py" delay={54} />
      </div>
      <KineticText text="Le LLM décide. Le script exécute." delay={72} fontSize={32} />
      {/* Autres fichiers de cadrage en chips discrets */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          justifyContent: 'center',
          maxWidth: 1100,
          marginTop: 6,
          opacity: supportOp,
        }}
      >
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 20,
            color: COLORS.blue,
            marginRight: 6,
            fontWeight: 600,
          }}
        >
          + tout ce qui cadre :
        </span>
        {supporting.map((name, i) => (
          <span
            key={i}
            style={{
              fontFamily: '"JetBrains Mono", "Fira Code", Menlo, monospace',
              fontSize: 20,
              color: COLORS.text,
              opacity: 0.7,
              padding: '4px 14px',
              border: `1px solid ${COLORS.text}33`,
              borderRadius: 8,
            }}
          >
            {name}
          </span>
        ))}
      </div>
      <span
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 20,
          color: COLORS.blue,
          opacity: interpolate(frame, [110, 124], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          marginTop: 8,
          fontStyle: 'italic',
        }}
      >
        On voit tout ça en détail au fil de la semaine.
      </span>
    </AbsoluteFill>
  );
};

// S8 — Bloc F : écosystème — 4 cartes outils cliquables
const S8: React.FC = () => {
  const frame = useCurrentFrame();
  const tools = [
    {name: 'Claude Code', tag: 'Anthropic — CLI dev', url: 'https://claude.com/product/claude-code', color: COLORS.orange},
    {name: 'OpenClaw', tag: 'Agent perso 24/7', url: 'https://openclaw.ai/', color: COLORS.text},
    {name: 'Hermes', tag: 'Nous Research — OSS', url: 'https://hermes-agent.nousresearch.com/', color: COLORS.text},
    {name: 'Ralph Loop', tag: 'Auto-relance infinie', url: 'https://ghuntley.com/ralph/', color: COLORS.blue},
  ];
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 26}}>
      <Reveal delay={6}>
        <LordiconIcon file={ICON.globe} color={COLORS.blue} width={140} height={140} />
      </Reveal>
      <KineticText text="L'ÉCOSYSTÈME AGENTIQUE — 2026" delay={20} fontSize={30} color={COLORS.orange} />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 22,
          marginTop: 14,
          maxWidth: 1100,
        }}
      >
        {tools.map((t, i) => {
          const delay = 38 + i * 10;
          const o = interpolate(frame, [delay, delay + 12], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const y = interpolate(frame, [delay, delay + 12], [20, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <a
              key={i}
              href={t.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '20px 28px',
                border: `2px solid ${t.color}33`,
                borderRadius: 14,
                background: `${t.color}08`,
                opacity: o,
                transform: `translateY(${y}px)`,
                textDecoration: 'none',
                minWidth: 380,
              }}
            >
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 800,
                  fontSize: 36,
                  color: t.color,
                  letterSpacing: 0.5,
                }}
              >
                {t.name}
              </span>
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 500,
                  fontSize: 22,
                  color: COLORS.text,
                  opacity: 0.75,
                  marginTop: 6,
                }}
              >
                {t.tag}
              </span>
            </a>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// S9 — Programme de la semaine (4 jours)
const S9: React.FC = () => {
  const frame = useCurrentFrame();
  const days = [
    {label: 'J1 — Lundi', detail: 'Vibe coding. Découverte des limites.', color: COLORS.orange},
    {label: 'J2 — Mardi', detail: 'Cadrage. Scripts. Gates.', color: COLORS.text},
    {label: 'J3 — Mercredi', detail: 'Outils externes. MCP, sous-agents, plans.', color: COLORS.text},
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

export const SLIDE_COMPONENTS = [S0, S1, SHarness, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11];
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
