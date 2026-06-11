import { useState, useEffect } from "react";

/**
 * MetricsBar.jsx — Mini spinner de progreso para una métrica.
 * Muestra el valor con un medidor circular SVG (mini-gauge).
 */
export default function MetricsBar({ label, value, delay = 0 }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value, 100) / 100;
  const strokeDashoffset = circumference * (1 - progress);

  const getStrokeColor = (val) => {
    if (val >= 70) return "stroke-acceptable";
    if (val >= 40) return "stroke-warning";
    return "stroke-critical";
  };

  const getTextColor = (val) => {
    if (val >= 70) return "text-acceptable";
    if (val >= 40) return "text-warning";
    return "text-critical";
  };

  return (
    <div className="flex flex-col items-center gap-2.5">
      <div className="relative w-14 h-14 flex items-center justify-center filter drop-shadow-md">
        <svg viewBox="0 0 48 48" className="w-full h-full transform -rotate-90">
          <circle
            cx="24"
            cy="24"
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="3.5"
          />
          <circle
            cx="24"
            cy="24"
            r={radius}
            fill="none"
            className={getStrokeColor(value)}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            style={{
              strokeDashoffset: mounted ? strokeDashoffset : circumference,
              transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)"
            }}
          />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center text-xs font-black ${getTextColor(value)}`}>
          {Math.round(value)}
        </span>
      </div>
      <span className="text-[10px] font-bold text-surface-400 tracking-wider uppercase text-center max-w-[70px] leading-tight">
        {label}
      </span>
    </div>
  );
}
