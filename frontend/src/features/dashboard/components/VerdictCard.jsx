/**
 * VerdictCard.jsx — Card héroe del veredicto de lógica difusa.
 * Muestra el score numérico dentro de un gauge SVG circular animado con gradiente
 * y la etiqueta del veredicto con colores de urgencia. Incorpora además
 * la visualización lateral de los scores de Accesibilidad, SEO y Rendimiento.
 */

import { Sparkles, Activity } from "lucide-react";
import { getVerdictConfig } from "../utils/urgencyConfig";
import { reconstructScores } from "../utils/scoreReconstructor";
import MetricsBar from "./MetricsBar";

/**
 * @param {object} props
 * @param {number} props.score — Puntuación del veredicto (0-100)
 * @param {string} props.description — Etiqueta del veredicto (ej: "Urgente")
 * @param {object} props.data — Datos completos del reporte de auditoría para extraer sub-scores
 */
export default function VerdictCard({ score, description, data }) {
  const config = getVerdictConfig(description);
  const subScores = reconstructScores(data);

  // Cálculos para el gauge SVG circular
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(score, 100) / 100;
  const strokeDashoffset = circumference * (1 - progress);

  // Mapear gradiente de color según veredicto
  const gradientId = `gauge-gradient-${description.replace(/\s+/g, "-")}`;
  const getGlowColorHex = (desc) => {
    if (desc === "Urgente") return "rgba(239, 68, 68, 0.4)";
    if (desc === "Aceptable") return "rgba(16, 185, 129, 0.4)";
    return "rgba(245, 158, 11, 0.4)";
  };

  return (
    <div
      className={`card-hero rounded-[32px] p-8 sm:p-10 animate-[slide-up_0.6s_ease-out]
        ${config.glowColor} transition-all duration-500 hover:shadow-[0_0_40px_rgba(99,102,241,0.12)] h-full flex flex-col items-center justify-center`}
    >
      <div className="flex flex-col items-center w-full h-full justify-center gap-16">
        
        {/* Grupo Superior: Gauge y Etiqueta de Veredicto */}
        <div className="flex flex-col items-center gap-8">
          {/* Superior: Gauge circular */}
          <div className="relative flex-shrink-0">
            <div
              className="absolute inset-[-16px] rounded-full opacity-35 blur-2xl pointer-events-none transition-all duration-500"
              style={{
                background: `radial-gradient(circle, ${getGlowColorHex(description)} 0%, transparent 70%)`,
              }}
              aria-hidden="true"
            />

            <svg
              viewBox="0 0 120 120"
              className="w-52 h-52 relative transform -rotate-90 filter drop-shadow-[0_0_12px_rgba(0,0,0,0.5)]"
            >
              <defs>
                <linearGradient id="gauge-gradient-Urgente" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#e11d48" />
                </linearGradient>
                <linearGradient id="gauge-gradient-Moderado" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
                <linearGradient id="gauge-gradient-Aceptable" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>

              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="rgba(255, 255, 255, 0.04)"
                strokeWidth="7"
              />
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke={`url(#${gradientId})`}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{
                  transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
                  animation: "score-fill 1.5s ease-out both",
                }}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-5xl font-black tracking-tight bg-gradient-to-br from-white to-surface-400 bg-clip-text text-transparent`}>
                {score.toFixed(1)}
              </span>
              <span className="text-[11px] text-surface-500 font-bold uppercase tracking-widest mt-1">
                Score Global
              </span>
            </div>
          </div>

          {/* Medio: Información del veredicto ultra-minimalista */}
          <div className="text-center w-full flex flex-col items-center">
            <div className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] shadow-md">
              <config.icon size={22} className={config.color} />
              <h2 className={`text-lg font-black tracking-tight ${config.color}`}>
                {config.label}
              </h2>
            </div>
          </div>
        </div>

        {/* Inferior: Scores de Componentes detallados (Mini Spinners) */}
        <div className="w-full flex items-start justify-around gap-2 px-4">
          <MetricsBar label="Accesibilidad" value={subScores.accessibility} delay={100} />
          <MetricsBar label="SEO" value={subScores.seo} delay={250} />
          <MetricsBar label="Rendimiento" value={subScores.performance} delay={400} />
        </div>
      </div>
    </div>
  );
}
