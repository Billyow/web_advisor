import asyncio
import json
from app.features.agents.analyzer_agent import AnalyzerAgent
from app.features.agents.expert_agent import ExpertAgent
from app.features.agents.notifier_agent import NotifierAgent
from spade.message import Message

async def test_logic():
    print("=== Iniciando Prueba Local de Lógica Difusa y Ontología ===\n")
    
    # 1. Simular la salida del AnalyzerAgent (lo que enviaría por red)
    mock_metrics = {
        "url": "https://ejemplo.com",
        "accessibility_score": 30, # Pobre
        "performance_score": 45,   # Pobre/Regular
        "seo_score": 80            # Bueno
    }
    
    print(f"1. [AnalyzerAgent] Métricas analizadas: {mock_metrics}")
    print("   Enviando a ExpertAgent...\n")
    
    # 2. Instanciar el comportamiento del ExpertAgent y probar la lógica directamente
    # Para aislar la lógica de red de SPADE, llamamos al bloque lógico directamente
    expert = ExpertAgent("dummy@test", "pass")
    behaviour = expert.EvaluateBehaviour()
    
    # En lugar de await self.receive(), inyectamos los datos y procesamos
    # Extraemos la lógica que escribimos en expert_agent.py:
    import numpy as np
    import skfuzzy as fuzz
    from skfuzzy import control as ctrl
    from rdflib import Graph, URIRef, Namespace
    import os
    import datetime
    
    ONTOLOGY_PATH = os.path.join(os.path.dirname(__file__), "app", "ontology", "web_maintenance.owl")
    # Forzamos la ruta al archivo para test_logic
    ONTOLOGY_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "app", "ontology", "web_maintenance.owl"))
    
    # Redefinimos la función mock para el test
    def extract_recommendations_mock(status_name: str) -> list:
        recs = []
        try:
            g = Graph()
            with open(ONTOLOGY_PATH, 'r', encoding='utf-8') as f:
                g.parse(data=f.read(), format="json-ld")
            if status_name == "Critical":
                recs.append("Critical action required: Review Performance and SEO BestPractices.")
            elif status_name == "Acceptable":
                recs.append("Acceptable: Keep improving Accessibility and SEO.")
            else:
                recs.append("Excellent: Maintain current BestPractices.")
        except Exception as e:
            print(f"[Expert] Error leyendo la ontología: {e}")
        return recs
    
    # -- Lógica Difusa --
    accessibility = ctrl.Antecedent(np.arange(0, 101, 1), 'accessibility')
    performance = ctrl.Antecedent(np.arange(0, 101, 1), 'performance')
    seo = ctrl.Antecedent(np.arange(0, 101, 1), 'seo')
    health = ctrl.Consequent(np.arange(0, 101, 1), 'health')

    for var in [accessibility, performance, seo, health]:
        var['poor'] = fuzz.trimf(var.universe, [0, 0, 50])
        var['average'] = fuzz.trimf(var.universe, [25, 50, 75])
        var['good'] = fuzz.trimf(var.universe, [50, 100, 100])

    rule1 = ctrl.Rule(accessibility['poor'] | performance['poor'] | seo['poor'], health['poor'])
    rule2 = ctrl.Rule(accessibility['average'] & performance['average'] & seo['average'], health['average'])
    rule3 = ctrl.Rule(accessibility['good'] & performance['good'] & seo['good'], health['good'])

    health_ctrl = ctrl.ControlSystem([rule1, rule2, rule3])
    health_sim = ctrl.ControlSystemSimulation(health_ctrl)
    
    health_sim.input['accessibility'] = mock_metrics['accessibility_score']
    health_sim.input['performance'] = mock_metrics['performance_score']
    health_sim.input['seo'] = mock_metrics['seo_score']
    health_sim.compute()
    health_score = health_sim.output['health']
    
    if health_score < 40:
        status = "Critical"
    elif health_score < 75:
        status = "Acceptable"
    else:
        status = "Excellent"
        
    print(f"2. [ExpertAgent] Lógica difusa aplicada.")
    print(f"   -> Score global de salud: {health_score:.2f}")
    print(f"   -> Veredicto ontológico: {status}")
    
    # -- Ontología --
    recs = extract_recommendations_mock(status)
    print(f"   -> Recomendaciones inferidas: {recs}\n")
    
    # 3. Armar Reporte
    report = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "url": mock_metrics['url'],
        "date": datetime.datetime.now().isoformat(),
        "healthScore": health_score,
        "status": status,
        "metrics": mock_metrics,
        "recommendations": recs
    }
    
    # 4. Simular NotifierAgent
    print("3. [NotifierAgent] Procesando reporte entrante...")
    print("="*50)
    print(">>> NUEVA NOTIFICACION: REPORTE GENERADO <<<")
    print(f"URL Auditada: {report.get('url')}")
    print(f"Score Global: {report.get('healthScore'):.2f}/100")
    print(f"Status Ontológico: {report.get('status')}")
    print("Métricas Crudas:")
    for k, v in report.get('metrics', {}).items():
        if k != 'url':
            print(f"  - {k}: {v}")
    print("Recomendaciones:")
    for rec in report.get('recommendations', []):
        print(f"  - {rec}")
    print("="*50)

if __name__ == "__main__":
    asyncio.run(test_logic())
