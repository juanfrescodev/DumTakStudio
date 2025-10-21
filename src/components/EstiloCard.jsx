//components/EstiloCard.jsx
export default function EstiloCard({ estilo }) {
  return (
    <div className="max-w-screen-md mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{estilo.nombre}</h1>
      <p className="text-gray-700 mb-4">{estilo.descripcion}</p>
      <ul className="list-disc pl-5 mb-4">
        {estilo.elementos.map((el, i) => <li key={i}>{el}</li>)}
      </ul>
      {estilo.video && (
        <iframe
          width="100%"
          height="315"
          src={estilo.video}
          title={`Video de ${estilo.nombre}`}
          allowFullScreen
        />
      )}
    </div>
  );
}
