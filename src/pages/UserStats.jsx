//UserStats.jsx
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import Navbar from "../components/Navbar";
import ScoreLineChart from "../components/ScoreLineChart";
import ErrorBarChart from "../components/ErrorBarChart";
import RitmoPieChart from "../components/RitmoPieChart";
import PrecisionRadarChart from "../components/PrecisionRadarChart";
import SequencerSummary from "../components/SequencerSummary";
import SequencerRitmoBarChart from "../components/SequencerRitmoBarChart";
import SequencerDurationLineChart from "../components/SequencerDurationLineChart";

export default function UserStats() {
  const { isLoggedIn, user } = useAuthStore();
  const [scores, setScores] = useState([]);
  const [sequencerStats, setSequencerStats] = useState([]);

  useEffect(() => {
    if (isLoggedIn) {
      // 🧠 Cargar puntajes de práctica
      fetch(`https://ritmos-backend.onrender.com/api/scores/user/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setScores(data);
          } else {
            console.error("Respuesta inesperada en scores:", data);
            setScores([]);
          }
        })
        .catch((err) => {
          console.error("Error al cargar estadísticas de práctica:", err);
          setScores([]);
        });

      // 🎛️ Cargar estadísticas del secuenciador
      fetch(`https://ritmos-backend.onrender.com/api/sequencer-stats/user/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setSequencerStats(data);
          } else {
            console.error("Respuesta inesperada en sequencerStats:", data);
            setSequencerStats([]);
          }
        })
        .catch((err) => {
          console.error("Error al cargar estadísticas del secuenciador:", err);
          setSequencerStats([]);
        });
    }
  }, [isLoggedIn, user]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="p-6 max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-purple-700 mb-4">📊 Tus estadísticas personales</h2>
          <p className="text-gray-700 mb-4">
            Para ver tu progreso, precisión y logros, creá una cuenta gratuita.
          </p>
          <p className="text-sm text-gray-600">
            Al registrarte, DumTak Studio guarda tu evolución, te sugiere ritmos personalizados y desbloquea logros únicos.
          </p>
          <a href="/register" className="mt-4 inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
            ✨ Crear cuenta
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-purple-700 mb-4">📈 Análisis de tu práctica</h2>

        {scores.length === 0 ? (
          <p className="text-gray-600">Todavía no registraste prácticas. ¡Probá el modo práctica y volvé!</p>
        ) : (
          <>
            <table className="w-full text-sm border border-gray-300 rounded overflow-hidden mb-8">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="px-4 py-2">Fecha</th>
                  <th className="px-4 py-2">Ritmo</th>
                  <th className="px-4 py-2">Puntaje</th>
                  <th className="px-4 py-2">Nota</th>
                  <th className="px-4 py-2">Tendencia</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((s, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-4 py-2">{new Date(s.fecha).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{s.ritmo}</td>
                    <td className="px-4 py-2">{s.puntaje}</td>
                    <td className="px-4 py-2">{s.notaFinal || "-"}</td>
                    <td className="px-4 py-2">{s.tendencia || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {sequencerStats.length > 0 && (
              <>
                <h2 className="text-2xl font-bold text-purple-700 mt-10 mb-4">🎛️ Uso del secuenciador</h2>
                <SequencerSummary stats={sequencerStats} />
                <SequencerRitmoBarChart stats={sequencerStats} />
                <SequencerDurationLineChart stats={sequencerStats} />
              </>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">📊 Visualización de tu progreso</h3>
              <p className="text-sm text-gray-600 mb-4">
                Estos gráficos muestran cómo evolucionaste en tus prácticas: precisión, errores, ritmos y perfil rítmico.
              </p>
              <ScoreLineChart data={scores} />
              <ErrorBarChart scores={scores} />
              <RitmoPieChart scores={scores} />
              <PrecisionRadarChart scores={scores} />
            </div>
          </>
        )}


      </div>
    </div>
  );
}
