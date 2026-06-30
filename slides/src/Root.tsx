import React from 'react';
import {Composition} from 'remotion';
import {SlidesComp, TOTAL} from './Slides';
import {J2SlidesComp, J2_TOTAL} from './J2Slides';

// Compositions pour rendu vidéo (remotion render).
// Pour le mode présentation interactif, on passe par main.tsx → Deck.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="IIMJ1Theorie"
        component={SlidesComp}
        durationInFrames={TOTAL}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="IIMJ2Cadrage"
        component={J2SlidesComp}
        durationInFrames={J2_TOTAL}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
