from apps.core.services.command_center import CommandCenterService
try:
    metrics = CommandCenterService.get_global_metrics()
    print("SUCCESS")
    print("Keys:", metrics.keys())
    print("System Health:", metrics.get("system_health"))
except Exception as e:
    print("FAILED")
    print(e)
