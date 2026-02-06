from .models import SecurityAlert, SecurityIncident, RemediationAction

class ScoringEngine:
    @staticmethod
    def calculate_score(alert):
        """
        Calculates a score (0-100) for a SecurityAlert based on severity and context.
        """
        severity_map = {
            'critical': 100,
            'high': 75,
            'medium': 40,
            'low': 10,
            'informational': 5
        }
        
        base_score = severity_map.get(alert.severity, 10)
        
        # Contextual weights (using raw_data instead of contextual_data)
        context = alert.raw_data or {}
        weights = context.get('weights', {})
        
        score = base_score
        
        if weights.get('asset_criticality'):
            score += 20
        if weights.get('repeat_events'):
            score += 15
        if weights.get('threat_intel_match'):
            score += 25
            
        return min(100, score)

class RuleEngine:
    @staticmethod
    def evaluate(alert):
        """
        Maps a SecurityAlert to a playbook action based on rules.
        """
        if alert.severity == 'critical' and alert.source == 'endpoint_security':
            return 'isolate_asset'
            
        if alert.severity == 'high' and alert.source == 'email_security':
            return 'quarantine_email'
            
        if alert.severity == 'critical' and 'brute force' in alert.title.lower():
            return 'block_ip_firewall'

        return None

class PlaybookService:
    @staticmethod
    def execute(playbook_name, alert, user=None):
        """
        Executes a playbook action.
        """
        # Placeholder for task execution (e.g. Celery)
        # from .tasks import isolate_asset_task, ...
        
        result = "No Action"
        
        if playbook_name == 'isolate_asset':
            # Logic to isolate asset
            # asset_id = ...
            result = "Asset isolation initiated"
                
        elif playbook_name == 'block_ip_firewall':
            result = "Firewall block rule created"
                
        elif playbook_name == 'quarantine_email':
             result = "Email quarantine request sent"
        
        # Log action
        # RemediationAction.objects.create(...)
                 
        return f"Task Executed: {result}"
