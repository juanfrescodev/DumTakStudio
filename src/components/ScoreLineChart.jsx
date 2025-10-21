import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function ScoreLineChart({ data }) {
  const chartData = data.map(s => ({
    fecha: new Date(s.fecha).toLocaleDateString(),
    nota: s.notaFinal || 0
  }));

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">📈 Evolución de nota final</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="fecha" />
          <YAxis domain={[0, 10]} />
          <Tooltip />
          <Line type="monotone" dataKey="nota" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
