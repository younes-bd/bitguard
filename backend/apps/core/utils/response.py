from rest_framework.response import Response

def standard_response(success, message, data=None, errors=None, status=200):
    """
    Standardize the API response format across all endpoints.
    """
    response_data = {
        "success": success,
        "message": message,
        "data": data if data is not None else {},
        "errors": errors if errors is not None else None
    }
    return Response(response_data, status=status)
