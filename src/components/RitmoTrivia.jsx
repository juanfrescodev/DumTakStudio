// src/components/RitmoTriviaSteps.jsx
import { useState, useEffect, useRef } from "react";
import ritmosData from "../data/ritmos.json";

export default function RitmoTriviaSteps() {
  const [currentRitmo, setCurrentRitmo] = useState(null);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [audioReady, setAudioReady] = useState(false);

  const audioCtxRef = useRef(null);
  const samplesRef = useRef({});

  useEffect(() => {
    const loadSamples = async () => {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ctx;

      const allSteps = ritmosData.flatMap((r) => r.steps || []);
      await Promise.all(
        allSteps.map(async (s) => {
          if (s.sound && !samplesRef.current[s.sound]) {
            const res = await fetch(s.sound);
            const buf = await res.arrayBuffer();
            const audioBuf = await ctx.decodeAudioData(buf);
            samplesRef.current[s.sound] = audioBuf;
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
    const ritmosConSteps = ritmosData.filter((r) => r.steps);
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
    } else {
      setFeedback(`❌ Incorrecto. Era: ${currentRitmo.nombre}`);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-xl w-full mt-10">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">🎧 ¿Qué ritmo estás escuchando?</h2>

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
    </div>
  );
}
