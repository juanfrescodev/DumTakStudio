// src/pages/InfoCulturalPage.jsx
import Navbar from "../components/Navbar";
import MiddleEastMap from "../components/MiddleEastMap";
export default function TeoriaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-100">
      <Navbar />
      <div className="px-4 py-8 max-w-screen-sm mx-auto"></div>
    <div className="max-w-screen-md mx-auto mt-10">
      <MiddleEastMap />
    </div>
    </div>
  );
}

