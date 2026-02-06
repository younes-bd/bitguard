from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views as api # Alias to keep existing references working
from .views import CustomTokenObtainPairView, VerifyLoginOTPView, RegisterView, ChangePasswordView



router = DefaultRouter()
router.register(r'users', api.UserViewSet, basename='user')
router.register(r'profile', api.ProfileViewSet, basename='profile')
router.register(r'security/devices', api.DeviceViewSet, basename='device')
router.register(r'security/logs', api.LoginActivityViewSet, basename='login_activity')
router.register(r'addresses', api.AddressViewSet, basename='address')
router.register(r'connections', api.ConnectionViewSet, basename='connection')
router.register(r'shared-resources', api.SharedResourceViewSet, basename='shared_resource')

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    # Auth (JWT)
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'), 
    path('login/', CustomTokenObtainPairView.as_view(), name='auth_login'), # Frontend uses this
    path('login/verify-otp/', VerifyLoginOTPView.as_view(), name='auth_login_verify_otp'),
    path('test/', api.TestConnectionView.as_view(), name='test_connection'), # Diagnostic
    path('debug-login/', api.DebugLoginView.as_view(), name='debug_login'), # Deep Diagnostic
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # Auth (Custom API)
    path('register/', api.RegisterView.as_view(), name='auth_register'),
    path('change-password/', api.ChangePasswordView.as_view(), name='auth_change_password'),
    
    # 2FA
    path('2fa/generate/', api.Generate2FAView.as_view(), name='2fa_generate'),
    path('2fa/verify/', api.Verify2FAView.as_view(), name='2fa_verify'),
    path('download/personal-data/', api.DownloadDataView.as_view(), name='download_personal_data'),

    # Manually map 'me' action for singleton-like access
    path('me/', api.UserViewSet.as_view({'get': 'me', 'patch': 'me', 'put': 'me'}), name='user_me'),
    
    # Include router URLs (users/, profile/)
    path('', include(router.urls)),
]