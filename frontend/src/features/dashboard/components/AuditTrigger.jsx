import { useState } from "react";
import { Search, AlertTriangle, Loader2, Sparkles } from "lucide-react";
import { apiClient } from "../../../shared/api/client";

export default function AuditTrigger({ onAuditComplete }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError(null);

    try {
      // Usar la ruta correcta del backend para iniciar la auditoría
      const report = await apiClient("/audit-reports/audit", {
        method: "POST",
        body: JSON.stringify({ url }),
      });

      onAuditComplete(report);
      setUrl("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 max-w-3xl w-full relative">
      {/* Formulario de auditoría */}
      <form onSubmit={handleSubmit} className="flex gap-2 w-full">
        <div className="relative flex-1">
          <input
            type="url"
            required
            placeholder="Analizar nueva URL... (ej: https://ejemplo.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
            className="w-full py-3.5 pl-6 pr-14 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15]
                       text-base text-white placeholder-surface-500 font-medium
                       focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 
                       transition-all duration-300 ease-out
                       disabled:opacity-50"
          />
          <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none">
            <Search size={18} className="text-surface-400" />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading || !url}
          className="px-6 py-3.5 rounded-xl text-base font-bold text-white
                     bg-indigo-600 hover:bg-indigo-500
                     active:scale-[0.98] shadow-md
                     focus:outline-none focus:ring-2 focus:ring-indigo-500/40
                     transition-all duration-300 ease-out
                     disabled:opacity-40 disabled:cursor-not-allowed
                     flex items-center justify-center min-w-[140px] cursor-pointer shrink-0"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 size={18} className="animate-spin text-white/90" />
              <span>Analizando…</span>
            </span>
          ) : (
            "Auditar"
          )}
        </button>
      </form>

      {error && (
        <div className="absolute top-full left-0 mt-2 p-2 rounded bg-critical/10 border border-critical/20 text-critical text-xs flex items-center gap-1.5 z-50">
          <AlertTriangle size={14} className="flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
