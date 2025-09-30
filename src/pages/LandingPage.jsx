import Navbar from "../components/Navbar";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  useEffect(() => {
    fetch('https://ritmos-backend.onrender.com/ping')
      .then(() => console.log('Backend activado desde landing'))
      .catch(err => console.error('Error al despertar el backend', err));
  }, []);

  const sections = [
    { path: "/secuenciador", label: "🎛️ Secuenciador" },
    { path: "/ritmos", label: "🥁 Ritmos" },
    { path: "/info-cultural", label: "🌍 Info Cultural" },
    { path: "/instrumentos", label: "🎶 Instrumentos" },
    { path: "/trivia", label: "❓ Trivia" },
    { path: "/donar", label: "💖 Donar" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-100">
      <Navbar />
      <div className="px-4 py-8 max-w-screen-sm mx-auto"></div>
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-orange-200 flex flex-col items-center justify-center px-4 py-10">
      <h1 className="text-4xl font-bold mb-8 text-center">Dumtak Studio</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-md">
        {sections.map(({ path, label }) => (
          <Link
            key={path}
            to={path}
            className="bg-white shadow rounded-xl p-4 text-center text-lg font-semibold hover:bg-yellow-200 transition"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
    </div>
  );
}
