import { useEffect, useRef, useState } from "react";

export default function useAudioEngine({
  bpm,
  sequenceVolume = 1,
  metronomoVolume = 0.5,
  metronomoOn = true,
  playlist = [],
}) {
  const audioCtxRef = useRef(null);
  const samplesRef = useRef({});
  const schedulerIdRef = useRef(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  let lastStepTime = performance.now();

  const visualSyncRef = useRef({
    startTime: 0,
    bpm: bpm,
    currentStep: 0,
    nextNoteTime: 0,
    currentRitmoIndex: 0,
    compasesReproducidos: 0, // ✅ nuevo contador
  });

  const masterGainRef = useRef(null);
  const metronomoGainRef = useRef(null);

  const baseUrl = import.meta.env.BASE_URL;

  useEffect(() => {
    audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();

    masterGainRef.current = audioCtxRef.current.createGain();
    masterGainRef.current.gain.value = sequenceVolume;
    masterGainRef.current.connect(audioCtxRef.current.destination);

    metronomoGainRef.current = audioCtxRef.current.createGain();
    metronomoGainRef.current.gain.value = metronomoVolume;
    metronomoGainRef.current.connect(audioCtxRef.current.destination);

    const loadSample = async (path) => {
      try {
        const url = `${baseUrl}${path}`;
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioCtxRef.current.decodeAudioData(arrayBuffer);
        samplesRef.current[path] = audioBuffer;
      } catch (err) {
        console.error("Error cargando sample:", path, err);
      }
    };

    const loadAll = async () => {
      const sounds = ["ritmos/dum.mp3", "ritmos/tak.mp3", "ritmos/tek.mp3", "ritmos/click.wav"];
      const promises = sounds.map((sound) => loadSample(sound));

      try {
        await Promise.all(promises);
        setIsLoaded(true);
      } catch (err) {
        console.error("❌ Error al cargar los sonidos:", err);
        alert("Hubo un problema al cargar los sonidos. Verificá tu conexión.");
      }
    };
    loadAll();

    return () => {
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  const playSample = (path, time = 0, gainNode = masterGainRef.current) => {
    const buffer = samplesRef.current[path];
    if (!buffer || !audioCtxRef.current) return;

    const source = audioCtxRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(gainNode);
    source.start(time);
  };

  const setMasterVolume = (value) => {
    if (masterGainRef.current && audioCtxRef.current)
      masterGainRef.current.gain.setValueAtTime(value, audioCtxRef.current.currentTime);
  };

  const setMetronomeVolume = (value) => {
    if (metronomoGainRef.current && audioCtxRef.current)
      metronomoGainRef.current.gain.setValueAtTime(value, audioCtxRef.current.currentTime);
  };

  const schedule = () => {
    if (!playlist.length || !audioCtxRef.current) return;

    const secondsPerBeat = 60 / bpm;
    const lookahead = 0.1;

    while (visualSyncRef.current.nextNoteTime < audioCtxRef.current.currentTime + lookahead) {
      const ritmoIndex = visualSyncRef.current.currentRitmoIndex;
      const ritmo = playlist[ritmoIndex];
      if (!ritmo || !ritmo.steps?.length) break;

      const steps = ritmo.steps;
      const stepIndex = visualSyncRef.current.currentStep;
      const step = steps[stepIndex];

      const now = performance.now();
      const delta = now - lastStepTime;
      lastStepTime = now;

      const expectedStepDuration = (60 / bpm) / 4 * 1000; // en ms

      if (delta > expectedStepDuration * 1.5) {
        console.warn("⏱️ Glitch detectado:", delta.toFixed(2), "ms");
      }

      if (step?.sound && samplesRef.current[step.sound]) {
        playSample(step.sound, visualSyncRef.current.nextNoteTime, masterGainRef.current);
      }

      if (metronomoOn && stepIndex % 4 === 0) {
        playSample("ritmos/click.wav", visualSyncRef.current.nextNoteTime, metronomoGainRef.current);
      }

      visualSyncRef.current.currentStep++;

      if (visualSyncRef.current.currentStep >= steps.length) {
        visualSyncRef.current.currentStep = 0;
        visualSyncRef.current.compasesReproducidos++;

        const compasesEsperados = ritmo.bars || 1;

        if (visualSyncRef.current.compasesReproducidos >= compasesEsperados) {
          visualSyncRef.current.currentRitmoIndex++;
          visualSyncRef.current.compasesReproducidos = 0;

          if (visualSyncRef.current.currentRitmoIndex >= playlist.length) {
            visualSyncRef.current.currentRitmoIndex = 0;
          }
        }
      }

      const stepDuration = secondsPerBeat / 4;
      visualSyncRef.current.nextNoteTime += stepDuration;
    }
  };

  const startSequence = async () => {
    if (!isLoaded || isPlaying) return;
    if (audioCtxRef.current.state === "suspended") await audioCtxRef.current.resume();

    setIsPlaying(true);
    visualSyncRef.current.startTime = audioCtxRef.current.currentTime;
    visualSyncRef.current.nextNoteTime = audioCtxRef.current.currentTime + 0.1;
    visualSyncRef.current.currentStep = 0;
    visualSyncRef.current.currentRitmoIndex = 0;
    visualSyncRef.current.compasesReproducidos = 0; // ✅ reinicio
    visualSyncRef.current.bpm = bpm;

    schedulerIdRef.current = setInterval(schedule, 25);
  };

  const stopSequence = () => {
    setIsPlaying(false);
    if (schedulerIdRef.current) {
      clearInterval(schedulerIdRef.current);
      schedulerIdRef.current = null;
    }
  };

  return {
    playSample,
    startSequence,
    stopSequence,
    isPlaying,
    isLoaded,
    visualSyncRef,
    audioCtxRef,
    setMasterVolume,
    setMetronomeVolume,
  };
}
