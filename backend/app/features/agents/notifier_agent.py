"""
notifier_agent.py — Agente Notificador (SPADE).

Responsabilidades:
- Recibe el reporte JSON-LD del ExpertAgent.
- Notifica al frontend (vía WebSocket o polling) que hay un nuevo reporte disponible.
- Opcionalmente envía alertas por email si el veredicto es "Urgente".

TODO: Implementar la clase SPADE con los behaviours correspondientes.
"""


class NotifierAgent:
    """
    Agente SPADE encargado de notificar sobre nuevos reportes.

    Ejemplo de uso:
        agent = NotifierAgent("notifier@xmpp-server", "password")
        await agent.start()
    """

    def __init__(self, jid: str, password: str):
        self.jid = jid
        self.password = password

    async def notify(self, report_id: str) -> None:
        """
        Notifica que un nuevo reporte está disponible.

        Args:
            report_id: Identificador del reporte generado.
        """
        # TODO: Implementar notificación vía WebSocket o email
        raise NotImplementedError("Implementar notificación con SPADE")
