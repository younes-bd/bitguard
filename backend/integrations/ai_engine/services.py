import logging
import tiktoken
import openai
from decimal import Decimal
from typing import Tuple, Optional

logger = logging.getLogger(__name__)

# Cost per 1000 tokens (GPT pricing — update as needed)
COST_TABLE = {
    'gpt-4o':        {'prompt': Decimal('0.005'),   'completion': Decimal('0.015')},
    'gpt-4o-mini':   {'prompt': Decimal('0.00015'), 'completion': Decimal('0.0006')},
    'gpt-3.5-turbo': {'prompt': Decimal('0.0005'),  'completion': Decimal('0.0015')},
}


class AiEngineService:
    """
    Tier-1 LLM Gateway — multi-provider adapter (OpenAI).
    All methods are tenant-aware: they read AISettings for the active tenant
    to determine the correct provider and API key.
    """

    # ─────────────────────────────────────────────────────────────
    # PRIVATE HELPERS
    # ─────────────────────────────────────────────────────────────

    @classmethod
    def _get_settings(cls, tenant):
        """Fetches the AISettings row for the given tenant. Returns None if not configured."""
        try:
            from integrations.ai_engine.models import AISettings
            return AISettings.objects.filter(tenant=tenant, is_active=True).first()
        except Exception as e:
            logger.error(f"[ai_engine] Failed to fetch AISettings for tenant {tenant}: {e}")
            return None

    @classmethod
    def _get_openai_key(cls, settings_obj) -> Optional[str]:
        """Returns tenant API key if set, else falls back to the global Django setting."""
        from django.conf import settings as django_settings
        if settings_obj and settings_obj.openai_api_key:
            return settings_obj.openai_api_key
        return getattr(django_settings, 'OPENAI_API_KEY', None)

    @classmethod
    def _log_usage(cls, tenant, user, provider: str, feature: str,
                   prompt_tokens: int, completion_tokens: int, model: str):
        """Writes an AIUsageLog record for billing and analytics."""
        try:
            from integrations.ai_engine.models import AIUsageLog
            costs = COST_TABLE.get(model, COST_TABLE['gpt-4o-mini'])
            cost = (
                (Decimal(prompt_tokens) / 1000 * costs['prompt']) +
                (Decimal(completion_tokens) / 1000 * costs['completion'])
            )
            AIUsageLog.objects.create(
                tenant=tenant,
                user=user,
                provider=provider,
                feature=feature,
                tokens_used=prompt_tokens + completion_tokens,
                cost_usd=cost,
            )
        except Exception as e:
            logger.warning(f"[ai_engine] Failed to write usage log: {e}")

    # ─────────────────────────────────────────────────────────────
    # PUBLIC API
    # ─────────────────────────────────────────────────────────────

    @classmethod
    def generate_text(cls, prompt: str, system_prompt: str = '',
                      tenant=None, user=None, feature_name: str = 'generic',
                      model: str = 'gpt-4o-mini') -> str:
        """
        Core generic text generator. Used by AgentOrchestrator and any
        ERP module that needs LLM output. Raises RuntimeError on failure.
        """
        ai_settings = cls._get_settings(tenant)
        api_key = cls._get_openai_key(ai_settings)

        if not api_key:
            raise RuntimeError(
                "AI Engine is not configured. Please set your OpenAI API key "
                "in Settings → Integrations → AI Engine."
            )

        openai.api_key = api_key
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        logger.info(f"[ai_engine] generate_text | feature={feature_name} | model={model}")

        try:
            response = openai.ChatCompletion.create(
                model=model,
                messages=messages,
                temperature=0.7,
                max_tokens=1500,
            )
            content = response.choices[0].message.content.strip()
            usage = response.get('usage', {})
            cls._log_usage(
                tenant=tenant, user=user, provider='openai',
                feature=feature_name,
                prompt_tokens=usage.get('prompt_tokens', 0),
                completion_tokens=usage.get('completion_tokens', 0),
                model=model,
            )
            return content
        except openai.error.AuthenticationError:
            raise RuntimeError("Invalid OpenAI API key. Please update it in Settings → Integrations.")
        except openai.error.RateLimitError:
            raise RuntimeError("OpenAI rate limit reached. Please try again shortly.")
        except Exception as e:
            logger.error(f"[ai_engine] generate_text failed: {e}")
            raise RuntimeError(f"AI Engine error: {e}")

    @classmethod
    def count_tokens(cls, text: str, model: str = 'gpt-4o') -> int:
        """Returns the token count of a string without making an API call."""
        try:
            enc = tiktoken.get_encoding('cl100k_base')
            return len(enc.encode(text))
        except Exception as e:
            logger.warning(f"[ai_engine] count_tokens fallback: {e}")
            return len(text) // 4  # Rough fallback: ~4 chars per token

    @classmethod
    def summarize_text(cls, text: str, tenant=None, user=None) -> str:
        """Summarizes long blocks of text (e.g., helpdesk tickets, lead notes)."""
        system = (
            "You are a professional business analyst. "
            "Summarize the following text concisely in 2-3 sentences."
        )
        return cls.generate_text(
            prompt=text, system_prompt=system,
            tenant=tenant, user=user, feature_name='summarize_text',
        )

    @classmethod
    def extract_entities(cls, text: str, tenant=None, user=None) -> dict:
        """
        Extracts structured data from raw text (e.g., parsing a lead email).
        Returns a dict: {name, company, email, phone, intent}.
        """
        import json
        system = (
            "You are a CRM data extractor. Extract the following fields from the text as JSON: "
            "name, company, email, phone, intent. Use null for any missing field."
        )
        raw = cls.generate_text(
            prompt=text, system_prompt=system,
            tenant=tenant, user=user, feature_name='extract_entities',
        )
        try:
            clean = raw.strip().removeprefix('```json').removeprefix('```').removesuffix('```').strip()
            return json.loads(clean)
        except Exception:
            logger.warning(f"[ai_engine] extract_entities could not parse JSON response.")
            return {"name": None, "company": None, "email": None, "phone": None, "intent": raw}

    @classmethod
    def triage_ticket(cls, title: str, description: str,
                      tenant=None, user=None) -> Tuple[str, str, str]:
        """
        Auto-categorizes and prioritizes a helpdesk ticket.
        Returns: (priority, category, reasoning)
        """
        import json
        system = (
            "You are a Tier-1 IT helpdesk triage expert. "
            "Given a ticket title and description, respond ONLY with a JSON object with keys: "
            "priority (critical|high|medium|low), category (string), reasoning (string)."
        )
        raw = cls.generate_text(
            prompt=f"Title: {title}\n\nDescription: {description}",
            system_prompt=system,
            tenant=tenant, user=user, feature_name='triage_ticket',
        )
        try:
            clean = raw.strip().removeprefix('```json').removeprefix('```').removesuffix('```').strip()
            data = json.loads(clean)
            return (
                data.get('priority', 'medium'),
                data.get('category', 'general'),
                data.get('reasoning', ''),
            )
        except Exception:
            return ('medium', 'general', raw)

