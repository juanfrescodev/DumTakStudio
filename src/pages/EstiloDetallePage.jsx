//pages/EstiloDetallePage.jsx
import { useParams, Link } from "react-router-dom";
import estilosData from "../data/estilosData.json";
import Navbar from "../components/Navbar";

export default function EstiloDetallePage() {
  const { estilo } = useParams();
  const estiloData = estilosData.find((e) => e.id === estilo);

  if (!estiloData) {
    return (
      <>
        <Navbar />
        <div className="pt-24 px-4 text-center">
          <h2 className="text-xl font-semibold text-red-600">Estilo no encontrado</h2>
          <Link to="/info-cultural" className="mt-4 inline-block text-blue-600 underline">
            ← Volver al mapa cultural
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="pt-24 px-4 max-w-screen-md mx-auto">
        <h1 className="text-3xl font-bold text-yellow-700 mb-2">{estiloData.nombre}</h1>
        <p className="text-sm text-gray-600 mb-4">Origen: {estiloData.pais}</p>

        {estiloData.imagen && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">📷 Imagen representativa</h2>
            <img
              src={estiloData.imagen}
              alt={`Imagen de ${estiloData.nombre}`}
              className="w-full rounded shadow object-cover max-h-[400px]"
            />
          </div>
        )}

        <p className="text-lg mb-6">{estiloData.descripcion}</p>

        <h2 className="text-xl font-semibold mb-2">🎭 Elementos característicos</h2>
        <p className="text-gray-700 mb-2">
          Estos elementos te ayudan a reconocer el estilo en la danza, la música o el vestuario. Observá cómo se combinan para expresar su identidad cultural:
        </p>
        <ul className="list-disc list-inside mb-6">
          {estiloData.elementos.map((el, i) => (
            <li key={i}>{el}</li>
          ))}
        </ul>

        {estiloData.video && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">🎥 Video de referencia</h2>
            <p className="text-gray-700 mb-2">
              Mirá este ejemplo en acción. Observá cómo se manifiestan los elementos del estilo en el movimiento, la música y el contexto:
            </p>
            <div className="aspect-video">
              <iframe
                src={estiloData.video}
                title={`Video de ${estiloData.nombre}`}
                allowFullScreen
                className="w-full h-full rounded shadow"
              />
            </div>
          </div>
        )}

        <Link
          to="/info-cultural"
          className="inline-block bg-yellow-300 hover:bg-yellow-400 text-black px-4 py-2 rounded shadow"
        >
          ← Volver al mapa cultural
        </Link>
      </div>
    </>
  );
}
