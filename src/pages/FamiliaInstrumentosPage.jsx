// src/pages/FamiliaInstrumentosPage.jsx
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import instrumentosData from "../data/instrumentosData";
import useAudioEngine from "../hooks/useAudioEngine";
import { useEffect, useState } from "react";

const InstrumentoCard = ({ instrumento, playSample }) => {
    const samplePath = instrumento.sample.startsWith('/')
        ? instrumento.sample.slice(1)
        : `ritmos/${instrumento.sample}`;

    const handlePlay = () => {
        if (playSample) playSample(samplePath, 0);
    };

    const isPercussion = samplePath.includes("dum") || samplePath.includes("tek") || samplePath.includes("riq");
    const bgColor = isPercussion ? "bg-red-50" : "bg-blue-50";

    return (
        <div className={`p-5 rounded-xl shadow-md ${bgColor} hover:shadow-lg transition duration-200`}>
            <h3 className="text-xl font-bold text-gray-800 mb-2 capitalize">
                {instrumento.nombre}
            </h3>
            <p className="text-sm text-gray-600 mb-4">{instrumento.uso}</p>
            <button
                onClick={handlePlay}
                className="w-full bg-yellow-500 text-gray-900 font-bold py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-yellow-600 active:scale-[0.98] transition shadow"
            >
                <span>🔊 Escuchar {instrumento.nombre}</span>
            </button>
            <button
                onClick={() => navigator.share?.({
                    title: instrumento.nombre,
                    text: `Escuchá el sonido del ${instrumento.nombre} en nuestra webApp de ritmos árabes`,
                    url: window.location.href
                })}
                className="mt-2 text-xs text-blue-600 underline"
            >
                📤 Compartir este instrumento
            </button>
        </div>
    );
};

export default function FamiliaInstrumentosPage() {
    const [familiaId, setFamiliaId] = useState("");
    const [familiaData, setFamiliaData] = useState(null);
    const { playSample, audioCtxRef, isLoaded } = useAudioEngine({});

    useEffect(() => {
        const hash = window.location.hash; // Ej: "#/instrumentos/percusion"
        const parts = hash.split("/");
        const id = parts[2] || "";
        setFamiliaId(id);

        const found = instrumentosData.find(f => f.id === id);
        setFamiliaData(found);
    }, []);

    const ensureAudioContext = async () => {
        if (audioCtxRef.current?.state === "suspended") {
            await audioCtxRef.current.resume();
        }
    };

    if (!familiaData) {
        return (
            <div className="min-h-screen bg-gray-50 text-center p-10">
                <Navbar />
                <h1 className="text-3xl font-bold text-red-600 mb-4">Familia de Instrumentos no encontrada 😥</h1>
                <p className="text-lg text-gray-600 mb-4">
                    Verificá que el ID "{familiaId}" exista en la data y esté en minúsculas.
                </p>
                <Link to="/instrumentos" className="text-blue-600 hover:underline font-semibold">
                    ← Volver al listado de Familias
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50" onClick={ensureAudioContext}>
            <Navbar />
            <main className="container mx-auto p-4 md:p-8">
                <Link
                    to="/instrumentos"
                    className="inline-block bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-lg shadow font-semibold mb-6 text-sm"
                >
                    ← Volver a Familias
                </Link>

                <h1 className="text-4xl font-extrabold text-gray-900 mb-2 flex items-center">
                    {familiaData.icon} {familiaData.nombre}
                </h1>
                <p className="text-xl italic text-gray-700 mb-6 border-b pb-4">
                    {familiaData.descripcion}
                </p>

                <section className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Instrumentos de la Familia
                    </h2>
                    {!isLoaded && (
                        <p className="text-orange-600 mb-4">Cargando samples de audio (Web Audio API)...</p>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {familiaData.ejemplos.map((instrumento) => (
                            <InstrumentoCard
                                key={instrumento.id}
                                instrumento={instrumento}
                                playSample={playSample}
                            />
                        ))}
                    </div>
                </section>

                <aside className="mt-10 p-6 bg-white rounded-xl shadow-2xl border-l-4 border-yellow-500">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">
                        Relato Cultural
                    </h2>
                    <p className="text-gray-600 mb-4">
                        {familiaData.relato} Estos instrumentos no solo suenan: cuentan historias, acompañan danzas, y transmiten emociones que han viajado por siglos desde el Magreb hasta el Levante.
                    </p>
                    <Link
                        to="/ritmos"
                        className="text-blue-600 hover:underline font-semibold"
                    >
                        🥁 Ver Ritmos que usan estos instrumentos
                    </Link>
                </aside>

                <div className="mt-12 text-center text-sm text-gray-500">
                    ¿Querés aprender más sobre música árabe, maqamat y danza oriental? Visitá nuestra <Link to="/teoria" className="text-blue-600 underline">Guía Educativa</Link> o explorá <a href="https://www.maqamworld.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">MaqamWorld</a>.
                </div>
            </main>
        </div>
    );
}
