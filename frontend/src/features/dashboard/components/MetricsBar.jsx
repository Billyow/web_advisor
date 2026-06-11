/**
 * MetricsBar.jsx — Barra visual de progreso para una métrica.
 * Muestra el valor de una métrica con una barra de progreso animada
 * y colores que cambian según el rendimiento (rojo, amarillo, verde).
 */

/**
 * @param {object} props
 * @param {string} props.label — Nombre de la métrica (ej: "Score")
 * @param {number} props.value — Valor numérico (0-100)
 * @param {number} props.delay — Delay de animación en ms (para escalonar las barras)
 */
export default function MetricsBar({ label, value, delay = 0 }) {
  // Determinar color según rango
  const getBarColor = (val) => {
    if (val >= 70) return "bg-acceptable";
    if (val >= 40) return "bg-warning";
    return "bg-critical";
  };

  const getTextColor = (val) => {
    if (val >= 70) return "text-acceptable";
    if (val >= 40) return "text-warning";
    return "text-critical";
  };

  return (
    <div className="space-y-2">
      {/* Label y valor */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-surface-300">{label}</span>
        <span className={`text-sm font-bold ${getTextColor(value)}`}>
          {value.toFixed(1)}
        </span>
      </div>

      {/* Barra de progreso */}
      <div className="w-full h-2.5 rounded-full bg-surface-800 overflow-hidden">
        <div
          className={`h-full rounded-full ${getBarColor(value)} transition-all duration-1000 ease-out`}
          style={{
            width: `${Math.min(value, 100)}%`,
            transitionDelay: `${delay}ms`,
            animation: `score-fill 1.2s ease-out ${delay}ms both`,
          }}
        />
      </div>
    </div>
  );
}
