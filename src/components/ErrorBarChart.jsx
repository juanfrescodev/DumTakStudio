import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function ErrorBarChart({ scores }) {
  const erroresTotales = scores.reduce((acc, s) => {
    const errores = s.erroresPorGolpe || {};
    for (let golpe in errores) {
      acc[golpe] = (acc[golpe] || 0) + errores[golpe];
    }
    return acc;
  }, {});

  const chartData = Object.entries(erroresTotales).map(([golpe, cantidad]) => ({
    golpe,
    cantidad
  }));

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">📊 Errores por tipo de golpe</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="golpe" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="cantidad" fill="#f87171" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
