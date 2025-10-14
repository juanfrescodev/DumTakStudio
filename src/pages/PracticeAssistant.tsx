//PracticeAssistant.tsx
import Navbar from "../components/Navbar";
import React, { useState } from "react";
import PracticeSession from "../components/PracticeSession";
import ritmos from "../data/ritmos.json";

export default function PracticeAssistant() {
  const [ritmoId, setRitmoId] = useState("maksum");

  return (
    <div className="practice-page min-h-screen bg-gray-50">
      <Navbar />

      <div className="px-4 py-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-yellow-700 mb-6 text-center">
          🧠 Asistente de Práctica
        </h1>

        <p className="text-center text-gray-700 mb-4 text-sm max-w-xl mx-auto">
          Practicá tus golpes con guía visual y sonora. Elegí un ritmo, ajustá el tempo y recibí feedback sobre tu precisión. Ideal para entrenar oído, coordinación y compás.
        </p>

        <div className="mb-6 text-center">
          <label className="text-sm font-medium mr-2">🎵 Elegí un ritmo:</label>
          <select
            value={ritmoId}
            onChange={(e) => setRitmoId(e.target.value)}
            className="px-3 py-2 rounded bg-white border border-gray-300"
          >
            {ritmos.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nombre}
              </option>
            ))}
          </select>
        </div>

        <PracticeSession ritmoId={ritmoId} initialBpm={90} />
      </div>
    </div>
  );
}
