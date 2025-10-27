// RhythmTrainerPage.tsx
import { useState } from 'react';
import DifficultySelector from '../components/DifficultySelector';
import ScorePreview from '../components/ScorePreview';
import PlaybackCursor from '../components/PlaybackCursor';
import UserInputTracker from '../components/UserInputTracker';
import FeedbackPanel from '../components/FeedbackPanelTrainer';
import { generateRhythm } from '../hooks/RhythmGenerator';
import { startMetronome } from '../hooks/MetronomeEngine';

export default function RhythmTrainerPage() {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | null>(null);
  const [score, setScore] = useState([]);
  const [results, setResults] = useState([]);

  const handleStart = () => {
    const generated = generateRhythm(difficulty || 'easy');
    setScore(generated);
    startMetronome(difficulty || 'easy');
  };

  return (
    <div>
      <h2>Entrenador de Lectura Rítmica</h2>
      <DifficultySelector onSelect={setDifficulty} />
      <button onClick={handleStart}>Iniciar</button>
      <ScorePreview score={score} />
      <PlaybackCursor score={score} />
      <UserInputTracker score={score} onResults={setResults} />
      <FeedbackPanel results={results} />
    </div>
  );
}
