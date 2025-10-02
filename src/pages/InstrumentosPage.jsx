// src/pages/InstrumentosPage.jsx
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import instrumentosData from "../data/instrumentosData";

export default function InstrumentosPage() {
    const familias = instrumentosData;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto p-4 md:p-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                    🎶 Instrumentos Árabes: Ritmo, Maqam y Cultura
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                    Descubrí los instrumentos fundamentales de la música árabe tradicional. Desde la percusión que marca el pulso del Maqam hasta los aerófonos que evocan el desierto, cada familia tiene un rol único en la danza oriental, el folklore y la expresión musical del mundo árabe.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {familias.map((familia) => (
                        <Link
                            key={familia.id}
                            to={`/instrumentos/${familia.id}`}
                            className={`${familia.color} text-white p-6 rounded-2xl shadow-xl transform transition duration-300 hover:scale-[1.03] hover:shadow-2xl border-b-4 border-yellow-300 block`}
                        >
                            <h2 className="text-3xl font-bold mb-3 flex items-center">
                                {familia.icon} {familia.nombre}
                            </h2>
                            <p className="text-sm opacity-90 mb-4 line-clamp-3">
                                {familia.descripcion}
                            </p>
                            <span className="inline-block bg-white text-gray-800 text-xs font-semibold px-3 py-1 rounded-full mt-2">
                                Ver instrumentos ({familia.ejemplos.length})
                            </span>
                        </Link>
                    ))}

                    <div className="bg-gray-200 p-6 rounded-2xl shadow-lg border-dashed border-2 border-gray-400 flex flex-col justify-center">
                        <h2 className="text-xl font-bold text-gray-700 mb-2">
                            ¿Faltan instrumentos?
                        </h2>
                        <p className="text-sm text-gray-500 mb-4">
                            Tu apoyo permite grabar samples de alta calidad de instrumentos como el Kamanja o el Nay. ¡Sumate a la expansión cultural!
                        </p>
                        <Link 
                            to="/donar" 
                            className="text-purple-600 hover:text-purple-700 font-semibold underline"
                        >
                            💖 Quiero apoyar la Sala de Studio
                        </Link>
                    </div>
                </div>

                <div className="mt-12 text-center text-sm text-gray-500">
                    ¿Querés aprender más? Explorá nuestra <Link to="/teoria" className="text-blue-600 underline">Guía de Ritmología y Maqam</Link> o visitá <a href="https://www.maqamworld.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">MaqamWorld</a>.
                </div>
            </main>
        </div>
    );
}
