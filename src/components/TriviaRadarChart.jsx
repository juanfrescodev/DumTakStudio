import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";

export default function TriviaRadarChart({ stats }) {
  const ritmoMap = {};

  stats.forEach((s) => {
    for (let ritmo in s.aciertosPorRitmo) {
      ritmoMap[ritmo] = ritmoMap[ritmo] || { ritmo, aciertos: 0, errores: 0 };
      ritmoMap[ritmo].aciertos += s.aciertosPorRitmo[ritmo];
    }
    for (let ritmo in s.erroresPorRitmo) {
      ritmoMap[ritmo] = ritmoMap[ritmo] || { ritmo, aciertos: 0, errores: 0 };
      ritmoMap[ritmo].errores += s.erroresPorRitmo[ritmo];
    }
  });

  const data = Object.entries(ritmoMap).map(([ritmo, { aciertos, errores }]) => ({
    ritmo,
    precision: Math.round((aciertos / (aciertos + errores)) * 100)
  }));

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">🎯 Precisión por ritmo (%)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="ritmo" />
          <Radar dataKey="precision" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
