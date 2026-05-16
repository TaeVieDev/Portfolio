import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Background from "./components/Background";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import MissionDetail from "./pages/MissionDetail";

// Composant racine. Architecture après refonte single-page :
//   /                 → Home (toutes les sections en scroll)
//   /missions/:slug   → Page détail d'une mission (case study)
//   *                 → fallback vers la home
//
// Toutes les anciennes routes (/bts-sio, /competence…) ont été supprimées :
// elles deviennent des ancres (#bts, #competences…) sur la home.
// Si quelqu'un tape encore l'ancienne URL, le wildcard le ramène à /.
export default function App() {
  return (
    <div className="relative w-full min-h-screen">
      <ScrollToTop />
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        {/* :slug = paramètre dynamique. MissionDetail le récupère via useParams. */}
        <Route path="/missions/:slug" element={<MissionDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
      <Background />
    </div>
  );
}
