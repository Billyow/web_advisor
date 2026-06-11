/**
 * UrgencyBadge.jsx — Badge de urgencia con color dinámico.
 * Muestra una etiqueta visual compacta que indica el nivel de urgencia
 * de una recomendación usando colores de la ontología.
 */

import { getStatusConfig } from "../utils/urgencyConfig";

/**
 * @param {object} props
 * @param {string} props.statusIri — IRI del estado (ej: "onto:Critical")
 */
export default function UrgencyBadge({ statusIri }) {
  const config = getStatusConfig(statusIri);

  return (
    <span
      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-bold whitespace-nowrap shrink-0
        ${config.bgColor} ${config.color} ${config.borderColor} border
        transition-all duration-200`}
    >
      <span
        className={`w-2.5 h-2.5 rounded-full ${config.dotColor} animate-pulse`}
        aria-hidden="true"
      />
      {config.label}
    </span>
  );
}
