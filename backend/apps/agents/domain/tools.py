import logging

logger = logging.getLogger(__name__)

class ERPTools:
    """
    Registry of strictly typed tools the AI Agent is allowed to call.
    """
    
    @classmethod
    def get_tool(cls, tool_name):
        tools = {
            "read_ticket": cls.read_ticket,
            "escalate_to_human": cls.escalate_to_human,
            "search_knowledge_base": cls.search_knowledge_base
        }
        return tools.get(tool_name)

    @staticmethod
    def read_ticket(ticket_id: str) -> str:
        """Fetches the details of a helpdesk ticket."""
        # In a real scenario, this queries apps.helpdesk.domain.models.Ticket
        logger.info(f"Agent executing tool: read_ticket({ticket_id})")
        return f"Ticket {ticket_id}: Customer is asking for a password reset."

    @staticmethod
    def escalate_to_human(ticket_id: str, reason: str) -> str:
        """Assigns the ticket to a human agent."""
        logger.warning(f"Agent executing tool: escalate_to_human({ticket_id}) Reason: {reason}")
        return "Ticket escalated successfully."

    @staticmethod
    def search_knowledge_base(query: str) -> str:
        """Searches the company FAQ."""
        logger.info(f"Agent executing tool: search_knowledge_base({query})")
        return "Knowledge Base Result: To reset a password, click 'Forgot Password' on the login screen."
