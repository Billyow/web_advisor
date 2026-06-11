/**
 * urgencyConfig.js — Mapeo de niveles de urgencia a colores, iconos y etiquetas.
 * Usado por VerdictCard, UrgencyBadge y RecommendationCard para mantener
 * consistencia visual en toda la interfaz.
 */

import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle,
  XCircle,
  AlertCircle,
  CheckCircle2,
  Accessibility,
  Puzzle,
  Search,
  TrendingUp,
  Zap,
  Rocket,
  Lock,
  Shield,
  ClipboardCheck,
  Sparkles,
  HelpCircle
} from "lucide-react";

/**
 * Configuración visual para cada nivel de urgencia del veredicto difuso.
 * Las claves coinciden con los valores de onto:fuzzyVerdict → schema:description.
 */
export const VERDICT_CONFIG = {
  Urgente: {
    label: "Mantenimiento Urgente",
    description: "Se requiere acción inmediata. Múltiples problemas críticos detectados.",
    color: "text-critical",
    bgColor: "bg-critical/10",
    borderColor: "border-critical/30",
    glowColor: "shadow-[0_0_30px_rgba(239,68,68,0.25)]",
    ringColor: "stroke-critical",
    icon: AlertOctagon,
    pulseAnimation: true,
  },
  Moderado: {
    label: "Mantenimiento Moderado",
    description: "Existen problemas que deben atenderse pronto para evitar degradación.",
    color: "text-warning",
    bgColor: "bg-warning/10",
    borderColor: "border-warning/30",
    glowColor: "shadow-[0_0_30px_rgba(245,158,11,0.25)]",
    ringColor: "stroke-warning",
    icon: AlertTriangle,
    pulseAnimation: false,
  },
  Aceptable: {
    label: "Estado Aceptable",
    description: "El sitio se encuentra en buen estado. Revisiones menores sugeridas.",
    color: "text-acceptable",
    bgColor: "bg-acceptable/10",
    borderColor: "border-acceptable/30",
    glowColor: "shadow-[0_0_30px_rgba(16,185,129,0.25)]",
    ringColor: "stroke-acceptable",
    icon: CheckCircle,
    pulseAnimation: false,
  },
};

/**
 * Configuración visual para cada nivel de estado de recomendación.
 * Las claves coinciden con onto:hasStatus → @id (sin el prefijo "onto:").
 */
export const STATUS_CONFIG = {
  Critical: {
    label: "Crítico",
    color: "text-critical",
    bgColor: "bg-critical/10",
    borderColor: "border-critical/30",
    dotColor: "bg-critical",
    icon: XCircle,
  },
  Warning: {
    label: "Advertencia",
    color: "text-warning",
    bgColor: "bg-warning/10",
    borderColor: "border-warning/30",
    dotColor: "bg-warning",
    icon: AlertCircle,
  },
  Acceptable: {
    label: "Aceptable",
    color: "text-acceptable",
    bgColor: "bg-acceptable/10",
    borderColor: "border-acceptable/30",
    dotColor: "bg-acceptable",
    icon: CheckCircle2,
  },
};

/**
 * Configuración visual para cada categoría de acción sugerida.
 * Las claves coinciden con onto:suggestsAction → @id (sin el prefijo "onto:").
 */
export const ACTION_CONFIG = {
  Accessibility: {
    label: "Accesibilidad",
    icon: Accessibility,
    emoji: Puzzle,
    description: "Estándares WCAG y acceso universal",
  },
  SEO: {
    label: "SEO",
    icon: Search,
    emoji: TrendingUp,
    description: "Optimización para motores de búsqueda",
  },
  Performance: {
    label: "Rendimiento",
    icon: Zap,
    emoji: Rocket,
    description: "Velocidad y Core Web Vitals",
  },
  Security: {
    label: "Seguridad",
    icon: Lock,
    emoji: Shield,
    description: "Protección y buenas prácticas de seguridad",
  },
  BestPractices: {
    label: "Buenas Prácticas",
    icon: ClipboardCheck,
    emoji: Sparkles,
    description: "Estándares y convenciones web modernas",
  },
};

/**
 * Extrae el nombre corto de un IRI de la ontología.
 * Ej: "onto:Critical" → "Critical"
 *
 * @param {string} iri - IRI completo (ej: "onto:Critical")
 * @returns {string} Nombre corto
 */
export function extractOntologyName(iri) {
  if (!iri) return "Unknown";
  // Manejar tanto "onto:Critical" como URIs completos
  const parts = iri.split(/[#:/]/);
  return parts[parts.length - 1] || "Unknown";
}

/**
 * Obtiene la configuración de un veredicto por su descripción.
 * Retorna un fallback seguro si el veredicto no está mapeado.
 */
export function getVerdictConfig(description) {
  return VERDICT_CONFIG[description] || VERDICT_CONFIG["Moderado"];
}

/**
 * Obtiene la configuración de un estado por su IRI.
 */
export function getStatusConfig(statusIri) {
  const name = extractOntologyName(statusIri);
  return STATUS_CONFIG[name] || STATUS_CONFIG["Warning"];
}

/**
 * Obtiene la configuración de una acción por su IRI.
 */
export function getActionConfig(actionIri) {
  const name = extractOntologyName(actionIri);
  return ACTION_CONFIG[name] || { label: name, icon: HelpCircle, emoji: HelpCircle, description: "" };
}
