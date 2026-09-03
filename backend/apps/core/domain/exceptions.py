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

    from django.core.exceptions import ObjectDoesNotExist
    if isinstance(exc, ObjectDoesNotExist):
        # If a user is deleted but sends an old JWT, it triggers DoesNotExist during token refresh.
        # Returning 401 allows the frontend to log the user out cleanly instead of crashing on a 500.
        status_code = 401 if 'jwt' in getattr(context.get('request'), 'path', '') else 404
        return standard_response(
            success=False,
            message="Resource not found.",
            data=None,
            errors=str(exc),
            status=status_code
        )

    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return standard_response(
        success=False,
        message="A system error occurred.",
        data=None,
        errors=str(exc),
        status=500
    )
