from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.mail import send_mail
from django.conf import settings
from apps.core.utils.response import standard_response
from apps.core.services.audit import AuditService
from .serializers import (
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
    CustomTokenObtainPairSerializer,
)

User = get_user_model()


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        AuditService.log_action(
            request,
            action="USER_LOGIN",
            resource=f"users.User:{serializer.validated_data.get('user_id', 'unknown')}",
            payload={"method": "JWT"},
        )
        return standard_response(True, "Login successful", serializer.validated_data)


class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        return standard_response(True, "Token refreshed", serializer.validated_data)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            AuditService.log_action(request, action="USER_LOGOUT", resource=f"users.User:{request.user.pk}")
            return standard_response(True, "Successfully logged out")
        except Exception as e:
            return standard_response(False, "Failed to log out", errors=str(e), status=400)


class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        # Use Django's built-in password reset token mechanism
        try:
            user = User.objects.get(email=email)
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))

            reset_url = f"{getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')}/reset-password/{uid}/{token}/"

            send_mail(
                subject="BitGuard — Password Reset Request",
                message=(
                    f"Hi {user.first_name or user.username},\n\n"
                    f"You requested a password reset. Click the link below:\n\n"
                    f"{reset_url}\n\n"
                    f"This link expires in 24 hours. If you did not request this, ignore this email.\n\n"
                    f"— BitGuard Security Team"
                ),
                from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@bitguard.tech'),
                recipient_list=[email],
                fail_silently=True,  # Don't expose whether email exists via errors
            )
        except User.DoesNotExist:
            pass  # Silently succeed — do not reveal whether email is registered

        # Always return success to prevent email enumeration attacks
        return standard_response(True, "If an account with that email exists, a reset link has been sent.")


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        uid_b64 = serializer.validated_data.get('uid')
        token = serializer.validated_data.get('token')
        new_password = serializer.validated_data.get('new_password')

        try:
            uid = force_str(urlsafe_base64_decode(uid_b64))
            user = User.objects.get(pk=uid)
        except (User.DoesNotExist, ValueError, TypeError, OverflowError):
            return standard_response(False, "Invalid password reset link.", status=400)

        if not default_token_generator.check_token(user, token):
            return standard_response(False, "Password reset link is invalid or has expired.", status=400)

        user.set_password(new_password)
        user.save()

        AuditService.log_action(
            request,
            action="USER_PASSWORD_RESET",
            resource=f"users.User:{user.pk}",
            payload={"method": "token"},
        )
        return standard_response(True, "Your password has been reset successfully. You can now log in.")
