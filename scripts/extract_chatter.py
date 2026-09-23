import re

core_path = "backend/apps/core/domain/models.py"
mail_path = "backend/apps/mail/domain/models.py"

with open(core_path, "r", encoding="utf-8") as f:
    core_content = f.read()

# Extract from "# CHATTER SYSTEM" up to "class ScheduledAction"
pattern = re.compile(r'(# CHATTER SYSTEM.*?)(?=class ScheduledAction)', re.DOTALL)
match = pattern.search(core_content)

if match:
    chatter_code = match.group(1)
    # Remove from core
    new_core = core_content.replace(chatter_code, "")
    with open(core_path, "w", encoding="utf-8") as f:
        f.write(new_core)
    
    # Add to mail
    with open(mail_path, "a", encoding="utf-8") as f:
        f.write("\n\n" + chatter_code)
    
    print("Chatter successfully extracted and appended to mail/domain/models.py")
else:
    print("Could not find Chatter in core models")
