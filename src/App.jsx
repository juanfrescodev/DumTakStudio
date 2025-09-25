// src/App.jsx
import { useEffect, useState } from "react";
import RitmoCard from "./components/ritmoCard";
import ritmosData from "./data/ritmos.json";
import RitmoPlaylist from "./components/RitmoPlaylist";
import RitmoTrivia from "./components/RitmoTrivia";

export default function App() {
  const [ritmos, setRitmos] = useState([]);
  const [playlist, setPlaylist] = useState([]);

  useEffect(() => {
    setRitmos(ritmosData);
  }, []);

  const addToPlaylist = (id, bars) => {
    setPlaylist((prev) => [...prev, { id, bars }]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-orange-200 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">🎵 Ritmos Árabes</h1>

      {/* Editor de secuencia */}
      <div className="bg-white rounded-xl shadow p-4 mb-6 max-w-xl w-full">
        <h2 className="text-lg font-bold mb-2">🧩 Armá tu secuencia</h2>
        <div className="flex gap-4 items-center">
          <select id="ritmo-select" className="p-2 rounded border">
            {ritmos.map((r) => (
              <option key={r.id} value={r.id}>{r.nombre}</option>
            ))}
          </select>
          <input type="number" id="bars-input" min="1" defaultValue={4} className="p-2 rounded border w-20" />
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => {
              const id = document.getElementById("ritmo-select").value;
              const bars = parseInt(document.getElementById("bars-input").value);
              addToPlaylist(id, bars);
            }}
          >
            Agregar
          </button>
        </div>
      </div>

      {/* Secuencia personalizada */}
      <RitmoPlaylist playlist={playlist} initialBpm={90} />

      {/* Ritmos individuales */}
      <div className="flex flex-wrap gap-6 justify-center mt-10">
        {ritmos.map((ritmo) => (
          <RitmoCard key={ritmo.id} ritmo={ritmo} />
        ))}
      </div>
      <RitmoTrivia />
    </div>
  );
}
