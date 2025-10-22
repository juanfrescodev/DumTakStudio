export default function TriviaSummary({ stats }) {
  const totalMinutos = stats.reduce((acc, s) => acc + s.duracion, 0) / 60;
  const nivelMax = Math.max(...stats.map((s) => s.nivelMaximo));
  const rachaMax = Math.max(...stats.map((s) => s.rachaMaxima));
  const ultima = stats[0];

  const ritmoDominado = getRitmo(stats, "aciertosPorRitmo", "max");
  const ritmoFallado = getRitmo(stats, "erroresPorRitmo", "max");

  function getRitmo(stats, campo, tipo) {
    const map = {};
    stats.forEach((s) => {
      for (let ritmo in s[campo]) {
        map[ritmo] = (map[ritmo] || 0) + s[campo][ritmo];
      }
    });
    const entries = Object.entries(map);
    if (entries.length === 0) return "-";
    return tipo === "max"
      ? entries.reduce((a, b) => (a[1] > b[1] ? a : b))[0]
      : entries.reduce((a, b) => (a[1] < b[1] ? a : b))[0];
  }

  return (
    <div className="mb-6 bg-purple-50 p-4 rounded-lg border border-purple-200">
      <h3 className="text-lg font-semibold text-purple-700 mb-2">📚 Resumen de trivia</h3>
      <p className="text-sm text-gray-700 mb-1">Total de minutos jugados: <strong>{Math.round(totalMinutos)}</strong></p>
      <p className="text-sm text-gray-700 mb-1">Nivel máximo alcanzado: <strong>{nivelMax}</strong></p>
      <p className="text-sm text-gray-700 mb-1">Racha más larga: <strong>{rachaMax}</strong></p>
      <p className="text-sm text-gray-700 mb-1">Ritmo más dominado: <strong>{ritmoDominado}</strong></p>
      <p className="text-sm text-gray-700">Ritmo más fallado: <strong>{ritmoFallado}</strong></p>
    </div>
  );
}
