import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame, interpolate} from 'remotion';
import {Centered, KineticText, Reveal} from './components';
import {LordiconIcon} from './LordiconIcon';
import {COLORS, FONT_FAMILY} from './theme';

// Slides J4 — Vos workflows en entreprise
// Durée par slide : 5 secondes à 30 fps.
export const SLIDE = 150;

const GREEN = '#2ECC71';
const PURPLE = '#7C4DFF';

const ICON = {
  rocket: 'wired-flat-489-rocket-space-hover-flying.json',
  shield: 'wired-flat-3278-shield-checkered-hover-pinch.json',
  alert: 'wired-flat-2263-alert-hover-pinch.json',
};

const RED = '#FF4D4D';

// PROSE = 100 % doctrine LLM · MIXTE = doctrine + scripts · SCRIPT = surtout du code déterministe
const PATTERN_COLOR = {
  PROSE: COLORS.blue,
  MIXTE: COLORS.orange,
  SCRIPT: GREEN,
} as const;

// ============ BRIQUES ============

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

const Badge: React.FC<{text: string; color: string}> = ({text, color}) => (
  <span
    style={{
      fontFamily: FONT_FAMILY,
      fontWeight: 800,
      fontSize: 15,
      letterSpacing: 1,
      color,
      border: `1.5px solid ${color}`,
      borderRadius: 6,
      padding: '3px 11px',
      whiteSpace: 'nowrap',
    }}
  >
    {text}
  </span>
);

// Slide "workflow détaillé" : l'anatomie complète d'un skill (le SSS + ce que ça évite).
// Mappe directement sur le livrable étudiant : SKILL.md + script déterministe + registre métier/transverse.
type DetailProps = {
  name: string;
  source: 'mana-os' | 'entreprise';
  register: 'MÉTIER' | 'TRANSVERSE';
  pattern: keyof typeof PATTERN_COLOR;
  trigger: string;
  skill: string;
  script: string;
  sessions: string;
  avoids: string;
};

const WorkflowDetail: React.FC<DetailProps> = ({
  name,
  source,
  register,
  pattern,
  trigger,
  skill,
  script,
  sessions,
  avoids,
}) => {
  const frame = useCurrentFrame();
  const cols = [
    {tag: 'SKILL.md', sub: 'la doctrine', body: skill, color: COLORS.blue},
    {tag: 'SCRIPT', sub: 'déterministe', body: script, color: GREEN},
    {tag: 'SESSIONS', sub: 'ce que ça produit', body: sessions, color: COLORS.orange},
  ];
  return (
    <AbsoluteFill style={{flexDirection: 'column', justifyContent: 'center', padding: '60px 96px', gap: 24}}>
      {/* Header : nom + badges */}
      <Reveal delay={4}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap'}}>
          <span
            style={{
              fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
              fontWeight: 800,
              fontSize: 46,
              color: COLORS.orange,
            }}
          >
            {name}
          </span>
          <Badge text={source === 'mana-os' ? 'mana-os · réel' : 'entreprise'} color={source === 'mana-os' ? PURPLE : COLORS.text} />
          <Badge text={`SKILL ${register}`} color={COLORS.text} />
          <Badge text={pattern} color={PATTERN_COLOR[pattern]} />
        </div>
      </Reveal>

      {/* Quand ça se déclenche */}
      <Reveal delay={12}>
        <div style={{fontFamily: FONT_FAMILY, fontSize: 23, color: COLORS.text}}>
          <span style={{color: 'rgba(245,245,240,0.55)'}}>Quand — </span>
          {trigger}
        </div>
      </Reveal>

      {/* SSS : 3 colonnes */}
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20}}>
        {cols.map((c, i) => {
          const op = interpolate(frame, [22 + i * 8, 32 + i * 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          const y = interpolate(frame, [22 + i * 8, 32 + i * 8], [22, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return (
            <div
              key={c.tag}
              style={{
                opacity: op,
                transform: `translateY(${y}px)`,
                padding: '22px 24px',
                borderRadius: 14,
                background: 'rgba(255,255,255,0.04)',
                borderTop: `4px solid ${c.color}`,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                minHeight: 236,
              }}
            >
              <div style={{display: 'flex', alignItems: 'baseline', gap: 10}}>
                <span style={{fontFamily: FONT_FAMILY, fontWeight: 900, fontSize: 24, color: c.color}}>{c.tag}</span>
                <span style={{fontFamily: FONT_FAMILY, fontSize: 15, color: 'rgba(245,245,240,0.5)'}}>{c.sub}</span>
              </div>
              <span style={{fontFamily: FONT_FAMILY, fontSize: 19, lineHeight: 1.42, color: COLORS.text}}>{c.body}</span>
            </div>
          );
        })}
      </div>

      {/* Ce que ça évite (le WLGW) */}
      <div
        style={{
          opacity: interpolate(frame, [50, 62], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
          padding: '16px 24px',
          borderRadius: 12,
          border: `2px solid ${COLORS.orange}`,
          background: `${COLORS.orange}12`,
        }}
      >
        <span style={{fontFamily: FONT_FAMILY, fontWeight: 800, fontSize: 19, color: COLORS.orange}}>Sans le skill — </span>
        <span style={{fontFamily: FONT_FAMILY, fontSize: 19, color: COLORS.text}}>{avoids}</span>
      </div>
    </AbsoluteFill>
  );
};

// ============ DONNÉES DES WORKFLOWS DÉTAILLÉS ============
// 5 workflows mana-os réels (Alex) + 4 workflows entreprise. Tous ont un script (pattern mixte/script).

const DETAILS: DetailProps[] = [
  {
    name: 'calendar',
    source: 'mana-os',
    register: 'MÉTIER',
    pattern: 'MIXTE',
    trigger: '« event RDV dentiste jeudi 14h », « bloque-moi un créneau lundi »',
    skill: "Toujours créer l'event AVEC un rappel, sinon pas de notif. Multi-comptes (perso / pro / TPB). Ne jamais inventer une heure : demander si c'est flou.",
    script: "mana_calendar.py — sous-commandes sync / create / setup. La date, le fuseau, l'appel API Google : gérés par le code, pas improvisés par le LLM.",
    sessions: "L'event apparaît dans Google + Outlook Desktop, avec notif PC et téléphone.",
    avoids: "Le LLM crée un event sans rappel, aucune notif, tu rates le RDV. Ou il se trompe de compte.",
  },
  {
    name: 'gmail',
    source: 'mana-os',
    register: 'TRANSVERSE',
    pattern: 'MIXTE',
    trigger: '« mes mails non lus », « cherche le mail de Mathieu », « prépare une réponse à X »',
    skill: "Multi-comptes perso / pro. Règle cardinale : jamais d'envoi sans validation explicite. On montre le brouillon d'abord, on envoie seulement sur OK clair.",
    script: 'mail.py — list / search / read / draft / send, avec un garde-fou anti-envoi codé en dur.',
    sessions: "Un brouillon est créé dans Gmail. Rien ne part tant que tu n'as pas confirmé.",
    avoids: "Le LLM envoie un mail tout seul « pour rendre service ». Le garde-fou l'en empêche.",
  },
  {
    name: 'lint-dette',
    source: 'mana-os',
    register: 'TRANSVERSE',
    pattern: 'SCRIPT',
    trigger: '« scanne les repos », « sors le mur de la dette »',
    skill: '100 % déterministe, ZÉRO appel LLM. Compte les anti-patterns par regex, selon des règles fixes.',
    script: 'lint_dette_ia.py — scanne les repos, sort un JSON. Que du regex, rejouable à l\'identique.',
    sessions: 'rapport.json projeté dans le dashboard « mur de la dette » (celui du J2).',
    avoids: "Un « linter » qui demande à un LLM : lent, cher, jamais deux fois le même résultat. Ici c'est instantané et reproductible.",
  },
  {
    name: 'daily-review',
    source: 'mana-os',
    register: 'TRANSVERSE',
    pattern: 'MIXTE',
    trigger: '« ma revue du jour », lancé chaque matin',
    skill: 'Résume calendar + todos + inbox. Sort AU MAXIMUM 3 priorités, pas douze.',
    script: 'daily_review.py — va chercher les sources et génère le rapport du jour.',
    sessions: 'Le rapport atterrit dans mobile/, consultable sur le téléphone via Obsidian.',
    avoids: 'Le LLM te sort 12 priorités « toutes urgentes ». Le skill impose d\'en garder 3.',
  },
  {
    name: 'hevy',
    source: 'mana-os',
    register: 'MÉTIER',
    pattern: 'MIXTE',
    trigger: '« récupère mes dernières séances », « mes stats muscu »',
    skill: "Pull les séances via l'API Hevy. Passe la main au skill coach-sport pour l'interprétation.",
    script: 'hevy.py — synchronise les workouts vers le journal d\'entraînement.',
    sessions: 'Séances loggées dans programme-2026/journal/, prêtes à être analysées.',
    avoids: 'Le LLM « estime » ta progression sans données. Le script tire les vrais chiffres de l\'app.',
  },
  {
    name: 'traite-mon-dump',
    source: 'mana-os',
    register: 'TRANSVERSE',
    pattern: 'MIXTE',
    trigger: '« traite mon dump », après avoir vidé mes idées en vrac (vocal ou texte)',
    skill: 'Chaque élément est trié : action immédiate, tâche, note, journal, recette, idée projet. Puis le brut est vidé.',
    script: 'sync_mobile.py — récupère le dump iCloud, le compare au local, range chaque artefact dans le bon dossier.',
    sessions: 'Un résumé de ce qui a été trié, et le dump remis à zéro. On ne garde que le résultat.',
    avoids: "Le LLM garde l'historique brut « au cas où » et range au hasard. La doctrine : on vide, on ne garde que les artefacts.",
  },
  {
    name: 'telegram-notif',
    source: 'mana-os',
    register: 'TRANSVERSE',
    pattern: 'SCRIPT',
    trigger: 'automatique, aux heures fixes (matin, midi, soir)',
    skill: 'Notificateur PUR. Aucune donnée perso ne transite : que des compteurs (« 3 tâches, 1 event ») et des liens Obsidian.',
    script: 'telegram_bot.py + mana_scheduler.py — envoient les notifs aux horaires prévus, compteurs et liens seulement.',
    sessions: 'Notif reçue sur le téléphone ; le contenu réel reste dans Obsidian, en local.',
    avoids: 'Le LLM mettrait le contenu des tâches dans la notif (fuite). La doctrine : compteurs et liens, jamais le contenu.',
  },
  {
    name: 'code-review',
    source: 'entreprise',
    register: 'TRANSVERSE',
    pattern: 'MIXTE',
    trigger: '« relis mon PR avant que je le mette en revue »',
    skill: 'Check-list maison : test présent ? nom clair ? effet de bord ? migration ? Lance les tests avant de dire quoi que ce soit.',
    script: 'lint-diff.ts — fait tourner ESLint et les tests sur le diff, pas sur tout le repo.',
    sessions: 'Chaque review est tracée : ce qui a été vérifié, quand.',
    avoids: "Le LLM dit « LGTM » sur du code qui casse un test. Le script fait tourner les tests pour de vrai.",
  },
  {
    name: 'test-writer',
    source: 'entreprise',
    register: 'TRANSVERSE',
    pattern: 'MIXTE',
    trigger: '« écris les tests de cette fonction »',
    skill: "Un cas nominal + deux cas limites + un cas d'erreur. Interdit de mocker la fonction qu'on teste.",
    script: 'run-and-check.ts — lance vitest / pytest et vérifie que les tests passent vraiment.',
    sessions: 'Le résultat des tests est loggé : vert ou rouge, sans tricher.',
    avoids: 'Le LLM écrit des tests qui passent en mockant la logique testée. Faux sentiment de sécurité.',
  },
  {
    name: 'component-audit',
    source: 'entreprise',
    register: 'MÉTIER',
    pattern: 'SCRIPT',
    trigger: '« quels composants sont morts dans le design system »',
    skill: 'Priorise par usage réel croisé avec la dette. Ne cite que des composants qui existent vraiment.',
    script: 'scan-components.ts — parse le repo front et sort l\'usage réel de chaque composant.',
    sessions: 'Rapport : composants utilisés, abandonnés, dupliqués.',
    avoids: 'Le LLM invente des noms de composants plausibles mais faux. Le script liste les vrais.',
  },
  {
    name: 'release-check',
    source: 'entreprise',
    register: 'TRANSVERSE',
    pattern: 'MIXTE',
    trigger: '« est-ce qu\'on peut déployer ? »',
    skill: 'Gate humain avant le push prod. Vérifie tests, migrations, feature flags, changelog.',
    script: 'preflight.ts — déroule la check-list de déploiement automatiquement.',
    sessions: 'Rapport preflight : ce qui est prêt, ce qui bloque.',
    avoids: "Le LLM dit « c'est bon, déploie » en ayant zappé une migration. Le script vérifie.",
  },
];

const detailSlides: React.FC[] = DETAILS.map((d) => {
  const Comp: React.FC = () => <WorkflowDetail {...d} />;
  return Comp;
});

// ============ SLIDES CADRE ============

// J4-S0 — Intro
const J4S0: React.FC = () => (
  <CenterHero
    file={ICON.rocket}
    color={COLORS.orange}
    kicker="JOUR 4 — JEUDI"
    label="Vos workflows avec Claude Code"
    labelSize={72}
  />
);

// J4-S1 — Rappel mécanique : skill + contexte + objectif = agent, et les 3 patterns
const J4S1: React.FC = () => {
  const frame = useCurrentFrame();
  const patterns = [
    {label: 'PROSE', sub: '100 % doctrine', ex: 'ex : meeting-notes, follow-up', color: COLORS.blue, delay: 46},
    {label: 'MIXTE', sub: 'doctrine + scripts', ex: 'ex : calendar, code-review', color: COLORS.orange, delay: 56},
    {label: 'SCRIPT', sub: 'surtout du code fiable', ex: 'ex : lint-dette, component-audit', color: GREEN, delay: 66},
  ];
  return (
    <AbsoluteFill style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 30, padding: '0 100px'}}>
      <KineticText text="Un SKILL + contexte + objectif = un agent" delay={4} fontSize={44} highlight="SKILL" />
      <KineticText
        text="Tout ce qui suit, c'est un skill que vous écrivez une fois et rechargez à volonté."
        delay={20}
        fontSize={24}
        color={COLORS.text}
      />
      <div style={{display: 'flex', gap: 24, marginTop: 14}}>
        {patterns.map((p) => {
          const op = interpolate(frame, [p.delay, p.delay + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          const y = interpolate(frame, [p.delay, p.delay + 10], [24, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return (
            <div
              key={p.label}
              style={{
                opacity: op,
                transform: `translateY(${y}px)`,
                width: 340,
                padding: '24px 28px',
                borderRadius: 14,
                background: 'rgba(255,255,255,0.04)',
                borderTop: `4px solid ${p.color}`,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <span style={{fontFamily: FONT_FAMILY, fontWeight: 900, fontSize: 30, color: p.color}}>{p.label}</span>
              <span style={{fontFamily: FONT_FAMILY, fontSize: 22, color: COLORS.text}}>{p.sub}</span>
              <span style={{fontFamily: FONT_FAMILY, fontSize: 17, color: 'rgba(245,245,240,0.6)'}}>{p.ex}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// J4 — Patterns transversaux (pas des skills, des réflexes)
const J4Transversaux: React.FC = () => {
  const frame = useCurrentFrame();
  const items = [
    {t: 'CADRAGE', d: 'Planifier avant de coder.'},
    {t: 'GATES', d: 'Le LLM s\'arrête et demande aux étapes critiques.'},
    {t: 'CONFIG vs CODE', d: 'Zéro magic number, tout vit dans config/.'},
    {t: 'WLGW', d: 'Chaque plantage → un anti-pattern dans le SKILL.md.'},
    {t: 'SESSIONS', d: 'Chaque script sérieux logue en JSONL. Audit.'},
    {t: 'GARDE-FOU', d: 'Aucune action externe sans validation humaine.'},
  ];
  return (
    <AbsoluteFill style={{flexDirection: 'column', justifyContent: 'center', padding: '70px 110px', gap: 34}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
        <Reveal delay={4}>
          <LordiconIcon file={ICON.shield} color={COLORS.orange} width={92} height={92} />
        </Reveal>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <span style={{fontFamily: FONT_FAMILY, fontWeight: 800, fontSize: 20, letterSpacing: 2, color: COLORS.orange}}>
            LES RÉFLEXES QUI VONT PARTOUT
          </span>
          <span style={{fontFamily: FONT_FAMILY, fontWeight: 900, fontSize: 46, color: COLORS.text}}>
            Patterns transversaux
          </span>
        </div>
      </div>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 22}}>
        {items.map((it, i) => {
          const op = interpolate(frame, [16 + i * 7, 26 + i * 7], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          const y = interpolate(frame, [16 + i * 7, 26 + i * 7], [20, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return (
            <div
              key={it.t}
              style={{
                opacity: op,
                transform: `translateY(${y}px)`,
                padding: '20px 24px',
                borderRadius: 12,
                background: 'rgba(255,255,255,0.04)',
                borderLeft: `4px solid ${COLORS.orange}`,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <span style={{fontFamily: FONT_FAMILY, fontWeight: 900, fontSize: 24, color: COLORS.orange}}>{it.t}</span>
              <span style={{fontFamily: FONT_FAMILY, fontSize: 19, lineHeight: 1.35, color: COLORS.text}}>{it.d}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// J4 — Démarrer demain
const J4Demain: React.FC = () => {
  const frame = useCurrentFrame();
  const steps = [
    {n: '1', t: 'Ton .claude/skills/ perso', d: 'Dans tes projets à toi. Aucune permission à demander.'},
    {n: '2', t: 'Un skill de 20 lignes, prose only', d: 'Ton style à toi. Tier DRAFT. Tu itères.'},
    {n: '3', t: 'Il devient utile → tu l\'apportes', d: '« J\'ai gagné 30 min par jour, ça peut nous servir ? »'},
    {n: '4', t: 'Un WLGW par semaine', d: 'Regarde ce que Claude foire chez toi. Écris l\'anti-pattern.'},
    {n: '5', t: 'Cite tes sources / sessions', d: 'La diff entre « IA magique » et outil pro : l\'auditabilité.'},
  ];
  return (
    <AbsoluteFill style={{flexDirection: 'column', justifyContent: 'center', padding: '70px 130px', gap: 26}}>
      <KineticText text="Comment démarrer demain" delay={4} fontSize={50} highlight="demain" />
      <div style={{display: 'flex', flexDirection: 'column', gap: 16, marginTop: 10}}>
        {steps.map((s, i) => {
          const op = interpolate(frame, [22 + i * 9, 32 + i * 9], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          const x = interpolate(frame, [22 + i * 9, 32 + i * 9], [-24, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return (
            <div key={s.n} style={{opacity: op, transform: `translateX(${x}px)`, display: 'flex', alignItems: 'center', gap: 22}}>
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 900,
                  fontSize: 30,
                  color: COLORS.bg,
                  background: COLORS.orange,
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {s.n}
              </span>
              <div style={{display: 'flex', flexDirection: 'column'}}>
                <span style={{fontFamily: FONT_FAMILY, fontWeight: 800, fontSize: 26, color: COLORS.text}}>{s.t}</span>
                <span style={{fontFamily: FONT_FAMILY, fontSize: 20, color: 'rgba(245,245,240,0.7)'}}>{s.d}</span>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// J4 — WLGW : What LLMs Get Wrong (le mécanisme qui fait grandir un skill)
const J4WLGW: React.FC = () => {
  const frame = useCurrentFrame();
  const steps = [
    {n: '1', t: 'LE LLM SE PLANTE', d: 'Il « calcule » 19,6 % de TVA au lieu de 20 %. Il applique la remise sur le TTC au lieu du HT.'},
    {n: '2', t: 'TU NOTES L\'ANTI-PATTERN', d: 'Dans le SKILL.md : ce qui est BAD, ce qui est GOOD, et pourquoi.'},
    {n: '3', t: 'LE SKILL GRANDIT', d: 'Il ne refait plus l\'erreur. À chaque plantage observé, il apprend.'},
  ];
  return (
    <AbsoluteFill style={{flexDirection: 'column', justifyContent: 'center', padding: '60px 100px', gap: 28}}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
        <span style={{fontFamily: FONT_FAMILY, fontWeight: 800, fontSize: 20, letterSpacing: 2, color: COLORS.orange}}>
          CE QUI FAIT GRANDIR UN SKILL
        </span>
        <KineticText text="WLGW · What LLMs Get Wrong" delay={4} fontSize={46} align="left" highlight="Wrong" />
      </div>

      <Reveal delay={16}>
        <div style={{fontFamily: FONT_FAMILY, fontSize: 25, color: COLORS.text, maxWidth: 1400}}>
          Ce que le LLM rate à tous les coups sur un domaine donné. On l'attrape une fois, on ne le subit plus.
        </div>
      </Reveal>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20}}>
        {steps.map((s, i) => {
          const op = interpolate(frame, [26 + i * 9, 36 + i * 9], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          const y = interpolate(frame, [26 + i * 9, 36 + i * 9], [22, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return (
            <div
              key={s.n}
              style={{
                opacity: op,
                transform: `translateY(${y}px)`,
                padding: '22px 24px',
                borderRadius: 12,
                background: 'rgba(255,255,255,0.04)',
                borderTop: `4px solid ${COLORS.orange}`,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                minHeight: 200,
              }}
            >
              <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                <span
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontWeight: 900,
                    fontSize: 22,
                    color: COLORS.bg,
                    background: COLORS.orange,
                    width: 38,
                    height: 38,
                    borderRadius: 19,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {s.n}
                </span>
                <span style={{fontFamily: FONT_FAMILY, fontWeight: 900, fontSize: 21, color: COLORS.orange}}>{s.t}</span>
              </div>
              <span style={{fontFamily: FONT_FAMILY, fontSize: 19, lineHeight: 1.4, color: COLORS.text}}>{s.d}</span>
            </div>
          );
        })}
      </div>

      <div style={{opacity: interpolate(frame, [58, 70], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), fontFamily: FONT_FAMILY, fontSize: 20, color: 'rgba(245,245,240,0.7)'}}>
        Dans chaque workflow qui suit, le « <span style={{color: COLORS.orange, fontWeight: 700}}>Sans le skill —</span> » : c'est un WLGW capturé.
      </div>
    </AbsoluteFill>
  );
};

// J4 — Le pouvoir (et le coût) des tokens
const J4Risque: React.FC = () => {
  const frame = useCurrentFrame();
  const dangers = [
    {t: 'COÛT', d: 'Une boucle + une clé sans plafond = facture qui explose.', fix: 'Budget cap sur chaque clé.'},
    {t: 'IRRÉVERSIBLE', d: 'push --force, deploy prod, suppression de données.', fix: 'Garde-fou humain avant l\'action.'},
    {t: 'FUITE', d: 'Une clé qui peut tout, oubliée dans un repo.', fix: 'Least privilege. Jamais de secret dans git.'},
  ];
  return (
    <AbsoluteFill style={{flexDirection: 'column', justifyContent: 'center', padding: '60px 100px', gap: 26}}>
      {/* Header */}
      <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
        <Reveal delay={4}>
          <LordiconIcon file={ICON.alert} color={RED} width={92} height={92} />
        </Reveal>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <span style={{fontFamily: FONT_FAMILY, fontWeight: 800, fontSize: 20, letterSpacing: 2, color: RED}}>
            AVANT DE LÂCHER VOS AGENTS
          </span>
          <span style={{fontFamily: FONT_FAMILY, fontWeight: 900, fontSize: 46, color: COLORS.text}}>
            Le token qui peut tout
          </span>
        </div>
      </div>

      <Reveal delay={12}>
        <div style={{fontFamily: FONT_FAMILY, fontSize: 24, color: COLORS.text, maxWidth: 1400}}>
          Un script, un agent, agit avec les droits de sa clé. Une clé qui peut push, déployer, poster, payer,
          c'est autant de dégâts possibles si ça part en vrille ou si elle fuite.
        </div>
      </Reveal>

      {/* 3 dangers + réflexe */}
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20}}>
        {dangers.map((it, i) => {
          const op = interpolate(frame, [22 + i * 8, 32 + i * 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          const y = interpolate(frame, [22 + i * 8, 32 + i * 8], [22, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return (
            <div
              key={it.t}
              style={{
                opacity: op,
                transform: `translateY(${y}px)`,
                padding: '20px 24px',
                borderRadius: 12,
                background: 'rgba(255,255,255,0.04)',
                borderTop: `4px solid ${RED}`,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                minHeight: 190,
              }}
            >
              <span style={{fontFamily: FONT_FAMILY, fontWeight: 900, fontSize: 24, color: RED}}>{it.t}</span>
              <span style={{fontFamily: FONT_FAMILY, fontSize: 19, lineHeight: 1.35, color: COLORS.text}}>{it.d}</span>
              <span style={{fontFamily: FONT_FAMILY, fontSize: 18, lineHeight: 1.3, color: GREEN, marginTop: 'auto'}}>
                → {it.fix}
              </span>
            </div>
          );
        })}
      </div>

      {/* Anecdote */}
      <div
        style={{
          opacity: interpolate(frame, [50, 62], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
          padding: '18px 26px',
          borderRadius: 12,
          border: `2px solid ${RED}`,
          background: `${RED}12`,
        }}
      >
        <span style={{fontFamily: FONT_FAMILY, fontWeight: 800, fontSize: 20, color: RED}}>Vu en vrai — </span>
        <span style={{fontFamily: FONT_FAMILY, fontSize: 20, color: COLORS.text}}>
          un outil, une clé sans plafond : <strong>5 000 $</strong> de Cloudflare partis en fumée. Un budget cap et une clé scopée l'auraient évité.
        </span>
      </div>

      {/* Lien à leur vécu */}
      <div style={{opacity: interpolate(frame, [66, 78], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), fontFamily: FONT_FAMILY, fontSize: 18, color: 'rgba(245,245,240,0.65)'}}>
        Vos clés LiteLLM avaient un plafond cette semaine. C'était exactement ça.
      </div>
    </AbsoluteFill>
  );
};

// ============ EXPORT ============

const SlideFade: React.FC<{children: React.ReactNode}> = ({children}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

// Deck J4 : intro + rappel + WLGW, 11 workflows détaillés (7 mana-os + 4 entreprise), patterns transversaux, risque tokens, démarrer demain.
export const J4_SLIDE_COMPONENTS: React.FC[] = [J4S0, J4S1, J4WLGW, ...detailSlides, J4Transversaux, J4Risque, J4Demain];
export const J4_SLIDE_COUNT = J4_SLIDE_COMPONENTS.length;
export const J4_TOTAL = SLIDE * J4_SLIDE_COUNT;

export const J4SlidesComp: React.FC = () => (
  <AbsoluteFill style={{background: `radial-gradient(circle at 50% 45%, #1a2030 0%, ${COLORS.bg} 70%)`}}>
    {J4_SLIDE_COMPONENTS.map((S, i) => (
      <Sequence key={i} from={i * SLIDE} durationInFrames={SLIDE}>
        <SlideFade>
          <S />
        </SlideFade>
      </Sequence>
    ))}
  </AbsoluteFill>
);
