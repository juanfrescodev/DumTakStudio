//components/RitmoTrivia.jsx
import { useState, useEffect, useRef } from "react";
import ritmosData from "../data/ritmos.json";
import confetti from "canvas-confetti";
import { useAuthStore } from "../store/useAuthStore";

export default function RitmoTriviaSteps({ onRankingUpdate }) {
  const base = import.meta.env.BASE_URL;
  const ritmosConRutas = ritmosData;
  
  const lanzarConfeti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const [historialPreguntas, setHistorialPreguntas] = useState([]);
  const [ritmosUsados, setRitmosUsados] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const { isLoggedIn, user } = useAuthStore();
  const [nivel, setNivel] = useState(1);
  const [aciertos, setAciertos] = useState(0);
  const [currentRitmo, setCurrentRitmo] = useState(null);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [audioReady, setAudioReady] = useState(false);
  const [puntaje, setPuntaje] = useState(0);
  const [vidas, setVidas] = useState(3);
  const [nombreJugador, setNombreJugador] = useState("");
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [ranking, setRanking] = useState([]);
  const [animarNivel, setAnimarNivel] = useState(false);
  const [animarNivelDuelo, setAnimarNivelDuelo] = useState({ 1: false, 2: false });
  const audio = new Audio(`${base}ritmos/festejo.mp3`);
  const [logros, setLogros] = useState([]);
  const [mostrarLogro, setMostrarLogro] = useState(null);
  const fondoPorNivel = {
  1: "bg-white",
  2: "bg-yellow-100",
  3: "bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white"
};

  const audioCtxRef = useRef(null);
  const samplesRef = useRef({});
  const [modoDuelo, setModoDuelo] = useState(false);
  const [jugadorActual, setJugadorActual] = useState(1);
  const [puntajesDuelo, setPuntajesDuelo] = useState({ 1: 0, 2: 0 });
  const [vidasDuelo, setVidasDuelo] = useState({ 1: 3, 2: 3 });
  const [nivelDuelo, setNivelDuelo] = useState({ 1: 1, 2: 1 });
  const [rachaDuelo, setRachaDuelo] = useState({ 1: 0, 2: 0 });

  useEffect(() => {
    const loadSamples = async () => {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ctx;

      const allSteps = ritmosConRutas.flatMap((r) => {
        const variantes = r.variantes;
        const baseSteps = variantes?.base?.steps || [];
        const arregloSteps = variantes?.arreglo?.steps || [];
        const legacySteps = r.steps || [];
        return [...baseSteps, ...arregloSteps, ...legacySteps];
      });

      await Promise.all(
        allSteps.map(async (s) => {
          if (s.sound) {
            const key = `ritmos/${s.sound.replace(/^\/+/, "")}`;
            if (!samplesRef.current[key]) {
              try {
                const res = await fetch(`${base}${key}`);
                const buf = await res.arrayBuffer();
                const audioBuf = await ctx.decodeAudioData(buf);
                samplesRef.current[key] = audioBuf;
              } catch (err) {
                console.warn("⚠️ Error cargando sonido:", key, err);
              }
            }
          }
        })
      );

      setAudioReady(true);
    };

    loadSamples();
  }, []);

  useEffect(() => {
    generarNuevaPregunta();
  }, [nivel]);

  useEffect(() => {
    obtenerRanking(); // carga el ranking al abrir la página
  }, []);

  useEffect(() => {
    if (!juegoTerminado) {
      setTimeout(() => {
        obtenerRanking();
      }, 500);
    }
  }, [juegoTerminado]);

  const generarNuevaPregunta = () => {
    if (!startTime) setStartTime(Date.now());
    const nivelActual = modoDuelo ? nivelDuelo[jugadorActual] : nivel;

    const dificultadPermitida =
      nivelActual === 1
        ? ["facil"]
        : nivelActual === 2
        ? ["facil", "intermedio"]
        : ["facil", "intermedio", "dificil"];

    const ritmosValidos = ritmosConRutas.filter((r) =>
      dificultadPermitida.includes(r.dificultad) &&
      (r.steps || r.variantes?.base?.steps || r.variantes?.arreglo?.steps)
    );

    const elegido = ritmosValidos[Math.floor(Math.random() * ritmosValidos.length)];
    setRitmosUsados((prev) => [...prev, elegido.nombre]);

    // 🔀 Elegir modo aleatorio (base o arreglo) solo una vez
    const variantes = elegido.variantes;
    let modoTrivia = "base";

    if (variantes?.base?.steps && variantes?.arreglo?.steps) {
      modoTrivia = Math.random() < 0.5 ? "base" : "arreglo";
    } else if (variantes?.arreglo?.steps) {
      modoTrivia = "arreglo";
    } else if (variantes?.base?.steps) {
      modoTrivia = "base";
    }

    // 🧠 Guardar ritmo con modoTrivia fijo
    setCurrentRitmo({ ...elegido, modoTrivia });

    // 🧩 Generar opciones
    const opciones = [elegido];
    while (opciones.length < 4) {
      const candidato = ritmosValidos[Math.floor(Math.random() * ritmosValidos.length)];
      if (!opciones.find((o) => o.id === candidato.id)) {
        opciones.push(candidato);
      }
    }

    setOptions(shuffleArray(opciones));
    setSelected(null);
    setFeedback("");
  };


  const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);

  const playStep = (step, time) => {
    const key = `ritmos/${step?.sound}`;
    const buffer = samplesRef.current[key];
    if (buffer && audioCtxRef.current) {
      const source = audioCtxRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtxRef.current.destination);
      source.start(time);
    }
  };

  const playSequence = () => {
    if (!audioReady || !currentRitmo) return;

    let steps;

    const variantes = currentRitmo.variantes;
    const nivelActual = modoDuelo ? nivelDuelo[jugadorActual] : nivel;

    if (nivelActual === 1 && variantes?.base?.steps) {
      steps = variantes.base.steps;
    } else if (variantes?.base?.steps && variantes?.arreglo?.steps) {
      const modo = currentRitmo.modoTrivia || "base";
      steps = variantes?.[modo]?.steps || currentRitmo.steps;
    } else if (variantes?.base?.steps) {
      steps = variantes.base.steps;
    } else if (currentRitmo.steps) {
      steps = currentRitmo.steps;
    } else {
      console.warn("Ritmo sin secuencia reproducible:", currentRitmo.id);
      return;
    }


    const stepsConRutaCompleta = steps.map((s) => ({
      ...s,
      sound: s.sound ? s.sound.replace(/^\/+/, "") : null,
      img: s.img ? `${base}ritmos/${s.img.replace(/^\/+/, "")}` : null,
    }));

    const ctx = audioCtxRef.current;
    const bpm = 90;
    const stepsPerBeat = stepsConRutaCompleta.length / (currentRitmo.beatsPerBar || 4);
    const stepDuration = (60 / bpm) / stepsPerBeat;

    stepsConRutaCompleta.forEach((step, i) => {
      const time = ctx.currentTime + i * stepDuration;
      playStep(step, time);
    });
  };

  const handleSelect = (id) => {
    setSelected(id);

    if (modoDuelo) {
      // 🎮 MODO DUELO
      const acierto = id === currentRitmo.id;

      if (acierto) {
        setFeedback(`✅ Jugador ${jugadorActual} acertó!`);
        setPuntajesDuelo((prev) => ({
          ...prev,
          [jugadorActual]: prev[jugadorActual] + 1
        }));

        setRachaDuelo((prev) => {
          const nueva = prev[jugadorActual] + 1;
          if (nueva === 3 && nivelDuelo[jugadorActual] < 3) {
            setNivelDuelo((niveles) => ({
              ...niveles,
              [jugadorActual]: niveles[jugadorActual] + 1
            }));

            setAnimarNivelDuelo((prev) => ({
              ...prev,
              [jugadorActual]: true
            }));
            setTimeout(() => {
              setAnimarNivelDuelo((prev) => ({
                ...prev,
                [jugadorActual]: false
              }));
            }, 1000);
          }
          return { ...prev, [jugadorActual]: nueva };
        });
      } else {
        setFeedback(`❌ Jugador ${jugadorActual} falló. Era: ${currentRitmo.nombre}`);
        setVidasDuelo((prev) => {
          const nuevas = prev[jugadorActual] - 1;
          if (nuevas <= 0 && prev[jugadorActual === 1 ? 2 : 1] <= 0) {
            setJuegoTerminado(true);
          }
          return { ...prev, [jugadorActual]: nuevas };
        });

        setRachaDuelo((prev) => {
          const nueva = 0;
          if (nivelDuelo[jugadorActual] > 1) {
            setNivelDuelo((niveles) => ({
              ...niveles,
              [jugadorActual]: niveles[jugadorActual] - 1
            }));
          }
          return { ...prev, [jugadorActual]: nueva };
        });
      }

      setJugadorActual(jugadorActual === 1 ? 2 : 1);
      setTimeout(() => generarNuevaPregunta(), 1000);
      return;
    }

    // 🎮 MODO INDIVIDUAL
    if (id === currentRitmo.id) {
      setFeedback("✅ ¡Correcto!");
      setPuntaje((prev) => prev + 1);

      setHistorialPreguntas((prev) => [
        ...prev,
        {
          ritmo: currentRitmo.nombre,
          acierto: id === currentRitmo.id
        }
      ]);

      const nuevos = aciertos + 1;

      if (nuevos === 1 && !logros.includes("primer")) {
        setLogros((prev) => [...prev, "primer"]);
        setMostrarLogro("🥇 Primer acierto");
      }
      if (nuevos === 5 && !logros.includes("cinco")) {
        setLogros((prev) => [...prev, "cinco"]);
        setMostrarLogro("🔥 5 aciertos seguidos");
      }
      if (nuevos === 10 && nivel === 3 && vidas === 3 && !logros.includes("perfecto")) {
        setLogros((prev) => [...prev, "perfecto"]);
        setMostrarLogro("🎯 Nivel 3 sin perder vidas");
      }

      setTimeout(() => setMostrarLogro(null), 2000);

      if (nuevos === 5) {
        setNivel(2);
        setAnimarNivel(true);
        setTimeout(() => setAnimarNivel(false), 1000);
        audio.play();
        lanzarConfeti();
      }
      if (nuevos === 10) {
        setNivel(3);
        setAnimarNivel(true);
        setTimeout(() => setAnimarNivel(false), 1000);
        audio.play();
        lanzarConfeti();
      }

      setAciertos(nuevos);
    } else {
      setFeedback(`❌ Incorrecto. Era: ${currentRitmo.nombre}`);
      setHistorialPreguntas((prev) => [
        ...prev,
        {
          ritmo: currentRitmo.nombre,
          acierto: false
        }
      ]);
      setVidas((prev) => {
        const nuevas = prev - 1;
        if (nuevas <= 0) {
          setJuegoTerminado(true);

          (async () => {
            try {
              await enviarPuntaje();
              
              setTimeout(() => {
                obtenerRanking();
              }, 500);
            } catch (err) {
              console.error("❌ Error al guardar puntaje o estadísticas:", err);
            }
          })();
        }
        return nuevas;
      });
    }
  };


  const enviarEstadisticaTrivia = async () => {
    console.log("Usuario logueado:", user);

    const nombre = isLoggedIn ? user.nombre : nombreJugador;
    const duracion = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;
    
    const aciertosPorRitmo = {};
    const erroresPorRitmo = {};

historialPreguntas.forEach(({ ritmo, acierto }) => {
  if (acierto) {
    aciertosPorRitmo[ritmo] = (aciertosPorRitmo[ritmo] || 0) + 1;
  } else {
    erroresPorRitmo[ritmo] = (erroresPorRitmo[ritmo] || 0) + 1;
  }
});



    const stat = {
      userId: isLoggedIn ? user.id : null,
      nombre,
      puntaje,
      aciertosPorRitmo,
      erroresPorRitmo,
      nivelMaximo: nivel,
      rachaMaxima: 4,
      logros,
      duracion: Math.round((Date.now() - startTime) / 1000),
      fecha: new Date().toISOString()
    };

    try {
      await fetch("https://ritmos-backend.onrender.com/api/trivia-stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stat)
      });
      console.log("✅ Estadística de trivia guardada");
    } catch (err) {
      console.error("❌ Error al guardar estadística:", err);
    }
  };

  const enviarPuntaje = async () => {
    const nombre = isLoggedIn ? user.nombre : nombreJugador;

    if (!nombre) {
      alert("Por favor ingresá tu nombre para guardar el puntaje.");
      return;
    }

    console.log("Enviando puntaje:", {
      nombre,
      userId: isLoggedIn ? user.id : null,
      puntaje,
      ritmos: ritmosUsados,
      modo: "trivia"
    });

    try {
      await fetch("https://ritmos-backend.onrender.com/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          userId: isLoggedIn ? user.id : null,
          puntaje,
          ritmos: ritmosUsados,
          modo: "trivia"
        })
      });
      alert("✅ Puntaje guardado con éxito!");
      if (!isLoggedIn) setNombreJugador("");

      await enviarEstadisticaTrivia();
      setTimeout(() => {
        obtenerRanking(); // actualiza el ranking local
        if (onRankingUpdate) onRankingUpdate(); // actualiza el ranking general
      }, 500);
    } catch (err) {
      console.error("Error al guardar puntaje:", err);
      alert("❌ Hubo un error al guardar tu puntaje.");
    }
  };



  const obtenerRanking = async () => {
    try {
      const res = await fetch("https://ritmos-backend.onrender.com/api/scores/top?modo=trivia");
      const data = await res.json();
      setRanking(data);
    } catch (err) {
      console.error("Error al obtener ranking:", err);
    }
  };

  return (
  <div className={`${fondoPorNivel[nivel]} rounded-2xl shadow-xl p-6 max-w-xl w-full mt-10`}>
    <h2 className="text-2xl font-bold mb-4 text-gray-800">🎧 ¿Qué ritmo estás escuchando?</h2>

    {!juegoTerminado && (
      <>
        {animarNivel && (
          <p className="text-xl font-bold text-center text-green-600 mb-4 animate-bounce">
            🎉 ¡Nivel {nivel} desbloqueado! Seguí avanzando.
          </p>
        )}

        <div className="mb-4">
          <label className="mr-4 font-semibold">Modo de juego:</label>
          <button
            onClick={() => setModoDuelo(false)}
            className={`px-3 py-1 rounded ${!modoDuelo ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Individual
          </button>
          <button
            onClick={() => setModoDuelo(true)}
            className={`px-3 py-1 rounded ml-2 ${modoDuelo ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Duelo
          </button>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div
            className="bg-green-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${(aciertos % 5) * 20}%` }}
          />
        </div>

        {modoDuelo ? (
          <div className="mb-4 text-center font-medium">
            🎮 Turno de Jugador {jugadorActual}
            {animarNivelDuelo[jugadorActual] && (
              <p className="text-green-600 font-bold text-center animate-bounce mt-2">
                🎉 ¡Jugador {jugadorActual} subió a nivel {nivelDuelo[jugadorActual]}!
              </p>
            )}
            <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
              <div className="bg-gray-100 p-2 rounded">
                <p className="font-semibold">Jugador 1</p>
                ❤️ {vidasDuelo[1]} | 🏆 {puntajesDuelo[1]} | 🔢 Nivel: {nivelDuelo[1]}
              </div>
              <div className="bg-gray-100 p-2 rounded">
                <p className="font-semibold">Jugador 2</p>
                ❤️ {vidasDuelo[2]} | 🏆 {puntajesDuelo[2]} | 🔢 Nivel: {nivelDuelo[2]}
              </div>
            </div>
            <p className="text-sm text-gray-700 mt-1">
              🔢 Nivel actual: {nivelDuelo[jugadorActual]}
            </p>
          </div>
        ) : (
          <p className="text-lg font-medium mb-2">
            ❤️ Vidas: {vidas} | 🏆 Puntaje: {puntaje} | 🔢 Nivel: {nivel}
          </p>
        )}

        {mostrarLogro && (
          <div className="text-center text-yellow-500 text-xl font-bold animate-bounce mb-4">
            {mostrarLogro}
          </div>
        )}

        <button
          onClick={playSequence}
          disabled={!audioReady}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold mb-6"
        >
          ▶️ Escuchar ritmo
        </button>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {options.map((r) => (
            <button
              key={r.id}
              onClick={() => handleSelect(r.id)}
              disabled={!!selected}
              className={`px-4 py-2 rounded-lg font-semibold text-white transition ${
                selected
                  ? r.id === currentRitmo.id
                    ? "bg-green-600"
                    : r.id === selected
                    ? "bg-red-500"
                    : "bg-gray-400"
                  : "bg-orange-600 hover:bg-orange-700"
              }`}
            >
              {r.nombre}
            </button>
          ))}
        </div>

        {feedback && (
          <p className="text-lg font-medium text-center mb-4">{feedback}</p>
        )}

        <button
          onClick={generarNuevaPregunta}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
        >
          ➡️ Siguiente pregunta
        </button>
      </>
    )}

    {juegoTerminado && (
      <div className="mt-6">
        {modoDuelo ? (
          <>
            <p className="text-xl font-bold text-center mb-4">🎮 Duelo terminado</p>
            <p className="text-lg text-center mb-2">Jugador 1: {puntajesDuelo[1]} pts</p>
            <p className="text-lg text-center mb-2">Jugador 2: {puntajesDuelo[2]} pts</p>
            <p className="text-center font-bold text-green-600">
              🏆 Ganador: {puntajesDuelo[1] > puntajesDuelo[2] ? "Jugador 1" : puntajesDuelo[1] < puntajesDuelo[2] ? "Jugador 2" : "Empate"}
            </p>

            <button
              onClick={() => {
                setPuntajesDuelo({ 1: 0, 2: 0 });
                setVidasDuelo({ 1: 3, 2: 3 });
                setJugadorActual(1);
                setJuegoTerminado(false);
                generarNuevaPregunta();
                obtenerRanking();
              }}
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
            >
              🔁 Volver a jugar
            </button>
          </>
        ) : (
          <>
            <p className="text-xl font-bold text-center mb-4">🎮 Juego terminado</p>
            <p className="text-lg text-center mb-2">Tu puntaje final: {puntaje}</p>
            {!isLoggedIn && (
              <input
                type="text"
                placeholder="Escribí tu nombre para guardar el puntaje"
                value={nombreJugador}
                onChange={(e) => setNombreJugador(e.target.value)}
                className="w-full px-4 py-2 border rounded mb-4"
              />
            )}
            <button
              onClick={enviarPuntaje}
              disabled={!isLoggedIn && !nombreJugador}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 font-semibold mb-6"
            >
              💾 Guardar puntaje
            </button>

            <h3 className="text-xl font-bold mb-2 text-center">🏅 Ranking Top 10</h3>
            <ul className={`rounded p-4 ${
              nivel === 3 ? "bg-gray-800 text-white border border-gray-600" : "bg-gray-100 text-black"
            }`}>
              {ranking.map((r, i) => (
                <li key={r._id} className="flex justify-between py-1 px-2 border-b border-gray-400">
                  <span>{i + 1}. {r.nombre}</span>
                  <span>{r.puntaje} pts</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => {
                setPuntaje(0);
                setVidas(3);
                setNivel(1);
                setAciertos(0);
                setJuegoTerminado(false);
                setRanking([]);
                generarNuevaPregunta();
              }}
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
            >
              🔁 Volver a jugar
            </button>
          </>
        )}
      </div>
    )}
  </div>
);

}

