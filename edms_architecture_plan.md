# Odoo-Style EDMS & Document Architecture Plan

This document outlines the architectural plan to upgrade the BitGuard platform's document generation and management capabilities, matching the power and flexibility of Odoo's 3-tier document engine.

## 1. The Core Attachment Engine (apps.core)
Currently, documents are hardcoded to a basic `Document` model. Odoo instead uses a highly flexible `ir.attachment` model.
- **Action**: Build a generic `Attachment` model in `apps.core`.
- **How it works**: Utilizing Django's `GenericForeignKey`, this model can attach any file (a PDF, an image, a spreadsheet) to *any* record in the entire database (Invoices, Projects, Contracts, Users) without needing explicit ForeignKeys for every model.

## 2. The PDF Reporting Engine (New App: apps.reporting)
Odoo uses an HTML-to-PDF engine (QWeb + Wkhtmltopdf) to generate all business documents dynamically.
- **Action**: Build a new `apps.reporting` module powered by `WeasyPrint` (the modern Python standard for HTML-to-PDF generation).
- **How it works**: 
  1. We define HTML/CSS templates for "Standard Invoice", "Start of Work", "SLA Agreement".
  2. A service grabs a database record (e.g., an Invoice), injects the data into the HTML template, and renders a pristine PDF.
  3. The PDF is saved as an `Attachment` linked to the Invoice record.

## 3. The EDMS App (Refactoring apps.documents -> apps.edms)
*Note on Naming: Renaming `documents` to `edms` (Electronic Document Management System) is an excellent enterprise practice. It signifies that the module is a comprehensive system for managing workflows, OCR, and retention policies, rather than just a simple file upload folder.*

- **Action**: Create the `apps.edms` module (migrating from `apps.documents`).
- **Features**:
  - **Workspaces**: Folders to isolate documents by department (Finance, HR, Legal).
  - **Tags**: Dynamic categorization (e.g., "To Validate", "Signed").
  - **EDMS Document Model**: Sits on top of the generic `Attachment` model to add metadata like OCR text extraction, version locking, and retention policies.

## Example Automated Workflow: Invoice Generation
1. A client pays for a Store Order.
2. The workflow signal creates an `accounting.Invoice`.
3. A background task triggers `ReportingService.generate_pdf(invoice)`.
4. The engine fetches the "Invoice Template", renders the HTML, and generates the PDF document.
5. The PDF is saved as an `Attachment` generic link to the invoice.
6. The EDMS indexes the invoice into the "Finance" Workspace.
7. The client logs into the portal and downloads their invoice PDF.
