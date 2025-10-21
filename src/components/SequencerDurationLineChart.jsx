import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function SequencerDurationLineChart({ stats }) {
  const data = stats.map((s) => ({
    fecha: new Date(s.fecha).toLocaleDateString(),
    duracion: Math.round(s.duracion / 60), // minutos
  }));

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">⏱️ Duración por sesión (minutos)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="fecha" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="duracion" stroke="#10b981" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
