import os

path = r'c:\Users\youne\Desktop\2-InfoTech\website\website13\frontend\src\core\routes\PortalRoutes.jsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "import { hrmRoutes } from '../../apps/hrm/routes/hrmRoutes';",
    "import { hrRoutes } from '../../apps/hr/routes/hrRoutes';"
)
content = content.replace(
    "import HrmDashboard from '../../apps/hrm/pages/dashboards/HrmDashboard';",
    "import HrmDashboard from '../../apps/hr/pages/dashboards/HrmDashboard';"
)

content = content.replace(
    """            <Route path="hrm" element={<SubscriptionGuard requiredProduct="hrm"><ProductLayout /></SubscriptionGuard>}>
                <Route index element={<HrmDashboard />} />
                {hrmRoutes}
            </Route>""",
    """            <Route path="hr" element={<SubscriptionGuard requiredProduct="hr"><ProductLayout /></SubscriptionGuard>}>
                <Route index element={<HrmDashboard />} />
                {hrRoutes}
            </Route>"""
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched PortalRoutes.jsx")
