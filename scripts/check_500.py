import urllib.request
import urllib.error
try:
    req = urllib.request.Request("http://127.0.0.1:8000/api/v1/system/installed-modules/")
    urllib.request.urlopen(req)
except urllib.error.HTTPError as e:
    print(f"HTTP {e.code}")
    print(e.read().decode('utf-8'))
except Exception as e:
    print(e)
