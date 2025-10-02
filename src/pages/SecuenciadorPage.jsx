//SecuenciadorPage.jsxS
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import RitmoPlaylist from "../components/RitmoPlaylist";
import ritmosData from "../data/ritmos.json";


export default function SecuenciadorPage() {
  useEffect(() => {
    fetch("https://ritmos-backend.onrender.com/ping")
      .then(() => console.log("Backend activado"))
      .catch((err) => console.error("Error al despertar el backend", err));
  }, []);

  const [ritmos, setRitmos] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [selectedRitmo, setSelectedRitmo] = useState("");
  const [bars, setBars] = useState(4);

  useEffect(() => {
    setRitmos(ritmosData);
    if (ritmosData.length > 0) setSelectedRitmo(ritmosData[0].id);
  }, []);

  const addToPlaylist = () => {
    if (!selectedRitmo) return;

    const ritmo = ritmosData.find((r) => r.id === selectedRitmo);
    if (!ritmo) return;

    // buscamos los steps del modo base
    const steps = ritmo.variantes?.base?.steps || ritmo.steps || [];

    // ⚠️ normalizamos paths para que coincidan con useAudioEngine
    const normalizedSteps = steps.map((s) => {
      if (!s.sound) return s;

      // Si empieza con "/" → le saco el slash y lo meto en "ritmos/"
      const clean = s.sound.startsWith("/") ? s.sound.slice(1) : s.sound;
      return {
        ...s,
        sound: `ritmos/${clean}`
      };
    });


    setPlaylist((prev) => [
      ...prev,
      { id: selectedRitmo, bars, steps: normalizedSteps },
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-100">
      <Navbar />
      <div className="max-w-screen-sm w-full mx-auto px-4 py-6 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6 text-center">🎛️ Secuenciador</h1>

        <div className="bg-white rounded-xl shadow p-4 mb-6 w-full">
          <h2 className="text-lg font-bold mb-2">🧩 Armá tu secuencia</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <select
              value={selectedRitmo}
              onChange={(e) => setSelectedRitmo(e.target.value)}
              className="p-2 rounded border w-full sm:w-auto"
            >
              {ritmos.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nombre}
                </option>
              ))}
            </select>

            <input
              type="number"
              min="1"
              value={bars}
              onChange={(e) => setBars(Number(e.target.value))}
              className="p-2 rounded border w-20"
            />

            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={addToPlaylist}
            >
              Agregar
            </button>
          </div>
        </div>

        <RitmoPlaylist
          playlist={playlist}
          setPlaylist={setPlaylist}
          initialBpm={90}
        />
      </div>
    </div>
  );
}
