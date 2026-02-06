from rest_framework import viewsets, permissions, generics, views, response, status, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.db.models import Q
from .models import Profile, LoginActivity, Device, OTP, Address, Connection, SharedResource
from .serializers import (
    UserSerializer, ProfileSerializer, LoginActivitySerializer,
    DeviceSerializer, RegisterSerializer, OTPSerializer, VerifyOTPSerializer, PasswordChangeSerializer,
    AddressSerializer, ConnectionSerializer, SharedResourceSerializer
)
from .services import OTPService, EmailService, DeviceService

User = get_user_model()

class TestConnectionView(views.APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request):
        return Response({"status": "ok", "message": "Backend is reachable"})
    def post(self, request):
        return Response({"status": "ok", "data": request.data})


class DebugLoginView(views.APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request):
        from django.contrib.auth import authenticate
        username = request.query_params.get('username', 'admin')
        password = request.query_params.get('password', 'dummy')
        try:
            print(f"DEBUG LOGIN: Authenticating {username}...")
            user = authenticate(username=username, password=password)
            if user:
                return Response({"status": "success", "user": str(user)})
            else:
                return Response({"status": "failed", "detail": "Authentication returned None (Invalid credentials or logic)"})
        except Exception as e:
            import traceback
            tb = traceback.format_exc()
            print(f"DEBUG LOGIN CRASH: {tb}")
            return Response({"status": "error", "error": str(e), "traceback": tb}, status=500)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

class ChangePasswordView(generics.UpdateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PasswordChangeSerializer

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            
            # Update last changed timestamp
            if hasattr(self.object, 'profile'):
                self.object.profile.password_last_changed = timezone.now()
                self.object.profile.save()
                
            return Response({"status": "success", "message": "Password updated successfully"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserViewSet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.ListModelMixin, mixins.DestroyModelMixin, viewsets.GenericViewSet):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return User.objects.all().order_by('-date_joined')
        return User.objects.filter(id=self.request.user.id)

    def get_object(self):
        # Override to ensure we look up from queryset, not just 'users/me'
        # Default implementation uses lookup_field (pk) against get_queryset()
        # But we previously hardcoded return self.request.user.
        # We need to restore standard behavior for PK lookups, but keep 'me' logic separate.
        # However, 'me' is a separate action.
        # Standard ViewSet get_object uses PK.
        return super().get_object()

    @action(detail=False, methods=['get', 'patch', 'put'])
    def me(self, request):
        # Track device on every profile access (active session)
        if request.user.is_authenticated:
            DeviceService.track_device(request.user, request)
            
        user = self.request.user
        if request.method == 'GET':
            serializer = self.get_serializer(user)
            return Response(serializer.data)
        elif request.method in ['PATCH', 'PUT']:
            serializer = self.get_serializer(user, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

class ProfileViewSet(viewsets.ModelViewSet):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Profile.objects.all()

    def get_queryset(self):
        return Profile.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get', 'patch', 'put'])
    def me(self, request):
        # Track device
        if request.user.is_authenticated:
            DeviceService.track_device(request.user, request)
            
        profile, created = Profile.objects.get_or_create(user=request.user)
        if request.method == 'GET':
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        elif request.method in ['PATCH', 'PUT']:
            serializer = self.get_serializer(profile, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

class LoginActivityViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = LoginActivitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return LoginActivity.objects.filter(user=self.request.user).order_by('-timestamp')

class DeviceViewSet(viewsets.ModelViewSet):
    serializer_class = DeviceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Device.objects.filter(user=self.request.user)

class AddressViewSet(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ConnectionViewSet(viewsets.ModelViewSet):
    serializer_class = ConnectionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return connections where I am sender or receiver
        user = self.request.user
        return Connection.objects.filter(Q(from_user=user) | Q(to_user=user))

    def create(self, request, *args, **kwargs):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            to_user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User with this email does not exist.'}, status=status.HTTP_404_NOT_FOUND)
            
        if to_user == request.user:
            return Response({'error': 'You cannot invite yourself.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if already connected
        if Connection.objects.filter(
            (Q(from_user=request.user) & Q(to_user=to_user)) | 
            (Q(from_user=to_user) & Q(to_user=request.user))
        ).exists():
             return Response({'error': 'Connection already exists or pending.'}, status=status.HTTP_400_BAD_REQUEST)

        connection = Connection.objects.create(
            from_user=request.user,
            to_user=to_user,
            status='pending'
        )
        
        # Optionally send email notification here
        
        serializer = self.get_serializer(connection)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        conn = self.get_object()
        if conn.to_user != request.user:
            return Response({'error': 'Not authorized'}, status=403)
        conn.status = 'accepted'
        conn.save()
        return Response({'status': 'accepted'})

class SharedResourceViewSet(viewsets.ModelViewSet):
    serializer_class = SharedResourceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return SharedResource.objects.filter(Q(owner=user) | Q(shared_with=user))

    def perform_create(self, serializer):
        # owner is me
        serializer.save(owner=self.request.user)

class Generate2FAView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        # Use Service Logic
        code = OTPService.generate_otp(request.user, type='2fa')
        
        # Send Email
        sent = EmailService.send_otp_email(request.user, code)
        
        if sent:
            return Response({
                'status': 'sent',
                'message': 'OTP sent to your email',
                'mock_code': code if settings.DEBUG else None 
            })
        return Response({'error': 'Failed to send email'}, status=500)

class Verify2FAView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        if serializer.is_valid():
            code = serializer.validated_data['code']
            if OTPService.verify_otp(request.user, code, type='2fa'):
                return Response({'status': 'verified', 'message': '2FA verified successfully'})
            return Response({'error': 'Invalid or expired code'}, status=400)
        return Response(serializer.errors, status=400)

class DownloadDataView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        data = {
            "username": user.username,
            "email": user.email,
            "joined": str(user.date_joined),
            "profile": ProfileSerializer(user.profile).data,
            "login_history": LoginActivitySerializer(user.login_activities.all(), many=True).data,
            "devices": DeviceSerializer(user.devices.all(), many=True).data,
        }
        return Response(data)

from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import authenticate

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        try:
            # 1. Standard Authentication Check (Username/Password)
            data = request.data.copy()
            if 'email' in data and 'username' not in data:
                data['username'] = data['email']
                
            username = data.get('username')
            password = data.get('password')
            
            # We try to find the user first to track activity
            user = authenticate(request, username=username, password=password)

            if user is None:
                return Response({"detail": "No active account found with the given credentials"}, status=401)

            # 2. Login Logic
            # Track Device
            DeviceService.track_device(user, request)

            # Check 2FA
            try:
                profile = user.profile
                if profile.two_factor_auth:
                    # 2FA Flow
                    code = OTPService.generate_otp(user, type='2fa')
                    EmailService.send_otp_email(user, code)
                    
                    # Identify partial login?
                    # We return a specific structure telling frontend to switch to OTP input
                    return Response({
                        "action": "require_otp",
                        "detail": "2FA is enabled. Please enter the code sent to your email.",
                        "temp_user_id": user.id  # Encrypt this in production!
                    }, status=202)
            except Profile.DoesNotExist:
                pass

            # 3. Standard JWT Issue (No 2FA or 2FA passed)
            # Use our modified data which has username
            serializer = self.get_serializer(data=data)

            try:
                serializer.is_valid(raise_exception=True)
            except Exception as e:
                return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

            response = Response(serializer.validated_data, status=status.HTTP_200_OK)
            
            if response.status_code == 200:
                DeviceService.track_login(user, request, status='success')
            else:
                DeviceService.track_login(user, request, status='failed')
                
            return response

        except Exception as e:
            import traceback
            print(f"LOGIN EXCEPTION: {traceback.format_exc()}")
            return Response({"detail": "Internal Login Error", "error": str(e)}, status=500)


class VerifyLoginOTPView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        user_id = request.data.get('user_id')
        code = request.data.get('code')
        
        if not user_id or not code:
            return Response({"error": "User ID and Code code required"}, status=400)
            
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
            
        if OTPService.verify_otp(user, code, type='2fa'):
            # Success! Generate Tokens manually
            from rest_framework_simplejwt.tokens import RefreshToken
            refresh = RefreshToken.for_user(user)
            
            DeviceService.track_login(user, request, status='success_OTP')
            
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        
        # Failed
        DeviceService.track_login(user, request, status='failed_OTP')
        return Response({"error": "Invalid code"}, status=400)