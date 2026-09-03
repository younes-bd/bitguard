# Odoo Tier-1 Architecture: Pillars & Module Sequence

In Odoo, the UI dashboard order and the App Store categorization are driven by a strict mathematical `sequence` integer on both the `ir.module.category` (Pillars) and `ir.module.module` (Apps). 

Below is the exact, standard Odoo architecture, ordered precisely by Pillar sequence, and then by Module sequence inside each pillar.

## 1. Sales (Sequence: 10)
*The revenue generation pillar, ordered from core quoting to specialized sales.*
1. **Sales** (`sale_management`) - Core quoting and sales orders.
2. **CRM** (`crm`) - Lead and pipeline tracking.
3. **Point of Sale** (`point_of_sale`) - Retail and restaurant registers.
4. **Subscriptions** (`sale_subscription`) - Recurring billing and MRR.
5. **Rental** (`sale_renting`) - Time-based equipment/service rentals.
6. **Amazon Connector** (`sale_amazon`) - Marketplace synchronization.

## 2. Services (Sequence: 20)
*Service delivery and resource allocation.*
1. **Project** (`project`) - Task management and agile boards.
2. **Timesheets** (`hr_timesheet`) - Time tracking against projects.
3. **Field Service** (`industry_fsm`) - On-site intervention planning.
4. **Helpdesk** (`helpdesk`) - Ticketing and SLA management.
5. **Planning** (`planning`) - Shift and schedule management.
6. **Appointments** (`appointment`) - Self-service meeting booking.

## 3. Accounting & Finance (Sequence: 30)
*Financial control and ledger management.*
1. **Accounting** (`account_accountant`) - The master general ledger and reconciliation.
2. **Invoicing** (`account`) - Customer invoices and vendor bills (Sub-set of Accounting).
3. **Consolidation** (`account_consolidation`) - Multi-company financial merging.
4. **Spreadsheet** (`spreadsheet_dashboard`) - Financial BI and reporting.
5. **Dashboards** (`board`) - Custom KPI dashboards and pinned executive views.
6. **Equity** (`equity`) - Cap table and share management.

## 4. Inventory (Sequence: 40)
*Supply chain and stock movement.*
1. **Inventory** (`stock`) - Warehouse management, routing, and stock valuation.
2. **Purchase** (`purchase`) - Vendor RFQs and POs.
3. **Barcode** (`stock_barcode`) - Mobile scanner operations.

## 5. Manufacturing (Sequence: 50)
*Production and factory floor management.*
1. **Manufacturing** (`mrp`) - BOMs, routing, and work orders.
2. **Shop Floor** (`mrp_workorder_ui`) - Tablet-based interface for factory operators.
3. **PLM** (`mrp_plm`) - Engineering change orders and versioning.
4. **Maintenance** (`maintenance`) - Equipment upkeep (preventative/corrective).
5. **Quality** (`quality_control`) - Inspections and quality alerts.
6. **Repairs** (`repair`) - Fixing broken products (under warranty or paid).
7. **IoT** (`iot`) - Machine integration (scales, cameras, foot pedals).

## 6. Website (Sequence: 60)
*External portals and web presence.*
1. **Website** (`website`) - The core website builder.
2. **eCommerce** (`website_sale`) - Online B2C/B2B shopping.
3. **eLearning** (`website_slides`) - LMS and course management.
4. **Forum** (`website_forum`) - Community Q&A.
5. **Blog** (`website_blog`) - Content marketing.
6. **Live Chat** (`im_livechat`) - Website visitor chatting.

## 7. Marketing (Sequence: 70)
*Audience engagement and automation.*
1. **Email Marketing** (`mass_mailing`) - Newsletters and blast emails.
2. **SMS Marketing** (`mass_mailing_sms`) - Text message campaigns.
3. **WhatsApp** (`whatsapp`) - WhatsApp Business API campaigns and template management.
4. **Social Marketing** (`social`) - Facebook/Twitter/LinkedIn scheduling.
5. **Events** (`event`) - Ticketing and attendee management.
6. **Marketing Automation** (`marketing_automation`) - Drip campaigns and journeys.
7. **Surveys** (`survey`) - Feedback forms and certifications.

## 8. Human Resources (Sequence: 80)
*Employee lifecycle and benefits.*
1. **Employees** (`hr`) - The core employee directory.
2. **Recruitment** (`hr_recruitment`) - Applicant tracking system (ATS).
3. **Time Off** (`hr_holidays`) - Leave requests and allocations.
4. **Attendances** (`hr_attendance`) - Check-in/Check-out clock.
5. **Frontdesk** (`frontdesk`) - Visitor management and digital lobby.
6. **Payroll** (`hr_payroll`) - Payslips and salary rules.
7. **Expenses** (`hr_expense`) - Employee reimbursements.
8. **Appraisals** (`hr_appraisal`) - Periodic performance reviews.
9. **Referrals** (`hr_referral`) - Gamified job recommendations.
10. **Fleet** (`fleet`) - Company vehicle management.
11. **Lunch** (`lunch`) - Office meal ordering.
12. **ESG** (`esg`) - Environmental, Social, and Governance compliance.

## 9. Productivity (Sequence: 90)
*Internal collaboration and communication utilities.*
1. **Discuss** (`mail`) - Internal chat and channels.
2. **To-Do** (`project_todo`) - Personal task management.
3. **Documents** (`documents`) - Paperless document management (OCR).
4. **Sign** (`sign`) - eSignature requests.
5. **Approvals** (`approvals`) - Custom request validation flows.
6. **Knowledge** (`knowledge`) - Internal Wiki/Notion-style documentation.
7. **Calendar** (`calendar`) - Internal meeting scheduling.
8. **VoIP** (`voip`) - Integrated SIP telephony.

## 10. Administration (Sequence: 100)
*System configuration and master controls.*
1. **Settings** (`base`) - The master configuration gateway.
2. **Apps** (`base`) - The App Store / installer.
3. **Security Operations Center** (`soc`) - Threat monitoring, audit logs, and AI security agents.
4. **Studio** (`web_studio`) - No-code customization engine.

---

### Shared Utilities & Master Data (Application: False)
*In Odoo, not every module gets a tile on the main dashboard. If a module has `'application': False` in its manifest, it acts as a silent utility or shared data layer. You access these features from **inside** other main apps.*
* **Portal** (`portal`) - Powers the external customer account pages (`/my`). Does not have an admin dashboard tile.
* **Reporting** (`base_report_designer` / `reporting`) - The PDF/Excel generation engine used by Accounting and Sales.
* **Product** (`product`) - The master product catalog. Accessed via *Sales > Products* or *Inventory > Products*, never as a standalone app.
* **Delivery** (`delivery`) - Adds shipping methods and carrier integrations (FedEx, UPS) inside the Sales and Inventory apps.
* **Notifications** (`mail_bot` / `notifications`) - The background push notification and webhook engine.
* **Users** (`users`) - Employee/User management, accessed strictly via the Settings app.

---

### External Integrations & API Bridges (Application: False)
*These modules act strictly as bridges between your ERP and third-party APIs. They sit entirely outside the core business logic and do not get a main dashboard tile. You configure them inside the Settings app, and they quietly power features inside other apps (like processing a checkout in eCommerce or generating text in Marketing).*
* **Payments** (`payments` / `payment_stripe` / `payment_paypal`) - Standardizes payment gateways. Activated during checkout flows.
* **AI Engine** (`ai_engine` / `mail_openai`) - Connects to LLM providers (ChatGPT/Claude). Used dynamically across the ERP to auto-generate content.

---

### Hidden / Technical Kernel (Sequence: 999)
*These modules operate in the background and are deliberately excluded from standard dashboards to protect system integrity. They are the absolute foundation of the ERP.*
* **Core** (`core`) - Abstract base models and global routing.
* **System** (`system`) - System registries and global settings structure.
* **Auth** (`auth`) - Security gateways, JWT, and login logic.
* **Tenants** (`tenants`) - Multi-SaaS isolation and data segregation.
