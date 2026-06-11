/**
 * RecommendationCard.jsx — Tarjeta individual de recomendación semántica.
 * Muestra una recomendación con su categoría, nivel de urgencia e ícono,
 * todo derivado de la ontología OWL.
 */

import UrgencyBadge from "./UrgencyBadge";
import { getActionConfig } from "../utils/urgencyConfig";

/**
 * @param {object} props
 * @param {object} props.recommendation — Objeto de recomendación del JSON-LD
 * @param {number} props.index — Índice para animación escalonada
 */
export default function RecommendationCard({ recommendation, index = 0 }) {
  const statusIri = recommendation["onto:hasStatus"]?.["@id"] || "";
  const actionIri = recommendation["onto:suggestsAction"]?.["@id"] || "";
  const description = recommendation["schema:description"] || "";

  const actionConfig = getActionConfig(actionIri);

  return (
    <div
      className="glass rounded-2xl p-5 hover:bg-white/[0.06] transition-all duration-300
                 hover:shadow-card-hover hover:-translate-y-0.5 group"
      style={{
        animation: `slide-up 0.5s ease-out ${150 + index * 100}ms both`,
      }}
    >
      <div className="flex items-start gap-4">
        {/* Icono de categoría */}
        <div
          className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-600/15 
                      flex items-center justify-center text-2xl
                      group-hover:scale-110 transition-transform duration-300"
        >
          {actionConfig.emoji}
        </div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          {/* Header: categoría + badge */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-sm font-semibold text-primary-300">
              {actionConfig.label}
            </span>
            <UrgencyBadge statusIri={statusIri} />
          </div>

          {/* Descripción del problema y sugerencia */}
          <p className="text-sm text-surface-300 leading-relaxed">
            {description}
          </p>

          {/* Referencia a la ontología */}
          <div className="mt-3 flex items-center gap-1.5 text-xs text-surface-500">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
            </svg>
            <span>Ontología: {actionConfig.description}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
