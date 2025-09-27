// src/components/RitmoTriviaSteps.jsx
import { useState, useEffect, useRef } from "react";
import ritmosData from "../data/ritmos.json";

export default function RitmoTriviaSteps() {
  const base = import.meta.env.BASE_URL;

  const ritmosConRutas = ritmosData.map((r) => {
    const stepsConRutaCompleta = r.steps?.map((s) => ({
      ...s,
      sound: s.sound ? `${base}ritmos/${s.sound.replace(/^\/+/, "")}` : null,
      img: s.img ? `${base}ritmos/${s.img.replace(/^\/+/, "")}` : null,
    })) || [];

    return { ...r, steps: stepsConRutaCompleta };
  });

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

  const audioCtxRef = useRef(null);
  const samplesRef = useRef({});

  useEffect(() => {
    const loadSamples = async () => {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ctx;

      const allSteps = ritmosConRutas.flatMap((r) => r.steps || []);
      await Promise.all(
        allSteps.map(async (s) => {
          if (s.sound && !samplesRef.current[s.sound]) {
            try {
              const res = await fetch(s.sound);
              const buf = await res.arrayBuffer();
              const audioBuf = await ctx.decodeAudioData(buf);
              samplesRef.current[s.sound] = audioBuf;
            } catch (err) {
              console.warn("⚠️ Error cargando sonido:", s.sound, err);
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
  }, []);

  const generarNuevaPregunta = () => {
    const ritmosConSteps = ritmosConRutas.filter((r) => r.steps);
    const elegido = ritmosConSteps[Math.floor(Math.random() * ritmosConSteps.length)];

    const opciones = [elegido];
    while (opciones.length < 4) {
      const candidato = ritmosConSteps[Math.floor(Math.random() * ritmosConSteps.length)];
      if (!opciones.find((o) => o.id === candidato.id)) {
        opciones.push(candidato);
      }
    }

    setCurrentRitmo(elegido);
    setOptions(shuffleArray(opciones));
    setSelected(null);
    setFeedback("");
  };

  const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);

  const playStep = (step, time) => {
    const buffer = samplesRef.current[step?.sound];
    if (buffer && audioCtxRef.current) {
      const source = audioCtxRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtxRef.current.destination);
      source.start(time);
    }
  };

  const playSequence = () => {
    if (!audioReady || !currentRitmo?.steps) return;

    const ctx = audioCtxRef.current;
    const steps = currentRitmo.steps;
    const bpm = 90;
    const stepsPerBeat = steps.length / (currentRitmo.beatsPerBar || 4);
    const stepDuration = (60 / bpm) / stepsPerBeat;

    steps.forEach((step, i) => {
      const time = ctx.currentTime + i * stepDuration;
      playStep(step, time);
    });
  };

  const handleSelect = (id) => {
    setSelected(id);
    if (id === currentRitmo.id) {
      setFeedback("✅ ¡Correcto!");
      setPuntaje((prev) => prev + 1);
    } else {
      setFeedback(`❌ Incorrecto. Era: ${currentRitmo.nombre}`);
      setPuntaje((prev) => Math.max(0, prev - 1));
      setVidas((prev) => prev - 1);
      if (vidas - 1 <= 0) {
        setJuegoTerminado(true);
        obtenerRanking();
      }
    }
  };

  const enviarPuntaje = async () => {
    try {
      await fetch("https://ritmos-backend.onrender.com/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombreJugador,
          puntaje,
          ritmo: currentRitmo?.nombre,
          modo: "descubrir"
        })
      });
      alert("✅ Puntaje guardado con éxito!");
      setNombreJugador("");
    } catch (err) {
      console.error("Error al guardar puntaje:", err);
      alert("❌ Hubo un error al guardar tu puntaje.");
    }
  };

  const obtenerRanking = async () => {
    try {
      const res = await fetch("https://ritmos-backend.onrender.com/api/scores/top");
      const data = await res.json();
      setRanking(data);
    } catch (err) {
      console.error("Error al obtener ranking:", err);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-xl w-full mt-10">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">🎧 ¿Qué ritmo estás escuchando?</h2>

      {!juegoTerminado && (
        <>
          <p className="text-lg font-medium mb-2">❤️ Vidas: {vidas} | 🏆 Puntaje: {puntaje}</p>

          <button
            onClick={playSequence}
            disabled={!audioReady}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold mb-6"
          >
            ▶️ Reproducir ritmo
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
            Siguiente
          </button>
        </>
      )}

      {juegoTerminado && (
        <div className="mt-6">
          <p className="text-xl font-bold text-center mb-4">🎮 Juego terminado</p>
          <p className="text-lg text-center mb-2">Tu puntaje final: {puntaje}</p>
          <input
            type="text"
            placeholder="Tu nombre"
            value={nombreJugador}
            onChange={(e) => setNombreJugador(e.target.value)}
            className="w-full px-4 py-2 border rounded mb-4"
          />
          <button
            onClick={enviarPuntaje}
            disabled={!nombreJugador}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 font-semibold mb-6"
          >
            Guardar puntaje
          </button>

          <h3 className="text-xl font-bold mb-2 text-center">🏅 Ranking Top 10</h3>
          <ul className="bg-gray-100 rounded p-4">
            {ranking.map((r, i) => (
              <li key={r._id} className="flex justify-between py-1 px-2 border-b">
                <span>{i + 1}. {r.nombre}</span>
                <span>{r.puntaje} pts</span>
              </li>
            ))}
            </ul>

          <button
            onClick={() => {
              setPuntaje(0);
              setVidas(3);
              setJuegoTerminado(false);
              setRanking([]);
              generarNuevaPregunta();
            }}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
          >
            🔁 Volver a jugar
          </button>
        </div>
      )}
    </div>
  );
}

