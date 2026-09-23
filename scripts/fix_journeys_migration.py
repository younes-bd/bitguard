import os

path = 'backend/apps/journeys/migrations/0002_initial.py'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace("model_name='marketingworkflow'", "model_name='journeysworkflow'")
c = c.replace("model_name='massmailing'", "model_name='campaigns'")

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)
print("Journeys migration fixed.")
