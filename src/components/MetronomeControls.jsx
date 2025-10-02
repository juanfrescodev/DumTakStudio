// components/MetronomeControls.jsx
import React from "react";

export function MetronomeControls({ metronomoOn, setMetronomoOn, metronomoVolume, setMetronomoVolume, isMetronomoPlaying }) {
  return (
    <div className="flex flex-wrap items-center gap-6 p-3 bg-purple-50 rounded-lg border border-purple-200">
      <button
        onClick={() => setMetronomoOn(!metronomoOn)}
        className={`px-3 py-1 rounded font-semibold text-sm ${
          metronomoOn ? "bg-purple-600 text-white" : "bg-gray-300 text-gray-700"
        }`}
      >
        Click Metrónomo: {metronomoOn ? "Activo" : "Inactivo"}
      </button>

      <div className="text-2xl">
        {isMetronomoPlaying ? "🔊" : "🎯"}
      </div>

      <div className="flex items-center space-x-2">
        <label className="text-sm">Volumen:</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={metronomoVolume}
          onChange={(e) => setMetronomoVolume(Number(e.target.value))}
          className="w-24 accent-purple-500"
        />
        <span className="text-sm">{(metronomoVolume * 100).toFixed(0)}%</span>
      </div>
    </div>
  );
}
