/**
 * client.js — API client wrapper para comunicarse con el backend FastAPI.
 * Centraliza la URL base y el manejo de errores.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

/**
 * Realiza una petición al backend y retorna los datos parseados.
 *
 * @param {string} endpoint - Ruta relativa del endpoint (ej: "/audit-reports/latest")
 * @param {object} options - Opciones adicionales para fetch
 * @returns {Promise<any>} Datos de respuesta parseados como JSON
 * @throws {Error} Si la respuesta no es OK
 */
export async function apiClient(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(
      errorBody.detail || `Error ${response.status}: ${response.statusText}`
    );
  }

  return response.json();
}
