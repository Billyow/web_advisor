/**
 * useAuditReport.js — Hook personalizado para obtener el último reporte de auditoría.
 * Maneja estados de carga, error y datos.
 */

import { useState, useEffect, useCallback } from "react";
import { apiClient } from "../../../shared/api/client";

/**
 * Hook que obtiene el último reporte de auditoría del backend.
 *
 * @returns {{ data: object|null, loading: boolean, error: string|null, refetch: function }}
 */
export function useAuditReport() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReport = useCallback(async () => {
    await Promise.resolve();
    setLoading(true);
    setError(null);

    try {
      const report = await apiClient("/audit-reports/latest");
      setData(report);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchReport();
  }, [fetchReport]);

  return {
    data,
    loading,
    error,
    refetch: fetchReport,
  };
}
