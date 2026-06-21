import os
import shutil

src_dir = "frontend/src/apps/erp/pages"
dest_accounting = "frontend/src/apps/accounting/pages"
dest_billing = "frontend/src/apps/billing/pages"
dest_projects = "frontend/src/apps/projects/pages"
dest_purchase = "frontend/src/apps/purchase/pages"
dest_sales = "frontend/src/apps/sales/pages"

os.makedirs(dest_accounting, exist_ok=True)
os.makedirs(dest_billing, exist_ok=True)
os.makedirs(dest_projects, exist_ok=True)
os.makedirs(dest_purchase, exist_ok=True)
os.makedirs(dest_sales, exist_ok=True)

# Helper function to move
def move_dir_contents(src, dest):
    if os.path.exists(src):
        os.makedirs(dest, exist_ok=True)
        for item in os.listdir(src):
            s = os.path.join(src, item)
            d = os.path.join(dest, item)
            if not os.path.exists(d):
                shutil.move(s, d)

# Accounting
move_dir_contents(f"{src_dir}/accounting", f"{dest_accounting}/accounting")
move_dir_contents(f"{src_dir}/reports", f"{dest_accounting}/reports")
if os.path.exists(f"{src_dir}/dashboards/ErpDashboard.jsx"):
    os.makedirs(f"{dest_accounting}/dashboards", exist_ok=True)
    shutil.move(f"{src_dir}/dashboards/ErpDashboard.jsx", f"{dest_accounting}/dashboards/AccountingDashboard.jsx")
if os.path.exists(f"{src_dir}/ErpReportPage.jsx"):
    shutil.move(f"{src_dir}/ErpReportPage.jsx", f"{dest_accounting}/AccountingReportPage.jsx")
if os.path.exists(f"{src_dir}/FinancialsDashboard.jsx"):
    shutil.move(f"{src_dir}/FinancialsDashboard.jsx", f"{dest_accounting}/FinancialsDashboard.jsx")
if os.path.exists(f"{src_dir}/InvoiceBranding.jsx"):
    shutil.move(f"{src_dir}/InvoiceBranding.jsx", f"{dest_accounting}/InvoiceBranding.jsx")
if os.path.exists(f"{src_dir}/PaymentTerms.jsx"):
    shutil.move(f"{src_dir}/PaymentTerms.jsx", f"{dest_accounting}/PaymentTerms.jsx")
if os.path.exists(f"{src_dir}/ErpSettings.jsx"):
    os.makedirs("frontend/src/apps/sysadmin/pages/settings", exist_ok=True)
    shutil.move(f"{src_dir}/ErpSettings.jsx", "frontend/src/apps/sysadmin/pages/settings/ErpSettings.jsx")

# Billing
move_dir_contents(f"{src_dir}/billing", f"{dest_billing}/billing")
for item in ['InvoiceCreate.jsx', 'InvoiceDetail.jsx', 'InvoiceList.jsx', 'ExpenseList.jsx']:
    if os.path.exists(f"{src_dir}/{item}"):
        shutil.move(f"{src_dir}/{item}", f"{dest_billing}/{item}")

if os.path.exists(f"{src_dir}/documents"):
    os.makedirs(f"{dest_billing}/documents", exist_ok=True)
    for doc in os.listdir(f"{src_dir}/documents"):
        if 'CreditNote' in doc or 'Receipt' in doc:
            shutil.move(f"{src_dir}/documents/{doc}", f"{dest_billing}/documents/{doc}")

# Projects
for item in ['ProjectCreate.jsx', 'ProjectDetail.jsx', 'ProjectList.jsx', 'RiskList.jsx', 'TimeBilling.jsx']:
    if os.path.exists(f"{src_dir}/{item}"):
        shutil.move(f"{src_dir}/{item}", f"{dest_projects}/{item}")

# Purchase
move_dir_contents(f"{src_dir}/vendors", f"{dest_purchase}/vendors")

# Sales
if os.path.exists(f"{src_dir}/ProductCatalog.jsx"):
    shutil.move(f"{src_dir}/ProductCatalog.jsx", f"{dest_sales}/ProductCatalog.jsx")
if os.path.exists(f"{src_dir}/documents"):
    os.makedirs(f"{dest_sales}/documents", exist_ok=True)
    for doc in os.listdir(f"{src_dir}/documents"):
        if 'Quotation' in doc:
            shutil.move(f"{src_dir}/documents/{doc}", f"{dest_sales}/documents/{doc}")

# EDMS
if os.path.exists(f"{src_dir}/documents/DocumentHub.jsx"):
    os.makedirs("frontend/src/apps/edms/pages", exist_ok=True)
    shutil.move(f"{src_dir}/documents/DocumentHub.jsx", "frontend/src/apps/edms/pages/DocumentHub.jsx")

print("Files moved successfully.")
