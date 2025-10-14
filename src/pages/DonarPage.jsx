//src/pages/DonarPage.jsx
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const opcionesApoyo = [
  {
    monto: "Café ☕",
    valor: "5 USD",
    descripcion: "Contribuye al mantenimiento de los servidores y la infraestructura técnica.",
    color: "bg-amber-500 hover:bg-amber-600",
    link: "https://link.a.tu.plataforma.de.pago/cafe",
  },
  {
    monto: "Sesión de Studio 🎧",
    valor: "25 USD",
    descripcion: "Financia la grabación de nuevos ritmos con calidad profesional.",
    color: "bg-pink-600 hover:bg-pink-700",
    link: "https://link.a.tu.plataforma.de.pago/sesion",
  },
  {
    monto: "Patrocinador Cultural ✨",
    valor: "Monto libre",
    descripcion: "Apoya la expansión de contenido educativo, cultural y geográfico.",
    color: "bg-indigo-600 hover:bg-indigo-700",
    link: "https://link.a.tu.plataforma.de.pago/patrocinador",
  },
];

export default function DonarPage() {
  return (
    <>
      <Navbar />

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Cabecera */}
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
          💖 Apoyá DumTak Studio
        </h1>
        <p className="text-lg text-gray-600 mb-8 border-l-4 border-yellow-500 pl-4 italic">
          DumTak Studio es una obra cultural digital dedicada a la Ritmología Árabe. Si el secuenciador, la trivia o los contenidos te ayudaron a aprender, tu apoyo nos permite seguir creando, grabando y enseñando.
        </p>

        {/* ¿En qué se invierte tu apoyo? */}
        <h2 className="text-3xl font-semibold text-gray-700 mb-6">
          ¿En qué se invierte tu aporte?
        </h2>
        <div className="space-y-4 mb-10">
          <p>Este proyecto se sostiene gracias a la comunidad. Cada donación ayuda a:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>💾 Mantener el backend que gestiona el ranking de la trivia y la práctica asistida.</li>
            <li>🎙️ Grabar nuevos ritmos como el Fallahi o el Masmoudi Kebir con variantes y notación visual precisa.</li>
            <li>🌍 Expandir las secciones de instrumentos y contexto cultural para enriquecer la experiencia educativa.</li>
          </ul>
        </div>

        {/* Opciones de apoyo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {opcionesApoyo.map(({ monto, valor, descripcion, color, link }) => (
            <a
              key={monto}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className={`${color} text-white p-5 rounded-xl shadow-lg transform transition duration-200 hover:scale-[1.05] text-center flex flex-col justify-between`}
            >
              <span className="text-2xl font-bold mb-2">{monto}</span>
              <span className="text-4xl font-extrabold mb-4">{valor}</span>
              <span className="text-sm">{descripcion}</span>
            </a>
          ))}
        </div>

        {/* Suscripción al boletín */}
        <div className="bg-gray-100 p-8 rounded-xl border-l-4 border-blue-500 shadow">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Ingresá tu email para recibir novedades..."
              className="flex-grow p-3 rounded-lg border border-gray-300"
            />
            <button
              onClick={() => alert("¡Gracias! Te añadiremos a nuestra lista de difusión.")}
              className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition"
            >
              Suscribirme al boletín
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Recibirás consejos, ritmos nuevos y contenido exclusivo.
          </p>
        </div>

        {/* Enlace de cierre */}
        <div className="mt-10 text-center">
          <Link to="/" className="text-md text-gray-600 hover:text-yellow-600 underline">
            ← Volver a la página principal
          </Link>
        </div>
      </div>
    </>
  );
}
