/**
 * Dashboard.jsx — Página principal del SEM-Web-Advisor.
 * Orquesta todos los componentes del dashboard, los envuelve dentro de un
 * recuadro maestro centrado en pantalla, y maneja los estados de carga y error.
 */

import { BarChart3, ShieldCheck, Sparkles } from "lucide-react";
import { useAuditReport } from "./hooks/useAuditReport";
import ReportHeader from "./components/ReportHeader";
import VerdictCard from "./components/VerdictCard";
import SemanticExplanation from "./components/SemanticExplanation";
import AuditTrigger from "./components/AuditTrigger";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import ErrorAlert from "../../shared/components/ErrorAlert";

export default function Dashboard() {
  const { data, loading, error, refetch } = useAuditReport();

  const handleAuditComplete = () => {
    refetch();
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="py-12 flex justify-center items-center">
          <LoadingSpinner />
        </div>
      );
    }

    if (error && !data) {
      return (
        <div className="py-4">
          <ErrorAlert message={error} onRetry={refetch} />
        </div>
      );
    }

    if (!data) {
      return (
        <div className="p-8 sm:p-12 text-center bg-white/[0.02] border border-white/[0.04] rounded-2xl animate-[fade-in_0.5s_ease-out]">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 ring-1 ring-indigo-500/20">
            <BarChart3 size={30} className="text-indigo-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            No hay reportes de auditoría
          </h3>
          <p className="text-xs sm:text-sm text-surface-400 max-w-sm mx-auto leading-relaxed">
            Utiliza el panel superior para analizar un sitio web y generar el primer reporte.
          </p>
        </div>
      );
    }

    const verdict = data["onto:fuzzyVerdict"] || {};
    const recommendations = data["onto:Recommendation"] || [];
    const score = verdict["schema:value"] ?? 0;
    const verdictDescription = verdict["schema:description"] ?? "Moderado";

    return (
      <div className="flex flex-col gap-6 w-full animate-[fade-in_0.5s_ease-out]">
        <ReportHeader
          name={data["schema:name"]}
          url={data["schema:url"]}
          dateCreated={data["schema:dateCreated"]}
          onRefresh={refetch}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Columna Izquierda: Fuzzy Score (Sticky & Full Height) */}
          <div className="lg:col-span-4 h-auto lg:h-[calc(100vh-160px)] lg:sticky lg:top-24">
            <VerdictCard score={score} description={verdictDescription} data={data} />
          </div>

          {/* Columna Derecha: Recomendaciones */}
          <div className="lg:col-span-8">
            <SemanticExplanation recommendations={recommendations} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full relative">
      {/* Luces de fondo decorativas */}
      <div className="fixed top-[-10%] left-[-5%] w-[45%] h-[45%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-5%] right-[-5%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none" />

      {/* Navegación Global (Header) */}
      <nav className="w-full sticky top-0 z-50 bg-[#050a18]/80 backdrop-blur-3xl border-b border-white/[0.06] shadow-xl">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-12 py-5 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-4 shrink-0 w-full md:w-auto">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-500/15 ring-1 ring-indigo-500/25 shadow-inner">
              <ShieldCheck size={26} className="text-indigo-400" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-black text-white tracking-tight leading-none">
                SEM-Web-Advisor
              </h1>
              <p className="text-[11px] text-surface-400 mt-1.5 font-bold uppercase tracking-widest">
                Mantenimiento Inteligente
              </p>
            </div>
          </div>

          <div className="w-full md:w-auto flex-1 max-w-3xl flex justify-end">
            <AuditTrigger onAuditComplete={handleAuditComplete} />
          </div>

        </div>
      </nav>

      {/* Contenido Principal */}
      <main className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-12 py-8 w-full relative z-10 flex flex-col min-h-[calc(100vh-80px)]">
        
        {/* Contenido dinámico del reporte o estado de carga */}
        <div className="flex-1">
          {renderContent()}
        </div>

        {/* Footer integrado */}
        <footer className="pt-8 pb-4 mt-8 border-t border-white/[0.04]">
          <div className="text-center flex flex-col gap-2">
            <p className="text-xs text-surface-500 flex items-center justify-center gap-1.5 flex-wrap">
              <Sparkles size={12} className="text-indigo-500/50" />
              Reporte generado por{" "}
              <span className="text-indigo-400 font-medium">SEM-Web-Advisor</span>
              {" · "}Sistema Inteligente de Mantenimiento Web Semántico
              <Sparkles size={12} className="text-indigo-500/50" />
            </p>
            <p className="text-[11px] text-surface-600 font-medium">
              Powered by FastAPI · scikit-fuzzy · Linked Data (JSON-LD)
            </p>
          </div>
        </footer>

      </main>
    </div>
  );
}
