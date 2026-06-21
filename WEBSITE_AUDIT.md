# BitGuard Enterprise Audit — Do-It-All MSP Identity Pivot
**Audit Date:** 2026-05-28 | **Scope:** Full-Stack (Frontend + Backend) + Brand Identity

---

> **CRITICAL**: This audit covers two dimensions simultaneously:
> 1. **Brand Pivot:** Shifting perception from a "Cybersecurity SaaS Monitor" to a "Do-It-All MSP & IT Enterprise"
> 2. **Full-Stack Connectivity:** Identifying where the frontend uses mock/hardcoded data vs. real backend API calls

---

## PART 1 — Brand Identity & Messaging Audit

### 1.1 Hero Section (`LandingPage.jsx`) — CRITICAL

| Finding | Impact |
|---|---|
| Badge text: `MANAGED SECURITY PLATFORM` | Immediately frames the company as a pure security SaaS |
| H1: `Enterprise IT & Cybersecurity, Simplified.` | "Cybersecurity" in the gradient = pure SOC company feel |
| Paragraph: `threat detection, compliance, SOC engineers, 15-min SLA` | Zero mention of Web Dev, AI, Digital Transformation, E-Commerce |
| Hero visual: Dark dashboard + radar rings + security video | 100% cybersecurity aesthetic — indistinguishable from CrowdStrike |

**What a real MSP's hero looks like (CDW, Insight, Logicalis):**
> "Your complete technology partner. Strategy, infrastructure, security, and innovation — all under one roof."

**Required Fix:** Rewrite headline + badge + subtext + hero visual to communicate ALL service pillars.

---

### 1.2 Navigation Mega-Menu (`PublicLayout.jsx`) — PARTIAL

| Finding | Status |
|---|---|
| Col 1: Managed IT — Helpdesk, NOC, Hardware | Good |
| Col 2: Cloud & Infra + Physical IT | Good |
| Col 3: Cybersecurity — takes a full column | Over-weighted |
| Col 4: Platform (SaaS platform) + Software & Data | Web Design, Full Stack Dev, App Development, Digital Transformation are buried |

**Critical Gap:** Web Development, E-Commerce, AI Automation have zero visual prominence in the nav. They are secondary items under "Software & Data" — which is itself buried at the bottom of Column 4.

**Required Fix:** Elevate "Digital Services" (Web Dev, E-Commerce, App Dev, AI Automation) to its own Column 3.

---

### 1.3 Services Marquee (`LandingPage.jsx`) — PARTIAL

Current marquee only shows technology vendor partners (Microsoft, AWS, CrowdStrike), anchoring the brand to security/infrastructure. No mention of: Web Dev, E-Commerce, AI, Digital Transformation.

**Required Fix:** Add a service capabilities marquee:
`• WEB DEVELOPMENT • AI AUTOMATION • E-COMMERCE PLATFORMS • MANAGED IT • PHYSICAL SECURITY • CLOUD MIGRATION • DIGITAL TRANSFORMATION •`

---

### 1.4 Bento Box Service Grid (`LandingPage.jsx`) — CRITICAL

| Card | Size | Issue |
|---|---|---|
| Managed Cybersecurity & SOC | `md:col-span-8` (HUGE) | Dominates the entire section |
| Managed IT & Helpdesk | `md:col-span-4` | Correct size |
| Cloud & VDI | `md:col-span-4` | Correct size |
| Physical Security | `md:col-span-4` | Correct size |
| Data & AI Solutions | `md:col-span-4` | Correct size |
| **Web Development & E-Commerce** | **MISSING** | Not represented at all |

**Required Fix:** Redesign bento so Web Dev & E-Commerce and AI get equal prominence. Cybersecurity reduced from `col-span-8` to `col-span-6`.

---

### 1.5 Footer Navigation — PARTIAL

"Web Design", "App Development", "Full Stack" are not prominently listed in the footer solutions column.

---

## PART 2 — Full-Stack Connectivity Audit

### 2.1 What IS connected to the real backend

| Feature | Frontend Call | Backend Endpoint | Status |
|---|---|---|---|
| Newsletter signup | `client.post('home/signups/')` | `POST /api/home/signups/` | LIVE |
| Footer newsletter | `client.post('home/signups/')` | Same | LIVE |
| Contact form | `client.post('home/inquiries/')` | `POST /api/home/inquiries/` | LIVE |
| Support ticket form | `client.post('home/support/ticket/')` | `POST /api/home/support/ticket/` — creates real CRM records | LIVE |
| Remote session join | `client.post('home/support/session/join/')` | `POST /api/home/support/session/join/` | LIVE |
| Announcements banner | `client.get('home/announcements/')` | `GET /api/home/announcements/` | LIVE |
| Global search backend | `GlobalSearchView` | Searches real `ServicePage` and `Page` models | EXISTS but NOT WIRED |

---

### 2.2 What is using MOCK/HARDCODED data

| Feature | Location | Issue | Priority |
|---|---|---|---|
| **Global Search (frontend)** | `PublicLayout.jsx` L100–113 | Uses hardcoded `mockData` array. Real `GET /api/home/search/?q=` endpoint exists but is NOT called | P0 |
| **Hero section badge/headline** | `LandingPage.jsx` L85–94 | Hardcoded copy biased toward security SaaS | P0 |
| **Bento Box service grid** | `LandingPage.jsx` L229–310 | Static hardcoded cards, not pulled from ServicePage backend | P1 |
| **Stats Bar** (500+ orgs, 99.99% uptime) | `LandingPage.jsx` L217–229 | Hardcoded numbers | P2 |
| **Why BitGuard tab section** | `LandingPage.jsx` | Hardcoded 3-item feature list | P2 |

---

### 2.3 Backend: Website App Connectivity Gap

The backend `website` app has a fully built `ServicePageViewSet` at `GET /api/home/services/` and a real `GlobalSearchView` at `GET /api/home/search/?q=`. Neither is being used on the frontend. The global search uses a mock JS array instead of calling the live endpoint.

**Action Required:** Wire `PublicLayout.jsx` search to call `client.get('home/search/?q=' + searchQuery)`.

---

### 2.4 Missing Backend Services for Marketing Content

| Feature | Backend Exists? | Frontend Exists? | Gap |
|---|---|---|---|
| Blog posts (`/api/blog/`) | Yes | Blog page references it | Need to verify seed data |
| Case Studies | No dedicated endpoint | `CaseStudies.jsx` is static | Static-only |
| Testimonials | No backend model | Hardcoded | Missing |
| Events | No dedicated endpoint | `Events.jsx` is static | Static-only |

---

## PART 3 — Prioritized Fix List

### P0 — Critical (Execute First)

1. Fix Global Search: Wire `PublicLayout.jsx` to call `client.get('home/search/?q=' + searchQuery)` instead of mock array
2. Rewrite Hero Headline & Badge: `MANAGED SECURITY PLATFORM` → `YOUR COMPLETE TECHNOLOGY PARTNER`; H1: `From Web Dev to Cybersecurity, We Do It All`
3. Redesign Bento Grid: Add large card for Web Development & E-Commerce and AI Automation; reduce Cybersecurity card from `col-span-8` to `col-span-6`
4. Add Services Capabilities Marquee: Scrolling text listing all service categories

### P1 — High Priority (Navigation + Services Visibility)

5. Restructure Nav Column 4: Rename "Software & Data" → "Digital Services"; add Web Dev, E-Commerce, AI Automation, Digital Transformation as prominent items
6. Rebalance Nav Column 3: Merge 6 Cybersecurity items into 3–4 key ones
7. Update Hero subtext: Include Web Dev, AI, Physical Security in paragraph

### P2 — Polish (Brand Consistency)

8. Hero Visual: Change pure security video to multi-panel visual showing all pillars
9. Services marquee: Add web dev + AI to tech partners marquee
10. Seed ServicePage database: Run `services_data.py` to populate backend search results

---

## Summary Scorecard

| Dimension | Current State | Target State |
|---|---|---|
| Brand identity | SOC SaaS company | Do-It-All MSP & IT Enterprise |
| Hero messaging | Cybersecurity-only | All 5 service pillars visible above the fold |
| Navigation | Web Dev buried in col 4 | Web Dev as a primary column |
| Backend connectivity | ~60% live | ~90% live (fix search + seed data) |
| Mock data | Global search + stats | Remove all mock data |

---

*This audit is authoritative for the BitGuard website redesign. All implementation work must reference this document.*
