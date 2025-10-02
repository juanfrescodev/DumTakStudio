// src/data/instrumentosData.js

const instrumentosData = [
    {
        id: "percusion",
        nombre: "Tambores y Percusión",
        icon: "🥁",
        color: "bg-red-500",
        descripcion: "La base rítmica de la música árabe tradicional. Estos instrumentos producen los sonidos fundamentales Dum, Tak y Tek, esenciales para los ritmos como Maqsum, Baladi y Saidi.",
        ejemplos: [
            { id: "tabla", nombre: "Tabla / Darbuka", uso: "Tambor de copa usado en solos y acompañamientos rítmicos.", sample: "dum.mp3" },
            { id: "riq", nombre: "Riq", uso: "Pandereta con sonajas, aporta textura aguda y brillante.", sample: "tek.mp3" },
        ],
        relato: "Sin la percusión, los patrones rítmicos no tendrían voz ni poder. Son el corazón de la danza oriental y el pulso del Maqam."
    },
    {
        id: "cuerdas",
        nombre: "Instrumentos Melódicos y de Cuerda",
        icon: "🎻",
        color: "bg-blue-500",
        descripcion: "Instrumentos que ejecutan el sistema de Maqam y definen la estructura melódica. Son esenciales en la música árabe clásica y folclórica.",
        ejemplos: [
            { id: "oud", nombre: "Oud", uso: "Laúd árabe sin trastes, considerado el rey de los instrumentos árabes.", sample: "oud_c4.mp3" },
            { id: "qanun", nombre: "Qanun", uso: "Cítara de mesa con cuerdas tensadas, usada para melodías rápidas y ornamentadas.", sample: "qanun_e4.mp3" },
        ],
        relato: "Las melodías que crean estos instrumentos dan el contexto emocional y cultural. El Maqam vive en sus cuerdas."
    },
    {
        id: "viento",
        nombre: "Viento y Aerófonos",
        icon: "🎶",
        color: "bg-green-500",
        descripcion: "Instrumentos que evocan el alma del desierto y la espiritualidad del mundo árabe. Su sonido es profundo, meditativo y ancestral.",
        ejemplos: [
            { id: "nay", nombre: "Nay", uso: "Flauta de caña que representa la voz del alma en la música sufí.", sample: "nay_d4.mp3" },
            { id: "mijwiz", nombre: "Mijwiz", uso: "Doble clarinete tradicional usado en celebraciones y danzas populares.", sample: "mijwiz_b3.mp3" },
        ],
        relato: "El aliento que da vida a estos instrumentos conecta lo terrenal con lo espiritual. Son el suspiro del desierto y la voz del ritual."
    }
];

export default instrumentosData;
