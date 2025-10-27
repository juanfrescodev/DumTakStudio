import { useEffect, useRef, useState } from "react";
import abcjs from "abcjs";

export default function ReadingRhythmABC() {
  const abcRef = useRef(null);
  const [bpm, setBpm] = useState(80);

  const abcNotation = `
X:1
T:Lectura Rítmica
M:4/4
L:1/8
Q:1/4=${bpm}
K:C
z4 | C4 | z2 C2 | C2 z2 | C8 |
`;

  useEffect(() => {
    const visualObj = abcjs.renderAbc(abcRef.current, abcNotation, {
      responsive: "resize",
      add_classes: true,
      staffwidth: 600,
    })[0];

    const synth = new abcjs.synth.CreateSynth();
    synth.init({ visualObj }).then(() => {
      synth.prime().then(() => {
        synth.start();
      });
    });
  }, [abcNotation]);

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-purple-700">🎼 Lectura Rítmica con abcjs</h2>

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

      <div ref={abcRef} />
    </div>
  );
}
