// src/pages/TriviaPage.jsx
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import RitmoTrivia from "../components/RitmoTrivia";

export default function TriviaPage() {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Activar backend
    fetch("https://ritmos-backend.onrender.com/ping").catch(() => {});

    // Obtener ranking
    fetch("https://ritmos-backend.onrender.com/api/scores/top")
      .then((res) => res.json())
      .then((data) => {
        setRanking(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar el ranking", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-100">
      <Navbar />
      <div className="px-4 py-8 max-w-screen-sm mx-auto">
        {/* contenido de la trivia */}    
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-100 px-4 py-8">
      <div className="max-w-screen-sm mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">❓ Trivia de Ritmos</h1>
        <p className="text-center mb-4 text-gray-700">
          Poné a prueba tus conocimientos sobre ritmos, instrumentos y cultura musical.
        </p>

        {/* Ranking */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-center">🏆 Mejores jugadores</h2>
          {loading ? (
            <p className="text-center text-gray-500">Cargando ranking...</p>
          ) : ranking.length > 0 ? (
            <ul className="space-y-2">
              {ranking.map((jugador, index) => (
                <li
                  key={jugador.nombre + index}
                  className="flex justify-between border-b pb-1 text-sm"
                >
                  <span>
                    {index + 1}. {jugador.nombre}
                  </span>
                  <span className="font-semibold">{jugador.puntaje}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">No hay puntajes registrados aún.</p>
          )}
        </div>

        {/* Componente de trivia */}
        <div className="bg-white rounded-xl shadow p-4">
          <RitmoTrivia />
        </div>

        <div className="mt-6 text-center">
          <a href="/" className="text-blue-600 underline">
            ← Volver al inicio
          </a>
        </div>
      </div>
    </div>
      </div>
    </div>
  );
}