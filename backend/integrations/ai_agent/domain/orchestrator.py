import logging
from .models import AgentProfile, AgentRunLog
from .tools import ERPTools
from integrations.ai_engine.services import AiEngineService

logger = logging.getLogger(__name__)

class AgentOrchestrator:
    """
    The ReAct (Reason + Act) loop for autonomous virtual employees.
    """
    
    @classmethod
    def handle_event(cls, role: str, context: dict, tenant_id: str):
        """
        Triggered when something happens in the ERP (e.g., a ticket is created).
        """
        try:
            # 1. Fetch the active agent for this role
            agent = AgentProfile.objects.get(role=role, is_active=True, tenant_id=tenant_id)
        except AgentProfile.DoesNotExist:
            logger.info(f"No active AI Agent found for role: {role}. Aborting.")
            return

        logger.info(f"Waking up AI Agent: {agent.name}")
        
        # 2. Setup the Run Log for auditing
        run_log = AgentRunLog.objects.create(
            agent=agent,
            tenant_id=tenant_id,
            triggered_by_model=context.get('model', ''),
            triggered_by_id=context.get('id', '')
        )
        
        thoughts = []
        actions_taken = []
        
        # 3. The Orchestration Loop (Simplified Mock for now)
        try:
            thoughts.append(f"Analyzing context: {context}")
            
            # Here we would normally send the Agent's system_prompt + context to the ai_engine
            # Example: AiEngineService.generate_response(agent.system_prompt, context)
            
            if 'password' in str(context).lower():
                # Agent decides to use a tool
                thoughts.append("I should search the knowledge base for password reset instructions.")
                if 'search_knowledge_base' in agent.allowed_tools:
                    result = ERPTools.search_knowledge_base("password reset")
                    actions_taken.append({"tool": "search_knowledge_base", "result": result})
                    thoughts.append("Found instructions. Replying to user.")
                else:
                    thoughts.append("I do not have permission to search the knowledge base. Escalating.")
                    result = ERPTools.escalate_to_human(context.get('id'), "Missing permissions")
                    actions_taken.append({"tool": "escalate_to_human", "result": result})
            
            # Save the final log
            run_log.thoughts = "\n".join(thoughts)
            run_log.actions_taken = actions_taken
            run_log.save()
            
        except Exception as e:
            logger.error(f"Agent {agent.name} crashed during loop: {e}")
            run_log.status = 'failed'
            run_log.thoughts += f"\nCRITICAL ERROR: {e}"
            run_log.save()
