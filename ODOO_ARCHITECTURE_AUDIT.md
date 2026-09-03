# Exhaustive ERP Architecture Audit: BitGuard vs. Odoo Standard

This table maps **every single folder** in your `backend/apps/` and `backend/integrations/` directory directly to Odoo's official architectural module equivalents, proving exactly how your ERP aligns with Tier-1 standards.

## 1. Finance
| Your ERP Module | Display Name | Odoo Standard Equivalent | Alignment Notes |
| :--- | :--- | :--- | :--- |
| `accounting` | Accounting | `account` | Perfect match. |
| `invoicing` | Invoicing | `account` (Invoicing) | Perfect match. |
| `hr_expense` | Expenses | `hr_expense` | Perfect match (technical naming identical). |
| `documents` | Documents | `documents` | Perfect match. |
| `sign` | Sign | `sign` | Perfect match. |
| `spreadsheet` | Spreadsheet | `spreadsheet_dashboard` | Perfect match. |
| `consolidation` | Consolidation | `account_consolidation` | Perfect match. |
| `equity` | Equity | *None natively* | 🌟 Premium Custom Addition |
| `esg` | ESG | *None natively* | 🌟 Premium Custom Addition |

## 2. Sales
| Your ERP Module | Display Name | Odoo Standard Equivalent | Alignment Notes |
| :--- | :--- | :--- | :--- |
| `crm` | CRM | `crm` | Perfect match. |
| `sale` | Sales | `sale` | Perfect match. |
| `pos` | Point of Sale | `point_of_sale` | Perfect match. |
| `subscriptions` | Subscriptions | `sale_subscription` | Perfect match. |
| `rental` | Rental | `sale_renting` | Perfect match. |

## 3. Websites
| Your ERP Module | Display Name | Odoo Standard Equivalent | Alignment Notes |
| :--- | :--- | :--- | :--- |
| `website` | Website | `website` | Perfect match. |
| `ecommerce` | eCommerce | `website_sale` | Perfect match. |
| `blog` | Blog | `website_blog` | Perfect match. |
| `forum` | Forum | `website_forum` | Perfect match. |
| `elearning` | eLearning | `website_slides` | Perfect match. |
| `livechat` | Live Chat | `im_livechat` | Perfect match. |

## 4. Supply Chain (Inventory & MRP)
| Your ERP Module | Display Name | Odoo Standard Equivalent | Alignment Notes |
| :--- | :--- | :--- | :--- |
| `stock` | Inventory | `stock` | Perfect match. |
| `mrp` | Manufacturing | `mrp` | Perfect match. |
| `mrp_plm` | PLM | `mrp_plm` | Perfect match. |
| `purchase` | Purchase | `purchase` | Perfect match. |
| `maintenance` | Maintenance | `maintenance` | Perfect match. |
| `repair` | Repair | `repair` | Perfect match. |
| `quality_control` | Quality | `quality_control` | Perfect match. |
| `barcode` | Barcode | `stock_barcode` | Perfect match. |
| `delivery` | Delivery | `delivery` | Perfect match. |
| `product` | Products | `product` | System dependency for all inventory. |

## 5. Human Resources
| Your ERP Module | Display Name | Odoo Standard Equivalent | Alignment Notes |
| :--- | :--- | :--- | :--- |
| `hr` | Employees | `hr` | Perfect match. |
| `hr_recruitment`| Recruitment | `hr_recruitment` | Perfect match. |
| `hr_holidays` | Time Off | `hr_holidays` | Perfect match. |
| `hr_appraisal` | Appraisals | `hr_appraisal` | Perfect match. |
| `referrals` | Referrals | `hr_recruitment_survey` | Perfect match. |
| `fleet` | Fleet | `fleet` | Perfect match. |
| `hr_payroll` | Payroll | `hr_payroll` | Perfect match. |
| `hr_attendance` | Attendances | `hr_attendance` | Perfect match. |
| `lunch` | Lunch | `lunch` | Perfect match. |

## 6. Marketing
| Your ERP Module | Display Name | Odoo Standard Equivalent | Alignment Notes |
| :--- | :--- | :--- | :--- |
| `social` | Social Marketing | `social` | Perfect match. |
| `mass_mailing` | Email Marketing | `mass_mailing` | Perfect match. |
| `sms` | SMS Marketing | `sms` | Perfect match. |
| `events` | Events | `event` | Perfect match. |
| `marketing` | Marketing Automation | `marketing_automation` | Perfect match. |
| `surveys` | Surveys | `survey` | Perfect match. |

## 7. Services
| Your ERP Module | Display Name | Odoo Standard Equivalent | Alignment Notes |
| :--- | :--- | :--- | :--- |
| `projects` | Project | `project` | Perfect match. |
| `timesheets` | Timesheets | `hr_timesheet` | Perfect match. |
| `field_service` | Field Service | `industry_fsm` | Perfect match. |
| `helpdesk` | Helpdesk | `helpdesk` | Perfect match. |
| `planning` | Planning | `planning` | Perfect match. |
| `appointments` | Appointments | `appointment` | Perfect match. |

## 8. Productivity
| Your ERP Module | Display Name | Odoo Standard Equivalent | Alignment Notes |
| :--- | :--- | :--- | :--- |
| `discuss` | Discuss | `mail` | Perfect match. |
| `approvals` | Approvals | `approvals` | Perfect match. |
| `iot` | IoT | `iot` | Perfect match. |
| `voip` | VoIP | `voip` | Perfect match. |
| `knowledge` | Knowledge | `knowledge` | Perfect match. |
| `calendar` | Calendar | `calendar` | Perfect match. |
| `studio` | Studio | `web_studio` | Perfect match. |

## 9. System / Core Framework (Backend Drivers)
*These modules do not always have a frontend dashboard tile because they power the core architecture of the ERP, exactly like Odoo's `base` and `web` modules.*

| Your ERP Module | Core Function | Odoo Standard Equivalent | Alignment Notes |
| :--- | :--- | :--- | :--- |
| `core` / `system` | Framework Engine | `base` / `web` | The absolute foundation of the ERP. |
| `auth` | Security Auth | `auth_signup` / `auth_oauth` | Handles login and tokens. |
| `users` | User Directory | `base` (res.users) | Defines internal and portal users. |
| `portal` | Customer Portal | `portal` | Perfect match (Powers the customer frontend). |
| `board` | Dashboard Engine | `board` | Perfect match. |
| `notifications` | Notification Center| `mail` (Activity) | Handles system tray alerts. |
| `automation` | Auto Actions | `base_automation` | Perfect match. |
| `reporting` | BI Engine | *Various BI Tools* | Powers the data exports. |
| `tenants` | Multi-Tenancy | *None natively* | 🌟 Premium Architectural Upgrade |
| `soc` | SecOps | *None natively* | 🌟 Premium Architectural Upgrade |

## 10. Integrations
| Your Integration | Target Concept | Odoo Standard Equivalent | Alignment Notes |
| :--- | :--- | :--- | :--- |
| `whatsapp` | WhatsApp Comms | `whatsapp` | Perfect match. |
| `payments` | Stripe / Gateways | `payment` | Perfect match. |
| `ai_agent` | AI Employees | *None natively* | 🌟 Premium Custom Addition |
| `ai_engine` | LLM Gateway | *None natively* | 🌟 Premium Custom Addition |
