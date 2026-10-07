class SettingsRegistry:
    def __init__(self):
        self._settings = {}

    def register(self, key, default, setting_type='string', app_name='system', description=''):
        """Registers a configuration key into the master schema."""
        self._settings[key] = {
            'default': default,
            'type': setting_type,
            'app': app_name,
            'description': description
        }

    def get_all(self):
        return self._settings

    def get(self, key):
        return self._settings.get(key)

# Singleton Instance
settings_registry = SettingsRegistry()
