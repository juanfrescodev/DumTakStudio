export function usePracticeAnalyzer({ userEvents, steps = [], bpm }) {
  if (!Array.isArray(steps) || steps.length === 0) return [];

  const stepDuration = 60000 / bpm / steps.length;

  const feedback = steps.map((step, index) => {
    const expectedTime = index * stepDuration;

    const match = userEvents.find((e) => {
      const delta = Math.abs(e.time - expectedTime);
      return delta < stepDuration * 0.4;
    });

    const tipoGolpe = step.tipoGolpe || "silencio";

    if (!match && tipoGolpe !== "silencio") {
      return {
        step: index,
        error: "Omisión",
        suggestion: `Faltó el golpe esperado: ${tipoGolpe}`,
      };
    }

    if (match && tipoGolpe === "silencio") {
      return {
        step: index,
        error: "Golpe no esperado",
        suggestion: "Evitar golpear en silencios",
      };
    }

    if (match) {
      const delta = match.time - expectedTime;
      if (Math.abs(delta) > stepDuration * 0.2) {
        return {
          step: index,
          error: "Desfase",
          suggestion: delta > 0 ? "Estás atrasado" : "Estás adelantado",
        };
      }
    }

    return {
      step: index,
      error: null,
      suggestion: "¡Perfecto!",
    };
  });

  return feedback;
}
