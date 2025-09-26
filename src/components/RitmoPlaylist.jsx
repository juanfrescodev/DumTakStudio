import { useState, useEffect, useRef } from "react";
import ritmosData from "../data/ritmos.json";

export default function RitmoPlaylist({ playlist, initialBpm = 90 }) {
  const [editablePlaylist, setEditablePlaylist] = useState(playlist);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [bpm, setBpm] = useState(initialBpm);

  const audioCtxRef = useRef(null);
  const samplesRef = useRef({});
  const scheduledEventsRef = useRef([]);
  const visualTimerRef = useRef(null);
  const sequenceStartTimeRef = useRef(0);
  const totalDurationRef = useRef(0);
  const isPlayingRef = useRef(false);

  const colorMap = {
    maksum: "bg-red-500",
    malfuf: "bg-blue-500",
    baladi: "bg-green-500",
    saidi: "bg-purple-500",
    samai: "bg-teal-500",
    default: "bg-gray-500",
  };

  const base = import.meta.env.BASE_URL;

  useEffect(() => {
    setEditablePlaylist(playlist);
  }, [playlist]);

  const blocks = editablePlaylist.map(({ id, bars }) => {
    const ritmo = ritmosData.find((r) => r.id === id);
    if (!ritmo || !ritmo.steps) return null;

    const stepsConRutaCompleta = ritmo.steps.map((s) => ({
      ...s,
      sound: s.sound ? `${base}ritmos/${s.sound}` : null,
      img: s.img ? `${base}ritmos/${s.img}` : null,
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
  }, [blocks]);

  const playStep = (step, time) => {
    const buffer = samplesRef.current[step?.sound];
    if (buffer && audioCtxRef.current) {
      const source = audioCtxRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtxRef.current.destination);
      source.start(time);
      scheduledEventsRef.current.push(source);
    }
  };

  const scheduleSequence = () => {
    const ctx = audioCtxRef.current;
    const startTime = ctx.currentTime;
    sequenceStartTimeRef.current = startTime;
    scheduledEventsRef.current = [];

    let blockStart = startTime;
    blocks.forEach((block) => {
      const stepsPerBeat = block.steps.length / block.beatsPerBar;
      const stepDuration = (60 / bpm) / stepsPerBeat;

      for (let bar = 0; bar < block.bars; bar++) {
        for (let i = 0; i < block.steps.length; i++) {
          const time = blockStart + (bar * block.steps.length + i) * stepDuration;
          playStep(block.steps[i], time);
        }
      }

      const blockDuration = block.bars * block.steps.length * stepDuration;
      blockStart += blockDuration;
    });

    totalDurationRef.current = blockStart - startTime;

    if (visualTimerRef.current) cancelAnimationFrame(visualTimerRef.current);
    const syncVisual = () => {
      if (!isPlayingRef.current) return;
      const now = ctx.currentTime;
      const elapsed = now - sequenceStartTimeRef.current;
      let acc = 0;
      for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        const stepsPerBeat = block.steps.length / block.beatsPerBar;
        const stepDuration = (60 / bpm) / stepsPerBeat;
        const blockDuration = block.bars * block.steps.length * stepDuration;
        if (elapsed < acc + blockDuration) {
          setCurrentBlockIndex(i);
          break;
        }
        acc += blockDuration;
      }
      visualTimerRef.current = requestAnimationFrame(syncVisual);
    };
    visualTimerRef.current = requestAnimationFrame(syncVisual);

    setTimeout(() => {
      if (!isPlayingRef.current) return;
      scheduleSequence();
    }, totalDurationRef.current * 1000);
  };

  const startSequence = async () => {
    if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    await audioCtxRef.current.resume().catch(() => {});
    isPlayingRef.current = true;
    setIsPlaying(true);
    scheduleSequence();
  };

  const stopSequence = () => {
    scheduledEventsRef.current.forEach(source => {
      try {
        source.stop();
      } catch {}
    });
    scheduledEventsRef.current = [];
    if (visualTimerRef.current) cancelAnimationFrame(visualTimerRef.current);
    isPlayingRef.current = false;
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

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => {
                    const updated = [...editablePlaylist];
                    updated.splice(i, 1);
                    setEditablePlaylist(updated);
                  }}
                  className="bg-white text-red-600 font-bold px-2 py-1 rounded hover:bg-red-100"
                >
                  ❌
                </button>
                <button
                  onClick={() => {
                    if (i === 0) return;
                    const updated = [...editablePlaylist];
                    [updated[i - 1], updated[i]] = [updated[i], updated[i - 1]];
                    setEditablePlaylist(updated);
                  }}
                  className="bg-white text-gray-800 font-bold px-2 py-1 rounded hover:bg-gray-100"
                >
                  ⬅️
                </button>
                <button
                  onClick={() => {
                    if (i === editablePlaylist.length - 1) return;
                    const updated = [...editablePlaylist];
                    [updated[i], updated[i + 1]] = [updated[i + 1], updated[i]];
                    setEditablePlaylist(updated);
                  }}
                  className="bg-white text-gray-800 font-bold px-2 py-1 rounded hover:bg-gray-100"
                >
                  ➡️
                </button>
              </div>
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