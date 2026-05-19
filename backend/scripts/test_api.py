#!/usr/bin/env python3
"""
BitGuard API Smoke Test — validates core endpoints end-to-end.
Run with:  python3 scripts/test_api.py
"""
import json
import sys
import urllib.request
import urllib.error

BASE = "http://127.0.0.1:8000/api"

PASS = "\033[92m✅\033[0m"
FAIL = "\033[91m❌\033[0m"
WARN = "\033[93m⚠️\033[0m"

results = []


def _request(method, path, data=None, token=None):
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(
        f"{BASE}{path}",
        data=body,
        headers={"Content-Type": "application/json"},
        method=method,
    )
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return json.loads(resp.read()), resp.status
    except urllib.error.HTTPError as e:
        try:
            return json.loads(e.read()), e.code
        except Exception:
            return {"error": str(e)}, e.code
    except Exception as e:
        return {"error": str(e)}, 0


def post(path, data, token=None):
    return _request("POST", path, data=data, token=token)


def get(path, token=None):
    return _request("GET", path, token=token)


def check(label, resp, status, expect_status=200):
    """Print result and record pass/fail."""
    ok = (status == expect_status)
    icon = PASS if ok else FAIL
    results.append(ok)

    if isinstance(resp, list):
        count_str = f"count={len(resp)}"
    elif isinstance(resp, dict):
        count_str = f"count={resp.get('count', '?')}" if 'count' in resp else ""
    else:
        count_str = ""

    extra = f"  [{count_str}]" if count_str else ""
    print(f"  {icon}  [{status}] {label}{extra}")
    if not ok:
        snippet = json.dumps(resp, indent=2)[:400] if resp else "(empty)"
        print(f"        {snippet}")
    return ok


# ─────────────────────────────────────────────
print("=" * 60)
print("  BitGuard API Smoke Test")
print("=" * 60)

# 1 — Auth
print("\n── Auth ──────────────────────────────────────────────────")
resp, status = post("/auth/login/", {"email": "admin@bitguard.tech", "password": "admin"})
check("POST /api/auth/login/", resp, status, 200)

token = None
if isinstance(resp, dict) and resp.get("success"):
    token = resp.get("data", {}).get("access_token")
    print(f"     Token: {str(token)[:40]}...")
else:
    print(f"  {FAIL}  Cannot continue without a valid token. Aborting.")
    sys.exit(1)

# 2 — Dashboard
print("\n── Dashboard ─────────────────────────────────────────────")
r, s = get("/dashboard/metrics/", token=token)
check("GET /api/dashboard/metrics/", r, s)

r, s = get("/dashboard/health/", token=token)
check("GET /api/dashboard/health/", r, s)

r, s = get("/dashboard/mrr/", token=token)
check("GET /api/dashboard/mrr/", r, s)

# 3 — CRM
print("\n── CRM ───────────────────────────────────────────────────")
r, s = get("/crm/clients/", token=token)
check("GET /api/crm/clients/", r, s)

r, s = get("/crm/contacts/", token=token)
check("GET /api/crm/contacts/", r, s)

r, s = get("/crm/deals/", token=token)
check("GET /api/crm/deals/", r, s)

# 4 — Support
print("\n── Support ───────────────────────────────────────────────")
r, s = get("/support/tickets/", token=token)
check("GET /api/support/tickets/", r, s)

r, s = get("/support/articles/", token=token)
check("GET /api/support/articles/", r, s)

# 5 — Notifications
print("\n── Notifications ─────────────────────────────────────────")
r, s = get("/notifications/", token=token)
check("GET /api/notifications/", r, s)

# 6 — Tenants
print("\n── Tenants ───────────────────────────────────────────────")
r, s = get("/tenants/", token=token)
check("GET /api/tenants/", r, s)

# 7 — IAM / Users
print("\n── IAM ───────────────────────────────────────────────────")
r, s = get("/iam/", token=token)
check("GET /api/iam/ (users list)", r, s)

# 8 — Billing
print("\n── Billing ───────────────────────────────────────────────")
r, s = get("/billing/invoices/", token=token)
check("GET /api/billing/invoices/", r, s)

# 9 — Security / SOC
print("\n── Security (SOC) ────────────────────────────────────────")
r, s = get("/security/incidents/", token=token)
check("GET /api/security/incidents/", r, s)

# 10 — Token refresh
print("\n── Token Refresh ─────────────────────────────────────────")
login_resp, _ = post("/auth/login/", {"email": "admin@bitguard.tech", "password": "admin"})
refresh_token = login_resp.get("data", {}).get("refresh_token")
r, s = post("/auth/jwt/refresh/", {"refresh": refresh_token})
check("POST /api/auth/jwt/refresh/", r, s)

# ── Summary ──
print("\n" + "=" * 60)
total = len(results)
passed = sum(results)
failed = total - passed
icon = PASS if failed == 0 else FAIL
print(f"  {icon}  {passed}/{total} checks passed  |  {failed} failed")
print("=" * 60)

sys.exit(0 if failed == 0 else 1)
