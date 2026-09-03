import os

path = r'src/apps/board/routes/EnterpriseRouter.jsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add imports
imports = """import { hrRoutes } from "../../hr/routes/hrRoutes";
import { attendancesRoutes } from '../../attendances/routes/attendancesRoutes';
import { timeoffRoutes } from '../../timeoff/routes/timeoffRoutes';
import { recruitmentRoutes } from '../../recruitment/routes/recruitmentRoutes';
import { payrollRoutes } from '../../payroll/routes/payrollRoutes';
import { appraisalsRoutes } from '../../appraisals/routes/appraisalsRoutes';
"""
content = content.replace('import { hrRoutes } from "../../hr/routes/hrRoutes";', imports)

# 2. Replace the bottom section (after fallback)
bottom_routes = """
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/admin" replace />} />
            <Route path="attendances" element={<ModuleLayout title="Attendances" sections={productMenu.attendances} accentColor="orange" />}>
                <Route index element={<AttendancesDashboard />} />
            </Route>
            <Route path="payroll" element={<ModuleLayout title="Payroll" sections={productMenu.payroll} accentColor="emerald" />}>
                <Route index element={<PayrollDashboard />} />
            </Route>
            <Route path="timeoff" element={<ModuleLayout title="Time Off" sections={productMenu.timeoff} accentColor="purple" />}>
                <Route index element={<div className="p-8 text-xl font-semibold">Time Off Dashboard Placeholder</div>} />
            </Route>
            <Route path="recruitment" element={<ModuleLayout title="Recruitment" sections={productMenu.recruitment} accentColor="pink" />}>
                <Route index element={<div className="p-8 text-xl font-semibold">Recruitment Dashboard Placeholder</div>} />
            </Route>
            <Route path="expenses" element={<ModuleLayout title="Expenses" sections={productMenu.expenses} accentColor="amber" />}>
                <Route index element={<ExpensesDashboard />} />
            </Route>
        </Routes>"""

new_bottom = """
            <Route path="attendances" element={<ModuleLayout title="Attendances" sections={productMenu.attendances} accentColor="orange" />}>
                {attendancesRoutes}
            </Route>
            <Route path="payroll" element={<ModuleLayout title="Payroll" sections={productMenu.payroll} accentColor="emerald" />}>
                {payrollRoutes}
            </Route>
            <Route path="timeoff" element={<ModuleLayout title="Time Off" sections={productMenu.timeoff} accentColor="purple" />}>
                {timeoffRoutes}
            </Route>
            <Route path="recruitment" element={<ModuleLayout title="Recruitment" sections={productMenu.recruitment} accentColor="pink" />}>
                {recruitmentRoutes}
            </Route>
            <Route path="expenses" element={<ModuleLayout title="Expenses" sections={productMenu.expenses} accentColor="amber" />}>
                <Route index element={<ExpensesDashboard />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>"""

content = content.replace(bottom_routes, new_bottom)

# 3. Replace appraisals (which was in the new missing Odoo apps block)
old_appraisals = """            <Route path="appraisals" element={<ModuleLayout title="Appraisals" sections={productMenu.appraisals} accentColor="amber" />}>
                <Route index element={<AppraisalsDashboard />} />
            </Route>"""
new_appraisals = """            <Route path="appraisals" element={<ModuleLayout title="Appraisals" sections={productMenu.appraisals} accentColor="amber" />}>
                {appraisalsRoutes}
            </Route>"""
content = content.replace(old_appraisals, new_appraisals)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated EnterpriseRouter.jsx")
