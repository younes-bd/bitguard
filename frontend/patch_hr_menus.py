import os
import re

file_path = r'c:\Users\youne\Desktop\2-InfoTech\website\website13\frontend\src\core\api\menu.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# HR Replacement
hr_new = """    hr: [
        {
            title: 'Employees',
            items: [
                { label: 'Employees', icon: Users, path: '/admin/hr/employees' },
                { label: 'Contracts', icon: FileText, path: '/admin/hr/contracts' },
            ]
        },
        {
            title: 'Departments',
            items: [
                { label: 'Departments', icon: Layers, path: '/admin/hr/org-chart' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Reporting', icon: Activity, path: '/admin/hr/reporting' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/hr/settings' },
                { label: 'Work Locations', icon: MapPin, path: '/admin/hr/work-locations' },
                { label: 'Departure Reasons', icon: AlertCircle, path: '/admin/hr/departure-reasons' },
            ]
        }
    ],"""
content = re.sub(r'    hr: \[\s*\{\s*title: \'Employees\'.*?\]\s*\}\s*\],', hr_new, content, flags=re.DOTALL)

# Attendances Replacement
attendances_new = """    attendances: [
        {
            title: 'Attendances',
            items: [
                { label: 'Attendances', icon: UserCheck, path: '/admin/attendances' },
                { label: 'Kiosk Mode', icon: Monitor, path: '/admin/attendances/kiosk' }
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Reporting', icon: Activity, path: '/admin/attendances/reports' }
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/attendances/settings' }
            ]
        }
    ],"""
content = re.sub(r'    attendances: \[\s*\{\s*title: \'Attendances\'.*?\]\s*\}\s*\],', attendances_new, content, flags=re.DOTALL)

# Timeoff Replacement
timeoff_new = """    timeoff: [
        {
            title: 'My Time Off',
            items: [
                { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/timeoff' },
                { label: 'My Time Off', icon: Clock, path: '/admin/timeoff/requests' },
                { label: 'My Allocations', icon: Plus, path: '/admin/timeoff/my-allocations' }
            ]
        },
        {
            title: 'Management',
            items: [
                { label: 'Time Off', icon: CheckSquare, path: '/admin/timeoff/approvals' },
                { label: 'Allocations', icon: Plus, path: '/admin/timeoff/allocations' }
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'by Employee', icon: Users, path: '/admin/timeoff/reports/employee' },
                { label: 'by Type', icon: Tag, path: '/admin/timeoff/reports/type' }
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/timeoff/settings' },
                { label: 'Time Off Types', icon: Tag, path: '/admin/timeoff/types' },
                { label: 'Accrual Plans', icon: Activity, path: '/admin/timeoff/accrual-plans' },
                { label: 'Public Holidays', icon: Calendar, path: '/admin/timeoff/public-holidays' }
            ]
        }
    ],"""
content = re.sub(r'    timeoff: \[\s*\{\s*title: \'My Time Off\'.*?\]\s*\}\s*\],', timeoff_new, content, flags=re.DOTALL)

# Recruitment Replacement
recruitment_new = """    recruitment: [
        {
            title: 'Applications',
            items: [
                { label: 'Job Positions', icon: FolderKanban, path: '/admin/recruitment' },
                { label: 'All Applications', icon: Users, path: '/admin/recruitment/applications' }
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Recruitment Analysis', icon: Activity, path: '/admin/recruitment/reports' }
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/recruitment/settings' },
                { label: 'Job Positions', icon: FolderKanban, path: '/admin/recruitment/jobs' },
                { label: 'Refuse Reasons', icon: AlertCircle, path: '/admin/recruitment/refuse-reasons' },
                { label: 'Departments', icon: Layers, path: '/admin/recruitment/departments' }
            ]
        }
    ],"""
content = re.sub(r'    recruitment: \[\s*\{\s*title: \'Recruitment\'.*?\]\s*\}\s*\],', recruitment_new, content, flags=re.DOTALL)

# Payroll Replacement
payroll_new = """    payroll: [
        {
            title: 'Payslips',
            items: [
                { label: 'To Pay', icon: Clock, path: '/admin/payroll/to-pay' },
                { label: 'All Payslips', icon: DollarSign, path: '/admin/payroll' },
                { label: 'Batches', icon: Layers, path: '/admin/payroll/batches' }
            ]
        },
        {
            title: 'Work Entries',
            items: [
                { label: 'Work Entries', icon: Calendar, path: '/admin/payroll/work-entries' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Payroll', icon: BarChart3, path: '/admin/payroll/reports' }
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/payroll/settings' },
                { label: 'Salary Rules', icon: FileText, path: '/admin/payroll/rules' },
                { label: 'Salary Structures', icon: Database, path: '/admin/payroll/structures' }
            ]
        }
    ],"""
content = re.sub(r'    payroll: \[\s*\{\s*title: \'Payslips\'.*?\]\s*\}\s*\],', payroll_new, content, flags=re.DOTALL)

# Appraisals Replacement
appraisals_new = """    appraisals: [
        {
            title: 'Appraisals',
            items: [
                { label: 'Appraisals', icon: Award, path: '/admin/appraisals' }
            ]
        },
        {
            title: 'Goals',
            items: [
                { label: 'Goals', icon: Target, path: '/admin/appraisals/goals' }
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Appraisal Analysis', icon: BarChart3, path: '/admin/appraisals/reports' }
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/appraisals/settings' },
                { label: 'Evaluation Scale', icon: Activity, path: '/admin/appraisals/scale' },
                { label: '360 Feedback', icon: Users, path: '/admin/appraisals/feedback-templates' }
            ]
        }
    ],"""
content = re.sub(r'    appraisals: \[\s*\{\s*title: \'Appraisals\'.*?\]\s*\}\s*\],', appraisals_new, content, flags=re.DOTALL)

# Fleet Replacement
fleet_new = """    fleet: [
        {
            title: 'Fleet',
            items: [
                { label: 'Vehicles', icon: Truck, path: '/admin/fleet' },
                { label: 'Odometers', icon: Clock, path: '/admin/fleet/odometer' }
            ]
        },
        {
            title: 'Contracts',
            items: [
                { label: 'Contracts', icon: FileText, path: '/admin/fleet/contracts' }
            ]
        },
        {
            title: 'Services',
            items: [
                { label: 'Services', icon: Wrench, path: '/admin/fleet/services' }
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Costs Analysis', icon: BarChart3, path: '/admin/fleet/reports' }
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/fleet/settings' },
                { label: 'Manufacturers', icon: Building2, path: '/admin/fleet/manufacturers' },
                { label: 'Vehicle Models', icon: Truck, path: '/admin/fleet/models' }
            ]
        }
    ],"""
content = re.sub(r'    fleet: \[\s*\{\s*title: \'Fleet\'.*?\]\s*\}\s*\],', fleet_new, content, flags=re.DOTALL)

# Expenses Replacement
expenses_new = """    expenses: [
        {
            title: 'My Expenses',
            items: [
                { label: 'My Expenses', icon: CreditCard, path: '/admin/expenses' },
                { label: 'My Reports', icon: FileText, path: '/admin/expenses/my-reports' },
            ]
        },
        {
            title: 'Expense Reports',
            items: [
                { label: 'To Approve', icon: CheckSquare, path: '/admin/expenses/to-approve' },
                { label: 'To Post', icon: FileText, path: '/admin/expenses/to-post' },
                { label: 'To Pay', icon: DollarSign, path: '/admin/expenses/to-pay' },
                { label: 'All Reports', icon: FileText, path: '/admin/expenses/reports' }
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Expenses Analysis', icon: BarChart3, path: '/admin/expenses/analysis' }
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/expenses/settings' },
                { label: 'Expense Categories', icon: Tags, path: '/admin/expenses/categories' }
            ]
        }
    ],"""
content = re.sub(r'    expenses: \[\s*\{\s*title: \'Expenses\'.*?\]\s*\}\s*\],', expenses_new, content, flags=re.DOTALL)


with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated all HR menus in menu.js")
