import { useEffect, useRef, useState } from "react";
import abcjs from "abcjs";

export default function ReadingPracticeABC() {
  const abcRef = useRef<HTMLDivElement>(null);
  const [bpm, setBpm] = useState(80);
  const [canPlay, setCanPlay] = useState(false);
  const [popup, setPopup] = useState<{ precision: string; puntos: number } | null>(null);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [counting, setCounting] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const startTimeRef = useRef(0);
  const visualObjRef = useRef<any>(null);
  const metronomeTimeoutRef = useRef<number | null>(null);
  const timingRef = useRef<any[]>([]);

  const abcNotation = `
X:1
T:Lectura Rítmica
M:4/4
L:1/8
Q:1/4=${bpm}
K:C
C2 C2 z2 C2 | C4 z4 |
`;

  const playClick = () => {
    const click = new Audio(`${import.meta.env.BASE_URL}ritmos/click.wav`);
    click.play();
  };

  const startMetronome = () => {
    const ctx = audioCtxRef.current;
    if (!ctx || !visualObjRef.current) return;

    setCounting(true);
    const beatInterval = 60 / bpm;

    // cuenta previa
    for (let i = 0; i < 4; i++) {
      setTimeout(() => playClick(), i * beatInterval * 1000);
    }

    // empieza práctica
    setTimeout(() => {
      setCounting(false);
      setCanPlay(true);
      startTimeRef.current = ctx.currentTime;

      abcjs.startAnimation(abcRef.current, visualObjRef.current, {
        showCursor: true,
        scrollToCursor: false,
      });

      const timing = visualObjRef.current.getTiming?.();
      if (!timing || timing.length === 0) {
        console.warn("⚠️ No hay eventos de timing. El cursor no se moverá.");
        return;
      }

      timingRef.current = timing;
      let index = 0;

      const scheduleNext = () => {
        if (index >= timing.length) return;
        const nextTime = startTimeRef.current + timing[index].milliseconds / 1000;
        const now = ctx.currentTime;
        const delay = Math.max(0, (nextTime - now) * 1000);

        metronomeTimeoutRef.current = window.setTimeout(() => {
          playClick();
          setStepIndex(index);
          index++;
          scheduleNext();
        }, delay);
      };

      scheduleNext();
    }, beatInterval * 4 * 1000);
  };

  // Renderiza y prepara timing con abcjs.synth
  useEffect(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    const visualObjs = abcjs.renderAbc(abcRef.current, abcNotation, {
      responsive: "resize",
      add_classes: true,
      staffwidth: 600,
    });

    const visualObj = visualObjs[0];
    visualObjRef.current = visualObj;

    // ⚡ Usa el módulo de synth para preparar el timing
    const synth = new abcjs.synth.CreateSynth();

    (async () => {
      try {
        await synth.init({
          visualObj,
          audioContext: audioCtxRef.current!,
        });
        await synth.prime();

        const timing = visualObj.getTiming?.();
        if (!timing || timing.length === 0) {
          console.warn("⚠️ abcjs no generó eventos de tiempo.");
        } else {
          timingRef.current = timing;
        }

        setCanPlay(false);
      } catch (error) {
        console.error("Error preparando el sintetizador:", error);
      }
    })();

    return () => {
      if (metronomeTimeoutRef.current) clearTimeout(metronomeTimeoutRef.current);
    };
  }, [abcNotation]);

  const handleHit = () => {
    const ctx = audioCtxRef.current;
    const timing = timingRef.current;
    if (!ctx || !canPlay || !timing || stepIndex >= timing.length) return;

    const golpeTime = ctx.currentTime;
    const expectedTime = startTimeRef.current + timing[stepIndex].milliseconds / 1000;
    const delta = (golpeTime - expectedTime) * 1000;

    let precision = "perfecto";
    const perfectMargin = 50;
    const tolerance = 90;

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
    switch (precision) {
      case "perfecto": puntos = 10; break;
      case "adelantado":
      case "atrasado": puntos = 5; break;
      case "fuera de rango": puntos = -5; break;
    }

    setPoints((prev) => prev + puntos);
    setStreak((prev) => (precision === "perfecto" ? prev + 1 : 0));
    setMaxStreak((prev) => Math.max(prev, streak));
    setPopup({ precision, puntos });

    const golpe = new Audio(`${import.meta.env.BASE_URL}ritmos/dum.mp3`);
    golpe.play();

    setTimeout(() => setPopup(null), 1200);
  };

  // Detecta barra espaciadora
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        handleHit();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [canPlay, stepIndex]);

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-purple-700">🎼 Lectura Rítmica Interactiva</h2>

      <div className="mb-4">
        <label className="font-medium">🎚️ BPM:</label>
        <input
          type="range"
          min="40"
          max="160"
          value={bpm}
          onChange={(e) => setBpm(Number(e.target.value))}
          className="w-48 accent-purple-500 ml-4"
        />
        <span className="ml-2 font-mono">{bpm}</span>
      </div>

      <div ref={abcRef} className="mb-6" />

      {!canPlay && !counting && (
        <button
          onClick={startMetronome}
          className="bg-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-green-700"
        >
          ▶️ Iniciar práctica
        </button>
      )}

      {counting && (
        <div className="text-center text-xl font-bold text-orange-600 animate-pulse">
          ⏱️ Cuenta previa...
        </div>
      )}

      {canPlay && (
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleHit}
            className="bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-blue-700"
          >
            🟦 Golpe (espacio)
          </button>

          <div className="text-sm text-gray-700">
            ⭐ Puntos: {points} — 🔥 Racha: {streak} — 🏆 Máxima: {maxStreak}
          </div>
        </div>
      )}

      {popup && (
        <div
          className={`fixed top-8 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full text-white font-bold shadow-lg z-50 ${
            popup.precision === "perfecto"
              ? "bg-green-600"
              : popup.precision === "adelantado"
              ? "bg-yellow-500"
              : popup.precision === "atrasado"
              ? "bg-orange-500"
              : "bg-red-600"
          }`}
        >
          {popup.precision.toUpperCase()} {popup.puntos > 0 ? `+${popup.puntos}` : popup.puntos}
        </div>
      )}
    </div>
  );
}
