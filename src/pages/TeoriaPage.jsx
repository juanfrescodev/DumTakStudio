// src/pages/TeoriaPage.jsx
import Navbar from "../components/Navbar";
export default function TeoriaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-100">
      <Navbar />
      <div className="px-4 py-8 max-w-screen-sm mx-auto"></div>
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-teal-200 flex flex-col items-center px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">📖 Teoría rítmica</h1>
      <p className="text-lg text-gray-700 text-center max-w-xl mb-6">
        Acá vas a encontrar explicaciones claras sobre compás, subdivisión, acento, y los estilos árabes más usados.
      </p>
    </div>
    </div>
  );
}
