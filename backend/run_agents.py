import asyncio
import json
import uuid
from spade.message import Message

# Importamos los agentes
from app.features.agents.analyzer_agent import AnalyzerAgent
from app.features.agents.expert_agent import ExpertAgent
from app.features.agents.notifier_agent import NotifierAgent

async def main():
    # Generamos identificadores aleatorios para no colisionar en el servidor público
    run_id = str(uuid.uuid4())[:8]
    analyzer_jid = f"analyzer_{run_id}@xmpp.jp"
    expert_jid = f"expert_{run_id}@xmpp.jp"
    notifier_jid = f"notifier_{run_id}@xmpp.jp"
    
    password = f"testpass_{run_id}"

    # Instanciar agentes
    analyzer = AnalyzerAgent(analyzer_jid, password)
    expert = ExpertAgent(expert_jid, password)
    notifier = NotifierAgent(notifier_jid, password)

    # Configurar rutas de comunicación (Knowledge del agente)
    analyzer.set("expert_jid", expert_jid)
    expert.set("notifier_jid", notifier_jid)

    print("Iniciando agentes...")
    await notifier.start(auto_register=True)
    await expert.start(auto_register=True)
    await analyzer.start(auto_register=True)

    print("Agentes iniciados. Esperando a que se conecten...")
    await asyncio.sleep(5)  # Dar tiempo a conectar al servidor XMPP

    # Simular una petición desde el "Frontend" o la API
    print("\n--- Simulando petición de análisis para 'https://ejemplo.com' ---")
    msg = Message(to=analyzer_jid)
    msg.set_metadata("performative", "request")
    msg.body = json.dumps({"url": "https://ejemplo.com"})
    
    # Podemos enviar el mensaje usando uno de los agentes activos (ej. el analyzer enviándose a sí mismo)
    await analyzer.client.send(msg)

    # Mantener el script corriendo para dar tiempo a que los mensajes viajen
    print("\n[Sistema] Esperando 10 segundos para procesar los mensajes...")
    await asyncio.sleep(10)
    
    print("Deteniendo agentes...")
    await analyzer.stop()
    await expert.stop()
    await notifier.stop()
    print("Agentes detenidos. Fin del programa.")

if __name__ == "__main__":
    asyncio.run(main())
