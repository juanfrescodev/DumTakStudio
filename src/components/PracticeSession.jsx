import React, { useState, useEffect, useRef } from "react";
import RitmoBlock from "./RitmoBlock";
import { MetronomeControls } from "./MetronomeControls";
import useAudioEngine from "../hooks/useAudioEngine";
import ritmos from "../data/ritmos.json";

export default function PracticeSession({ ritmoId, initialBpm = 90 }) {
  const countingRef = useRef(false);
  const [playlist, setPlaylist] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [stepFeedback, setStepFeedback] = useState([]);
  const [popupFeedback, setPopupFeedback] = useState(null);
  const [counting, setCounting] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [bpm, setBpm] = useState(initialBpm);
  const [metronomoOn, setMetronomoOn] = useState(true);
  const [metronomoVolume, setMetronomoVolume] = useState(1);
  const [masterVolume, setMasterVolumeState] = useState(1);
  const [countdownStep, setCountdownStep] = useState(null);
  const pasosEvaluadosRef = useRef(new Set());
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [nombreJugador, setNombreJugador] = useState("");
  const [puntajeEnviado, setPuntajeEnviado] = useState(false);
  const [puntajeGuardado, setPuntajeGuardado] = useState(false);
  const [popupPuntaje, setPopupPuntaje] = useState(null);


  
  const [ranking, setRanking] = useState([]);

  const obtenerRanking = async () => {
    try {
      const res = await fetch(`https://ritmos-backend.onrender.com/api/scores/top?ritmo=${ritmoId}&modo=practica`);
      const data = await res.json();
      setRanking(data);
    } catch (err) {
      console.error("Error al obtener ranking:", err);
    }
  };
  
  const {
    playSample,
    startSequence,
    stopSequence,
    isPlaying,
    isLoaded,
    visualSyncRef,
    audioCtxRef,
    setMasterVolume,
    setMetronomeVolume,
    setIsMuted,
    isMuted,
  } = useAudioEngine({ bpm, metronomoVolume, metronomoOn, playlist, sequenceVolume: masterVolume, isMuted: true });


  useEffect(() => {
    if (showFeedback && (puntajeGuardado || !nombreJugador)) {
      obtenerRanking();
    }
  }, [showFeedback, puntajeGuardado, nombreJugador]);


  useEffect(() => {
    const ritmo = ritmos.find((r) => r.id === ritmoId);
    const steps = ritmo?.variantes?.base?.steps || ritmo?.steps || [];

    const normalizedSteps = steps.map((s) => {
      if (!s.sound) return s;
      const clean = s.sound.startsWith("/") ? s.sound.slice(1) : s.sound;
      return { ...s, sound: `ritmos/${clean}` };
    });

    setPlaylist([{ id: ritmoId, bars: 1, modo: "base", steps: normalizedSteps }]);
    setUserEvents([]);
    setStepFeedback([]);
    setCanPlay(false);
    setShowFeedback(false);
    setCounting(false);
    setIsMuted(true);
  }, [ritmoId]);


  useEffect(() => {
    countingRef.current = counting;
  }, [counting]);


  useEffect(() => {
    const handleKey = (e) => {
      if (!canPlay || showFeedback) return;
      if (e.code === "Space") {
        e.preventDefault();
        handleGolpe("dum");
      } else if (e.code === "Enter") {
        e.preventDefault();
        handleGolpe("tak");
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [canPlay, showFeedback]);

  const handleStart = async () => {
    if (!audioCtxRef.current || !isLoaded) return;

    const ctx = audioCtxRef.current;
    const beatInterval = 60 / bpm;
    const startAt = ctx.currentTime + beatInterval * 4;

    setCounting(true);

    let count = 4;
    setCountdownStep(count);

    const countdownInterval = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdownStep(count);
      } else {
        setCountdownStep(null);
        clearInterval(countdownInterval);
        setCounting(false); // ✅ solo acá
      }
    }, (60 / bpm) * 1000); // sincronizado con el metrónomo

    setCanPlay(true);

    visualSyncRef.current.nextNoteTime = startAt;
    visualSyncRef.current.startTime = startAt;

    startSequence();
  };


  const handleGolpe = (tipoGolpe) => {
    if (countingRef.current) {
      setPopupFeedback({
        tipoGolpe,
        precision: "Todavía no comenzó",
        step: null,
        delta: null,
      });
      setTimeout(() => setPopupFeedback(null), 1200);
      return;
    }

    setIsMuted(false);

    const ctx = audioCtxRef.current;
    const golpeTime = ctx.currentTime;
    const startTime = visualSyncRef.current.startTime;
    const stepDuration = (60 / bpm) / 4;
    const stepIndex = Math.round((golpeTime - startTime) / stepDuration);
    const expectedTime = startTime + stepIndex * stepDuration;
    const delta = (golpeTime - expectedTime) * 1000;

    let precision = "perfecto";
    const msPerStep = stepDuration * 1000;

    // Zona perfecta: ±20% del paso, limitado entre 35 y 55 ms
    const perfectMargin = Math.max(35, Math.min(msPerStep * 0.2, 55));

    // Zona tolerada: ±35% del paso, limitado entre 60 y 90 ms
    const tolerance = Math.max(60, Math.min(msPerStep * 0.35, 90));
    if (golpeTime < visualSyncRef.current.startTime) {
      setPopupFeedback({
        tipoGolpe,
        precision: "demasiado temprano",
        step: null,
        delta: null,
      });
      setTimeout(() => setPopupFeedback(null), 1200);
      return;
    }

    if (Math.abs(delta) > tolerance) {
      precision = "fuera de rango";
    } else if (Math.abs(delta) <= perfectMargin) {
      precision = "perfecto";
    } else if (delta < 0) {
      precision = "adelantado";
    } else {
      precision = "atrasado";
    }

    let puntos = 0;
    let nuevaRacha = streak;

    switch (precision) {
      case "perfecto":
        puntos = 10;
        nuevaRacha += 1;
        break;
      case "adelantado":
      case "atrasado":
        puntos = 5;
        nuevaRacha = 0;
        break;
      case "fuera de rango":
        puntos = -5;
        nuevaRacha = 0;
        break;
      default:
        puntos = 0;
        nuevaRacha = 0;
    }


    setPoints((prev) => prev + puntos);
    setPopupPuntaje({
      puntos,
      step: stepIndex
    });

    setTimeout(() => setPopupPuntaje(null), 1000);
    setStreak(nuevaRacha);
    setMaxStreak((prev) => Math.max(prev, nuevaRacha));



    const golpeData = { time: golpeTime, tipoGolpe, step: stepIndex, delta, precision };
    setUserEvents((prev) => [...prev, golpeData]);
    setStepFeedback((prev) => [...prev, golpeData]);
    playSample(`ritmos/${tipoGolpe}.mp3`);

    setPopupFeedback(golpeData);
    setTimeout(() => setPopupFeedback(null), 1200);
    pasosEvaluadosRef.current.add(stepIndex);
  };

  const enviarPuntajePractica = async (nombre) => {
    if (puntajeEnviado) return;

    try {
      const res = await fetch("https://ritmos-backend.onrender.com/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          puntaje: points,
          ritmo: ritmoId,
          modo: "practica"
        })
      });

      if (res.ok) {
        console.log("✅ Puntaje guardado con éxito!");
        setPuntajeEnviado(true);
        setPuntajeGuardado(true);
      } else {
        const error = await res.json();
        console.error("❌ Error al guardar puntaje:", error);
      }
    } catch (err) {
      console.error("❌ Error de red:", err);
    }
  };

  const handleFinalizar = () => {
    if (puntajeEnviado) return;

    stopSequence();
    setShowFeedback(true); // 🔍 esto activa el análisis y ranking

    let nombreFinal = nombreJugador;

    if (!nombreFinal || nombreFinal.trim() === "") {
      const nombre = prompt("Ingresá tu nombre para guardar tu puntaje:");
      if (!nombre || nombre.trim() === "") return; // no se guarda, pero sí se muestra el ranking
      nombreFinal = nombre.trim();
      setNombreJugador(nombreFinal);
    }

    enviarPuntajePractica(nombreFinal); // solo si hay nombre
  };



  const handleRetry = () => {
    setUserEvents([]);
    setStepFeedback([]);
    setPopupFeedback(null);
    setCounting(false);
    setCanPlay(false);
    setShowFeedback(false);
    setIsMuted(true);
    setPuntajeEnviado(false);
  };

  const getColor = (precision) => {
    switch (precision) {
      case "perfecto": return "bg-green-600";
      case "adelantado": return "bg-yellow-500";
      case "atrasado": return "bg-orange-500";
      case "fuera de rango": return "bg-red-600";
      case "esperá la cuenta": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const stepsPerLoop = playlist[0]?.steps?.length || 16;

  const analyzeFeedback = () => {
    const expectedSteps = playlist[0]?.steps || [];
    const stepsPerLoop = expectedSteps.length;

    const total = stepFeedback.length;
    const correct = stepFeedback.filter((f) => f.precision === "perfecto").length;
    const adelantados = stepFeedback.filter((f) => f.precision === "adelantado").length;
    const atrasados = stepFeedback.filter((f) => f.precision === "atrasado").length;

    const tendencia =
      adelantados > atrasados ? "Tendencia a adelantarse" :
      atrasados > adelantados ? "Tendencia a atrasarse" :
      "Sin tendencia clara";

    const erroresPorGolpe = {};
    stepFeedback.forEach((f) => {
      if (f.precision !== "perfecto") {
        erroresPorGolpe[f.tipoGolpe] = (erroresPorGolpe[f.tipoGolpe] || 0) + 1;
      }
    });

    return {
      total,
      correct,
      adelantados,
      atrasados,
      tendencia,
      erroresPorGolpe,
    };
  };

  const stats = analyzeFeedback();
  
  const calcularNotaFinal = () => {
    if (stats.total === 0) return 0;
    const correctRatio = stats.correct / stats.total;
    return Math.max(1, Math.round(correctRatio * 10));
  };


  const sugerencias = [];
  if (stats.erroresPorGolpe["dum"] >= 3) sugerencias.push("🟥 Practicá golpes Dum con metrónomo lento.");
  if (stats.erroresPorGolpe["tak"] >= 3) sugerencias.push("🟩 Reforzá la precisión de los Tak en compases rápidos.");
  if (stats.tendencia.includes("adelantarse")) sugerencias.push("⏱️ Entrená con BPM más bajo para controlar la ansiedad rítmica.");
  if (stats.tendencia.includes("atrasarse")) sugerencias.push("🎯 Usá ejercicios de anticipación para mejorar tu reacción.");

return (
  <div className="practice-session p-6 bg-white rounded-xl shadow-lg relative">
    <h2 className="text-2xl font-bold mb-6 text-purple-700">🎯 Práctica asistida</h2>

    <MetronomeControls
      metronomoOn={metronomoOn}
      setMetronomoOn={setMetronomoOn}
      metronomoVolume={metronomoVolume}
      setMetronomeVolume={setMetronomeVolume}
      isMetronomoPlaying={isPlaying}
    />

    <div className="flex items-center gap-4 mb-6">
      <label className="font-medium">🎚️ Ajustá el tempo (BPM):</label>
      <input
        type="range"
        min="40"
        max="200"
        value={bpm}
        onChange={(e) => setBpm(Number(e.target.value))}
        className="w-48 accent-orange-500"
      />
      <span className="font-mono text-lg">{bpm}</span>
    </div>

    {playlist.length > 0 && (
      <RitmoBlock
        ritmoId={ritmoId}
        bars={1}
        index={0}
        playlist={playlist}
        setPlaylist={setPlaylist}
        visualSyncRef={visualSyncRef}
        audioCtxRef={audioCtxRef}
        userEvents={userEvents}
      />
    )}

    {!canPlay && !counting && (
      <button
        onClick={handleStart}
        className="bg-green-600 text-white font-bold py-2 px-4 rounded-full hover:bg-green-700"
      >
        ▶️ Iniciar práctica — Escuchá el conteo y preparate para tocar
      </button>
    )}

    {counting && (
      <p className="text-lg text-gray-700 mt-4 font-medium">
        🎵 Cuenta regresiva: escuchá 4 pulsos antes de comenzar...
      </p>
    )}

    {countdownStep && (
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        <div className="bg-white border-4 border-orange-500 rounded-full px-8 py-6 shadow-xl text-6xl font-extrabold text-orange-600 animate-pulse">
          {countdownStep}
        </div>
      </div>
    )}

    {canPlay && !showFeedback && (
      <>
        <div className="flex justify-center gap-4 mt-4">
          <div className="flex justify-center gap-6 mt-4 text-sm font-semibold text-gray-700">
            <div>⭐ Puntos: {points}</div>
            <div>🔥 Racha: {streak}</div>
            <div>🏆 Máxima: {maxStreak}</div>
          </div>

          {popupPuntaje && (
            <div
              className="popup-puntaje"
              style={{
                position: "absolute",
                top: "40%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: "2rem",
                fontWeight: "bold",
                color: popupPuntaje.puntos > 0 ? "limegreen" : "crimson",
                background: "rgba(0,0,0,0.6)",
                padding: "0.5em 1em",
                borderRadius: "8px",
                pointerEvents: "none"
              }}
            >
              {popupPuntaje.puntos > 0 ? `+${popupPuntaje.puntos}` : `${popupPuntaje.puntos}`}
            </div>
          )}


          <button
            onClick={() => handleGolpe("dum")}
            className="bg-red-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-red-600"
          >
            🟥 Dum (espacio) — Golpe grave
          </button>
          <button
            onClick={() => handleGolpe("tak")}
            className="bg-green-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-green-600"
          >
            🟩 Tak (enter) — Golpe agudo
          </button>
        </div>

        <button
          onClick={handleFinalizar}
          className="mt-6 bg-purple-600 text-white font-bold py-2 px-4 rounded-full hover:bg-purple-700"
        >
          🛑 Terminar práctica
        </button>
      </>
    )}

    {popupFeedback && (
      <div className={`fixed top-8 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full text-white font-bold shadow-lg z-50 ${getColor(popupFeedback.precision)}`}>
        {popupFeedback.tipoGolpe.toUpperCase()} – {popupFeedback.precision}
      </div>
    )}

  {showFeedback && (
    <>
      <div className="mt-6 bg-white p-6 rounded-xl shadow-xl border border-gray-200">
        <h3 className="text-2xl font-bold mb-4 text-purple-700">🧠 Análisis de tu práctica</h3>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-800">
          <div className="bg-green-100 p-4 rounded-lg shadow-sm">
            <p className="font-semibold text-green-700">✅ Golpes correctos</p>
            <p>{stats.correct} de {stats.total} ({Math.round((stats.correct / stats.total) * 100)}%)</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg shadow-sm">
            <p className="font-semibold text-yellow-700">📊 Tendencia</p>
            <p>{stats.tendencia}</p>
          </div>
        </div>

        <div className="mt-6 bg-blue-100 p-4 rounded-lg shadow-sm">
          <p className="font-semibold text-blue-700">📈 Nota final</p>
          <p className="text-xl font-bold text-blue-800">{calcularNotaFinal()} / 10</p>
        </div>

        {sugerencias.length > 0 && (
          <div className="mt-6">
            <h4 className="text-md font-semibold mb-2 text-orange-600">🧭 Sugerencias para mejorar</h4>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {sugerencias.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}

        {Object.keys(stats.erroresPorGolpe).length > 0 && (
          <div className="mt-6">
            <h4 className="text-md font-semibold mb-2 text-red-600">🎯 Golpes más fallados</h4>
            <table className="w-full text-sm text-left border border-gray-300 rounded overflow-hidden">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="px-4 py-2">Tipo</th>
                  <th className="px-4 py-2">Errores</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(stats.erroresPorGolpe).map(([tipo, count]) => (
                  <tr key={tipo} className="border-t">
                    <td className="px-4 py-2 font-bold">{tipo.toUpperCase()}</td>
                    <td className="px-4 py-2">{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <h4 className="text-md font-semibold mt-6 mb-2 text-gray-700">📋 Detalle paso a paso</h4>
        <ul className="text-sm space-y-1">
          {stepFeedback.map((f, i) => {
            const relativeStep = (f.step % stepsPerLoop) + 1;
            const ciclo = Math.floor(f.step / stepsPerLoop) + 1;
            const color = getColor(f.precision);
            return (
              <li key={i} className={`px-2 py-1 rounded ${color} text-white`}>
                Compás {ciclo}, paso {relativeStep}: {f.tipoGolpe} – {f.precision} {f.delta !== null ? `(${Math.round(f.delta)}ms)` : ""}
              </li>
            );
          })}
        </ul>

        <button
          onClick={handleRetry}
          className="mt-6 bg-blue-600 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-700 shadow-lg"
        >
          🔁 Volver a intentar — Repetí la práctica y mejorá tu precisión
        </button>
      </div>

      {ranking.length > 0 && (
        <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow-sm">
          <h4 className="text-md font-semibold mb-2 text-gray-700">🏆 Ranking de {ritmoId}</h4>
          <table className="w-full text-sm text-left border border-gray-300 rounded overflow-hidden">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="px-4 py-2">Jugador</th>
                <th className="px-4 py-2">Puntos</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((r, i) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-2 font-bold">{r.nombre}</td>
                  <td className="px-4 py-2">{r.puntaje}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
  </>
)}
</div>
);
}