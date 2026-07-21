from rest_framework.views import exception_handler
from apps.core.utils.response import standard_response
import logging

logger = logging.getLogger(__name__)

def custom_exception_handler(exc, context):
    """
    Custom exception handler to conform with the uniform `standard_response` structure.
    """
    response = exception_handler(exc, context)

    if response is not None:
        errors = response.data
        if isinstance(errors, dict) and 'detail' in errors:
            message = str(errors['detail'])
            errors = None
        else:
            message = "Validation Error"
            
        return standard_response(
            success=False,
            message=message,
            data=None,
            errors=errors,
            status=response.status_code
        )

    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return standard_response(
        success=False,
        message="A system error occurred.",
        data=None,
        errors=str(exc),
        status=500
    )
