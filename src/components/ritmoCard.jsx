// src/components/RitmoCard.jsx
import MetronomeSequencer from "./MetronomeSequencer";

export default function RitmoCard({ ritmo }) {
  const base = import.meta.env.BASE_URL;

  const stepsConRutaCompleta = ritmo.steps?.map((s) => ({
    ...s,
    sound: s.sound ? `${base}ritmos/${s.sound.replace(/^\/+/, "")}` : null,
    img: s.img ? `${base}ritmos/${s.img.replace(/^\/+/, "")}` : null,
  }));

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-xl font-bold mb-2">{ritmo.nombre}</h2>
        <p className="text-sm text-gray-600 mb-2">{ritmo.descripcion}</p>
        <p className="text-xs text-gray-500 mb-4">Origen: {ritmo.origen}</p>

        {ritmo.steps ? (
          <MetronomeSequencer
            steps={stepsConRutaCompleta}
            beatsPerBar={ritmo.beatsPerBar}
            initialBpm={90}
          />
        ) : ritmo.patronImg ? (
          <img
            src={`${base}ritmos/${ritmo.patronImg}`}
            alt={`Patrón de ${ritmo.nombre}`}
            className="w-24 h-24 object-contain rounded-lg mb-4"
          />
        ) : null}

        {ritmo.audio && (
          <audio
            controls
            src={`${base}ritmos/${ritmo.audio}`}
            className="w-full mt-4"
          />
        )}
      </div>
    </div>
  );
}
