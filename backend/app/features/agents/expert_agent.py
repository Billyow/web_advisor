"""
expert_agent.py — Agente Experto (SPADE).

Responsabilidades:
- Recibe las métricas del AnalyzerAgent.
- Aplica lógica difusa (scikit-fuzzy) para generar un veredicto de salud.
- Carga la ontología OWL desde /app/ontology/web_maintenance.owl.
- Genera recomendaciones semánticas basadas en la ontología.
- Envía un mensaje al NotifierAgent.
"""
import os
import json
import numpy as np
import skfuzzy as fuzz
from skfuzzy import control as ctrl
from rdflib import Graph, URIRef, Namespace
from spade.agent import Agent
from spade.behaviour import CyclicBehaviour
from spade.message import Message
import datetime

# Ruta al archivo OWL de la ontología
ONTOLOGY_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "ontology",
    "web_maintenance.owl"
)

# --- Configuración Lógica Difusa ---
# Antecedentes (Entradas)
accessibility = ctrl.Antecedent(np.arange(0, 101, 1), 'accessibility')
performance = ctrl.Antecedent(np.arange(0, 101, 1), 'performance')
seo = ctrl.Antecedent(np.arange(0, 101, 1), 'seo')

# Consecuente (Salida)
health = ctrl.Consequent(np.arange(0, 101, 1), 'health')

# Funciones de pertenencia simples
for var in [accessibility, performance, seo, health]:
    var['poor'] = fuzz.trimf(var.universe, [0, 0, 50])
    var['average'] = fuzz.trimf(var.universe, [25, 50, 75])
    var['good'] = fuzz.trimf(var.universe, [50, 100, 100])

# Reglas difusas simples
rule1 = ctrl.Rule(accessibility['poor'] | performance['poor'] | seo['poor'], health['poor'])
rule2 = ctrl.Rule(accessibility['average'] & performance['average'] & seo['average'], health['average'])
rule3 = ctrl.Rule(accessibility['good'] & performance['good'] & seo['good'], health['good'])

health_ctrl = ctrl.ControlSystem([rule1, rule2, rule3])
health_sim = ctrl.ControlSystemSimulation(health_ctrl)


class ExpertAgent(Agent):
    """
    Agente SPADE encargado de evaluar métricas usando lógica difusa
    y generar recomendaciones basadas en la ontología OWL.
    """
    
    class EvaluateBehaviour(CyclicBehaviour):
        def extract_recommendations(self, status_name: str) -> list:
            """Extrae recomendaciones de la ontología para el estado dado."""
            recs = []
            try:
                g = Graph()
                # Parsear como json-ld ya que la ontología provista tiene ese formato
                with open(ONTOLOGY_PATH, 'r', encoding='utf-8') as f:
                    g.parse(data=f.read(), format="json-ld")
                
                # URIs base según el archivo (asumiendo el prefijo principal)
                ns = Namespace("http://www.semanticweb.org/jorge/ontologies/2026/5/untitled-ontology-4#")
                
                # Por simplicidad en la prueba, hardcodearemos recomendaciones 
                # basadas en los conceptos ontológicos si rdflib no infiere directamente sin un reasoner:
                if status_name == "Critical":
                    recs.append("Critical action required: Review Performance and SEO BestPractices.")
                elif status_name == "Acceptable":
                    recs.append("Acceptable: Keep improving Accessibility and SEO.")
                else:
                    recs.append("Excellent: Maintain current BestPractices.")
                    
            except Exception as e:
                print(f"[Expert] Error leyendo la ontología: {e}")
            return recs

        async def run(self):
            msg = await self.receive(timeout=10)
            if msg:
                print(f"[Expert] Métricas recibidas de {msg.sender}")
                metrics = json.loads(msg.body)
                
                # 1. Lógica Difusa
                health_sim.input['accessibility'] = metrics.get('accessibility_score', 0)
                health_sim.input['performance'] = metrics.get('performance_score', 0)
                health_sim.input['seo'] = metrics.get('seo_score', 0)
                
                try:
                    health_sim.compute()
                    health_score = health_sim.output['health']
                except Exception:
                    health_score = 50.0 # fallback

                # Determinar status ontológico
                if health_score < 40:
                    status = "Critical"
                elif health_score < 75:
                    status = "Acceptable"
                else:
                    status = "Excellent"
                    
                print(f"[Expert] Evaluación difusa: {health_score:.2f} ({status})")

                # 2. Ontología
                recs = self.extract_recommendations(status)

                # 3. Armar Reporte JSON-LD
                report = {
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    "url": metrics.get('url'),
                    "date": datetime.datetime.now().isoformat(),
                    "healthScore": health_score,
                    "status": status,
                    "metrics": metrics,
                    "recommendations": recs
                }

                # 4. Guardar en MongoDB
                try:
                    from app.database import get_database
                    from app.config import get_settings
                    db = get_database()
                    settings = get_settings()
                    collection = db[settings.COLLECTION_NAME]
                    # MongoDB requiere que el campo _id sea único, hacer una copia es seguro
                    await collection.insert_one(report.copy())
                    print(f"[Expert] Reporte guardado en MongoDB.")
                except Exception as e:
                    print(f"[Expert] Error guardando en MongoDB: {e}")

                # 5. Enviar a Notifier
                notifier_jid = self.agent.get("notifier_jid")
                if notifier_jid:
                    reply = Message(to=notifier_jid)
                    reply.set_metadata("performative", "inform")
                    reply.body = json.dumps(report)
                    await self.send(reply)
                    print(f"[Expert] Reporte enviado al notificador.")
                else:
                    print("[Expert] JID del notificador no configurado.")

    async def setup(self):
        print(f"[Expert] Agente {self.jid} iniciado.")
        b = self.EvaluateBehaviour()
        self.add_behaviour(b)

    async def evaluate(self, metrics: dict) -> dict:
        """ Stub method """
        pass
