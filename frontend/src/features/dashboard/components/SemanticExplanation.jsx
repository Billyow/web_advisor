/**
 * SemanticExplanation.jsx — Sección de "Explicación Semántica".
 * Permite filtrar de forma interactiva las recomendaciones por Categoría y Severidad.
 * Proporciona estados vacíos ilustrativos y detallados cuando no hay problemas detectados.
 */

import { useState } from "react";
import { Sparkles, PartyPopper, Accessibility, Search, Zap, ClipboardCheck, Filter } from "lucide-react";
import RecommendationCard from "./RecommendationCard";
import { extractOntologyName } from "../utils/urgencyConfig";

const CATEGORIES = [
  { id: "Todos", label: "Todos", icon: Filter },
  { id: "Accessibility", label: "Accesibilidad", icon: Accessibility },
  { id: "SEO", label: "SEO", icon: Search },
  { id: "Performance", label: "Rendimiento", icon: Zap },
  { id: "BestPractices", label: "Buenas Prácticas", icon: ClipboardCheck }
];

const SEVERITIES = [
  { id: "Todos", label: "Todas las Severidades", color: "border-white/10 text-surface-300" },
  { id: "Critical", label: "Crítico", color: "bg-critical/10 text-critical border-critical/30" },
  { id: "Warning", label: "Advertencia", color: "bg-warning/10 text-warning border-warning/30" },
  { id: "Acceptable", label: "Aceptable", color: "bg-acceptable/10 text-acceptable border-acceptable/30" }
];

export default function SemanticExplanation({ recommendations = [] }) {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [activeSeverity, setActiveSeverity] = useState("Todos");

  // Contadores generales (para el badge del header)
  const criticalCount = recommendations.filter(
    (r) => extractOntologyName(r["onto:hasStatus"]?.["@id"]) === "Critical"
  ).length;

  const warningCount = recommendations.filter(
    (r) => extractOntologyName(r["onto:hasStatus"]?.["@id"]) === "Warning"
  ).length;

  // Filtrado de recomendaciones
  const filteredRecommendations = recommendations.filter((rec) => {
    const actionName = extractOntologyName(rec["onto:suggestsAction"]?.["@id"]);
    const statusName = extractOntologyName(rec["onto:hasStatus"]?.["@id"]);

    const categoryMatch = activeCategory === "Todos" || actionName === activeCategory;
    const severityMatch = activeSeverity === "Todos" || statusName === activeSeverity;

    return categoryMatch && severityMatch;
  });

  // Renderizado del estado vacío para una categoría sin incidencias
  const renderEmptyState = () => {
    let title = "¡Excelente estado!";
    let desc = "No se encontraron recomendaciones pendientes en esta sección.";
    
    if (activeCategory === "Accessibility") {
      title = "¡Accesibilidad Completa!";
      desc = "El sitio cumple con las etiquetas descriptivas y estándares WCAG básicos de esta auditoría.";
    } else if (activeCategory === "SEO") {
      title = "¡Optimización SEO Excelente!";
      desc = "Todas las etiquetas clave de SEO (título, descripción, encabezados h1) están bien estructuradas.";
    } else if (activeCategory === "Performance") {
      title = "¡Rendimiento Óptimo!";
      desc = "El sitio web cargó rápidamente y el tamaño de los recursos es el recomendado.";
    } else if (activeCategory === "BestPractices") {
      title = "¡Buenas Prácticas al Día!";
      desc = "El sitio sigue las convenciones y directrices de desarrollo web moderno.";
    } else if (activeCategory === "Todos" && recommendations.length === 0) {
      title = "¡Sitio en Estado Perfecto!";
      desc = "Increíble, no hay problemas ni sugerencias registradas. ¡Buen trabajo!";
    }

    return (
      <div className="rounded-[24px] p-10 text-center animate-[fade-in_0.5s_ease-out] border border-acceptable/20 bg-acceptable/[0.04]">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-acceptable/10 ring-1 ring-acceptable/20">
          <PartyPopper className="w-7 h-7 text-acceptable" />
        </div>
        <h3 className="text-base sm:text-lg font-black text-white mb-2">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-surface-400 max-w-sm mx-auto leading-relaxed">
          {desc}
        </p>
      </div>
    );
  };

  return (
    <section className="card-hero rounded-[32px] p-8 sm:p-10 flex flex-col gap-10 animate-[slide-up_0.5s_ease-out_200ms_both] h-full">
      
      {/* Panel de Control de Filtros */}
      <div className="flex flex-col gap-8">
        
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 pb-6 border-b border-white/[0.05]">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-indigo-400 shrink-0" />
              Explicación Semántica
            </h2>
            <p className="text-sm sm:text-base text-surface-400 mt-2 font-medium">
              Recomendaciones del agente experto basadas en la ontología web.
            </p>
          </div>

          {/* Badges de resumen rápido */}
          <div className="flex items-center gap-3">
            {criticalCount > 0 && (
              <span className="px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider bg-critical/10 text-critical border border-critical/20 whitespace-nowrap shrink-0">
                {criticalCount} Crítico{criticalCount > 1 ? "s" : ""}
              </span>
            )}
            {warningCount > 0 && (
              <span className="px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider bg-warning/10 text-warning border border-warning/20 whitespace-nowrap shrink-0">
                {warningCount} Advertencia{warningCount > 1 ? "s" : ""}
              </span>
            )}
            {criticalCount === 0 && warningCount === 0 && (
              <span className="px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider bg-acceptable/10 text-acceptable border border-acceptable/20 whitespace-nowrap shrink-0">
                Sin incidencias
              </span>
            )}
          </div>
        </div>

        {/* Fila 1: Pestañas de Categoría */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-black text-surface-500 uppercase tracking-[0.15em]">
            Categoría del Problema
          </span>
          <div className="flex flex-wrap gap-2.5">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center justify-center gap-2.5 px-6 py-2.5 text-sm font-bold rounded-xl border transition-all duration-200 cursor-pointer
                    ${isActive 
                      ? "bg-white/[0.08] text-white border-indigo-500/40 shadow-sm shadow-indigo-500/5 tab-active" 
                      : "bg-transparent text-surface-400 border-white/[0.05] hover:text-white hover:bg-white/[0.03]"
                    }`}
                >
                  <Icon size={18} className={`${isActive ? "text-indigo-400" : "text-surface-400"} shrink-0`} />
                  <span className="whitespace-nowrap text-base">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Fila 2: Selector de Severidad */}
        <div className="flex flex-col gap-3 pt-6 border-t border-white/[0.05] mt-2">
          <span className="text-xs font-black text-surface-500 uppercase tracking-[0.15em]">
            Filtrar por Severidad
          </span>
          <div className="flex flex-wrap gap-2.5">
            {SEVERITIES.map((sev) => {
              const isActive = activeSeverity === sev.id;
              return (
                <button
                  key={sev.id}
                  onClick={() => setActiveSeverity(sev.id)}
                  className={`px-6 py-2.5 text-sm font-bold rounded-full border transition-all duration-200 cursor-pointer whitespace-nowrap
                    ${isActive 
                      ? `${sev.id === "Critical" ? "bg-critical text-white border-critical" : sev.id === "Warning" ? "bg-warning text-white border-warning" : sev.id === "Acceptable" ? "bg-acceptable text-white border-acceptable" : "bg-white text-surface-950 border-white"} shadow-sm` 
                      : `bg-transparent text-surface-400 border-white/[0.06] hover:text-white hover:bg-white/[0.03]`
                    }`}
                >
                  {sev.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lista de Recomendaciones Filtradas */}
      <div className="flex flex-col gap-4">
        {filteredRecommendations.length > 0 ? (
          filteredRecommendations.map((rec, idx) => (
            <RecommendationCard
              key={idx}
              recommendation={rec}
              index={idx}
            />
          ))
        ) : (
          renderEmptyState()
        )}
      </div>

    </section>
  );
}
