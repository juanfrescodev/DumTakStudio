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
import estilosData from "../data/estilosData.json";

export default function MiddleEastMap() {
  const navigate = useNavigate();
  const mapRef = useRef();
  const [busqueda, setBusqueda] = useState("");
  const [seleccionado, setSeleccionado] = useState(null);

  const estilosConCoords = estilosData.filter((e) => e.coords);
  const estilosConZona = estilosData.filter((e) => e.zona);
  const estilosSinUbicacion = estilosData.filter((e) => !e.coords && !e.zona);

  const todosEstilos = [
    ...estilosConCoords.map((e) => ({ ...e, tipo: "local" })),
    ...estilosConZona.map((e) => ({ ...e, tipo: "regional" })),
    ...estilosSinUbicacion.map((e) => ({ ...e, tipo: "global" }))
  ];

  const sugerencias = todosEstilos.filter((e) =>
    e.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleClick = (region) => {
    navigate(`/info-cultural/${region}`);
  };

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
          placeholder="🔍 Buscá un estilo musical, de danza o cultural..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full max-w-md px-4 py-2 border rounded shadow-sm"
        />
        {busqueda && (
          <div className="bg-white border rounded shadow mt-2 max-w-md">
            {sugerencias.map((e) => (
              <div
                key={e.id}
                className="px-4 py-2 hover:bg-yellow-100 cursor-pointer flex justify-between items-center"
                onClick={() => handleSeleccion(e)}
              >
                <div>
                  <strong>{e.bandera || "🎭"} {e.nombre}</strong>
                  <div className="text-xs text-gray-600">{e.descripcion}</div>
                </div>
                <button
                  onClick={(ev) => {
                    ev.stopPropagation();
                    handleClick(e.id);
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
          <span className="w-4 h-4 bg-purple-500 rounded-sm"></span> Zona regional (varios países)
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-blue-500 rounded-full"></span> Estilo local (una ciudad o región)
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-gray-400 rounded"></span> Estilo global (sin ubicación fija)
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

        {estilosConCoords.map(({ nombre, id, coords, descripcion }) => (
          <Marker
            key={id}
            position={coords}
            eventHandlers={{ click: () => handleClick(id) }}
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

        {estilosConZona.map(({ nombre, id, zona, color = "purple", descripcion }) => (
          <Polygon
            key={id}
            positions={zona}
            pathOptions={{ color, fillOpacity: 0.3 }}
            eventHandlers={{ click: () => handleClick(id) }}
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
          {estilosSinUbicacion.map(({ nombre, id, descripcion, bandera }) => (
            <button
              key={id}
              onClick={() => handleClick(id)}
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded shadow text-left w-full sm:w-auto"
            >
              <strong>{bandera || "🌍"} {nombre}</strong>
              <br />
              <span className="text-xs text-gray-600">{descripcion}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
