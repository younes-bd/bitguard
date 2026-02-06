from django.contrib.auth import get_user_model

class EmailAuthBackend(object):
    """
    Authenticate using E-mail address OR Username.
    This acts as a 'Universal' backend to prevent fallback crashes.
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        print(f"UniversalAuthBackend: Attempting login for: {username}")
        User = get_user_model()
        try:
            # Try by Email
            try:
                user = User.objects.get(email=username)
            except User.DoesNotExist:
                # Try by Username
                try:
                    user = User.objects.get(username=username)
                except User.DoesNotExist:
                    print("UniversalAuthBackend: No user found.")
                    return None
            
            if user.check_password(password):
                if hasattr(user, 'is_active') and not user.is_active:
                    print("UniversalAuthBackend: User is inactive.")
                    return None
                print("UniversalAuthBackend: Success.")
                return user
            else:
                print("UniversalAuthBackend: Wrong password.")
                return None

        except Exception as e:
            print(f"UniversalAuthBackend Critical Error: {str(e)}")
            return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None