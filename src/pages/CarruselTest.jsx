// src/pages/CarruselTest.jsx
export default function CarruselTest() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-indigo-200 flex flex-col items-center px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">🧪 Test de Carrusel Horizontal</h1>

      <div className="w-full overflow-x-auto border border-gray-300 rounded-xl p-2 bg-white shadow">
        <div className="flex gap-2 whitespace-nowrap">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white font-bold rounded flex items-center justify-center"
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      <p className="mt-6 text-gray-700 text-center max-w-md">
        Si los bloques azules están en fila horizontal y podés hacer scroll lateral, el layout base está funcionando. Si se apilan verticalmente, hay un conflicto global que debemos resolver.
      </p>
      <div className="bg-red-500 text-white p-4">TEST</div>
      <div className="bg-red-500 text-white p-4">Tailwind funciona 🎉</div>
    </div>
  );
}
