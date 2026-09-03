from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.contrib.auth import get_user_model
import jwt
from django.conf import settings

User = get_user_model()

@database_sync_to_async
def get_user(validated_token):
    try:
        user = User.objects.get(id=validated_token["user_id"])
        return user
    except User.DoesNotExist:
        return AnonymousUser()

class JWTAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        query_string = parse_qs(scope["query_string"].decode())
        token = query_string.get("token")
        
        if not token:
            scope["user"] = AnonymousUser()
            return await self.inner(scope, receive, send)

        try:
            # This validates the token and raises an error if invalid
            UntypedToken(token[0])
            # Decode the payload to get user_id
            decoded_data = jwt.decode(token[0], settings.SECRET_KEY, algorithms=["HS256"])
            scope["user"] = await get_user(decoded_data)
        except (InvalidToken, TokenError, jwt.DecodeError, Exception) as e:
            scope["user"] = AnonymousUser()

        return await self.inner(scope, receive, send)

def JWTAuthMiddlewareStack(inner):
    from channels.auth import AuthMiddlewareStack
    return JWTAuthMiddleware(AuthMiddlewareStack(inner))
