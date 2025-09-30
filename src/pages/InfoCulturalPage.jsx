// src/pages/InfoCulturalPage.jsx
import Navbar from "../components/Navbar";

export default function InfoCulturalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-100">
      <Navbar />
      <div className="px-4 py-8 max-w-screen-sm mx-auto"></div>
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <h1 className="text-2xl font-bold">🌍 Info Cultural</h1>
      <p className="mt-4">Pronto vas a poder explorar estilos musicales por región.</p>
    </div>
    </div>
  );
}
