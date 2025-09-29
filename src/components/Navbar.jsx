import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const links = [
    { path: "/secuenciador", label: "🎛️ Secuenciador" },
    { path: "/ritmos", label: "🥁 Ritmos" },
    { path: "/info-cultural", label: "🌍 Info Cultural" },
    { path: "/instrumentos", label: "🎶 Instrumentos" },
    { path: "/trivia", label: "❓ Trivia" },
    { path: "/donar", label: "💖 Donar" },
  ];

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-screen-lg mx-auto px-4 py-3 flex flex-wrap gap-4 justify-center">
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
    </nav>
  );
}
