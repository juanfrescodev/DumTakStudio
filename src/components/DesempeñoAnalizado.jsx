// DesempeñoAnalizado.jsx
// DesempeñoAnalizado.jsx
export default function DesempeñoAnalizado({ scores, triviaStats, sequencerStats }) {
  if (!scores || scores.length === 0) return null;

  // 🕒 Tiempo total y comparativo
  const totalMinutos = scores.reduce((acc, s) => acc + (s.duracion || 0), 0);
  const hoy = new Date().toDateString();
  const ayer = new Date(Date.now() - 86400000).toDateString();
  const semanaPasada = new Date(Date.now() - 7 * 86400000);

  const sesionesHoy = scores.filter(s => new Date(s.fecha).toDateString() === hoy);
  const sesionesAyer = scores.filter(s => new Date(s.fecha).toDateString() === ayer);
  const sesionesSemana = scores.filter(s => new Date(s.fecha) > semanaPasada);

  const minutosHoy = sesionesHoy.reduce((acc, s) => acc + (s.duracion || 0), 0);
  const minutosAyer = sesionesAyer.reduce((acc, s) => acc + (s.duracion || 0), 0);
  const minutosSemana = sesionesSemana.reduce((acc, s) => acc + (s.duracion || 0), 0);

  // 🎯 Precisión y evolución
  const promedioNota = scores.reduce((acc, s) => acc + (s.notaFinal || 0), 0) / scores.length;
  const notaSemana = sesionesSemana.reduce((acc, s) => acc + (s.notaFinal || 0), 0) / sesionesSemana.length || 0;

  // 🔢 Nivel y racha
  const nivelMaximo = Math.max(...scores.map(s => s.nivelMaximo || 1));
  const rachaMaxima = Math.max(...triviaStats.map(s => s.rachaMaxima || 0));

  // 📉 Tendencias
  const tendencias = scores.map(s => s.tendencia).filter(Boolean);
  const tendenciaRepetida = tendencias.length > 0 ? tendencias.sort((a,b) =>
    tendencias.filter(v => v===a).length - tendencias.filter(v => v===b).length
  ).pop() : null;

  // 🥁 Ritmos más fallados en trivia
  const erroresPorRitmo = {};
  triviaStats.forEach(s => {
    if (s.erroresPorRitmo) {
      Object.entries(s.erroresPorRitmo).forEach(([ritmo, cantidad]) => {
        erroresPorRitmo[ritmo] = (erroresPorRitmo[ritmo] || 0) + cantidad;
      });
    }
  });
  const ritmoMasFallado = Object.entries(erroresPorRitmo).sort((a,b) => b[1] - a[1])[0]?.[0];

  // 🎛️ Ritmo más reproducido en secuenciador
  const conteoSecuenciador = {};
  sequencerStats.forEach(s => {
    conteoSecuenciador[s.ritmo] = (conteoSecuenciador[s.ritmo] || 0) + 1;
  });
  const ritmoMasReproducido = Object.entries(conteoSecuenciador).sort((a,b) => b[1] - a[1])[0]?.[0];

  // 🏅 Logros trivia
  const logros = [...new Set(triviaStats.flatMap(s => s.logros || []))];

  return (
    <div className="mb-8 p-4 bg-purple-50 border border-purple-200 rounded">
      <h3 className="text-lg font-bold text-purple-700 mb-2">🧠 Análisis automático de tu desempeño</h3>
      <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
        <li>🕒 Tiempo total de práctica: <strong>{Math.round(totalMinutos)} minutos</strong></li>
        <li>📅 Esta semana: <strong>{Math.round(minutosSemana)} min</strong> ({minutosSemana > 60 ? "✅ Buen ritmo" : "⚠️ Podés practicar más"})</li>
        <li>📊 Hoy vs ayer: <strong>{Math.round(minutosHoy)} min</strong> vs <strong>{Math.round(minutosAyer)} min</strong></li>
        <li>🎯 Precisión promedio: <strong>{Math.round(promedioNota)}%</strong> ({promedioNota > notaSemana ? "📈 Mejoraste esta semana" : "📉 Bajó esta semana"})</li>
        <li>🔢 Nivel máximo alcanzado: <strong>{nivelMaximo}</strong> | Racha máxima en trivia: <strong>{rachaMaxima}</strong></li>
        {tendenciaRepetida && <li>📉 Tendencia repetida: <strong>{tendenciaRepetida}</strong> → Recomendamos practicar con cuenta regresiva visual</li>}
        {ritmoMasFallado && <li>❌ Ritmo más fallado en trivia: <strong>{ritmoMasFallado}</strong> → Reforzalo en práctica o secuenciador</li>}
        {ritmoMasReproducido && <li>🎧 Ritmo más reproducido en secuenciador: <strong>{ritmoMasReproducido}</strong></li>}
        <li>📌 Recomendación general: {
          promedioNota < 70
            ? "Reforzá precisión con metrónomo y repeticiones lentas."
            : "¡Buen trabajo! Podés subir el BPM o probar nuevos ritmos."
        }</li>
        {logros.length > 0 && (
          <li>🏅 Logros desbloqueados: {logros.map((l, i) => <span key={i} className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded mr-1">{l}</span>)}</li>
        )}
      </ul>
    </div>
  );
}
