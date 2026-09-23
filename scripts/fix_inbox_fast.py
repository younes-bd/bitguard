path = 'backend/apps/inbox/domain/models.py'
with open(path, 'r') as f:
    content = f.read()
import re
new_content = re.sub(r'class RecordMessage\(.*?$.*', '', content, flags=re.DOTALL | re.MULTILINE)
new_content = re.sub(r'class MessageFollower\(.*?$.*', '', new_content, flags=re.DOTALL | re.MULTILINE)

new_content += """
from apps.core.domain.models import TenantAwareModel, BaseModel

class RecordMessage(TenantAwareModel):
    # Dummy placeholder since it's already in core
    class Meta:
        app_label = 'inbox'
        abstract = True

class MessageFollower(TenantAwareModel):
    class Meta:
        app_label = 'inbox'
        abstract = True
"""
with open(path, 'w') as f:
    f.write(new_content)
