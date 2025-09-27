import React, { useEffect, useRef, useState } from "react";

export default function MetronomeSequencer({ ritmo, variante = "base", initialBpm = 90 }) {
  const [bpm, setBpm] = useState(initialBpm);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [audioReady, setAudioReady] = useState(false);
  const [stepSize, setStepSize] = useState(40);
  const [modoVisual, setModoVisual] = useState("secuencial");
  const hasStartedRef = useRef(false);

  const audioCtxRef = useRef(null);
  const samplesRef = useRef({});
  const nextNoteTimeRef = useRef(0);
  const currentStepRef = useRef(0);
  const startTimeRef = useRef(0);
  const schedulerTimerRef = useRef(null);
  const visualTimerRef = useRef(null);
  const visualContainerRef = useRef(null);
  const stepRefs = useRef([]);

  const varianteData = ritmo?.variantes?.[variante];
  const steps = varianteData?.steps || [];
  const beatsPerBar = ritmo?.beatsPerBar || 4;
  const audioSrc = varianteData?.audio || null;

  const stepsPerBeat = steps.length / beatsPerBar;
  const secondsPerStep = () => (60 / bpm) / stepsPerBeat;

  useEffect(() => {
    hasStartedRef.current = true;
  }, []);

  useEffect(() => {
    const loadAll = async () => {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ctx;

      await Promise.all(
        steps.map(async (s) => {
          if (s.sound && !samplesRef.current[s.sound]) {
            const response = await fetch(s.sound);
            const arrayBuffer = await response.arrayBuffer();
            const buffer = await ctx.decodeAudioData(arrayBuffer);
            samplesRef.current[s.sound] = buffer;
          }
        })
      );

      setAudioReady(true);
    };

    if (steps.length > 0) {
      loadAll();
    }
  }, [steps]);

  useEffect(() => {
    const calcularTamaño = () => {
      if (visualContainerRef.current) {
        const anchoDisponible = visualContainerRef.current.offsetWidth;
        const pasosPorFila = modoVisual === "metrico"
          ? beatsPerBar
          : Math.min(steps.length, 16);
        const nuevoTamaño = Math.floor(anchoDisponible / pasosPorFila) - 4;
        setStepSize(Math.max(24, Math.min(nuevoTamaño, 60)));
      }
    };

    calcularTamaño();
    window.addEventListener("resize", calcularTamaño);
    return () => window.removeEventListener("resize", calcularTamaño);
  }, [steps.length, modoVisual, beatsPerBar]);

  useEffect(() => {
    if (!isPlaying) return;
    if (modoVisual === "secuencial" && stepRefs.current[currentStep]) {
      stepRefs.current[currentStep].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [currentStep, modoVisual, isPlaying]);

  const playStepSound = (step, time) => {
    const buffer = samplesRef.current[step?.sound];
    if (buffer && audioCtxRef.current) {
      const source = audioCtxRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtxRef.current.destination);
      source.start(time);
    }
  };

  const scheduleStep = (stepNumber, time) => {
    const stepIndex = stepNumber % steps.length;
    if (steps[stepIndex]?.sound) {
      playStepSound(steps[stepIndex], time);
    }
  };

  const scheduler = () => {
    const ctx = audioCtxRef.current;
    while (nextNoteTimeRef.current < ctx.currentTime + 0.1) {
      scheduleStep(currentStepRef.current, nextNoteTimeRef.current);
      currentStepRef.current++;
      nextNoteTimeRef.current += secondsPerStep();
    }
    schedulerTimerRef.current = requestAnimationFrame(scheduler);
  };

  const updateVisualStep = () => {
    const now = audioCtxRef.current.currentTime;
    const elapsed = now - startTimeRef.current;
    const step = Math.floor(elapsed / secondsPerStep());
    setCurrentStep(step % steps.length);
    visualTimerRef.current = requestAnimationFrame(updateVisualStep);
  };

  const start = async () => {
    if (!audioCtxRef.current)
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    await audioCtxRef.current.resume().catch(() => {});
    if (isPlaying || !audioReady) return;

    setIsPlaying(true);
    currentStepRef.current = 0;
    nextNoteTimeRef.current = audioCtxRef.current.currentTime;
    startTimeRef.current = audioCtxRef.current.currentTime;

    scheduler();
    updateVisualStep();
  };

  const stop = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    if (schedulerTimerRef.current) cancelAnimationFrame(schedulerTimerRef.current);
    if (visualTimerRef.current) cancelAnimationFrame(visualTimerRef.current);
  };

  useEffect(() => {
    if (isPlaying) {
      stop();
      start();
    }
  }, [bpm]);

  useEffect(() => {
    return () => {
      stop();
      if (audioCtxRef.current) audioCtxRef.current.close().catch(() => {});
    };
  }, []);

  const compases = [];
  for (let i = 0; i < steps.length; i += beatsPerBar) {
    compases.push(steps.slice(i, i + beatsPerBar));
  }

  return (
    <div className="w-full bg-white rounded-xl shadow p-4 mt-4">
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm text-gray-700 font-medium">
          {ritmo?.nombre} — Variante: <strong>{variante}</strong> — {beatsPerBar}/4 — {steps.length} semicorcheas
        </p>
        <button
          onClick={() =>
            setModoVisual(modoVisual === "secuencial" ? "metrico" : "secuencial")
          }
          className="text-xs font-semibold text-blue-600 hover:underline"
        >
          Cambiar a {modoVisual === "secuencial" ? "📐 Métrico" : "🔁 Secuencial"}
        </button>
      </div>

      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <button
          disabled={!audioReady}
          className={`px-4 py-2 rounded-lg font-semibold text-white text-sm transition-all duration-200
            ${isPlaying ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
            ${!audioReady ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => (isPlaying ? stop() : start())}
        >
          {isPlaying ? "Detener" : "▶️ Play"}
        </button>

        <div className="flex items-center gap-2">
          <label className="text-gray-700 font-medium">BPM</label>
          <input
            type="range"
            min="40"
            max="200"
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="w-40"
          />
          <span className="ml-2 w-12 text-right font-semibold text-gray-800">{bpm}</span>
        </div>
      </div>

      {modoVisual === "secuencial" ? (
        <div
          ref={visualContainerRef}
          className="w-full max-w-screen-lg px-4 mx-auto py-2 flex gap-2 justify-start overflow-x-auto"
        >
          {steps.map((s, i) => {
            const isActive = i === currentStep;
            const isPulseStart = i % 4 === 0;

            return (
              <div
                key={i}
                ref={(el) => (stepRefs.current[i] = el)}
                style={{ width: stepSize, height: stepSize }}
                className={`flex-shrink-0 rounded-lg flex items-center justify-center transition-all duration-150
                ${isActive ? "scale-110 ring-4 ring-yellow-300 brightness-125 animate-pulse" : "opacity-70 hover:opacity-100"}
                  ${isPulseStart ? "border-l-2 border-gray-400 pl-1" : ""}
                `}
              >
                {s.img ? (
                  <img
                    src={s.img}
                    alt={`step-${i}`}
                    style={{ width: stepSize * 0.6, height: stepSize * 0.6 }}
                    className="object-contain max-w-full max-h-full"
                  />
                ) : (
                  <div
                    style={{ width: stepSize * 0.6, height: stepSize * 0.6 }}
                    className="bg-gray-200 rounded-full"
                  />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div
          ref={visualContainerRef}
          className="w-full px-2 md:px-6 lg:px-12 py-2 flex flex-wrap gap-4 justify-start overflow-x-auto"
        >
          {compases.map((compas, i) => (
            <div
              key={i}
              className="flex gap-2 p-2 rounded-lg border border-gray-300 bg-gray-50"
            >
              {compas.map((s, j) => {
                const stepIndex = i * beatsPerBar + j;
                const isActive = stepIndex === currentStep;
                const isPulseStart = stepIndex % 4 === 0;

                return (
                  <div
                    key={j}
                    style={{ width: stepSize, height: stepSize }}
                    className={`flex-shrink-0 rounded-lg flex items-center justify-center transition-all duration-150
                      ${isActive ? "scale-110 ring-4 ring-yellow-300 brightness-125 animate-pulse" : "opacity-70 hover:opacity-100"}
                      ${isPulseStart ? "border-l-2 border-gray-400 pl-1" : ""}
                    `}
                  >
                    {s.img ? (
                      <img
                        src={s.img}
                        alt={`step-${stepIndex}`}
                        style={{ width: stepSize * 0.6, height: stepSize * 0.6 }}
                        className="object-contain max-w-full max-h-full"
                      />
                    ) : (
                      <div
                        style={{ width: stepSize * 0.6, height: stepSize * 0.6 }}
                        className="bg-gray-200 rounded-full"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
