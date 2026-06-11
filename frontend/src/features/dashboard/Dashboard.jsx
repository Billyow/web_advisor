/**
 * Dashboard.jsx — Página principal del SEM-Web-Advisor.
 * Orquesta todos los componentes del dashboard, obtiene los datos del backend
 * y maneja los estados de carga y error.
 */

import { useAuditReport } from "./hooks/useAuditReport";
import ReportHeader from "./components/ReportHeader";
import VerdictCard from "./components/VerdictCard";
import MetricsBar from "./components/MetricsBar";
import SemanticExplanation from "./components/SemanticExplanation";
import AuditTrigger from "./components/AuditTrigger";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import ErrorAlert from "../../shared/components/ErrorAlert";

export default function Dashboard() {
  const { data, loading, error, refetch } = useAuditReport();

  const handleAuditComplete = () => {
    // Cuando la auditoría termina, volvemos a obtener el reporte más reciente
    refetch();
  };

  // --- Render del layout principal siempre, para poder lanzar auditorías aunque no haya datos ---

  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner />;
    }

    if (error && !data) {
      return <ErrorAlert message={error} onRetry={refetch} />;
    }

    if (!data) {
      return (
        <div className="glass rounded-2xl p-8 text-center mt-8">
          <span className="text-4xl mb-3 block">📊</span>
          <h3 className="text-xl font-bold text-white mb-2">
            No hay reportes de auditoría
          </h3>
          <p className="text-surface-400">
            Utiliza el panel superior para analizar un sitio web y generar el primer reporte.
          </p>
        </div>
      );
    }

    // --- Extraer datos del JSON-LD ---
    const verdict = data["onto:fuzzyVerdict"] || {};
    const recommendations = data["onto:Recommendation"] || [];
    const score = verdict["schema:value"] ?? 0;
    const verdictDescription = verdict["schema:description"] ?? "Moderado";

    return (
      <div className="space-y-8 mt-8">
        {/* ── Encabezado del reporte ── */}
        <ReportHeader
          name={data["schema:name"]}
          url={data["schema:url"]}
          dateCreated={data["schema:dateCreated"]}
          onRefresh={refetch}
        />

        {/* ── Veredicto de lógica difusa ── */}
        <VerdictCard score={score} description={verdictDescription} />

        {/* ── Métrica principal ── */}
        <div className="glass rounded-2xl p-6 animate-[slide-up_0.5s_ease-out_100ms_both]">
          <h3 className="text-sm font-semibold text-surface-400 uppercase tracking-wider mb-4">
            Puntuación General
          </h3>
          <MetricsBar
            label="Índice de Mantenimiento"
            value={score}
            delay={200}
          />
        </div>

        {/* ── Explicación semántica (recomendaciones) ── */}
        <SemanticExplanation recommendations={recommendations} />
      </div>
    );
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Panel superior para lanzar nueva auditoría */}
        <AuditTrigger onAuditComplete={handleAuditComplete} />

        {/* Contenido del reporte actual o estados vacíos */}
        {renderContent()}

        {/* ── Footer informativo ── */}
        <footer className="text-center py-6 border-t border-surface-800/50 mt-12 animate-[fade-in_0.5s_ease-out_500ms_both]">
          <p className="text-xs text-surface-600">
            Reporte generado por{" "}
            <span className="text-primary-400 font-medium">SEM-Web-Advisor</span>
            {" · "}Sistema Inteligente de Mantenimiento Web Semántico
          </p>
          <p className="text-xs text-surface-700 mt-1">
            Powered by FastAPI · NumPy (Fuzzy) · Linked Data (JSON-LD)
          </p>
        </footer>
      </div>
    </div>
  );
}
