//compoents/FeedbackPanel.tsx
import React from 'react';

export default function FeedbackPanel({ feedback }) {
  return (
    <div className="feedback-panel">
      <h2>Feedback</h2>
      <ul>
        {feedback.map((f, i) => (
          <li key={i}>
            Paso {f.step + 1}: {f.error ? `${f.error} – ${f.suggestion}` : f.suggestion}
          </li>
        ))}
      </ul>
    </div>
  );
}
