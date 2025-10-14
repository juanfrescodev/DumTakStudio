// src/components/RitmoCard.jsx
import { useState } from "react";
import MetronomeSequencer from "./MetronomeSequencer";

export default function RitmoCard({ ritmo }) {
  const base = import.meta.env.BASE_URL;
  const [variante, setVariante] = useState("base");

  if (!ritmo) {
    return <p className="text-red-600 p-4">⚠️ Error: ritmo no disponible.</p>;
  }

  const tieneVariantes = !!ritmo.variantes;
  const varianteData = tieneVariantes
    ? ritmo.variantes[variante] || ritmo.variantes.base
    : { steps: ritmo.steps, audio: ritmo.audio, descripcion: ritmo.descripcion };

  const stepsConRutaCompleta = varianteData?.steps?.map((s) => ({
    ...s,
    sound: s.sound ? `${base}ritmos/${s.sound.replace(/^\/+/, "")}` : null,
    img: s.img ? `${base}ritmos/${s.img.replace(/^\/+/, "")}` : null,
  }));

  return (
    <div className="w-full max-w-screen-sm mx-auto bg-white rounded-xl shadow px-4 py-6">
      {/* Cabecera informativa */}
      <h2 className="text-2xl font-bold mb-2">{ritmo.nombre}</h2>
      <p className="text-sm text-gray-700 mb-2">{ritmo.descripcion}</p>
      <p className="text-xs text-gray-500 mb-4">🌍 Origen: {ritmo.origen}</p>

      {/* Selector de variante si existen */}
      {tieneVariantes && (
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mr-2">🎼 Variante:</label>
          <select
            value={variante}
            onChange={(e) => setVariante(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            {Object.keys(ritmo.variantes).map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-600 mt-1 italic">
            {varianteData?.descripcion || "Sin descripción disponible para esta variante."}
          </p>
        </div>
      )}

      {/* Audio de variante */}
      {varianteData?.audio && (
        <div className="mt-4">
          <p className="text-sm text-gray-700 mb-1">🔊 Escuchá esta variante:</p>
          <audio
            controls
            src={`${base}ritmos/${varianteData.audio.replace(/^\/+/, "")}`}
            className="w-full"
          />
        </div>
      )}

      {/* Audio completo del ritmo */}
      {ritmo.audio && (
        <div className="mt-6">
          <p className="text-sm text-gray-700 mb-1">🎧 Audio completo del ritmo:</p>
          <audio
            controls
            src={`${base}ritmos/${ritmo.audio.replace(/^\/+/, "")}`}
            className="w-full"
          />
        </div>
      )}

      {/* Visualización rítmica */}
      <div className="mt-6 overflow-x-auto">
        {stepsConRutaCompleta?.length > 0 ? (
          <>
            <p className="text-sm text-gray-700 mb-2">
              👀 Visualizá el patrón rítmico y seguí el compás con ayuda del metrónomo. Tocá o escuchá cada golpe para entrenar tu oído y coordinación.
            </p>
            <MetronomeSequencer
              ritmo={{
                ...ritmo,
                variantes: {
                  [variante]: {
                    ...varianteData,
                    steps: stepsConRutaCompleta
                  }
                }
              }}
              variante={variante}
              initialBpm={90}
            />
          </>
        ) : ritmo.patronImg ? (
          <img
            src={`${base}ritmos/${ritmo.patronImg}`}
            alt={`Patrón de ${ritmo.nombre}`}
            className="w-24 h-24 object-contain rounded-lg mb-4"
          />
        ) : (
          <p className="text-sm text-gray-500 italic">No hay visualización disponible para este ritmo.</p>
        )}
      </div>
    </div>
  );
}
