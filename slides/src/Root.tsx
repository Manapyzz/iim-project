import React from 'react';
import {Composition} from 'remotion';
import {SlidesComp, TOTAL} from './Slides';

// Composition pour rendu vidéo (remotion render).
// Pour le mode présentation interactif, on passe par main.tsx → Deck.
export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="IIMJ1Theorie"
      component={SlidesComp}
      durationInFrames={TOTAL}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
