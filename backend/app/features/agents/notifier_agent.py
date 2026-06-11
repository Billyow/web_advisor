"""
notifier_agent.py — Agente Notificador (SPADE).

Responsabilidades:
- Recibe el reporte JSON-LD del ExpertAgent.
- Notifica al frontend o simula el log de la notificación.
"""
import json
from spade.agent import Agent
from spade.behaviour import CyclicBehaviour

class NotifierAgent(Agent):
    """
    Agente SPADE encargado de notificar sobre nuevos reportes.
    """
    class NotifyBehaviour(CyclicBehaviour):
        async def run(self):
            msg = await self.receive(timeout=10)
            if msg:
                print(f"[Notifier] Reporte recibido de {msg.sender}")
                report = json.loads(msg.body)
                
                print("="*50)
                print("🔔 NUEVA NOTIFICACIÓN: REPORTE GENERADO 🔔")
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

    async def setup(self):
        print(f"[Notifier] Agente {self.jid} iniciado.")
        b = self.NotifyBehaviour()
        self.add_behaviour(b)

    async def notify(self, report_id: str) -> None:
        """ Stub method """
        pass
