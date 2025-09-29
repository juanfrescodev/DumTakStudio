// src/pages/RitmoDetallePage.jsx
import Navbar from "../components/Navbar";
import { useParams, Link } from "react-router-dom";
import ritmosData from "../data/ritmos.json";
import RitmoCard from "../components/RitmoCard";

export default function RitmoDetallePage() {
  const { id } = useParams();
  const ritmo = ritmosData.find((r) => r.id === id);

  if (!ritmo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-100 px-4 py-8">
        <h1 className="text-2xl font-bold text-red-700">Ritmo no encontrado</h1>
        <Link to="/ritmos" className="mt-4 text-blue-600 underline">
          Volver al listado
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-100 px-4 py-8">
      <div className="max-w-screen-sm mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">{ritmo.nombre}</h1>

        {/* Partitura + reproductor */}
        <RitmoCard ritmo={ritmo} />

        <div className="mt-6 text-center">
          <Link to="/ritmos" className="text-blue-600 underline">
            ← Volver al listado
          </Link>
        </div>
      </div>
    </div>
  );
}
