/**
 * ReportHeader.jsx — Encabezado del reporte de auditoría.
 * Muestra el nombre del reporte, URL auditada, fecha y un botón para refrescar.
 */

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
    <header className="animate-[slide-up_0.5s_ease-out]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Título y metadatos */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary-600/20 flex items-center justify-center">
              <span className="text-xl">🛡️</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {name || "SEM-Web-Advisor"}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-surface-400">
            {/* URL auditada */}
            <span className="inline-flex items-center gap-1.5">
              <svg className="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-400 hover:text-primary-300 underline underline-offset-2 transition-colors"
              >
                {url}
              </a>
            </span>

            {/* Fecha */}
            <span className="inline-flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 9v9.75" />
              </svg>
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Botón de refrescar */}
        <button
          onClick={onRefresh}
          className="self-start inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
                     glass text-sm font-medium text-surface-300
                     hover:text-white hover:bg-white/10 transition-all duration-200
                     cursor-pointer active:scale-95"
          title="Actualizar reporte"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
          </svg>
          Actualizar
        </button>
      </div>
    </header>
  );
}
