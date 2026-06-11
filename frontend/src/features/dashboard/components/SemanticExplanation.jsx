/**
 * SemanticExplanation.jsx — Sección de "Explicación Semántica".
 * Agrupa y muestra todas las recomendaciones generadas por el agente experto,
 * proporcionando contexto semántico basado en la ontología OWL.
 */

import RecommendationCard from "./RecommendationCard";

/**
 * @param {object} props
 * @param {Array} props.recommendations — Array de recomendaciones del JSON-LD
 */
export default function SemanticExplanation({ recommendations }) {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="glass rounded-2xl p-8 text-center animate-[fade-in_0.5s_ease-out]">
        <span className="text-4xl mb-3 block">🎉</span>
        <h3 className="text-lg font-semibold text-white mb-1">
          ¡Sin recomendaciones pendientes!
        </h3>
        <p className="text-sm text-surface-400">
          El sitio web cumple con los estándares de la ontología.
        </p>
      </div>
    );
  }

  // Contar por tipo de estado
  const criticalCount = recommendations.filter(
    (r) => r["onto:hasStatus"]?.["@id"]?.includes("Critical")
  ).length;

  const acceptableCount = recommendations.filter(
    (r) => r["onto:hasStatus"]?.["@id"]?.includes("Acceptable")
  ).length;

  const otherCount = recommendations.length - criticalCount - acceptableCount;

  return (
    <section className="space-y-5 animate-[slide-up_0.5s_ease-out_200ms_both]">
      {/* Header de la sección */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <svg className="w-6 h-6 text-primary-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
            </svg>
            Explicación Semántica
          </h2>
          <p className="text-sm text-surface-400 mt-1">
            Recomendaciones generadas por el agente experto basadas en la ontología web.
          </p>
        </div>

        {/* Contadores */}
        <div className="flex items-center gap-2">
          {criticalCount > 0 && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-critical/10 text-critical border border-critical/30">
              {criticalCount} Crítico{criticalCount > 1 ? "s" : ""}
            </span>
          )}
          {otherCount > 0 && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-warning/10 text-warning border border-warning/30">
              {otherCount} Advertencia{otherCount > 1 ? "s" : ""}
            </span>
          )}
          {acceptableCount > 0 && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-acceptable/10 text-acceptable border border-acceptable/30">
              {acceptableCount} Aceptable{acceptableCount > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {/* Lista de recomendaciones */}
      <div className="grid gap-4">
        {recommendations.map((rec, idx) => (
          <RecommendationCard
            key={idx}
            recommendation={rec}
            index={idx}
          />
        ))}
      </div>
    </section>
  );
}
