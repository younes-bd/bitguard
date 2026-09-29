import urllib.request
import json
import os

backend_dir = os.path.dirname(os.path.abspath(__file__))

print("Fetching countries and currencies from restcountries...")
try:
    req = urllib.request.urlopen('https://restcountries.com/v3.1/all?fields=name,cca2,currencies')
    data = json.loads(req.read())
    with open(os.path.join(backend_dir, 'restcountries.json'), 'w') as f:
        json.dump(data, f)
    print(f"Got {len(data)} countries.")
except Exception as e:
    print(e)
