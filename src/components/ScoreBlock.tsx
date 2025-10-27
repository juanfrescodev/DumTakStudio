import { useEffect, useState } from "react";

export default function ScoreBlock({ steps, visualSyncRef }) {
  const [activeStep, setActiveStep] = useState(null);

  useEffect(() => {
    let raf;

    const updateStep = () => {
      if (!visualSyncRef?.current) return;
      setActiveStep(visualSyncRef.current.currentStep % steps.length);
      raf = requestAnimationFrame(updateStep);
    };

    raf = requestAnimationFrame(updateStep);
    return () => cancelAnimationFrame(raf);
  }, [steps.length, visualSyncRef]);

  const getColorByGolpe = (tipo) => {
    switch (tipo) {
      case "dum": return "bg-red-500";
      case "tak": return "bg-green-500";
      case "tek": return "bg-orange-500";
      default: return "bg-gray-300";
    }
  };

  return (
    <div className="overflow-x-auto mt-4">
      <div className="flex gap-2 px-2 py-4 bg-white rounded-xl shadow-lg">
        {steps.map((step, i) => {
          const isActive = i === activeStep;
          const hasSound = !!step.sound;

          return (
            <div
              key={i}
              className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-150
                ${hasSound ? getColorByGolpe(step.tipoGolpe) + " text-white" : "bg-gray-200 text-gray-500"}
                ${isActive ? "ring-4 ring-yellow-300 scale-110 animate-pulse" : ""}
              `}
              title={step.tipoGolpe || "Silencio"}
            >
              {step.img ? (
                <img
                  src={step.img}
                  alt={`step-${i}`}
                  className="w-8 h-8 object-contain"
                />
              ) : (
                <span className="text-xs font-bold">{hasSound ? "●" : ""}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
