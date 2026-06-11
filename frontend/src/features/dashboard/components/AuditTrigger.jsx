import { useState } from "react";
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
    <div className="glass-light rounded-3xl p-8 animate-[slide-up_0.5s_ease-out]">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">🔍</span>
        <div>
          <h2 className="text-xl font-bold text-white">Nueva Auditoría</h2>
          <p className="text-sm text-surface-400">Ingresa la URL del sitio web a analizar</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="url"
          required
          placeholder="https://ejemplo.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
          className="flex-1 px-4 py-3 rounded-xl bg-surface-900/50 border border-surface-700 
                     text-white placeholder-surface-500 focus:outline-none focus:border-primary-500
                     focus:ring-1 focus:ring-primary-500 transition-all disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !url}
          className="px-6 py-3 rounded-xl bg-primary-600 text-white font-medium
                     hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                     focus:ring-offset-surface-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center min-w-[140px]"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analizando...
            </span>
          ) : (
            "Analizar Sitio"
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-critical/10 border border-critical/30 text-critical text-sm flex items-start gap-2">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
