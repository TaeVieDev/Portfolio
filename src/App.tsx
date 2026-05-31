import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Background from "./components/Background";
import ScrollToTop from "./components/ScrollToTop";
import ScrollUI from "./components/ScrollUI";
import Home from "./pages/Home";
import MissionsList from "./pages/MissionsList";
import { useRevealOnScroll } from "./hooks/useRevealOnScroll";

// Composant racine. Architecture après refonte single-page :
//   /                 → Home (toutes les sections en scroll)
//   /missions/:slug   → Page détail d'une mission (case study)
//   *                 → fallback vers la home
//

// Toutes les anciennes routes (/bts-sio, /competence…) ont été supprimées :
// elles deviennent des ancres (#bts, #competences…) sur la home.
// Si quelqu'un tape encore l'ancienne URL, le wildcard le ramène à /.
export default function App() {
  // Active le fade-in au scroll sur toutes les <section> de la page courante.
  // Le hook se re-déclenche à chaque changement de route (Home → /missions/:slug).
  useRevealOnScroll();

  return (
    <div className="relative w-full min-h-screen">
      <ScrollToTop />
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        {/* Liste complète d'une catégorie (cible du bouton "Afficher plus" de la home). */}
        <Route path="/missions/categorie/:category" element={<MissionsList />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
      <Background />
      {/* Overlay scroll : barre de progression + bouton retour en haut */}
      <ScrollUI />
    </div>
  );
}
