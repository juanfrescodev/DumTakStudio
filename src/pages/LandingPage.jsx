// src/pages/LandingPage.jsx
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-orange-200 flex flex-col items-center px-6 py-10">
      {/* Hero */}
      <h1 className="text-4xl sm:text-5xl font-bold text-center text-gray-800 mb-4">
        🥁 DumtakStudio
      </h1>
      <p className="text-lg sm:text-xl text-center text-gray-700 max-w-xl mb-8">
        Aprendé ritmos árabes de forma visual, interactiva y musical. Secuenciador, trivia, teoría y práctica en una sola app.
      </p>
      <Link
        to="/app"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-xl transition-all duration-200"
      >
        🎵 Empezar ahora
      </Link>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 max-w-4xl w-full">
        <FeatureCard
          icon="🎚️"
          title="Secuenciador"
          description="Armá tus propios patrones rítmicos y escuchalos con precisión."
        />
        <FeatureCard
          icon="🧠"
          title="Trivia musical"
          description="Poné a prueba tus conocimientos con desafíos interactivos."
        />
        <FeatureCard
          icon="📖"
          title="Teoría clara"
          description="Aprendé compás, subdivisión y estilos con explicaciones visuales."
        />
      </div>

      {/* Footer */}
      <footer className="mt-20 text-sm text-gray-600 text-center">
        Hecho con ❤️ por Juan Fresco · © 2025 DumtakStudio
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 text-center">
      <div className="text-4xl mb-2">{icon}</div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
