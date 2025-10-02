//src/pages/DonarPage.jsx
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

// Definición de las opciones de apoyo (ejemplos de plataformas)
const opcionesApoyo = [
    { 
        monto: "Café ☕", 
        valor: "5 USD", 
        descripcion: "Ayuda a mantener los servidores backend.",
        color: "bg-amber-500 hover:bg-amber-600",
        link: "https://link.a.tu.plataforma.de.pago/cafe" 
    },
    { 
        monto: "Sesión de Studio 🎧", 
        valor: "25 USD", 
        descripcion: "Financia la grabación de nuevos ritmos de alta calidad.",
        color: "bg-pink-600 hover:bg-pink-700",
        link: "https://link.a.tu.plataforma.de.pago/sesion" 
    },
    { 
        monto: "Patrocinador Cultural ✨", 
        valor: "Monto libre", 
        descripcion: "Apoyo directo a la expansión de contenido cultural y geográfico.",
        color: "bg-indigo-600 hover:bg-indigo-700",
        link: "https://link.a.tu.plataforma.de.pago/patrocinador" 
    },
];

export default function DonarPage() {
    return (
        <>
            <Navbar />
            
            <div className="container mx-auto px-4 py-12 max-w-3xl">
                
                {/* Cabecera y Relato Cultural */}
                <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
                    💖 Apoya a DumTak Studio
                </h1>
                <p className="text-lg text-gray-600 mb-8 border-l-4 border-yellow-500 pl-4 italic">
                    DumTak Studio es una obra cultural digitalizada dedicada a la Ritmología Árabe. Si el Secuenciador o la Trivia te han ayudado, tu apoyo nos permite mantener la infraestructura y expandir la enseñanza.
                </p>

                {/* Sección de Financiamiento Colectivo (Crowdfunding) */}
                <h2 className="text-3xl font-semibold text-gray-700 mb-6">
                    ¿En qué se invertirá tu apoyo?
                </h2>
                <div className="space-y-4 mb-10">
                    <p>La financiación de este proyecto se basa en la sostenibilidad. Cada donación contribuye a:</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                        <li>Mantener el backend que gestiona el Ranking de la Trivia, esencial para **fidelizar** a los Súper Fans..</li>
                        <li>Investigar y añadir nuevos ritmos (como el Fallahi o el Masmoudi Kebir) con sus variantes y notación visual precisa.</li>
                        <li>Expandir la sección 🎶 Instrumentos y la 🌍 Info Cultural, cumpliendo con la promoción de obras culturales.</li>
                    </ul>
                </div>

                {/* Opciones de Donación Directa */}
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

                {/* CTA para FUTURA MONETIZACIÓN (Venta de Cursos) */}
                <div className="bg-gray-100 p-8 rounded-xl border-l-4 border-blue-500 shadow">
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Esto simula la captura de leads para email marketing */}
                        <input 
                            type="email"
                            placeholder="Introduce tu email para novedades..."
                            className="flex-grow p-3 rounded-lg border border-gray-300"
                        />
                        <button
                            onClick={() => alert("Gracias! Te añadiremos a nuestra lista.")}
                            className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition"
                        >
                            Suscribirme al Boletín
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Al suscribirte, recibirás nuevos consejos y contenido exclusivo.
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