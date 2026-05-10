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

export default function App() {
  return (
    <div className="relative w-full min-h-screen">
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bts-sio" element={<BtsSio />} />
        <Route path="/competence" element={<Competence />} />
        <Route path="/ecole-alternance" element={<EcoleAlternance />} />
        <Route path="/missions-e5" element={<MissionsE5 />} />
        <Route path="/contact" element={<Contact />} />
        {/* Pages préservées mais masquées de la nav, comme l'ancien site */}
        <Route path="/projets-e6" element={<ProjetsE6 />} />
        <Route path="/veille-technologique" element={<VeilleTechnologique />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
      <Background />
    </div>
  );
}
