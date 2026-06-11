"""
analyzer_agent.py — Agente Analizador (SPADE).

Responsabilidades:
- Recibe la URL objetivo a auditar mediante un mensaje SPADE.
- Ejecuta el análisis técnico (simulado para accesibilidad, rendimiento, SEO).
- Envía las métricas recopiladas al ExpertAgent para evaluación.
"""
import json
import random
import asyncio
from spade.agent import Agent
from spade.behaviour import CyclicBehaviour
from spade.message import Message

class AnalyzerAgent(Agent):
    """
    Agente SPADE encargado de analizar una página web.
    Recopila métricas de accesibilidad, rendimiento y SEO.
    """
    class AnalyzeBehaviour(CyclicBehaviour):
        async def run(self):
            print("[Analyzer] Esperando peticiones de análisis...")
            msg = await self.receive(timeout=10)
            if msg:
                print(f"[Analyzer] Mensaje recibido de {msg.sender}: {msg.body}")
                data = json.loads(msg.body)
                url = data.get("url", "unknown")
                
                print(f"[Analyzer] Iniciando análisis simulado para la URL: {url}")
                await asyncio.sleep(2) # Simular tiempo de scraping
                
                # Datos básicos y simulados
                metrics = {
                    "url": url,
                    "accessibility_score": random.randint(40, 100),
                    "performance_score": random.randint(30, 100),
                    "seo_score": random.randint(50, 100)
                }
                
                print(f"[Analyzer] Análisis completado. Enviando métricas al Experto...")
                expert_jid = self.agent.get("expert_jid")
                if expert_jid:
                    reply = Message(to=expert_jid)
                    reply.set_metadata("performative", "inform")
                    reply.body = json.dumps(metrics)
                    await self.send(reply)
                else:
                    print("[Analyzer] Error: JID del Agente Experto no configurado.")

    async def setup(self):
        print(f"[Analyzer] Agente {self.jid} iniciado.")
        b = self.AnalyzeBehaviour()
        self.add_behaviour(b)

    async def analyze(self, url: str) -> dict:
        """ Método stub si se quisiera llamar directamente sin mensajes SPADE """
        pass

