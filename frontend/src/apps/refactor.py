import os
import shutil

base = "."
hr_pages = os.path.join(base, "hr", "pages")

moves = [
    (r"lists/AttendanceLog.jsx", "hr_attendance", r"pages/lists/AttendanceLog.jsx"),
    (r"lists/TimeTracking.jsx", "hr_attendance", r"pages/lists/TimeTracking.jsx"),
    (r"lists/LeaveManagement.jsx", "hr_holidays", r"pages/lists/LeaveManagement.jsx"),
    (r"lists/RecruitmentBoard.jsx", "recruitment", r"pages/lists/RecruitmentBoard.jsx"),
    (r"payroll/PayrollDashboard.jsx", "payroll", r"pages/dashboards/PayrollDashboard.jsx"),
    (r"payroll/PayslipBatchList.jsx", "payroll", r"pages/lists/PayslipBatchList.jsx"),
    (r"payroll/PayslipBatchDetail.jsx", "payroll", r"pages/lists/PayslipBatchDetail.jsx"),
    (r"payroll/SalaryRulesList.jsx", "payroll", r"pages/lists/SalaryRulesList.jsx"),
    (r"lists/Appraisals.jsx", "appraisals", r"pages/lists/Appraisals.jsx"),
    (r"lists/PerformanceReviews.jsx", "appraisals", r"pages/lists/PerformanceReviews.jsx")
]

for src, app, tgt in moves:
    src_path = os.path.join(hr_pages, src)
    tgt_path = os.path.join(base, app, tgt)
    
    if os.path.exists(src_path):
        os.makedirs(os.path.dirname(tgt_path), exist_ok=True)
        shutil.move(src_path, tgt_path)
        print(f"Moved {src_path} to {tgt_path}")

routes = {
    "hr_attendance": """import React from 'react';
import { Route } from 'react-router-dom';
import AttendanceLog from '../pages/lists/AttendanceLog';
import TimeTracking from '../pages/lists/TimeTracking';

export const HrAttendanceRoutes = (
    <>
        <Route index element={<AttendanceLog />} />
        <Route path="time" element={<TimeTracking />} />
        <Route path="kiosk" element={<div className="p-8">Kiosk Mode placeholder</div>} />
        <Route path="reports" element={<div className="p-8">Reports placeholder</div>} />
    </>
);
""",
    "hr_holidays": """import React from 'react';
import { Route } from 'react-router-dom';
import LeaveManagement from '../pages/lists/LeaveManagement';

export const HrHolidaysRoutes = (
    <>
        <Route index element={<LeaveManagement />} />
        <Route path="requests" element={<LeaveManagement />} />
        <Route path="approvals" element={<div className="p-8">Approvals placeholder</div>} />
        <Route path="allocations" element={<div className="p-8">Allocations placeholder</div>} />
        <Route path="settings" element={<div className="p-8">Settings placeholder</div>} />
        <Route path="types" element={<div className="p-8">Types placeholder</div>} />
    </>
);
""",
    "recruitment": """import React from 'react';
import { Route } from 'react-router-dom';
import RecruitmentBoard from '../pages/lists/RecruitmentBoard';

export const recruitmentRoutes = (
    <>
        <Route index element={<RecruitmentBoard />} />
        <Route path="applications" element={<div className="p-8">Applications placeholder</div>} />
        <Route path="reports" element={<div className="p-8">Reports placeholder</div>} />
    </>
);
""",
    "payroll": """import React from 'react';
import { Route } from 'react-router-dom';
import PayrollDashboard from '../pages/dashboards/PayrollDashboard';
import PayslipBatchList from '../pages/lists/PayslipBatchList';
import PayslipBatchDetail from '../pages/lists/PayslipBatchDetail';
import SalaryRulesList from '../pages/lists/SalaryRulesList';

export const payrollRoutes = (
    <>
        <Route index element={<PayrollDashboard />} />
        <Route path="batches" element={<PayslipBatchList />} />
        <Route path="batches/:id" element={<PayslipBatchDetail />} />
        <Route path="rules" element={<SalaryRulesList />} />
        <Route path="settings" element={<div className="p-8">Settings placeholder</div>} />
    </>
);
""",
    "appraisals": """import React from 'react';
import { Route } from 'react-router-dom';
import Appraisals from '../pages/lists/Appraisals';
import PerformanceReviews from '../pages/lists/PerformanceReviews';

export const appraisalsRoutes = (
    <>
        <Route index element={<Appraisals />} />
        <Route path="reviews" element={<PerformanceReviews />} />
        <Route path="settings" element={<div className="p-8">Settings placeholder</div>} />
    </>
);
"""
}

for app, code in routes.items():
    routes_dir = os.path.join(base, app, "routes")
    os.makedirs(routes_dir, exist_ok=True)
    with open(os.path.join(routes_dir, f"{app}Routes.jsx"), "w", encoding="utf-8") as f:
        f.write(code)
    print(f"Created {app}Routes.jsx")

hr_routes_code = """import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import HrmDashboard from '../pages/dashboards/HrmDashboard';
import EmployeeList from '../pages/lists/EmployeeList';
import EmployeeDetail from '../pages/lists/EmployeeDetail';
import CertificationsPage from '../pages/lists/CertificationsPage';
import HrmSettings from '../pages/settings/HrmSettings';
import OnboardingWorkflow from '../pages/wizards/OnboardingWorkflow';
import OrgChart from '../pages/lists/OrgChart';
import ContractsList from '../pages/lists/ContractsList';
import SkillsMatrix from '../pages/lists/SkillsMatrix';

export const hrRoutes = (
    <>
        <Route index element={<Navigate to="employees" replace />} />
        <Route path="overview" element={<HrmDashboard />} />
        <Route path="employees" element={<EmployeeList />} />
        <Route path="employees/:id" element={<EmployeeDetail />} />
        <Route path="certifications" element={<CertificationsPage />} />
        <Route path="onboarding" element={<OnboardingWorkflow />} />
        <Route path="settings" element={<HrmSettings />} />
        <Route path="org-chart" element={<OrgChart />} />
        <Route path="contracts" element={<ContractsList />} />
        <Route path="skills-matrix" element={<SkillsMatrix />} />
        
        {/* Legacy redirect for old hr routes if accessed directly */}
        <Route path="attendance" element={<Navigate to="/admin/hr_attendance" replace />} />
        <Route path="time" element={<Navigate to="/admin/hr_attendance/time" replace />} />
        <Route path="leaves" element={<Navigate to="/admin/hr_holidays" replace />} />
        <Route path="recruitment" element={<Navigate to="/admin/recruitment" replace />} />
        <Route path="payroll" element={<Navigate to="/admin/payroll" replace />} />
        <Route path="appraisals" element={<Navigate to="/admin/appraisals" replace />} />
    </>
);
"""
with open(os.path.join(base, "hr", "routes", "hrRoutes.jsx"), "w", encoding="utf-8") as f:
    f.write(hr_routes_code)
print("Updated hrRoutes.jsx")
