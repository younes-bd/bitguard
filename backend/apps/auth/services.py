class AuthService:
    @staticmethod
    def verify_otp(user, token):
        import pyotp
        if not user.mfa_enabled or not user.mfa_secret:
            raise ValueError("MFA is not enabled for this account.")
        totp = pyotp.TOTP(user.mfa_secret)
        if not totp.verify(token):
            raise ValueError("Invalid OTP token.")
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(user)
        return {
            'refresh_token': str(refresh),
            'access_token': str(refresh.access_token),
            'user_id': str(user.id)
        }
