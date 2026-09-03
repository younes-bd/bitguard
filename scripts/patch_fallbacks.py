import os
import re

base = r'src/apps'

routers = {
    'attendances/routes/attendancesRoutes.jsx': 'AttendanceLog',
    'timeoff/routes/timeoffRoutes.jsx': 'LeaveManagement',
    'recruitment/routes/recruitmentRoutes.jsx': 'RecruitmentBoard',
    'payroll/routes/payrollRoutes.jsx': 'PayrollDashboard',
    'appraisals/routes/appraisalsRoutes.jsx': 'Appraisals',
}

for rel_path, dashboard in routers.items():
    file_path = os.path.join(base, rel_path)
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if '<Route path="*" ' not in content:
        # insert before the closing </>
        replacement = f'        <Route path="*" element={{<{dashboard} />}} />\n    </>'
        content = content.replace('    </>', replacement)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Patched {rel_path}')

# Now for EnterpriseRouter.jsx to fix Expenses, Fleet, and others
router_path = os.path.join(base, 'dashboard/routes/EnterpriseRouter.jsx')
with open(router_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add fleet route
if 'path="fleet"' not in content:
    fleet_route = """            <Route path="fleet" element={<ModuleLayout title="Fleet" sections={productMenu.fleet} accentColor="indigo" />}>
                <Route index element={<FleetDashboard />} />
                <Route path="*" element={<FleetDashboard />} />
            </Route>
"""
    # Insert before <Route path="referrals"
    content = content.replace('<Route path="referrals"', fleet_route + '            <Route path="referrals"')

# Add expenses wildcard route
if '<Route path="*" element={<ExpensesDashboard />} />' not in content:
    old_expenses = """            <Route path="expenses" element={<ModuleLayout title="Expenses" sections={productMenu.expenses} accentColor="amber" />}>
                <Route index element={<ExpensesDashboard />} />
            </Route>"""
    new_expenses = """            <Route path="expenses" element={<ModuleLayout title="Expenses" sections={productMenu.expenses} accentColor="amber" />}>
                <Route index element={<ExpensesDashboard />} />
                <Route path="*" element={<ExpensesDashboard />} />
            </Route>"""
    content = content.replace(old_expenses, new_expenses)

# Add * fallback to all missing Odoo apps blocks that have an index route
import re
pattern = r'(<Route path="[^"]+" element={<ModuleLayout[^>]+>})\s*<Route index element={<([A-Za-z0-9_]+) />} />\s*</Route>'
def repl(match):
    return f'{match.group(1)}\n                <Route index element={{<{match.group(2)} />}} />\n                <Route path="*" element={{<{match.group(2)} />}} />\n            </Route>'

content = re.sub(pattern, repl, content)

with open(router_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Patched EnterpriseRouter.jsx")
