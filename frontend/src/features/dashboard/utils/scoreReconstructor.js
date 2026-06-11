/**
 * scoreReconstructor.js — Reconstructor de scores individuales.
 * Reconstruye las puntuaciones de Accesibilidad, SEO y Rendimiento
 * para reportes antiguos que no contienen estas variables directamente.
 */

import { extractOntologyName } from "./urgencyConfig";

/**
 * Reconstruye o extrae las puntuaciones de un reporte JSON-LD.
 * 
 * @param {object} report — Reporte de auditoría
 * @returns {{ accessibility: number, performance: number, seo: number }}
 */
export function reconstructScores(report) {
  if (!report) {
    return { accessibility: 100, performance: 100, seo: 100 };
  }

  const verdict = report["onto:fuzzyVerdict"] || {};

  // Si el reporte ya cuenta con los scores guardados por el backend rediseñado, usarlos directamente
  const hasSavedScores = 
    verdict["onto:accessibilityScore"] !== undefined &&
    verdict["onto:performanceScore"] !== undefined &&
    verdict["onto:seoScore"] !== undefined;

  if (hasSavedScores) {
    return {
      accessibility: verdict["onto:accessibilityScore"],
      performance: verdict["onto:performanceScore"],
      seo: verdict["onto:seoScore"]
    };
  }

  // Si no, reconstruirlos heurísticamente a partir de las recomendaciones
  const recommendations = report["onto:Recommendation"] || [];
  
  let accessibility = 100;
  let seo = 100;
  let performance = 100; // Por defecto es 100 si no hay problemas de carga

  recommendations.forEach((rec) => {
    const actionIri = rec["onto:suggestsAction"]?.["@id"] || "";
    const actionName = extractOntologyName(actionIri);
    const description = rec["schema:description"] || "";
    const statusIri = rec["onto:hasStatus"]?.["@id"] || "";
    const statusName = extractOntologyName(statusIri);

    if (actionName === "Accessibility") {
      // 1. Penalización por imágenes sin alt: penalty = min(40, count * 5)
      const imgMatch = description.match(/(\d+)\s+etiquetas\s+<img>/i);
      if (imgMatch) {
        const count = parseInt(imgMatch[1], 10);
        accessibility -= Math.min(40, count * 5);
      }
      // 2. Falta de atributo lang: penalty = 10
      if (description.includes("Falta el atributo 'lang'")) {
        accessibility -= 10;
      }
      // Penalización genérica si no coincide con los patrones pero existe el problema
      if (!imgMatch && !description.includes("Falta el atributo 'lang'")) {
        accessibility -= statusName === "Critical" ? 20 : 10;
      }
    } 
    else if (actionName === "SEO") {
      // 1. Falta de etiqueta title: penalty = 30
      if (description.includes("Falta la etiqueta <title>")) {
        seo -= 30;
      }
      // 2. Falta de meta description: penalty = 30
      if (description.includes("Falta la etiqueta <meta name='description'>")) {
        seo -= 30;
      }
      // 3. No se encontró h1: penalty = 20
      if (description.includes("No se encontró ninguna etiqueta <h1>")) {
        seo -= 20;
      }
      // 4. Múltiples h1s: penalty = 10
      if (description.includes("etiquetas <h1>. Se recomienda usar solo una")) {
        seo -= 10;
      }
      // Penalización genérica
      if (
        !description.includes("Falta la etiqueta <title>") &&
        !description.includes("Falta la etiqueta <meta name='description'>") &&
        !description.includes("No se encontró ninguna etiqueta <h1>") &&
        !description.includes("etiquetas <h1>. Se recomienda usar solo una")
      ) {
        seo -= statusName === "Critical" ? 20 : 10;
      }
    } 
    else if (actionName === "Performance") {
      // 1. Error de conexión: score = 0
      if (description.includes("Error al conectar")) {
        performance = 0;
      }
      // 2. Tiempo de carga lento o mejorable: perf_score = max(0, min(100, 100 - (load_time - 1) * 25))
      const timeMatch = description.match(/(\d+\.\d+)s/);
      if (timeMatch) {
        const loadTime = parseFloat(timeMatch[1]);
        const calcScore = 100 - (loadTime - 1) * 25;
        performance = Math.max(0, Math.min(100, calcScore));
      }
    }
  });

  return {
    accessibility: Math.max(0, accessibility),
    seo: Math.max(0, seo),
    performance: Math.max(0, performance)
  };
}
