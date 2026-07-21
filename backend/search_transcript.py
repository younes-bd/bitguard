import json
import sys

transcript_path = r'C:\Users\youne\.gemini\antigravity\brain\1bb53bbc-6508-46d7-bd54-d3bb79f04e8a\.system_generated\logs\transcript.jsonl'

with open(transcript_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for line in lines:
    try:
        data = json.loads(line)
        if data.get('source') == 'MODEL' and 'type' in data and data['type'] == 'PLANNER_RESPONSE':
            content = data.get('content', '')
            if 'frontend' in content.lower() and 'backend' in content.lower():
                print("===========================")
                print(content[:500] + "..." if len(content) > 500 else content)
    except Exception as e:
        pass
