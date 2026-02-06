from django.urls import path
from . import views

urlpatterns = [
    # Dashboard
    path('overview/', views.ERPDashboardView.as_view(), name='erp_overview'),

    # Projects
    path('projects/', views.ProjectListView.as_view(), name='erp_project_list'),
    path('projects/create/', views.ProjectCreateView.as_view(), name='erp_project_create'),
    path('projects/<int:pk>/', views.ProjectDetailView.as_view(), name='erp_project_detail'),
    path('projects/<int:pk>/edit/', views.ProjectUpdateView.as_view(), name='erp_project_edit'),
    
    # Services
    path('projects/services/', views.ServiceListView.as_view(), name='erp_service_list'),
    path('projects/services/create/', views.ServiceCreateView.as_view(), name='erp_service_create'),
    path('projects/services/<int:pk>/edit/', views.ServiceUpdateView.as_view(), name='erp_service_edit'),

    # Tasks
    path('tasks/', views.TaskListView.as_view(), name='erp_task_list'),
    path('tasks/create/', views.TaskCreateView.as_view(), name='erp_task_create'),
    path('tasks/<int:pk>/', views.TaskDetailView.as_view(), name='erp_task_detail'),
    path('tasks/<int:pk>/', views.TaskDetailView.as_view(), name='erp_task_detail'),
    path('tasks/<int:pk>/edit/', views.TaskUpdateView.as_view(), name='erp_task_edit'),
    
    # TimeLogs
    path('tasks/timelogs/', views.TimeLogListView.as_view(), name='erp_timelog_list'),
    path('tasks/timelogs/create/', views.TimeLogCreateView.as_view(), name='erp_timelog_create'),
    path('tasks/timelogs/<int:pk>/edit/', views.TimeLogUpdateView.as_view(), name='erp_timelog_edit'),

    # Workforce
    path('workforce/', views.WorkforceListView.as_view(), name='erp_workforce_list'),
    path('workforce/<int:pk>/', views.EmployeeDetailView.as_view(), name='erp_employee_detail'),
    path('workforce/<int:pk>/edit/', views.EmployeeUpdateView.as_view(), name='erp_employee_edit'),
    path('workforce/<int:pk>/', views.EmployeeDetailView.as_view(), name='erp_employee_detail'),
    path('workforce/<int:pk>/edit/', views.EmployeeUpdateView.as_view(), name='erp_employee_edit'),

    # Assets
    path('assets/', views.AssetListView.as_view(), name='erp_asset_list'),
    path('assets/create/', views.AssetCreateView.as_view(), name='erp_asset_create'),
    path('assets/<int:pk>/', views.AssetDetailView.as_view(), name='erp_asset_detail'),
    path('assets/<int:pk>/edit/', views.AssetUpdateView.as_view(), name='erp_asset_edit'),

    # Vendors
    path('vendors/', views.VendorListView.as_view(), name='erp_vendor_list'),
    path('vendors/create/', views.VendorCreateView.as_view(), name='erp_vendor_create'),
    path('vendors/<int:pk>/', views.VendorDetailView.as_view(), name='erp_vendor_detail'),
    
    # Vendor Contracts
    path('vendors/contracts/', views.VendorContractListView.as_view(), name='erp_contract_list'),
    path('vendors/contracts/create/', views.VendorContractCreateView.as_view(), name='erp_contract_create'),
    path('vendors/contracts/<int:pk>/edit/', views.VendorContractUpdateView.as_view(), name='erp_contract_edit'),

    # Financials
    path('financials/', views.FinancialOverviewView.as_view(), name='erp_financial_overview'),
    path('financials/export/', views.FinancialExportView.as_view(), name='erp_financial_export'),
    
    # Expenses
    path('financials/expenses/', views.ExpenseListView.as_view(), name='erp_expense_list'),
    path('financials/expenses/create/', views.ExpenseCreateView.as_view(), name='erp_expense_create'),
    path('financials/expenses/<int:pk>/', views.ExpenseDetailView.as_view(), name='erp_expense_detail'),
    path('financials/expenses/<int:pk>/edit/', views.ExpenseUpdateView.as_view(), name='erp_expense_edit'),

    # Vendor Bills
    path('financials/bills/', views.VendorBillListView.as_view(), name='erp_bill_list'),
    path('financials/bills/create/', views.VendorBillCreateView.as_view(), name='erp_bill_create'),
    path('financials/bills/<int:pk>/', views.VendorBillDetailView.as_view(), name='erp_bill_detail'),
    path('financials/bills/<int:pk>/edit/', views.VendorBillUpdateView.as_view(), name='erp_bill_edit'),

    # Invoices
    path('financials/invoices/', views.InvoiceListView.as_view(), name='erp_invoice_list'),
    path('financials/invoices/create/', views.InvoiceCreateView.as_view(), name='erp_invoice_create'),
    path('financials/invoices/<int:pk>/', views.InvoiceDetailView.as_view(), name='erp_invoice_detail'),
    path('financials/invoices/<int:pk>/edit/', views.InvoiceUpdateView.as_view(), name='erp_invoice_edit'),
    path('financials/invoices/<int:pk>/item/add/', views.InvoiceItemCreateView.as_view(), name='erp_invoice_item_create'),

    # Compliance
    # Compliance
    path('compliance/', views.ComplianceDashboardView.as_view(), name='erp_compliance_dashboard'),
    
    # Policies
    path('compliance/policies/', views.PolicyListView.as_view(), name='erp_policy_list'),
    path('compliance/policies/create/', views.PolicyCreateView.as_view(), name='erp_policy_create'),
    path('compliance/policies/<int:pk>/', views.PolicyDetailView.as_view(), name='erp_policy_detail'),
    path('compliance/policies/<int:pk>/edit/', views.PolicyUpdateView.as_view(), name='erp_policy_edit'),
    
    # Risks
    path('compliance/risks/', views.RiskRunbookView.as_view(), name='erp_risk_runbook'),
    path('compliance/risks/create/', views.RiskCreateView.as_view(), name='erp_risk_create'),
    path('compliance/risks/<int:pk>/', views.RiskDetailView.as_view(), name='erp_risk_detail'),
    path('compliance/risks/<int:pk>/edit/', views.RiskUpdateView.as_view(), name='erp_risk_edit'),
    
    # Compliance Items (Controls)
    path('compliance/items/', views.ComplianceItemListView.as_view(), name='erp_compliance_items'),
    path('compliance/items/create/', views.ComplianceItemCreateView.as_view(), name='erp_compliance_item_create'),
    path('compliance/items/<int:pk>/', views.ComplianceItemDetailView.as_view(), name='erp_compliance_item_detail'),
    path('compliance/items/<int:pk>/edit/', views.ComplianceItemUpdateView.as_view(), name='erp_compliance_item_edit'),

    # Reports
    path('reports/operations/', views.OperationsReportView.as_view(), name='erp_operations_report'),
    path('reports/financials/', views.FinancialReportView.as_view(), name='erp_financial_report'),
    path('reports/security-ops/', views.SecurityOpsReportView.as_view(), name='erp_security_report'),

    # System
    path('system/dashboard/', views.SystemDashboardView.as_view(), name='erp_system_dashboard'),
    path('system/integrations/', views.IntegrationListView.as_view(), name='erp_integrations'),
    path('system/integrations/<int:pk>/edit/', views.IntegrationUpdateView.as_view(), name='erp_integration_edit'),
    path('system/integrations/<int:pk>/toggle/', views.toggle_integration, name='erp_integration_toggle'),
    path('system/audit-logs/', views.AuditLogView.as_view(), name='erp_audit_logs'),
]