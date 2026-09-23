path = 'backend/apps/inbox/domain/models.py'
with open(path, 'r') as f:
    content = f.read()

# We need to remove the definition of RecordMessage and MessageFollower if they exist, and add imports.
# Let's just remove the block starting from `class RecordMessage(TenantAwareModel):` to the end of the file or next model.
import re
new_content = re.sub(r'class RecordMessage\(.*?$.*', '', content, flags=re.DOTALL | re.MULTILINE)
new_content = re.sub(r'class MessageFollower\(.*?$.*', '', new_content, flags=re.DOTALL | re.MULTILINE)

# Add imports
if 'RecordMessage' not in new_content:
    new_content += "\nfrom apps.core.domain.models import RecordMessage, MessageFollower\n"

with open(path, 'w') as f:
    f.write(new_content)
