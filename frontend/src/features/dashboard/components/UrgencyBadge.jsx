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
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
        ${config.bgColor} ${config.color} ${config.borderColor} border
        transition-all duration-200`}
    >
      <span
        className={`w-2 h-2 rounded-full ${config.dotColor} animate-pulse`}
        aria-hidden="true"
      />
      {config.label}
    </span>
  );
}
