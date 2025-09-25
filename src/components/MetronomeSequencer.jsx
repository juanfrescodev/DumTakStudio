// src/components/MetronomeSequencer.jsx
import React, { useEffect, useRef, useState } from "react";

export default function MetronomeSequencer({ steps = [], initialBpm = 90, beatsPerBar = 4 }) {
  const [bpm, setBpm] = useState(initialBpm);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [audioReady, setAudioReady] = useState(false);

  const audioCtxRef = useRef(null);
  const samplesRef = useRef({});
  const nextNoteTimeRef = useRef(0);
  const currentStepRef = useRef(0);
  const startTimeRef = useRef(0);
  const schedulerTimerRef = useRef(null);
  const visualTimerRef = useRef(null);

  const stepsPerBeat = steps.length / beatsPerBar;
  const secondsPerStep = () => (60 / bpm) / stepsPerBeat;

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

    loadAll();
  }, [steps]);

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

  return (
    <div className="w-full bg-white rounded-xl shadow p-4 mt-4">
      <p className="text-sm text-gray-700 mb-3 font-medium">
        Compás: {beatsPerBar}/4 — {steps.length} semicorcheas
      </p>

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

      {/* Carrusel horizontal de pasos */}
      <div className="w-full overflow-x-auto">
        <div className="flex gap-2 whitespace-nowrap px-1 py-2">
          {steps.map((s, i) => {
            const isActive = i === currentStep;
            const isBeatStart = i % stepsPerBeat === 0;

            return (
              <div
                key={i}
                className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-150
                  ${isActive ? "scale-110 ring-4 ring-yellow-300 brightness-125 animate-pulse" : "opacity-70 hover:opacity-100"}
                  ${isBeatStart ? "border-l-2 border-gray-400 pl-1" : ""}`}
              >
                <img
                  src={s.img}
                  alt={`step-${i}`}
                  className="w-6 h-6 object-contain max-w-full max-h-full"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
