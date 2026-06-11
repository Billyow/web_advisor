import numpy as np

def fuzzy_evaluate(acc: float, perf: float, seo: float):
    """
    Motor de lógica difusa implementado manualmente.
    Entradas: Accesibilidad, Rendimiento, SEO (0-100)
    Salida: (score_final, label)
    
    Mapeo de reglas simple:
    - Urgente: Promedio bajo o alguna métrica muy baja.
    - Moderado: Promedio medio.
    - Aceptable: Promedio alto y ninguna métrica crítica.
    """
    
    # Calcular promedios y mínimos
    avg_score = (acc + perf + seo) / 3.0
    min_score = min(acc, perf, seo)
    
    # Determinar el veredicto difuso usando una regla simplificada
    if min_score < 40 or avg_score < 60:
        label = "Urgente"
    elif min_score < 70 or avg_score < 80:
        label = "Moderado"
    else:
        label = "Aceptable"
        
    # Calcular un 'maintenance_score' que representa el estado general
    # 0 = Pésimo, 100 = Excelente
    final_score = avg_score * 0.7 + min_score * 0.3
    
    return float(final_score), label
