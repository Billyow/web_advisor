/**
 * ReportHeader.jsx — Barra de estado del reporte de auditoría.
 * Muestra el título, URL auditada, fecha y un botón para refrescar,
 * todo dentro de una tarjeta glass compacta estilo status-bar.
 */

import { ShieldCheck, Globe, Calendar, RefreshCw } from "lucide-react";

/**
 * @param {object} props
 * @param {string} props.name — Nombre del reporte (schema:name)
 * @param {string} props.url — URL auditada (schema:url)
 * @param {string} props.dateCreated — Fecha ISO (schema:dateCreated)
 * @param {function} props.onRefresh — Callback para re-obtener el reporte
 */
export default function ReportHeader({ name, url, dateCreated, onRefresh }) {
  // Formatear la fecha a formato legible en español
  const formattedDate = new Date(dateCreated).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <header className="animate-[slide-up_0.5s_ease-out] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Metadatos (URL y Fecha) */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                     bg-indigo-500/10 border border-indigo-500/20 text-sm font-medium text-indigo-300
                     hover:bg-indigo-500/20 hover:border-indigo-500/30 hover:text-indigo-200
                     transition-colors duration-200"
          title={url}
        >
          <Globe size={14} className="shrink-0" />
          <span className="truncate max-w-[200px] sm:max-w-md">{url}</span>
        </a>

        <span
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                     bg-white/5 border border-white/10 text-sm font-medium text-surface-300"
        >
          <Calendar size={14} className="shrink-0" />
          {formattedDate}
        </span>
      </div>

      {/* Botón de refrescar */}
      <button
        onClick={onRefresh}
        className="group inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg
                   bg-white/5 border border-white/10 text-sm font-semibold text-white
                   hover:bg-white/10 hover:border-white/20
                   transition-all duration-300 cursor-pointer active:scale-[0.98] shrink-0"
        title="Actualizar reporte"
      >
        <RefreshCw
          size={14}
          className="transition-transform duration-500 group-hover:rotate-180"
        />
        Actualizar Resultados
      </button>
    </header>
  );
}
