import React, { useState, useEffect } from "react";
import ritmosData from "../data/ritmos.json";

export default function RitmoBlock({
  ritmoId,
  bars,
  index,
  playlist,
  setPlaylist,
  visualSyncRef,
  audioCtxRef,
  userEvents = [],
}) {
  const [activeStep, setActiveStep] = useState(null);
  const ritmo = ritmosData.find((r) => r.id === ritmoId);
  const modo = playlist[index].modo || "base";
  const steps = playlist[index].steps || ritmo?.variantes?.[modo]?.steps || ritmo?.steps || [];

   useEffect(() => {
    let raf;

    const updateStep = () => {
      if (!visualSyncRef?.current || !audioCtxRef?.current) return;

      const { currentRitmoIndex, currentStep } = visualSyncRef.current;

      if (currentRitmoIndex === index) {
        setActiveStep(currentStep % steps.length);
      } else {
        setActiveStep(null);
      }

      raf = requestAnimationFrame(updateStep);
    };

    raf = requestAnimationFrame(updateStep);
    return () => cancelAnimationFrame(raf);
  }, [steps.length, index, visualSyncRef, audioCtxRef]);

  const handleChangeModo = (nuevoModo) => {
    const ritmo = ritmosData.find((r) => r.id === ritmoId);
    const newSteps = ritmo?.variantes?.[nuevoModo]?.steps ?? ritmo?.steps ?? [];

    const normalizedSteps = newSteps.map((s) => {
      if (!s.sound) return s;
      const clean = s.sound.startsWith("/") ? s.sound.slice(1) : s.sound;
      return { ...s, sound: `ritmos/${clean}` };
    });

    const updated = [...playlist];
    updated[index] = {
      ...updated[index],
      modo: nuevoModo,
      steps: normalizedSteps,
    };
    setPlaylist(updated);
  };

  const handleEliminar = () => {
    const updated = [...playlist];
    updated.splice(index, 1);
    setPlaylist(updated);
  };

  const handleMoverIzquierda = () => {
    if (index === 0) return;
    const updated = [...playlist];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setPlaylist(updated);
  };

  const handleMoverDerecha = () => {
    if (index === playlist.length - 1) return;
    const updated = [...playlist];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setPlaylist(updated);
  };

  const colorMap = {
    maksum: "bg-red-500",
    malfuf: "bg-blue-500",
    baladi: "bg-green-500",
    saidi: "bg-purple-500",
    samai: "bg-teal-500",
    default: "bg-gray-500",
  };
  const color = colorMap[ritmoId] || colorMap.default;

  const getColorByGolpe = (tipo) => {
    switch (tipo) {
      case "dum": return "bg-red-500";
      case "tak": return "bg-green-500";
      case "tek": return "bg-orange-500";
      default: return "bg-gray-300";
    }
  };



  return (
    <div
      className={`px-6 py-4 rounded-xl shadow-lg text-white font-bold text-lg transition-all duration-300 ${color}`}
    >
      <span className="block mb-1 text-sm opacity-80">🎵 Ritmo</span>
      <span className="block">{ritmo?.nombre || ritmoId}</span>
      <span className="block text-sm font-normal">x{bars} compases</span>

      {steps.length > 0 && (
        <div className="mt-4 grid grid-cols-8 gap-1 relative">
          {steps.map((step, i) => {
            const isActive = i === activeStep;
            const hasSound = !!step.sound;

            const golpesEnPaso = userEvents.filter((e) => e.step === i);
            const golpeVisual = golpesEnPaso.length > 0 ? golpesEnPaso[golpesEnPaso.length - 1] : null;

            return (
              <div
                key={i}
                className={`relative w-6 h-6 rounded flex items-center justify-center text-xs font-bold
                  ${hasSound ? getColorByGolpe(step.tipoGolpe) + " text-white" : "bg-gray-300 text-gray-500"}
                  ${isActive ? "ring-2 ring-black scale-110" : ""}
                  transition-all duration-150`}
                title={step.tipoGolpe || step.sound?.replace(".mp3", "") || "Silencio"}
              >
                {hasSound ? "●" : ""}
                {golpeVisual && (
                  <div
                    className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border border-white ${getPrecisionColor(golpeVisual.precision)}`}
                    title={`Golpe: ${golpeVisual.tipoGolpe} (${golpeVisual.precision})`}
                  ></div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {ritmo?.variantes && (
        <div className="mt-2 flex items-center gap-2">
          <label className="text-xs font-normal">🎼 Variante:</label>
          <select
            value={modo}
            onChange={(e) => handleChangeModo(e.target.value)}
            className="text-sm px-2 py-1 rounded bg-white text-gray-800"
          >
            {Object.keys(ritmo.variantes).map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <button
          onClick={handleEliminar}
          className="bg-white text-red-600 font-bold px-2 py-1 rounded hover:bg-red-100 text-sm"
          title="Eliminar ritmo de la secuencia"
        >
          ❌
        </button>
        <button
          onClick={handleMoverIzquierda}
          className="bg-white text-gray-800 font-bold px-2 py-1 rounded hover:bg-gray-100 text-sm"
          title="Mover hacia la izquierda"
        >
          ⬅️
        </button>
        <button
          onClick={handleMoverDerecha}
          className="bg-white text-gray-800 font-bold px-2 py-1 rounded hover:bg-gray-100 text-sm"
          title="Mover hacia la derecha"
        >
          ➡️
        </button>
      </div>

      {/* 🧠 Leyenda visual didáctica */}
      <div className="mt-4 text-sm font-normal bg-white text-gray-800 p-2 rounded">
        <p className="mb-1 font-semibold">🎨 Leyenda de golpes:</p>
        <div className="flex gap-2 items-center flex-wrap">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-red-500"></div> <span>Dum</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-green-500"></div> <span>Tak</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-orange-500"></div> <span>Tek</span>
          </div>
        </div>
      </div>
    </div>
  );

}
