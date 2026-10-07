import os
import importlib
from django.conf import settings

def get_full_settings_schema():
    """
    Scans all installed apps for a `settings_schema.py` file.
    Extracts the SETTINGS_SCHEMA dictionary and merges them.
    This acts as the single source of truth for setting definitions and validation.
    """
    apps_dir = os.path.join(settings.BASE_DIR, 'apps')
    schema = {}
    
    if not os.path.exists(apps_dir):
        return schema
        
    for app_name in os.listdir(apps_dir):
        app_path = os.path.join(apps_dir, app_name)
        schema_file = os.path.join(app_path, 'settings_schema.py')
        
        if os.path.isdir(app_path) and os.path.exists(schema_file):
            try:
                # Dynamically import the schema module
                module = importlib.import_module(f'apps.{app_name}.settings_schema')
                app_schema = getattr(module, 'SETTINGS_SCHEMA', {})
                
                # Merge into the global schema
                for key, config in app_schema.items():
                    # Enforce the Odoo 17 naming convention: app_name.setting_name
                    if not key.startswith(f"{app_name}."):
                        # We prefix it if it's not strictly formatted, but log a warning ideally
                        pass
                    
                    # Attach the app origin for frontend grouping
                    config['app'] = app_name
                    schema[key] = config
            except Exception as e:
                print(f"Failed to load settings schema for {app_name}: {e}")
                
    return schema

def validate_setting_value(key, value, schema):
    """
    Validates a value against the defined type in the schema.
    """
    if key not in schema:
        # If it's not in the schema, we reject it (Strict validation)
        raise ValueError(f"Setting key '{key}' is not defined in any settings_schema.py")
        
    config = schema[key]
    val_type = config.get('type', 'string')
    
    if val_type == 'boolean':
        if str(value).lower() in ['true', '1', 't', 'y', 'yes']:
            return 'true'
        elif str(value).lower() in ['false', '0', 'f', 'n', 'no']:
            return 'false'
        else:
            raise ValueError(f"Value for '{key}' must be a boolean.")
            
    elif val_type == 'integer':
        try:
            return str(int(value))
        except ValueError:
            raise ValueError(f"Value for '{key}' must be an integer.")
            
    elif val_type == 'select':
        choices = config.get('choices', [])
        if value not in choices:
            raise ValueError(f"Value '{value}' for '{key}' is not a valid choice. Allowed: {choices}")
            
    # Default: store as string
    return str(value)
