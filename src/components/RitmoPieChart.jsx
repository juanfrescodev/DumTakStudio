import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

export default function RitmoPieChart({ scores }) {
  const ritmos = scores.reduce((acc, s) => {
    acc[s.ritmo] = (acc[s.ritmo] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(ritmos).map(([ritmo, cantidad]) => ({
    name: ritmo,
    value: cantidad
  }));

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">🥁 Ritmos más practicados</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={100}>
            {chartData.map((_, i) => (
              <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
