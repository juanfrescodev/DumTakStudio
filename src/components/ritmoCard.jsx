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
    <div className="w-screen min-h-screen bg-white">
      {/* Cabecera informativa */}
      <div className="px-4 py-6 md:px-12 lg:px-24">
        <h2 className="text-2xl font-bold mb-2">{ritmo.nombre}</h2>
        <p className="text-sm text-gray-600 mb-2">{ritmo.descripcion}</p>
        <p className="text-xs text-gray-500 mb-4">Origen: {ritmo.origen}</p>

        {ritmo.audio && (
          <audio
            controls
            src={`${base}ritmos/${ritmo.audio}`}
            className="w-full mt-4"
          />
        )}
      </div>

      {/* Visualización rítmica a pantalla completa */}
      <div className="w-full px-2 md:px-6 lg:px-12">
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
      </div>
    </div>
  );
}
