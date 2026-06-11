/**
 * VerdictCard.jsx — Card héroe del veredicto de lógica difusa.
 * Muestra el score numérico dentro de un gauge SVG circular animado
 * y la etiqueta del veredicto (ej: "Urgente") con colores de urgencia.
 * Es el componente visual más prominente del Dashboard.
 */

import { getVerdictConfig } from "../utils/urgencyConfig";

/**
 * @param {object} props
 * @param {number} props.score — Puntuación del veredicto (0-100)
 * @param {string} props.description — Etiqueta del veredicto (ej: "Urgente")
 */
export default function VerdictCard({ score, description }) {
  const config = getVerdictConfig(description);

  // Cálculos para el gauge SVG circular
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(score, 100) / 100;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div
      className={`glass-light rounded-3xl p-8 animate-[slide-up_0.6s_ease-out]
        ${config.glowColor} transition-shadow duration-500
        ${config.pulseAnimation ? "animate-[pulse-glow_2.5s_ease-in-out_infinite]" : ""}`}
    >
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Gauge circular SVG */}
        <div className="relative flex-shrink-0">
          <svg
            width="160"
            height="160"
            viewBox="0 0 100 100"
            className="transform -rotate-90"
          >
            {/* Track de fondo */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="currentColor"
              className="text-surface-800"
              strokeWidth="8"
            />
            {/* Arco de progreso */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              className={config.ringColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{
                transition: "stroke-dashoffset 1.5s ease-out",
                animation: "score-fill 1.5s ease-out both",
              }}
            />
          </svg>

          {/* Score numérico centrado */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-extrabold ${config.color}`}>
              {score.toFixed(1)}
            </span>
            <span className="text-xs text-surface-500 font-medium mt-0.5">
              / 100
            </span>
          </div>
        </div>

        {/* Información del veredicto */}
        <div className="text-center md:text-left flex-1">
          {/* Emoji + label */}
          <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
            <span className="text-3xl" role="img" aria-label="icono de urgencia">
              {config.icon}
            </span>
            <h2 className={`text-2xl sm:text-3xl font-extrabold ${config.color}`}>
              {config.label}
            </h2>
          </div>

          {/* Descripción para el usuario */}
          <p className="text-surface-400 text-sm sm:text-base leading-relaxed max-w-md">
            {config.description}
          </p>

          {/* Indicador de veredicto difuso */}
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-800/50 border border-surface-700">
            <svg className="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
            </svg>
            <span className="text-xs text-surface-400 font-medium">
              Veredicto generado por lógica difusa (scikit-fuzzy)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
