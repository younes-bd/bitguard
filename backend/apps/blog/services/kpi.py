import logging
logger = logging.getLogger(__name__)

def get_kpis(tenant=None, date_range='30days'):
    return {"blog": {"posts": 0}}
