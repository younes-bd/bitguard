# Odoo-Inspired ERP Architecture Map

This document outlines the architectural mapping of the ERP suite, connecting frontend UI modules to their corresponding backend Django apps and databases.

## 1. Core Architecture Principles
- **Visual Splitting (Frontend):** The frontend presents a highly fragmented "App Store" experience. Users see many distinct tiles (e.g., Invoicing, Expenses, Accounting) which are actually sub-features.
- **Logical Grouping (Backend):** The backend groups these fragmented frontend apps into robust, cohesive domain clusters (e.g., all finance apps route to `apps.accounting`, all IT/Asset apps route to `apps.assets`).

---

## 2. Module Mapping Directory

### 💰 Finance & Accounting (`apps.accounting`)
- **Frontend Apps:** Accounting, Invoicing, Expenses, Financials
- **Core Models:** `JournalEntry`, `Invoice`, `ExpenseReport`, `Account`

### 👥 Human Resources (`apps.hrm`)
- **Frontend Apps:** Employees, Recruitment, Time Off, Appraisals, Referrals, Payroll
- **Core Models:** `Employee`, `LeaveRequest`, `JobOpening`, `Appraisal`, `Referral`

### 📦 Supply Chain & Operations (`apps.inventory`, `apps.purchase`, `apps.mrp`)
- **Frontend Apps:** Inventory, Purchase, Manufacturing (MRP), PLM, Quality, Maintenance
- **Core Models:** `Product`, `StockMove`, `PurchaseOrder`, `ManufacturingOrder`, `QualityAlert`, `EngineeringChangeOrder`

### 🤝 Customer Relations (`apps.crm`, `apps.sale`, `apps.pos`)
- **Frontend Apps:** CRM, Sales, Point of Sale (POS), Subscriptions, Sign
- **Core Models:** `Lead`, `SalesOrder`, `POSSession`, `Subscription`, `SignatureDocument`

### 🛠️ Services & Field Ops (`apps.services`, `apps.projects`, `apps.fleet`)
- **Frontend Apps:** Project, Timesheets, Field Service, Appointments, Helpdesk, Fleet
- **Core Models:** `Project`, `Task`, `Timesheet`, `ServiceTicket`, `Vehicle`

### 📣 Marketing & Website (`apps.marketing`, `apps.cms`, `apps.website`)
- **Frontend Apps:** Email Marketing, SMS Marketing, Social Marketing, Events, Surveys, Website, eLearning
- **Core Models:** `Campaign`, `Event`, `Survey`, `Course`, `WebPage`

### 💬 Communication (`apps.discuss`)
- **Frontend Apps:** Discuss, Live Chat, Calendar, WhatsApp
- **Core Models:** `Message`, `Channel`, `CalendarEvent`, `LiveChatSession`

### 📁 Document Management (`apps.edms`)
- **Frontend Apps:** Documents, Knowledge, Spreadsheet
- **Core Models:** `Document`, `Folder`, `Tag`

---

## 3. Data Flow & Routing
1. **Frontend Router (`EnterpriseRouter.jsx`):** Maps URLs like `/admin/invoicing` to the `InvoicingDashboard.jsx` placeholder.
2. **Backend API (`api/urls.py`):** Central router that delegates requests. For example, requests from Invoicing go to `/api/accounting/`.
3. **Domain Models (`domain/models.py`):** Each backend app defines its strict business logic and models inside `domain/models.py` (or `models.py`).
