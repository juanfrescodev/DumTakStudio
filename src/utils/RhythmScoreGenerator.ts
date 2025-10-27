export function generateRhythmScore(difficulty: "facil" | "intermedio" | "dificil") {
  const base = import.meta.env.BASE_URL;

  const figuresByDifficulty = {
    facil: ["negra", "blanca", "corchea"],
    intermedio: ["corchea", "semicorchea", "negra", "silencio"],
    dificil: ["semicorchea", "tresillo", "puntillo", "silencio", "corchea"],
  };

  const golpeTypes = ["dum", "tak", "tek"];
  const figureDurations = {
    blanca: 2,
    negra: 1,
    corchea: 0.5,
    semicorchea: 0.25,
    puntillo: 1.5,
    tresillo: 0.33,
    silencio: 1,
  };

  const steps = [];
  let currentTime = 0;
  const totalBeats = 16;

  while (currentTime < totalBeats) {
    const figures = figuresByDifficulty[difficulty];
    const figure = figures[Math.floor(Math.random() * figures.length)];
    const duration = figureDurations[figure] || 1;

    if (currentTime + duration > totalBeats) break;

    const isSilence = figure === "silencio";
    const golpe = isSilence ? null : golpeTypes[Math.floor(Math.random() * golpeTypes.length)];

    steps.push({
      figure,
      duration,
      tipoGolpe: golpe,
      sound: golpe ? `${base}ritmos/${golpe}.mp3` : null,
      img: getImageForFigure(figure, golpe, base),
    });

    currentTime += duration;
  }

  return steps;
}

function getImageForFigure(figure: string, tipoGolpe: string | null, base: string) {
  if (!tipoGolpe) return `${base}ritmos/silencioCorchea.png`;

  const golpe = tipoGolpe === "dum" ? "dum" : tipoGolpe === "tak" ? "tak" : "tek";

  switch (figure) {
    case "blanca": return `${base}ritmos/${golpe}Blanca.png`;
    case "negra": return `${base}ritmos/${golpe}Negra.png`;
    case "corchea": return `${base}ritmos/${golpe}Corchea.png`;
    case "semicorchea": return `${base}ritmos/${golpe}SemiCorchea.png`;
    case "puntillo": return `${base}ritmos/${golpe}NegraPuntillo.png`;
    case "tresillo": return `${base}ritmos/${golpe}Tresillo.png`;
    default: return `${base}ritmos/${golpe}Corchea.png`;
  }
}
