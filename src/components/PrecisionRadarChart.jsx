import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';

export default function PrecisionRadarChart({ scores }) {
  const erroresTotales = scores.reduce((acc, s) => {
    const errores = s.erroresPorGolpe || {};
    for (let golpe in errores) {
      acc[golpe] = (acc[golpe] || 0) + errores[golpe];
    }
    return acc;
  }, {});

  const chartData = Object.entries(erroresTotales).map(([golpe, errores]) => ({
    golpe,
    precision: Math.max(0, 1 - errores / scores.length)
  }));

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">🕸️ Perfil de precisión por golpe</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={chartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="golpe" />
          <Radar dataKey="precision" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
