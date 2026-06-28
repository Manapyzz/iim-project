import React, {useEffect, useState} from 'react';
import {Lottie, LottieAnimationData} from '@remotion/lottie';
import {cancelRender, continueRender, delayRender, staticFile} from 'remotion';

// --- Recoloration d'un Lottie (remplace les couleurs de fill/stroke statiques) ---
function hexToRgb01(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const n = parseInt(h, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function recolor(node: any, rgb: [number, number, number]): void {
  if (Array.isArray(node)) {
    node.forEach((child) => recolor(child, rgb));
    return;
  }
  if (node && typeof node === 'object') {
    // fill ('fl') ou stroke ('st') avec couleur statique
    if ((node.ty === 'fl' || node.ty === 'st') && node.c && node.c.a === 0 && Array.isArray(node.c.k)) {
      const alpha = node.c.k[3] ?? 1;
      node.c.k = [rgb[0], rgb[1], rgb[2], alpha];
    }
    for (const key in node) recolor(node[key], rgb);
  }
}

/**
 * Charge une icône Lordicon (Lottie JSON) depuis public/ et la rend dans Remotion.
 * `color` : recolore l'icône à une couleur (sinon couleurs d'origine).
 *   → tu peux donc télécharger les icônes SANS les recolorer sur Lordicon.
 */
export const LordiconIcon: React.FC<{
  file: string;
  width?: number;
  height?: number;
  loop?: boolean;
  color?: string;
}> = ({file, width = 160, height = 160, loop = true, color}) => {
  const [data, setData] = useState<LottieAnimationData | null>(null);
  const [handle] = useState(() => delayRender(`Loading ${file}`));

  useEffect(() => {
    fetch(staticFile(file))
      .then((res) => res.json())
      .then((json) => {
        if (color) {
          const clone = JSON.parse(JSON.stringify(json));
          recolor(clone, hexToRgb01(color));
          setData(clone);
        } else {
          setData(json);
        }
        continueRender(handle);
      })
      .catch((err) => cancelRender(err));
  }, [handle, file, color]);

  if (!data) return null;
  return <Lottie animationData={data} loop={loop} style={{width, height}} />;
};
