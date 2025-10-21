export default function SequencerSummary({ stats }) {
  const totalMinutos = stats.reduce((acc, s) => acc + s.duracion, 0) / 60;
  const ultima = stats[0];

  return (
    <div className="mb-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
      <h3 className="text-lg font-semibold text-yellow-700 mb-2">📊 Resumen del secuenciador</h3>
      <p className="text-sm text-gray-700 mb-1">Total acumulado: <strong>{Math.round(totalMinutos)} minutos</strong></p>
      {ultima && (
        <p className="text-sm text-gray-700">Última sesión: <strong>{new Date(ultima.fecha).toLocaleDateString()}</strong> — <strong>{Math.round(ultima.duracion / 60)} min</strong></p>
      )}
    </div>
  );
}
