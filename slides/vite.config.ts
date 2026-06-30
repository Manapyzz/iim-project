import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

// Page web qui sert le deck de présentation (@remotion/player).
// `public/` est servi à la racine (pour les Lottie si besoin plus tard).
export default defineConfig({
  plugins: [react()],
  // Base relative pour que le build marche aussi bien en local qu'en sous-chemin VPS (/slides/).
  base: './',
});
