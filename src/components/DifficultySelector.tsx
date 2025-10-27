export default function DifficultySelector({ onSelect, selected }) {
  const opciones = [
    { nivel: "facil", label: "🟢 Fácil" },
    { nivel: "intermedio", label: "🟡 Intermedio" },
    { nivel: "dificil", label: "🔴 Difícil" },
  ];

  return (
    <div className="flex flex-col items-center gap-4 mt-6">
      <h2 className="text-lg font-semibold text-gray-800">🎼 Elegí dificultad</h2>
      <div className="flex gap-4">
        {opciones.map((op) => (
          <button
            key={op.nivel}
            onClick={() => onSelect(op.nivel)}
            className={`px-4 py-2 rounded-full font-bold transition ${
              selected === op.nivel
                ? "bg-purple-600 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-purple-100"
            }`}
          >
            {op.label}
          </button>
        ))}
      </div>
    </div>
  );
}
