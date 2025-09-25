// src/main.jsx
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import LandingPage from "./pages/LandingPage";
import TriviaPage from "./pages/TriviaPage";
import TeoriaPage from "./pages/TeoriaPage";
import CarruselTest from "./pages/CarruselTest";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter basename="/DumTakStudio">
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/app" element={<App />} />
      <Route path="/trivia" element={<TriviaPage />} />
      <Route path="/teoria" element={<TeoriaPage />} />
      <Route path="/test" element={<CarruselTest />} />
    </Routes>
  </BrowserRouter>
);