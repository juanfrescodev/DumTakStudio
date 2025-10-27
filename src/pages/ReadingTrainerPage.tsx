import Navbar from "../components/Navbar";
import { useState } from "react";
import DifficultySelector from "../components/DifficultySelector";
import ReadingSession from "../components/ReadingSession";
import ReadingRhythmABC from "../components/ReadingRhythmABC";
import ReadingPracticeABC from "../components/ReadingPracticeABC";

export default function ReadingTrainerPage() {
  const [difficulty, setDifficulty] = useState<"facil" | "intermedio" | "dificil" | null>(null);
  const [start, setStart] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-100">
      <Navbar />

      <div className="max-w-screen-md mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-purple-700 mb-6">
          📖 Entrenador de Lectura Rítmica
        </h1>

        <p className="text-center text-gray-700 mb-4 text-sm max-w-xl mx-auto">
          Elegí un nivel de dificultad y seguí la partitura rítmica con ayuda del metrónomo y la animación. Tocá en el momento justo y recibí feedback sobre tu precisión.
        </p>

        {!start && (
          <>
            <DifficultySelector onSelect={setDifficulty} selected={difficulty} />

            <div className="text-center mt-6">
              <button
                disabled={!difficulty}
                onClick={() => setStart(true)}
                className={`px-6 py-3 rounded-full font-bold text-white transition ${
                  difficulty ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                ▶️ Comenzar práctica
              </button>
            </div>
          </>
        )}

        {start && difficulty && (
        <ReadingPracticeABC />
        )}
      </div>
    </div>
  );
}
