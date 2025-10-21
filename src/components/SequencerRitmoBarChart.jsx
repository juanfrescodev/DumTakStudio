import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function SequencerRitmoBarChart({ stats }) {
  const ritmoCount = stats.reduce((acc, s) => {
    s.ritmosUsados.forEach((r) => {
      acc[r] = (acc[r] || 0) + 1;
    });
    return acc;
  }, {});

  const data = Object.entries(ritmoCount).map(([ritmo, count]) => ({
    ritmo,
    count,
  }));

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">🥁 Ritmos más usados en el secuenciador</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="ritmo" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#f59e0b" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
