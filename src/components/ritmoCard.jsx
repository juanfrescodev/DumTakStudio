// src/components/RitmoCard.jsx
import { useState } from "react";
import MetronomeSequencer from "./MetronomeSequencer";

export default function RitmoCard({ ritmo }) {
  const base = import.meta.env.BASE_URL;
  const [variante, setVariante] = useState("base");

  if (!ritmo) {
    return <p className="text-red-600 p-4">Error: ritmo no disponible.</p>;
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
    <div className="w-screen min-h-screen bg-white">
      {/* Cabecera informativa */}
      <div className="px-4 py-6 md:px-12 lg:px-24">
        <h2 className="text-2xl font-bold mb-2">{ritmo.nombre}</h2>
        <p className="text-sm text-gray-600 mb-2">{ritmo.descripcion}</p>
        <p className="text-xs text-gray-500 mb-4">Origen: {ritmo.origen}</p>

        {/* Selector de variante si existen */}
        {tieneVariantes && (
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mr-2">Variante:</label>
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
            <p className="text-xs text-gray-500 mt-1 italic">
              {varianteData?.descripcion}
            </p>
          </div>
        )}

        {/* Audio */}
        {varianteData?.audio && (
          <audio
            controls
            src={`${base}ritmos/${varianteData.audio.replace(/^\/+/, "")}`}
            className="w-full mt-4"
          />
        )}
      </div>

      {/* Visualización rítmica */}
      <div className="w-full px-2 md:px-6 lg:px-12">
        {stepsConRutaCompleta?.length > 0 ? (
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
        ) : ritmo.patronImg ? (
          <img
            src={`${base}ritmos/${ritmo.patronImg}`}
            alt={`Patrón de ${ritmo.nombre}`}
            className="w-24 h-24 object-contain rounded-lg mb-4"
          />
        ) : null}
      </div>
    </div>
  );
}
