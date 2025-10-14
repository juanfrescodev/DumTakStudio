import Navbar from "../components/Navbar";
import { useState } from "react";
import { Link } from "react-router-dom";
import ritmosData from "../data/ritmos.json";

export default function RitmosPage() {
  const [busqueda, setBusqueda] = useState("");

  const ritmosFiltrados = [...ritmosData]
    .filter((r) => r.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    .sort((a, b) => a.nombre.localeCompare(b.nombre));

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-100">
      <Navbar />

      <div className="px-4 py-8 max-w-screen-sm mx-auto"></div>

      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-100 px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6">🥁 Ritmos Árabes</h1>

        <p className="text-center mb-4 text-gray-700 max-w-xl mx-auto">
          Explorá la biblioteca completa de ritmos árabes. Cada ritmo incluye su notación Dum–Tak–Tek, variantes y contexto musical. Buscá por nombre o hacé clic para ver su detalle y comenzar a practicar.
        </p>

        {/* Buscador */}
        <div className="max-w-md mx-auto mb-6">
          <input
            type="text"
            placeholder="🔍 Escribí el nombre de un ritmo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full p-3 rounded border shadow"
          />
        </div>

        {/* Listado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-screen-md mx-auto">
          {ritmosFiltrados.map((ritmo) => (
            <Link
              key={ritmo.id}
              to={`/ritmos/${ritmo.id}`}
              className="bg-white shadow rounded-xl p-4 text-center text-lg font-semibold hover:bg-yellow-200 transition"
            >
              {ritmo.nombre}
            </Link>
          ))}
          {ritmosFiltrados.length === 0 && (
            <p className="text-center col-span-2 text-gray-500">
              No se encontraron ritmos con ese nombre. Probá con otra palabra o revisá la lista completa.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
