import requests
import json

r = requests.get('http://127.0.0.1:8000/api/v1/system/translations/locales/?lng=fr')
print(r.status_code)
print(r.text)
