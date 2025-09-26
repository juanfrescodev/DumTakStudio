// src/main.jsx
import ReactDOM from "react-dom/client";
import "./index.css";
import { HashRouter, Routes, Route } from "react-router-dom"; // 👈 cambiamos BrowserRouter por HashRouter
import App from "./App";
import LandingPage from "./pages/LandingPage";
import TriviaPage from "./pages/TriviaPage";
import TeoriaPage from "./pages/TeoriaPage";
import CarruselTest from "./pages/CarruselTest";

ReactDOM.createRoot(document.getElementById("root")).render(
  <HashRouter> {/* 👈 ya no usamos basename */}
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/app" element={<App />} />
      <Route path="/trivia" element={<TriviaPage />} />
      <Route path="/teoria" element={<TeoriaPage />} />
      <Route path="/test" element={<CarruselTest />} />
    </Routes>
  </HashRouter>
);
