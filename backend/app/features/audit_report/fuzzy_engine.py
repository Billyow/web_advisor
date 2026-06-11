import numpy as np
import skfuzzy as fuzz
from skfuzzy import control as ctrl

def fuzzy_evaluate(acc: float, perf: float, seo: float):
    """
    Motor de lógica difusa implementado con scikit-fuzzy.
    Entradas: Accesibilidad, Rendimiento, SEO (0-100)
    Salida: (score_final, label)
    """
    
    # --- 1. Definir variables de entrada y salida ---
    
    # Entradas (Antecedentes)
    accessibility = ctrl.Antecedent(np.arange(0, 101, 1), 'accessibility')
    performance = ctrl.Antecedent(np.arange(0, 101, 1), 'performance')
    seo_var = ctrl.Antecedent(np.arange(0, 101, 1), 'seo')
    
    # Salida (Consecuente)
    urgency = ctrl.Consequent(np.arange(0, 101, 1), 'urgency')
    
    # --- 2. Funciones de membresía (triangulares) ---
    
    for var in [accessibility, performance, seo_var]:
        var['poor'] = fuzz.trimf(var.universe, [0, 0, 50])
        var['average'] = fuzz.trimf(var.universe, [20, 50, 80])
        var['good'] = fuzz.trimf(var.universe, [50, 100, 100])
        
    urgency['urgent'] = fuzz.trimf(urgency.universe, [0, 0, 50])
    urgency['moderate'] = fuzz.trimf(urgency.universe, [20, 50, 80])
    urgency['acceptable'] = fuzz.trimf(urgency.universe, [50, 100, 100])
    
    # --- 3. Reglas difusas ---
    
    # Reglas para 'Urgente' (cualquier métrica muy baja)
    rule1 = ctrl.Rule(accessibility['poor'] | performance['poor'] | seo_var['poor'], urgency['urgent'])
    
    # Reglas para 'Aceptable' (todas las métricas altas)
    rule2 = ctrl.Rule(accessibility['good'] & performance['good'] & seo_var['good'], urgency['acceptable'])
    
    # Regla general para el resto ('Moderado')
    rule3 = ctrl.Rule(
        (accessibility['average'] | performance['average'] | seo_var['average']) & 
        ~(accessibility['poor'] | performance['poor'] | seo_var['poor']), 
        urgency['moderate']
    )
    
    # --- 4. Sistema de control e Inferencia ---
    
    urgency_ctrl = ctrl.ControlSystem([rule1, rule2, rule3])
    engine = ctrl.ControlSystemSimulation(urgency_ctrl)
    
    # --- 5. Computar ---
    
    engine.input['accessibility'] = acc
    engine.input['performance'] = perf
    engine.input['seo'] = seo
    
    try:
        engine.compute()
        score_final = engine.output['urgency']
        
        # Determinar etiqueta basada en el centroide
        if score_final < 40:
            label = "Urgente"
        elif score_final < 70:
            label = "Moderado"
        else:
            label = "Aceptable"
            
        return float(score_final), label
        
    except Exception as e:
        # Fallback en caso de que las reglas no cubran el espacio de entrada
        # (Aunque las reglas actuales deberían cubrir todo)
        avg = (acc + perf + seo) / 3
        if avg < 40:
            return float(avg), "Urgente"
        elif avg < 70:
            return float(avg), "Moderado"
        else:
            return float(avg), "Aceptable"
