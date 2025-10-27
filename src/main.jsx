//main.jsx
import ReactDOM from "react-dom/client";
import "./index.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import "abcjs/abcjs-audio.css";

import LandingPage from "./pages/LandingPage";
import SecuenciadorPage from "./pages/SecuenciadorPage";
import RitmosPage from "./pages/RitmosPage";
import RitmoDetallePage from "./pages/RitmoDetallePage";
import InfoCulturalPage from "./pages/InfoCulturalPage";
import EstiloDetallePage from "./pages/EstiloDetallePage";
import InstrumentosPage from "./pages/InstrumentosPage";
import FamiliaInstrumentosPage from "./pages/FamiliaInstrumentosPage";
import TriviaPage from "./pages/TriviaPage";
import DonarPage from "./pages/DonarPage";
import PracticeAssistant from "./pages/PracticeAssistant"; // ✅ NUEVO IMPORT
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserStats from './pages/UserStats';
import ReadingTrainerPage from "./pages/ReadingTrainerPage";


 
ReactDOM.createRoot(document.getElementById("root")).render(
  <HashRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/secuenciador" element={<SecuenciadorPage />} />
      <Route path="/ritmos" element={<RitmosPage />} />
      <Route path="/ritmos/:id" element={<RitmoDetallePage />} />
      <Route path="/info-cultural" element={<InfoCulturalPage />} />
      <Route path="/info-cultural/:estilo" element={<EstiloDetallePage />} />
      <Route path="/instrumentos" element={<InstrumentosPage />} />
      <Route path="/instrumentos/:familia" element={<FamiliaInstrumentosPage />} />
      <Route path="/trivia" element={<TriviaPage />} />
      <Route path="/donar" element={<DonarPage />} />
      <Route path="/practice" element={<PracticeAssistant />} /> {/* ✅ NUEVA RUTA */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/estadisticas" element={<UserStats />} />
      <Route path="/lectura" element={<ReadingTrainerPage />} />


    </Routes>
  </HashRouter>
);
