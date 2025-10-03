import Navbar from "../components/Navbar";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import "../app.css";

const featuredSections = [
  {
    path: "/ritmos",
    label: "🥁 Ritmos y Notación",
    icon: "🥁",
    description:
      "Explorá la librería completa de ritmos egipcios (Maksum, Saidi, Baladi...) con notación visual Dum–Tak–Tek y variantes para estudio y práctica.",
    color: "bg-red-100 hover:bg-red-200 text-red-800",
  },
  {
    path: "/trivia",
    label: "🏆 Desafío de Ritmos",
    icon: "❓",
    description:
      "Poné a prueba tu oído con ejercicios interactivos. Subí en el ranking y convertí el aprendizaje en juego.",
    color: "bg-yellow-100 hover:bg-yellow-200 text-yellow-800",
  },
  {
    path: "/secuenciador",
    label: "🎛️ Creador de Secuencias",
    icon: "🎛️",
    description:
      "Diseñá tus propios ejercicios combinando ritmos y compases. Ideal para coreografías, ensayos y clases.",
    color: "bg-blue-100 hover:bg-blue-200 text-blue-800",
  },
  {
    path: "/info-cultural",
    label: "🌍 Info Cultural",
    icon: "🌍",
    description:
      "Sumergite en el contexto histórico y social de cada ritmo. Entendé su función en la danza, la música y la identidad árabe.",
    color: "bg-green-100 hover:bg-green-200 text-green-800",
  },
  {
    path: "/instrumentos",
    label: "🎶 Instrumentos",
    icon: "🎶",
    description:
      "Conocé el sonido y el rol de instrumentos como el derbake, riqq y sagat. Escuchá, aprendé y conectá con su esencia.",
    color: "bg-indigo-100 hover:bg-indigo-200 text-indigo-800",
  },
];

export default function LandingPage() {
  useEffect(() => {
    fetch("https://ritmos-backend.onrender.com/ping")
      .then(() => console.log("Backend activado desde landing"))
      .catch((err) => console.error("Error al despertar el backend", err));
  }, []);

  return (
    <>
      <Navbar />

      {/* Fondo visual envolvente */}
      <div className="relative min-h-screen bg-gradient-to-br from-yellow-100 via-orange-50 to-purple-100 overflow-hidden">
        {/* Patrón superpuesto */}
        <div className="absolute inset-0 bg-[url('/patron-arabe.svg')] bg-repeat opacity-20 pointer-events-none z-0" />

        {/* Contenido principal */}
        <div className="relative z-10 container mx-auto px-4 py-12 text-center max-w-6xl animate-fade-in-slow">
          {/* HERO */}
          <div className="text-center mb-10">
            <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-yellow-500 to-purple-600 tracking-tight leading-tight">
              Dumtak Studio
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mt-4 max-w-3xl mx-auto font-light">
              Ritmos que cuentan historias. Una herramienta para aprender, practicar y conectar con la percusión árabe desde la curiosidad, la danza o la música.
            </p>
          </div>

          {/* FRASE GUÍA */}
          <p className="text-lg text-gray-600 mb-6 font-medium italic">
            Elegí tu camino: explorá, jugá, creá o aprendé desde el contexto.
          </p>

          {/* CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
            {featuredSections.map(({ path, label, icon, description, color }, index) => (
              <Link
                key={path}
                to={path}
                className={`${color} p-6 sm:p-8 rounded-2xl shadow-inner shadow-lg transform transition duration-500 hover:scale-[1.05] hover:shadow-2xl border-b-4 border-yellow-500 animate-fade-in`}
                style={{ "--delay": `${index * 0.1}s` }}
              >
                <div className="text-4xl mb-3">{icon}</div>
                <h2 className="text-xl font-bold mb-2 text-gray-900">{label}</h2>
                <p className="text-sm text-gray-700">{description}</p>
              </Link>
            ))}
          </div>

          {/* CTA DONAR */}
          <div className="bg-white/80 p-6 rounded-xl shadow-inner border border-gray-200">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">
              ¿Te parece útil esta herramienta?
            </h3>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
              <Link
                to="/donar"
                className="bg-purple-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-purple-700 transform hover:scale-105 transition duration-200 text-lg uppercase tracking-wide"
              >
                💖 Apoyá el desarrollo cultural
              </Link>

              <a
                href="mailto:contacto@dumtakstudio.com"
                className="text-gray-600 hover:text-blue-600 font-medium py-3 px-8 text-sm"
              >
                Suscribite al boletín para recibir novedades
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
