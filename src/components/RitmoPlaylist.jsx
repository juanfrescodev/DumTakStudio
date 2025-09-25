import { useState, useEffect, useRef } from "react";
import ritmosData from "../data/ritmos.json";

export default function RitmoPlaylist({ playlist, initialBpm = 90 }) {
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [bpm, setBpm] = useState(initialBpm);

  const audioCtxRef = useRef(null);
  const samplesRef = useRef({});
  const stopFlagRef = useRef(false);
  const nextStartTimeRef = useRef(0);

  const colorMap = {
    maksum: "bg-red-500",
    malfuf: "bg-blue-500",
    baladi: "bg-green-500",
    saidi: "bg-purple-500",
    samai: "bg-teal-500",
    default: "bg-gray-500",
  };

  const base = import.meta.env.BASE_URL;

  const blocks = playlist.map(({ id, bars }) => {
    const ritmo = ritmosData.find((r) => r.id === id);
    if (!ritmo || !ritmo.steps) return null;

    const stepsConRutaCompleta = ritmo.steps.map((s) => ({
      ...s,
      sound: `${base}ritmos/${s.sound}`,
      img: `${base}ritmos/${s.img}`,
    }));

    return { ...ritmo, steps: stepsConRutaCompleta, bars, id };
  }).filter(Boolean);

  useEffect(() => {
    const loadSamples = async () => {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ctx;

      const allSteps = blocks.flatMap(b => b.steps);
      await Promise.all(
        allSteps.map(async (s) => {
          if (s.sound && !samplesRef.current[s.sound]) {
            try {
              const res = await fetch(s.sound);
              const buf = await res.arrayBuffer();
              const audioBuf = await ctx.decodeAudioData(buf);
              samplesRef.current[s.sound] = audioBuf;
            } catch (err) {
              console.warn("Error cargando sonido:", s.sound, err);
            }
          }
        })
      );

      setAudioReady(true);
    };

    loadSamples();
  }, [playlist]);

  const playStep = (step, time) => {
    const buffer = samplesRef.current[step?.sound];
    if (buffer && audioCtxRef.current) {
      const source = audioCtxRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtxRef.current.destination);
      source.start(time);
    }
  };

  const playBlock = (block) => {
    const ctx = audioCtxRef.current;
    const stepsPerBeat = block.steps.length / block.beatsPerBar;
    const stepDuration = (60 / bpm) / stepsPerBeat;

    for (let bar = 0; bar < block.bars; bar++) {
      for (let i = 0; i < block.steps.length; i++) {
        const time = nextStartTimeRef.current;
        playStep(block.steps[i], time);
        nextStartTimeRef.current += stepDuration;
      }
    }

    const totalTime = block.bars * block.steps.length * stepDuration;
    return totalTime;
  };

  const startSequence = async () => {
    if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    await audioCtxRef.current.resume().catch(() => {});
    stopFlagRef.current = false;
    setIsPlaying(true);
    nextStartTimeRef.current = audioCtxRef.current.currentTime;

    let index = 0;
    while (!stopFlagRef.current) {
      setCurrentBlockIndex(index);
      const blockDuration = playBlock(blocks[index]);
      await new Promise(resolve => setTimeout(resolve, blockDuration * 1000));
      index = (index + 1) % blocks.length;
    }
  };

  const stopSequence = () => {
    stopFlagRef.current = true;
    setIsPlaying(false);
    setCurrentBlockIndex(0);
  };

  return (
    <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 tracking-wide">
        🔁 Secuencia personalizada
      </h2>

      <div className="flex items-center gap-4 mb-6">
        <label className="font-medium text-gray-700">🎚️ BPM</label>
        <input
          type="range"
          min="40"
          max="200"
          value={bpm}
          onChange={(e) => setBpm(Number(e.target.value))}
          className="w-48 accent-orange-500"
        />
        <span className="ml-2 text-lg font-semibold text-gray-800">{bpm}</span>
      </div>

      <div className="flex gap-4 overflow-x-auto mb-6 pb-2">
        {blocks.map((b, i) => {
          const isActive = i === currentBlockIndex;
          const color = colorMap[b.id] || colorMap.default;

          return (
            <div
              key={i}
              className={`flex-shrink-0 px-6 py-4 rounded-xl shadow-lg text-white font-bold text-lg transition-all duration-300
                ${color} ${isActive ? "scale-105 ring-4 ring-yellow-300 animate-pulse" : "opacity-80 hover:opacity-100"}`}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎵</span>
                <span>{b.nombre}</span>
              </div>
              <p className="text-sm mt-1">x{b.bars} compases</p>
            </div>
          );
        })}
      </div>

      <button
        disabled={!audioReady}
        className={`px-6 py-3 rounded-xl font-bold text-white text-lg transition-all duration-200
          ${isPlaying ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
          ${!audioReady ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={() => (isPlaying ? stopSequence() : startSequence())}
      >
        {isPlaying ? "Detener" : "▶️ Reproducir"}
      </button>
    </div>
  );
}
