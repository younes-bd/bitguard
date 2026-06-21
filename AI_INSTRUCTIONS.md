# Enterprise AI Agent Rules

> **CRITICAL DIRECTIVE**: You are operating within the BitGuard Enterprise Platform monorepo. Before making ANY architectural changes, creating new apps, or refactoring existing code, you MUST:
>
> 1. Use your file reading tools to read `CHARTER.md` and `ARCHITECTURE.md` located in the root of this repository.
> 2. Strictly enforce **Feature-Sliced Design (FSD)** for all React frontend code. Flat folder structures are strictly forbidden and must be refactored on sight.
> 3. Strictly enforce **Domain-Driven Design (DDD)** for all Django backend code. Views orchestrate, but services dictate business logic.
>
> Failure to read the charter and enforce these architectures violates the enterprise standard.

---

## COMPANY IDENTITY DIRECTIVE — PERMANENT

> **THIS IS THE MOST IMPORTANT RULE IN THIS FILE.**
>
> BitGuard is a **Do-It-All Managed Service Provider (MSP) and Full-Service IT Enterprise**. It is NOT a cybersecurity SaaS company. It is NOT a SOC monitoring platform. It is a comprehensive IT services company that offers ALL of the following service pillars equally:
>
> 1. **Managed IT Services** — Helpdesk, NOC, Co-Managed IT, Hardware Procurement, Disaster Recovery
> 2. **Web Development & Digital** — Custom Web Dev, E-Commerce Platforms, App Development, UI/UX Design
> 3. **AI & Automation** — AI Workflow Automation, LLM Integration, Business Intelligence, Data Analytics
> 4. **Cloud & Infrastructure** — Azure/AWS Migrations, Microsoft 365, VDI, VoIP, Structured Cabling
> 5. **Cybersecurity** — Managed SOC/MDR, Penetration Testing, Compliance (vCISO), Zero Trust
> 6. **Physical Security** — Camera Surveillance, Access Control, Alarm Systems, Structured Cabling
> 7. **Digital Transformation** — Legacy modernization, ERP/CRM implementations, process automation
>
> **When writing any code, marketing copy, UI labels, navigation items, hero text, placeholder text, or any content for this platform, ALL SEVEN pillars must be treated with equal weight. NEVER position BitGuard as primarily a security or SOC company.**
>
> **Reference companies for tone and breadth:** CDW, Insight Direct, Logicalis, Accenture Technology, Presidio, ePlus, NWN Carousel. These are Do-It-All IT enterprises, not pure cybersecurity SaaS vendors.

---

## WEBSITE BRANDING RULES

- Hero section messaging MUST reference multiple service pillars, not just security
- Navigation mega-menus MUST give Web Development and AI equal column prominence to Cybersecurity
- Service grids/bento boxes MUST include Web Dev, E-Commerce, and AI cards with equal visual weight
- Avoid language like "Threats Blocked", "SOC Platform", "Security Monitor" in primary hero copy
- Preferred hero language: "Complete Technology Partner", "Full-Service IT", "End-to-End IT Services"

## TECHNICAL REMINDERS

- The live backend search endpoint is `GET /api/home/search/?q=` — use it, never mock it
- All form submissions (Contact, Newsletter, Support) are wired to real API endpoints — keep them live
- ServicePage backend data is in `backend/apps/website/services_data.py` — use it for seeding
- See `WEBSITE_AUDIT.md` in this root folder for the full brand pivot and connectivity audit
