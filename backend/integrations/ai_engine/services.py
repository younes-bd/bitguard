from apps.core.services.base import BaseService

class AiEngineService(BaseService):
    """
    Stub for AI-assisted operations.
    Charter Compliance: AI decision logic must live here.
    """
    @staticmethod
    def process_prompt(request, prompt):
        # Implementation to be added in future sprints
        pass

    @staticmethod
    def triage_ticket(ticket_title, ticket_description):
        """
        Analyzes the ticket title and description to auto-categorize priority.
        Returns a tuple: (suggested_priority, suggested_category, reasoning)
        """
        content = f"{ticket_title} {ticket_description}".lower()
        
        # Simple heuristic fallback for the demo
        if any(keyword in content for keyword in ['breach', 'ransomware', 'down', 'outage', 'critical']):
            return ('critical', 'security', 'Critical keywords detected.')
        elif any(keyword in content for keyword in ['urgent', 'password', 'access']):
            return ('high', 'access', 'High urgency keywords detected.')
        elif any(keyword in content for keyword in ['bug', 'error', 'broken']):
            return ('medium', 'bug', 'Medium severity issues identified.')
        
        return ('low', 'general', 'Standard inquiry.')
