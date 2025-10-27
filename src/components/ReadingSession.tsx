import { useEffect, useState } from "react";
import useAudioEngine from "../hooks/useAudioEngine";
import { generateRhythmScore } from "../utils/RhythmScoreGenerator";
import ScoreBlock from "./ScoreBlock";
import { MetronomeControls } from "./MetronomeControls";
import ReadingInput from "./ReadingInput";

export default function ReadingSession({ difficulty }) {
  const [score, setScore] = useState([]);
  const [bpm, setBpm] = useState(80);
  const [canPlay, setCanPlay] = useState(false);
  const [counting, setCounting] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [hits, setHits] = useState([]);
  const [popup, setPopup] = useState(null);

  const {
    playSample,
    startSequence,
    stopSequence,
    isPlaying,
    isLoaded,
    visualSyncRef,
    audioCtxRef,
    setMetronomeVolume,
    setMasterVolume,
  } = useAudioEngine({
    bpm,
    metronomoVolume: 1,
    metronomoOn: true,
    playlist: [{ id: "lectura", bars: 1, steps: score }],
    sequenceVolume: 1,
    isMuted: true,
  });

  useEffect(() => {
    const generated = generateRhythmScore(difficulty);
    setScore(generated);
  }, [difficulty]);

  const handleStart = () => {
    if (!audioCtxRef.current || !isLoaded) return;

    const beatInterval = 60 / bpm;
    const startAt = audioCtxRef.current.currentTime + beatInterval * 4;

    visualSyncRef.current.startTime = startAt;
    visualSyncRef.current.nextNoteTime = startAt;

    let count = 4;
    setCountdown(count);
    setCounting(true);

    const countdownInterval = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(countdownInterval);
        setCountdown(null);
        setCounting(false);
        setCanPlay(true);
        startSequence();
      }
    }, beatInterval * 1000);
  };

  const handleHit = (golpeData) => {
    setHits((prev) => [...prev, golpeData]);
    setPopup(golpeData);
    setTimeout(() => setPopup(null), 1200);
  };

  return (
    <div className="mt-6">
      <MetronomeControls
        metronomoOn={true}
        setMetronomoOn={() => {}}
        metronomoVolume={1}
        setMetronomeVolume={setMetronomeVolume}
        isMetronomoPlaying={isPlaying}
      />

      <div className="flex items-center gap-4 mb-6">
        <label className="font-medium">🎚️ BPM:</label>
        <input
          type="range"
          min="40"
          max="180"
          value={bpm}
          onChange={(e) => setBpm(Number(e.target.value))}
          className="w-48 accent-orange-500"
        />
        <span className="font-mono text-lg">{bpm}</span>
      </div>

      <ScoreBlock steps={score} visualSyncRef={visualSyncRef} />

      {canPlay && (
        <>
          <ReadingInput
            bpm={bpm}
            visualSyncRef={visualSyncRef}
            audioCtxRef={audioCtxRef}
            onHit={handleHit}
          />

          <div className="mt-4 text-center text-sm text-gray-700">
            Golpes registrados: {hits.length}
          </div>
        </>
      )}

      {!canPlay && !counting && (
        <button
          onClick={handleStart}
          className="bg-green-600 text-white font-bold py-2 px-4 rounded-full hover:bg-green-700"
        >
          ▶️ Iniciar lectura
        </button>
      )}

      {countdown && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-white border-4 border-orange-500 rounded-full px-8 py-6 shadow-xl text-6xl font-extrabold text-orange-600 animate-pulse">
            {countdown}
          </div>
        </div>
      )}

      {popup && (
        <div className={`fixed top-8 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full text-white font-bold shadow-lg z-50 ${
          popup.precision === "perfecto"
            ? "bg-green-600"
            : popup.precision === "adelantado"
            ? "bg-yellow-500"
            : popup.precision === "atrasado"
            ? "bg-orange-500"
            : "bg-red-600"
        }`}>
          {popup.tipoGolpe.toUpperCase()} – {popup.precision}
        </div>
      )}
    </div>
  );
}
