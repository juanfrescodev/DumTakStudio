//components/Navbar.jsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from '../store/useAuthStore';

export default function Navbar() {
  const location = useLocation();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { isLoggedIn, user, logout } = useAuthStore();

  const links = [
    { path: "/", label: "🏠 Inicio" },
    { path: "/secuenciador", label: "🎛️ Secuenciador" },
    { path: "/practice", label: "🧠 Práctica" },
    { path: "/ritmos", label: "🥁 Ritmos" },
    { path: "/info-cultural", label: "🌍 Info Cultural" },
    { path: "/instrumentos", label: "🎶 Instrumentos" },
    { path: "/trivia", label: "❓ Trivia" },
    { path: "/donar", label: "💖 Donar" },
  ];

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-screen-lg mx-auto px-4 py-3 flex items-center justify-between">
        {/* 🔗 Título clickeable */}
        <Link to="/" className="text-xl font-bold text-yellow-700 hover:underline">
          Dumtak Studio
        </Link>

        {/* Botón hamburguesa */}
        <button
          className="sm:hidden text-gray-700"
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          ☰
        </button>

        {/* Links en desktop */}
        <div className="hidden sm:flex gap-4 items-center">
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

          {/* 📊 Estadísticas personales */}
          {isLoggedIn && (
            <Link
              to="/estadisticas"
              className="text-sm font-medium px-3 py-1 rounded text-gray-700 hover:bg-yellow-100"
            >
              📊 Mis estadísticas
            </Link>
          )}

          {/* 🔐 Login o Usuario */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              👋 Hola, <span className="font-semibold">{user?.nombre}</span>
              <button
                onClick={logout}
                className="ml-2 px-2 py-1 text-red-600 hover:underline"
              >
                Salir
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-sm font-medium px-3 py-1 rounded text-gray-700 hover:bg-yellow-100"
            >
              🔑 Iniciar sesión
            </Link>
          )}
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

            {/* 📊 Estadísticas personales en mobile */}
            {isLoggedIn && (
              <Link
                to="/estadisticas"
                onClick={() => setMenuAbierto(false)}
                className="text-sm font-medium px-3 py-2 rounded text-gray-700 hover:bg-yellow-100"
              >
                📊 Mis estadísticas
              </Link>
            )}

            {/* 🔐 Login o Usuario en mobile */}
            {isLoggedIn ? (
              <div className="mt-2 text-sm text-gray-700">
                👋 Hola, <span className="font-semibold">{user?.nombre}</span>
                <button
                  onClick={() => {
                    logout();
                    setMenuAbierto(false);
                  }}
                  className="block mt-1 text-red-600 hover:underline"
                >
                  Salir
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuAbierto(false)}
                className="text-sm font-medium px-3 py-2 rounded text-gray-700 hover:bg-yellow-100"
              >
                🔑 Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
