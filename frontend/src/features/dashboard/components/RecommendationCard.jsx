/**
 * RecommendationCard.jsx — Tarjeta individual de recomendación semántica.
 * Muestra una recomendación con su categoría, nivel de urgencia e ícono.
 * Ofrece efectos de iluminación de fondo (hover glow) dinámicos por categoría.
 */

import { Link } from "lucide-react";
import UrgencyBadge from "./UrgencyBadge";
import {
  getActionConfig,
  extractOntologyName,
} from "../utils/urgencyConfig";

/**
 * Mapeo de categorías de acción a colores de gradiente para el contenedor del ícono.
 */
const ICON_GRADIENT_MAP = {
  Accessibility: {
    bg: "bg-gradient-to-br from-violet-500/15 to-purple-600/5",
    ring: "ring-violet-500/20",
    iconColor: "text-violet-300",
  },
  SEO: {
    bg: "bg-gradient-to-br from-sky-500/15 to-blue-600/5",
    ring: "ring-sky-500/20",
    iconColor: "text-sky-300",
  },
  Performance: {
    bg: "bg-gradient-to-br from-amber-500/15 to-orange-600/5",
    ring: "ring-amber-500/20",
    iconColor: "text-amber-300",
  },
  Security: {
    bg: "bg-gradient-to-br from-emerald-500/15 to-green-600/5",
    ring: "ring-emerald-500/20",
    iconColor: "text-emerald-300",
  },
  BestPractices: {
    bg: "bg-gradient-to-br from-rose-500/15 to-pink-600/5",
    ring: "ring-rose-500/20",
    iconColor: "text-rose-300",
  },
};

/** Gradiente por defecto cuando la categoría no está mapeada */
const DEFAULT_GRADIENT = {
  bg: "bg-gradient-to-br from-indigo-500/15 to-indigo-600/5",
  ring: "ring-indigo-500/20",
  iconColor: "text-indigo-300",
};

/**
 * Mapeo de estado a color para la barra lateral de acento.
 */
const ACCENT_BORDER_MAP = {
  Critical: "border-l-critical",
  Warning: "border-l-warning",
  Acceptable: "border-l-acceptable",
};

/**
 * Mapeo de sombras de resplandor dinámicas al hacer hover.
 */
const HOVER_GLOW_MAP = {
  Accessibility: "hover:shadow-[0_8px_32px_rgba(0,0,0,0.35),0_0_20px_rgba(139,92,246,0.12)] hover:border-violet-500/20",
  SEO: "hover:shadow-[0_8px_32px_rgba(0,0,0,0.35),0_0_20px_rgba(56,189,248,0.12)] hover:border-sky-500/20",
  Performance: "hover:shadow-[0_8px_32px_rgba(0,0,0,0.35),0_0_20px_rgba(245,158,11,0.12)] hover:border-amber-500/20",
  Security: "hover:shadow-[0_8px_32px_rgba(0,0,0,0.35),0_0_20px_rgba(16,185,129,0.12)] hover:border-emerald-500/20",
  BestPractices: "hover:shadow-[0_8px_32px_rgba(0,0,0,0.35),0_0_20px_rgba(244,63,94,0.12)] hover:border-rose-500/20",
};

export default function RecommendationCard({ recommendation, index = 0 }) {
  const statusIri = recommendation["onto:hasStatus"]?.["@id"] || "";
  const actionIri = recommendation["onto:suggestsAction"]?.["@id"] || "";
  const description = recommendation["schema:description"] || "";

  const actionConfig = getActionConfig(actionIri);

  const actionName = extractOntologyName(actionIri);
  const statusName = extractOntologyName(statusIri);

  const iconStyle = ICON_GRADIENT_MAP[actionName] || DEFAULT_GRADIENT;
  const accentBorder = ACCENT_BORDER_MAP[statusName] || "border-l-warning";
  const hoverGlow = HOVER_GLOW_MAP[actionName] || "hover:shadow-[0_8px_32px_rgba(0,0,0,0.35),0_0_20px_rgba(99,102,241,0.12)] hover:border-indigo-500/20";

  const ActionIcon = actionConfig.emoji;

  return (
    <div
      className={`rounded-2xl p-6 sm:p-8 border border-white/[0.04] bg-white/[0.015] border-l-[4px] ${accentBorder}
                  transition-all duration-300 ease-out group hover:-translate-y-0.5 hover:bg-white/[0.03] ${hoverGlow}`}
      style={{
        animation: `slide-up 0.5s ease-out ${100 + index * 80}ms both`,
      }}
    >
      <div className="flex items-center gap-6 sm:gap-8">
        
        {/* Contenedor de ícono con gradiente y anillo */}
        <div
          className={`flex-shrink-0 w-14 h-14 rounded-2xl ${iconStyle.bg}
                      ring-1 ${iconStyle.ring}
                      flex items-center justify-center
                      group-hover:scale-105 transition-transform duration-300 shadow-inner`}
        >
          <ActionIcon size={26} className={iconStyle.iconColor} />
        </div>

        {/* Contenido principal */}
        <div className="flex-1 min-w-0">
          
          {/* Header de metadata */}
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className={`text-[11px] font-black tracking-widest uppercase ${iconStyle.iconColor}`}>
              {actionConfig.label}
            </span>
            <span className="text-[10px] text-surface-600 font-bold">•</span>
            <UrgencyBadge statusIri={statusIri} />
          </div>

          {/* Texto de la recomendación */}
          <p className="text-base sm:text-lg text-white font-medium leading-relaxed mt-1">
            {description}
          </p>

          {/* Ontología (Opcional) */}
          <div className="mt-3 flex items-center gap-2 opacity-70">
            <Link size={14} className="text-indigo-400" />
            <span className="text-xs text-surface-400">
              Ontología: {actionConfig.description}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
