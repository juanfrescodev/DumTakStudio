import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  Polygon
} from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import "leaflet/dist/leaflet.css";

export default function MiddleEastMap() {
  const navigate = useNavigate();
  const mapRef = useRef();
  const [busqueda, setBusqueda] = useState("");
  const [seleccionado, setSeleccionado] = useState(null);

  // Estilos con ubicación puntual
  const estilos = [
    {
      nombre: "Baladi",
      region: "baladi",
      coords: [30.0, 31.2],
      descripcion: "Danza popular egipcia, terrenal y emocional.",
      bandera: "🇪🇬"
    },
    {
      nombre: "Kawleeya",
      region: "kawleeya",
      coords: [33.3, 44.4],
      descripcion: "Estilo gitano iraquí con giros y cabello suelto.",
      bandera: "🇮🇶"
    },
    {
      nombre: "Bandari",
      region: "bandari",
      coords: [27.2, 56.3],
      descripcion: "Danza costera iraní con ritmo alegre y pañuelos.",
      bandera: "🇮🇷"
    },
    {
      nombre: "Rom",
      region: "rom",
      coords: [39.9, 32.8],
      descripcion: "Danza gitana turca con énfasis en cadera y torso.",
      bandera: "🇹🇷"
    },
    {
      nombre: "Raqs Sharqi",
      region: "raqsharki",
      coords: [30.1, 31.3],
      descripcion: "Danza oriental clásica estilizada para escenario.",
      bandera: "🇪🇬"
    }
  ];

  // Estilos que abarcan regiones
  const regiones = [
    {
      nombre: "Saidi",
      region: "saidi",
      zona: [
        [26.0, 31.0],
        [25.7, 32.5],
        [25.0, 32.9],
        [24.1, 32.9]
      ],
      color: "green",
      descripcion: "Folklore del Alto Egipto con bastón y saltos.",
      bandera: "🇪🇬"
    },
    {
      nombre: "Dabke",
      region: "dabke",
      zona: [
        [33.8, 35.5],
        [32.0, 36.0],
        [31.9, 35.9]
      ],
      color: "purple",
      descripcion: "Danza grupal con pasos fuertes y unidad cultural.",
      bandera: "🇱🇧 🇸🇾 🇵🇸 🇯🇴"
    },
    {
      nombre: "Khaleegy",
      region: "khaleegy",
      zona: [
        [24.7, 46.7],
        [25.3, 55.3],
        [29.3, 48.0]
      ],
      color: "orange",
      descripcion: "Danza del Golfo con movimientos de cabello y manos.",
      bandera: "🇸🇦 🇦🇪 🇰🇼"
    }
  ];

  // Estilos globales sin ubicación
  const estilosGlobales = [
    {
      nombre: "Tribal Fusión",
      region: "tribal",
      descripcion: "Fusión moderna con estética tribal y música electrónica.",
      bandera: "🌍"
    },
    {
      nombre: "Cabaret",
      region: "cabaret",
      descripcion: "Estilo escénico glamoroso con movimientos sensuales.",
      bandera: "🌍"
    }
  ];

  const handleClick = (region) => {
    navigate(`/info-cultural/${region}`);
  };

  const todosEstilos = [
    ...estilos.map((e) => ({ ...e, tipo: "local" })),
    ...regiones.map((r) => ({ ...r, tipo: "regional" })),
    ...estilosGlobales.map((g) => ({ ...g, tipo: "global" }))
  ];

  const sugerencias = todosEstilos.filter((e) =>
    e.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleSeleccion = (estilo) => {
    setSeleccionado(estilo);
    if (estilo.coords) mapRef.current.flyTo(estilo.coords, 6);
    if (estilo.zona) mapRef.current.fitBounds(estilo.zona);
  };

  return (
    <div className="pt-20 px-4 relative z-0">
      {/* Buscador */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="🔍 Buscar estilo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full max-w-md px-4 py-2 border rounded shadow-sm"
        />
        {busqueda && (
          <div className="bg-white border rounded shadow mt-2 max-w-md">
            {sugerencias.map((e) => (
              <div
                key={e.region}
                className="px-4 py-2 hover:bg-yellow-100 cursor-pointer flex justify-between items-center"
                onClick={() => handleSeleccion(e)}
              >
                <div>
                  <strong>{e.bandera} {e.nombre}</strong>
                  <div className="text-xs text-gray-600">{e.descripcion}</div>
                </div>
                <button
                  onClick={(ev) => {
                    ev.stopPropagation();
                    handleClick(e.region);
                  }}
                  className="bg-yellow-300 hover:bg-yellow-400 text-xs px-2 py-1 rounded"
                >
                  Ver estilo
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Leyenda visual */}
      <div className="mb-4 flex gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-purple-500 rounded-sm"></span> Regional
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-blue-500 rounded-full"></span> Local
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-gray-400 rounded"></span> Global
        </div>
      </div>

      {/* Mapa */}
      <MapContainer
        center={[30, 40]}
        zoom={4}
        style={{ height: "500px", width: "100%" }}
        className="z-0"
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Marcadores individuales */}
        {estilos.map(({ nombre, region, coords, descripcion }) => (
          <Marker
            key={region}
            position={coords}
            eventHandlers={{ click: () => handleClick(region) }}
          >
            <Popup>{nombre}</Popup>
            <Tooltip direction="top" offset={[0, -10]} opacity={1}>
              <div>
                <strong>{nombre}</strong>
                <br />
                <span className="text-xs">{descripcion}</span>
              </div>
            </Tooltip>
          </Marker>
        ))}

        {/* Zonas regionales */}
        {regiones.map(({ nombre, region, zona, color, descripcion }) => (
          <Polygon
            key={region}
            positions={zona}
            pathOptions={{ color, fillOpacity: 0.3 }}
            eventHandlers={{ click: () => handleClick(region) }}
          >
            <Tooltip direction="center" opacity={1}>
              <div className="text-center">
                <strong>{nombre}</strong>
                <br />
                <span className="text-xs">{descripcion}</span>
              </div>
            </Tooltip>
          </Polygon>
        ))}
      </MapContainer>

      {/* Estilos globales */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">🌍 Estilos globales</h2>
        <div className="flex flex-wrap gap-4">
          {estilosGlobales.map(({ nombre, region, descripcion, bandera }) => (
            <button
              key={region}
              onClick={() => handleClick(region)}
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded shadow text-left w-full sm:w-auto"
            >
              <strong>{bandera} {nombre}</strong>
              <br />
              <span className="text-xs text-gray-600">{descripcion}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
