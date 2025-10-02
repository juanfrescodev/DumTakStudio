// components/RitmoPlaylist.jsx
import React, { useState } from "react";
import { MetronomeControls } from "./MetronomeControls";
import RitmoBlock from "./RitmoBlock";
import useAudioEngine from "../hooks/useAudioEngine";

export default function RitmoPlaylist({ playlist, setPlaylist, initialBpm }) {
  const [bpm, setBpm] = useState(initialBpm);
  const [metronomoOn, setMetronomoOn] = useState(true);
  const [metronomoVolume, setMetronomoVolume] = useState(0.5);
  const [masterVolume, setMasterVolumeState] = useState(1); // volumen global de la secuencia

  const {
    playSample,
    startSequence,
    stopSequence,
    isPlaying,
    visualSyncRef,
    audioCtxRef,
    setMasterVolume,    // <- aplica al master gain
    setMetronomeVolume, // <- aplica al metronomo
  } = useAudioEngine({ bpm, metronomoVolume, metronomoOn, playlist, sequenceVolume: masterVolume });

  const handleStart = async () => {
    if (!audioCtxRef.current) return;
    await audioCtxRef.current.resume(); // desbloquear AudioContext
    startSequence();
  };

  const handleMasterVolumeChange = (e) => {
    const newVol = Number(e.target.value);
    setMasterVolumeState(newVol);
    setMasterVolume(newVol); // aplica al master gain inmediatamente
  };

  const handleMetronomeVolumeChange = (e) => {
    const newVol = Number(e.target.value);
    setMetronomoVolume(newVol);
    setMetronomeVolume(newVol); // aplica al metronomo inmediatamente
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">🔁 Secuencia personalizada</h2>

      <div className="flex items-center gap-4 mb-6">
        <label className="font-medium">🎚️ BPM:</label>
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


      <div className="flex items-center gap-4 mb-6">
        <label className="font-medium">🔊 Volumen Secuencia:</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={masterVolume}
          onChange={handleMasterVolumeChange}
          className="w-48 accent-orange-500"
        />
        <span className="font-mono">{Math.round(masterVolume * 100)}%</span>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <label className="font-medium">🔔 Volumen Metronomo:</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={metronomoVolume}
          onChange={handleMetronomeVolumeChange}
          className="w-48 accent-orange-500"
        />
        <span className="font-mono">{Math.round(metronomoVolume * 100)}%</span>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">🧾 Ritmos en la secuencia:</h3>
        {playlist.length === 0 ? (
          <p className="text-gray-500 italic">No hay ritmos agregados.</p>
        ) : (
          <div className="flex flex-wrap gap-4">
            {playlist.map((r, i) => (
              <RitmoBlock
                key={i}
                ritmoId={r.id}
                bars={r.bars}
                index={i}
                playlist={playlist}
                setPlaylist={setPlaylist}
                visualSyncRef={visualSyncRef}
                audioCtxRef={audioCtxRef}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          className="px-4 py-2 bg-green-600 text-white rounded"
          onClick={handleStart}
        >
          ▶️ Reproducir Secuencia
        </button>

        <button
          className="px-4 py-2 bg-red-600 text-white rounded"
          onClick={stopSequence}
        >
          ⏹️ Detener Secuencia
        </button>
      </div>
    </div>
  );
}
