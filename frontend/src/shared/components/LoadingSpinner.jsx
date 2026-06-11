/**
 * LoadingSpinner.jsx — Spinner animado para estados de carga.
 * Muestra una animación visual mientras se obtienen los datos del backend.
 */

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-[fade-in_0.3s_ease-out]">
      {/* Spinner con gradiente */}
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-surface-800 border-t-primary-500 animate-spin" />
        <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-b-primary-300 animate-spin [animation-direction:reverse] [animation-duration:1.5s]" />
      </div>

      {/* Texto */}
      <div className="text-center">
        <p className="text-lg font-semibold text-surface-300">
          Cargando reporte de auditoría
        </p>
        <p className="text-sm text-surface-500 mt-1">
          Conectando con el sistema de análisis semántico...
        </p>
      </div>
    </div>
  );
}
