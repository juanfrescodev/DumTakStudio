import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function TriviaRitmoBarChart({ stats }) {
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

  const data = Object.values(ritmoMap);

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">📊 Aciertos y errores por ritmo</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="ritmo" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="aciertos" fill="#10b981" />
          <Bar dataKey="errores" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
