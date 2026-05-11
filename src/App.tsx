import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Background from "./components/Background";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import BtsSio from "./pages/BtsSio";
import Competence from "./pages/Competence";
import EcoleAlternance from "./pages/EcoleAlternance";
import MissionsE5 from "./pages/MissionsE5";
import Contact from "./pages/Contact";
import ProjetsE6 from "./pages/ProjetsE6";
import VeilleTechnologique from "./pages/VeilleTechnologique";

// Composant racine : la "shell" commune à toutes les pages.
// Header et Footer sont rendus EN DEHORS de <Routes> donc affichés partout.
// Seul le contenu central change selon l'URL.
export default function App() {
  return (
    <div className="relative w-full min-h-screen">
      {/* ScrollToTop écoute les changements d'URL et remet le scroll en haut.
          Pas de rendu visuel : c'est un composant "effet pur". */}
      <ScrollToTop />
      <Header />

      {/* <Routes> = équivalent du switch : matche l'URL et rend UNE seule <Route>.
          <Navigate replace> redirige proprement, remplace l'entrée dans l'historique
          (donc le bouton précédent ne ramène pas sur l'URL invalide). */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bts-sio" element={<BtsSio />} />
        <Route path="/competence" element={<Competence />} />
        <Route path="/ecole-alternance" element={<EcoleAlternance />} />
        <Route path="/missions-e5" element={<MissionsE5 />} />
        <Route path="/contact" element={<Contact />} />
        {/* Pages préservées mais masquées de la nav (comme l'ancien site) */}
        <Route path="/projets-e6" element={<ProjetsE6 />} />
        <Route path="/veille-technologique" element={<VeilleTechnologique />} />
        {/* path="*" = fallback pour toute URL non matchée */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
      <Background />
    </div>
  );
}
