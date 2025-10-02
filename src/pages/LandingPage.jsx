//src/pages/LandingPage.jsx
import Navbar from "../components/Navbar";
import { useEffect } from "react";
import { Link } from "react-router-dom";

// Definición de las 3 funcionalidades principales para destacar
const featuredSections = [
    { 
        path: "/ritmos", 
        label: "🥁 Ritmos y Notación", 
        icon: "🥁", 
        description: "Explora la librería completa de ritmos egipcios (Maksum, Saidi, Baladi, etc.) con notación visual (Dum, Tak, Tek) y variantes.",
        color: "bg-red-100 hover:bg-red-200 text-red-800"
    },
    { 
        path: "/trivia", 
        label: "🏆 Desafío de Ritmos (Trivia)", 
        icon: "❓", 
        description: "Pon a prueba tu oído y compite en el ranking Top 10. ¡Ideal para convertir el aprendizaje en un juego!",
        color: "bg-yellow-100 hover:bg-yellow-200 text-yellow-800"
    },
    { 
        path: "/secuenciador", 
        label: "🎛️ Creador de Secuencias", 
        icon: "🎛️", 
        description: "Diseña tus propios ejercicios combinando ritmos y compases. Practica tus coreografías con la Web Audio API.",
        color: "bg-blue-100 hover:bg-blue-200 text-blue-800"
    },
];

// Definición de enlaces secundarios (incluyendo monetización)
const secondaryLinks = [
    { path: "/info-cultural", label: "🌍 Info Cultural" },
    { path: "/instrumentos", label: "🎶 Instrumentos" }, 
];

export default function LandingPage() {

    // 1. Activa el backend al cargar (necesario para la Trivia y el Ranking)
    useEffect(() => {
        fetch('https://ritmos-backend.onrender.com/ping')
            .then(() => console.log('Backend activado desde landing'))
            .catch(err => console.error('Error al despertar el backend', err));
    }, []);

    return (
        <>
            <Navbar />
            
            <div className="container mx-auto px-4 py-12 text-center max-w-4xl">
                
                {/* HERO SECTION: Relato y Propuesta de Valor */}
                <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-4 tracking-tight">
                    Dumtak Studio
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 mb-10 font-light">
                    Tu centro de entrenamiento digital para la Ritmología Árabe. Aprende, practica y domina los ritmos egipcios con notación visual y audio preciso.
                </p>

                {/* FEATURE CARDS: Enfocadas en el valor central */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {featuredSections.map(({ path, label, icon, description, color }) => (
                        <Link 
                            key={path}
                            to={path}
                            className={`${color} p-6 rounded-2xl shadow-lg transform transition duration-300 hover:scale-[1.03] hover:shadow-xl border-b-4 border-yellow-500`}
                        >
                            <div className="text-4xl mb-3">{icon}</div>
                            <h2 className="text-xl font-bold mb-2 text-gray-900">{label}</h2>
                            <p className="text-sm text-gray-700">{description}</p>
                        </Link>
                    ))}
                </div>

                {/* LLAMADA A LA ACCIÓN SECUNDARIA Y MONETIZACIÓN */}
                <div className="bg-gray-50 p-6 rounded-xl shadow-inner border border-gray-200">
                    <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                        ¿Te parece útil esta herramienta?
                    </h3>
                    
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
                        {/* CTA PRINCIPAL: Monetización (Donar) */}
                        <Link 
                            to="/donar"
                            className="bg-purple-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-purple-700 transform hover:scale-105 transition duration-200 text-lg uppercase tracking-wide"
                        >
                            💖 Apoya el Desarrollo Cultural (Donar)
                        </Link>
                        
                        {/* Vínculo a Futuro (E-mail / Boletín) */}
                        <a 
                            href="mailto:contacto@dumtakstudio.com" 
                            className="text-gray-600 hover:text-blue-600 font-medium py-3 px-8 text-sm"
                        >
                            ¡Suscríbete al boletín para recibir novedades!
                        </a>
                    </div>
                    
                    {/* Enlaces complementarios */}
                    <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm font-medium">
                        {secondaryLinks.map(({ path, label }) => (
                            <Link 
                                key={path}
                                to={path}
                                className="text-gray-600 hover:text-yellow-600 underline"
                            >
                                {label}
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </>
    );
}