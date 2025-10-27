import { useEffect } from "react";

export default function ReadingInput({ bpm, visualSyncRef, audioCtxRef, onHit }) {
  useEffect(() => {
    const handleKey = (e) => {
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
  }, []);

  const handleGolpe = (tipoGolpe) => {
    const ctx = audioCtxRef.current;
    if (!ctx || !visualSyncRef.current) return;

    const golpeTime = ctx.currentTime;
    const startTime = visualSyncRef.current.startTime;
    const stepDuration = (60 / bpm) / 4;
    const stepIndex = Math.round((golpeTime - startTime) / stepDuration);
    const expectedTime = startTime + stepIndex * stepDuration;
    const delta = (golpeTime - expectedTime) * 1000;

    let precision = "perfecto";
    const msPerStep = stepDuration * 1000;
    const perfectMargin = Math.max(35, Math.min(msPerStep * 0.2, 55));
    const tolerance = Math.max(60, Math.min(msPerStep * 0.35, 90));

    if (Math.abs(delta) > tolerance) {
      precision = "fuera de rango";
    } else if (Math.abs(delta) <= perfectMargin) {
      precision = "perfecto";
    } else if (delta < 0) {
      precision = "adelantado";
    } else {
      precision = "atrasado";
    }

    onHit({ tipoGolpe, step: stepIndex, delta, precision });
  };

  return (
    <div className="flex justify-center gap-4 mt-6">
      <button
        onClick={() => handleGolpe("dum")}
        className="bg-red-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-red-600"
      >
        🟥 Dum (espacio)
      </button>
      <button
        onClick={() => handleGolpe("tak")}
        className="bg-green-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-green-600"
      >
        🟩 Tak (enter)
      </button>
    </div>
  );
}
