import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const links = [
    { path: "/", label: "🏠 Inicio" },
    { path: "/secuenciador", label: "🎛️ Secuenciador" },
    { path: "/ritmos", label: "🥁 Ritmos" },
    { path: "/info-cultural", label: "🌍 Info Cultural" },
    { path: "/instrumentos", label: "🎶 Instrumentos" },
    { path: "/trivia", label: "❓ Trivia" },
    { path: "/donar", label: "💖 Donar" },
  ];

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-screen-lg mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-yellow-700">Dumtak Studio</h1>

        {/* Botón hamburguesa */}
        <button
          className="sm:hidden text-gray-700"
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          ☰
        </button>

        {/* Links en desktop */}
        <div className="hidden sm:flex gap-4">
          {links.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`text-sm font-medium px-3 py-1 rounded ${
                location.pathname === path
                  ? "bg-yellow-300 text-black"
                  : "text-gray-700 hover:bg-yellow-100"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Menú desplegable en mobile */}
      {menuAbierto && (
        <div className="sm:hidden px-4 pb-4">
          <div className="flex flex-col gap-2">
            {links.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMenuAbierto(false)}
                className={`text-sm font-medium px-3 py-2 rounded ${
                  location.pathname === path
                    ? "bg-yellow-300 text-black"
                    : "text-gray-700 hover:bg-yellow-100"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
