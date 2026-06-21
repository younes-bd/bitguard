# 🔍 BitGuard — Do-It-All IT Enterprise: Full Website Audit
**Date:** May 30, 2026  
**Audited by:** 3 Specialist AI Agents (Frontend Pages · Navigation/Layouts · Routes/Services)  
**Benchmark:** Cloudflare · CrowdStrike · Datadog · Cisco · CDW · Palo Alto Networks

---

> [!CAUTION]
> **Overall Score: 5.9 / 10 — "Enterprise-Aspirant"**
> The visual design is world-class (9/10). The single biggest risk is **authenticity**: fake companies, dead links, and non-functional buttons will fail enterprise procurement due-diligence reviews.

---

## Summary Table

| Area | Score | Status |
|---|---|---|
| Visual Design & UI | 9/10 | ✅ Excellent |
| Navigation Structure | 7/10 | ⚠️ High-priority fixes |
| Service Pillar Coverage | 7/10 | ⚠️ Physical Security & Digital Services under-served |
| Content Authenticity | 4/10 | ❌ Fake companies, placeholder media |
| Functional Completeness | 5/10 | ❌ Many broken buttons & dead links |
| Social Proof | 5/10 | ❌ No real client logos, duplicate testimonials |
| SEO & Structured Data | 4/10 | ❌ Missing JSON-LD, no service schemas |
| Legal / Compliance Docs | 6/10 | ⚠️ No actual certificate downloads |

---

## 🔴 CRITICAL ISSUES (Fix Immediately)

These will actively damage enterprise sales and are verifiable 404s or broken UX.

### C-01 — `/blog` has NO route
- **File:** `WebsiteRoutes.jsx`
- **Linked from:** PublicLayout.jsx L227, L581, L848 · LandingPage.jsx L717
- **Issue:** 4 UI locations link to `/blog` but no Blog page or route exists. Users hit a blank page.
- **Fix:** Create `Blog.jsx` and add `<Route path="blog" element={<Blog />} />` inside `WebsiteRoutes.jsx`.

---

### C-02 — `/store` has NO route in WebsiteRoutes
- **File:** `WebsiteRoutes.jsx` / `PublicLayout.jsx` L551, L741, L880
- **Issue:** "IT Store" is a top-level nav link but `/store` is not wired into `WebsiteRoutes.jsx`. A store sub-app exists at `src/apps/store/` but is disconnected.
- **Fix:** Import the store app and add the route.

---

### C-03 — `/login` has NO route
- **File:** `WebsiteRoutes.jsx` / `PublicLayout.jsx` L749, L886
- **Issue:** Both desktop and mobile "Sign In" buttons link to `/login` which 404s.
- **Fix:** Add the login route.

---

### C-04 — 3 Industry pages cause 404 (missing data)
- **File:** `servicesData.js`
- **Affected:** `/industries/legal`, `/industries/education`, `/industries/energy`
- **Issue:** All 3 are in the nav dropdown but have NO data entry in `servicesData.js`. `ServiceDetail.jsx` renders a "not found" state.
- **Fix:** Add `'legal'`, `'education'`, and `'energy'` entries to `servicesData.js`.

---

### C-05 — App.jsx route order conflict: `/*` wildcard is FIRST
- **File:** `App.jsx` L71
- **Issue:** The `/*` wildcard is declared as the FIRST route. All specific routes below it (`/blog`, `/store`, `/login`, `/admin/*`, `/portal/*`) risk being swallowed by WebsiteRoutes before being evaluated. This is a critical routing conflict.
- **Fix:** Move `<Route path="/*" element={<WebsiteRoutes />} />` to the LAST position in App.jsx.

---

### C-06 — `/brochure/:slug` renders without header/footer
- **File:** `WebsiteRoutes.jsx` L60-61
- **Issue:** The `brochure/:slug` route is placed OUTSIDE the `<Route element={<PublicLayout />}>` wrapper. Brochure pages render with no navigation, header, or footer.
- **Fix:** Move the brochure route inside the PublicLayout wrapper.

---

### C-07 — Reports.jsx: All PDF downloads are fake
- **File:** `Reports.jsx` L22-27
- **Issue:** `handleDownload` sets `href='#'` — users fill out the lead form and receive a blank download. This is a critical CRO failure.
- **Fix:** Store real PDFs in `/assets/reports/` and set real `href` values per report object.

---

### C-08 — Podcasts.jsx: Spotify/Apple links go to platform homepages
- **File:** `Podcasts.jsx` L53, L56
- **Issue:** Links point to `open.spotify.com` and `podcasts.apple.com` root pages — not a BitGuard show. "Play Episode" buttons have no audio player or handler.
- **Fix:** Link to real show pages or replace with "Coming Soon" email capture.

---

### C-09 — FreeTools.jsx: Password checker uses `type="text"`
- **File:** `FreeTools.jsx` L145
- **Issue:** The password strength checker displays the password in **plaintext** as you type. This is a security anti-pattern on a cybersecurity company's website. Enterprise CISOs will immediately lose trust.
- **Fix:** Change to `type="password"` and add a show/hide toggle.

---

### C-10 — Support.jsx: `/kb` link likely 404
- **File:** `Support.jsx` L143
- **Issue:** A "Knowledge Base" link goes to `/kb`. No `/kb` route exists in `WebsiteRoutes.jsx`.
- **Fix:** Either build the KB page or change link to `/reports` or `/free-tools` as interim.

---

### C-11 — LandingPage.jsx: Duplicate testimonials (same person, conflicting titles)
- **File:** `LandingPage.jsx` L543–L701
- **Issue:** "Sarah Jenkins" appears twice — once as CTO (L558) and once as CFO (L672). Enterprise prospects who notice this immediately lose trust in all testimonials.
- **Fix:** Merge into ONE testimonials section with 5-6 unique, verified-looking profiles.

---

### C-12 — Integrations.jsx: Claims "150+ tools" but only 10 are listed
- **File:** `Integrations.jsx` L40
- **Issue:** The copy reads "BitGuard connects with over 150+ enterprise tools" but only 10 integrations are in the array. This will be flagged in any enterprise RFP.
- **Fix:** Either expand the list significantly or rewrite the copy: "10+ native integrations with hundreds of API-connected tools."

---

## 🟠 HIGH SEVERITY ISSUES

### H-01 — Industries dropdown uses stale key `'solutions'`
- **File:** `PublicLayout.jsx` L508-546
- **Issue:** `handleMenuEnter('solutions')` is fired on the Industries nav item but the active section check uses `isActiveSection('industries')`. The `aria-expanded` reports the wrong state — accessibility violation.
- **Fix:** Rename the state key from `'solutions'` to `'industries'` throughout.

### H-02 — `isActiveSection('store')` always returns false
- **File:** `PublicLayout.jsx` L135-147, L552
- **Issue:** No `case 'store'` exists in the `isActiveSection` switch. The IT Store active underline indicator never appears.
- **Fix:** Add `case 'store': return path.startsWith('/store');`

### H-03 — Physical Security links absent from mobile menu
- **File:** `PublicLayout.jsx` L791-817
- **Issue:** Desktop nav has Camera Surveillance, Access Control, and Structured Cabling under Physical IT. None of these appear in the mobile menu. A key differentiator service is invisible on mobile.
- **Fix:** Add a Physical Security subsection to the mobile Services section.

### H-04 — Footer social links point to platform root domains
- **File:** `PublicLayout.jsx` L975-978
- **Issue:** `href="https://linkedin.com"` etc. — these link to LinkedIn's homepage, not BitGuard's company page.
- **Fix:** Replace with real BitGuard profile URLs.

### H-05 — Placeholder phone number in JSON-LD structured data
- **File:** `PublicLayout.jsx` L189
- **Issue:** `"+1-800-555-0199"` is indexed by Google. This damages SEO credibility.
- **Fix:** Replace with the real business phone number or remove the contactPoint.

### H-06 — ConsoleLayout logout does not navigate after calling `logout()`
- **File:** `ConsoleLayout.jsx` L42-44
- **Issue:** After logout, the user stays on a protected route. No redirect to `/login` or `/`.
- **Fix:** Add `navigate('/login')` after `logout()`.

### H-07 — AccountsLayout, StoreLayout, PlatformLayout use raw localStorage logout
- **Files:** `AccountsLayout.jsx` L53-57 · `StoreLayout.jsx` L30-34 · `PlatformLayout.jsx` L42-46
- **Issue:** These layouts bypass the centralized `useAuth` logout context, directly deleting localStorage tokens. This can leave React auth state dirty.
- **Fix:** Import and use `useAuth().logout()` consistently in all layouts.

### H-08 — StoreLayout: `items` vs `sections` prop mismatch on Sidebar component
- **File:** `StoreLayout.jsx` L45 · `PlatformLayout.jsx` L59
- **Issue:** `ConsoleLayout` passes `sections={...}` but StoreLayout passes `items={...}` to the same Sidebar component.
- **Fix:** Audit the Sidebar component's API and standardize all layouts to use the same prop.

### H-09 — PlatformLayout: Profile/Settings dropdown buttons are non-functional
- **File:** `PlatformLayout.jsx` L118-129
- **Issue:** Profile and Settings are `<button>` elements with no `onClick` or navigation.
- **Fix:** Convert to `<Link to="/account/personal-info">` and `<Link to="/account/security">`.

### H-10 — PortalRoutes: Marketing module has no SubscriptionGuard
- **File:** `PortalRoutes.jsx` L62-65
- **Issue:** All other portal modules (CRM, ERP, SOC) are wrapped in `<SubscriptionGuard>`. The marketing module is not — any authenticated user can access it regardless of their subscription.
- **Fix:** Wrap with `<SubscriptionGuard requiredProduct="marketing">`.

### H-11 — `/settings` redirect causes loop for non-admin users
- **File:** `App.jsx` L124
- **Issue:** All users hitting `/settings` are sent to `/admin/settings`, which then bounces non-admin users back to `/portal`, creating a redirect loop.
- **Fix:** Make redirect role-aware: `<Navigate to={isAdmin ? '/admin/settings' : '/account/security'} />`.

### H-12 — Footer newsletter has no `<label>` or GDPR consent note
- **File:** `PublicLayout.jsx` L951-971
- **Issue:** WCAG 2.1 AA and GDPR require a visible label on form inputs and a consent statement for email marketing.
- **Fix:** Add `<label>` and "By subscribing you agree to our Privacy Policy" below the form.

### H-13 — ServiceDetail.jsx: "Related Services" are hardcoded to 3 fixed links
- **File:** `ServiceDetail.jsx` L240-242
- **Issue:** All service pages show the same 3 related services (MDR, Helpdesk, Digital Transformation) regardless of which page you're on. Camera Surveillance shows "Digital Transformation" as related.
- **Fix:** Add a `relatedServices` array to each entry in `servicesData.js`.

### H-14 — Support.jsx: UTF-8 encoding error `â€"` in option labels
- **File:** `Support.jsx` L277-280
- **Issue:** Em dashes are being double-encoded as `â€"` — renders as garbage characters in the browser. This looks extremely unprofessional.
- **Fix:** Replace all `â€"` with `–` (unicode em dash) directly in JSX.

### H-15 — 4 duplicate keys in `servicesData.js` (content silently discarded)
- **File:** `servicesData.js`
- **Duplicates:** `cloud-storage` (L1235 & L1586) · `web-design` (L1280 & L1627) · `full-stack` (L1366 & L1668) · `staff-augmentation` (L1063 & L1709)
- **Issue:** JavaScript silently discards the first definition. Hours of written content are completely unreachable.
- **Fix:** Remove or merge duplicate keys. Keep the best version of each.

### H-16 — Hero section uses a generic Pixabay stock video
- **File:** `LandingPage.jsx` L146
- **Issue:** `cdn.pixabay.com/video/...` is an obvious stock filler. Enterprise CTOs and IT Directors recognize stock footage immediately.
- **Fix:** Replace with a branded product demo clip, an animated Lottie, or a real dashboard screenshot.

### H-17 — No client logo strip / "Trusted By" section on landing page
- **File:** `LandingPage.jsx` L170-231
- **Issue:** Vendor logos are shown (Microsoft, AWS) but no client company logos. Every enterprise IT leader (Datadog, CDW, Cisco) leads with "Trusted by X companies."
- **Fix:** Add a "Trusted By" section with 8-12 client/industry logos or anonymized reference marks.

### H-18 — SecurityTrustCenter.jsx: No downloadable SOC 2 / ISO 27001 report
- **File:** `SecurityTrustCenter.jsx`
- **Issue:** BitGuard claims SOC 2 Type II certification with no downloadable evidence artifact. Enterprise procurement requires this.
- **Fix:** Add a lead-gated "Download SOC 2 Type II Report" button. Even a summary letter from the auditor builds credibility.

### H-19 — Compliance.jsx: "Download Report" button links to Reports.jsx (which has fake downloads)
- **File:** `Compliance.jsx` L80, L159
- **Issue:** The compliance report download chain is broken end-to-end. A broken compliance download is embarrassing during enterprise RFP processes.
- **Fix:** Either create real compliance PDFs or change CTA to "Request Compliance Documentation — Contact Sales."

### H-20 — Integrations.jsx: "View Documentation" links go to `/contact`
- **File:** `Integrations.jsx` L84-86
- **Issue:** Every integration card's documentation link redirects to the contact page. Enterprise developers expect real API docs.
- **Fix:** Create placeholder documentation pages or change CTA to "Request API Access."

---

## 🟡 MEDIUM SEVERITY ISSUES

| ID | File | Issue | Fix |
|---|---|---|---|
| M-01 | PublicLayout.jsx L227 | Banner "Learn More" hardcoded to `/blog` | Use `bannerAnnouncement.link \|\| '/blog'` |
| M-02 | PublicLayout.jsx L290 | Platform dropdown header says "BitGuard Software SOC" — too narrow | Change to "BitGuard Platform" |
| M-03 | PublicLayout.jsx L549-557 | IT Store missing as top-level section in mobile menu | Add IT Store section between Industries and Pricing in mobile nav |
| M-04 | PublicLayout.jsx L535/L826 | Energy & Utilities missing from mobile Industries section | Add `<Link to="/industries/energy">Energy & Utilities</Link>` to mobile nav |
| M-05 | PublicLayout.jsx L397/L808 | Compliance (vCISO) missing from mobile Cybersecurity section | Add to mobile Services/Cybersecurity subsection |
| M-06 | PublicLayout.jsx L694/L893 | User avatar hardcoded to static path, ignores `user.avatar` | Use `src={user?.avatar \|\| '/assets/images/user/avatar.png'}` |
| M-07 | PublicLayout.jsx L192-196 | JSON-LD `sameAs` social URLs may point to unclaimed profiles | Verify and store in env config |
| M-08 | PublicLayout.jsx L1022-1032 | Footer Company column missing System Status and Team links | Add `/status` and `/team` to footer Company column |
| M-09 | PublicLayout.jsx L1043-1050 | Compliance badges are text-only, not linked to Trust Center | Wrap each badge in `<Link to="/security">` |
| M-10 | PublicLayout.jsx (Footer) | `/accessibility` page exists but not linked in footer legal bar | Add `<Link to="/accessibility">Accessibility</Link>` |
| M-11 | StoreLayout.jsx L65-68 | Bell notification is a dummy with hardcoded pulsing dot | Replace with shared `<NotificationBell />` component |
| M-12 | StoreLayout.jsx L58-62 | Breadcrumb hardcoded "Store / Catalog" on all pages | Use `useLocation()` to generate dynamic breadcrumb |
| M-13 | PlatformLayout.jsx L111 | Uses `font-['Oswald']` but Oswald likely not imported | Add Oswald to Google Fonts import or remove the class |
| M-14 | App.jsx L85-106 | Account route paths missing leading `/` | Add leading `/` to all account route paths |
| M-15 | ServiceDetail.jsx L146 | `dangerouslySetInnerHTML` used without DOMPurify sanitization | Add `DOMPurify.sanitize()` before rendering |
| M-16 | ServiceDetail.jsx | Missing `Schema.org Service` JSON-LD on all service pages | Add Service schema per page |
| M-17 | Careers.jsx | Static job listings with no application mechanism or ATS | Integrate ATS or create application form posting to backend |
| M-18 | Contact.jsx | No "Response time" expectation set | Add "We typically respond within 2 business hours" |
| M-19 | StatusPage.jsx | No historical 90-day uptime data | Add uptime history bars per service (requires backend incidents log) |
| M-20 | StatusPage.jsx | No incident history / post-mortems | Add Incident History section |
| M-21 | Team.jsx | No LinkedIn links on team member cards | Add LinkedIn icon/link to each profile |
| M-22 | Team.jsx | No certifications displayed next to team members | Add CISSP, CCNA, CompTIA Security+ badges per person |
| M-23 | LandingPage.jsx L178-189 | Stats are round/unverifiable numbers | Add 1-2 precise, auditable metrics |
| M-24 | LandingPage.jsx L321-339 | Cloud and Physical Security bento cards have no description text | Add 2-line descriptions to each small bento cell |
| M-25 | CaseStudies.jsx | Only 4 case studies — none for Digital Services or Physical Security | Expand to 8+ case studies covering all service pillars |
| M-26 | CaseStudies.jsx | ROI metrics are vague ("40% reduction") | Add baseline+result format: "From X to Y in Z months" |
| M-27 | PrivacyPolicy.jsx | No GDPR lawful basis section, no CCPA/CPRA section | Add both EU and California-specific sections |
| M-28 | TermsOfService.jsx | No Data Processing Agreement (DPA) mention | Add DPA section with contact email |
| M-29 | Compliance.jsx | Missing FedRAMP / CMMC for government sector clients | Add CMMC and FedRAMP sections (even as "In Progress") |
| M-30 | Events.jsx L99 | "Register Now" buttons have no `onClick`, form, or link | Wire to registration form, Eventbrite, or Zoom page |
| M-31 | Events.jsx L42, L48 | Past event "Watch" buttons link to `#` | Link to YouTube/Vimeo or remove the button |
| M-32 | Reports.jsx L163 | "Subscribe to Intelligence Feed" button has no action | Wire to newsletter subscription API |

---

## 🟢 LOW SEVERITY ISSUES

| ID | File | Issue |
|---|---|---|
| L-01 | PublicLayout.jsx L207 | `bannerHeight` variable computed but never used — dead code |
| L-02 | PortalRoutes.jsx L22 | `ProtectedRoute` imported but never used |
| L-03 | PublicLayout.jsx (Footer) | Podcasts missing from footer Resources column |
| L-04 | PublicLayout.jsx (Footer) | Incident Management + Log Analysis missing from footer Platform column |
| L-05 | StoreLayout.jsx | Indigo accent color vs. blue in all other layouts — accidental inconsistency |
| L-06 | PlatformLayout.jsx L51-52 | Two sidebar items share same Shield icon — visually ambiguous |
| L-07 | servicesData.js L1533 | `business-process-improvement` has duplicate `faq` property |
| L-08 | LandingPage.jsx L135, L461 | `transparenttextures.com` external CDN — self-host instead |
| L-09 | FreeTools.jsx L14 | ROI savings hardcoded at 60% — cite Gartner or similar source |
| L-10 | FreeTools.jsx L191 | Speed test redirects to `speedtest.net` — breaks UX flow |
| L-11 | FreeTools.jsx L54 | Meta description mentions "subnet calculator" but it doesn't exist |
| L-12 | Reports.jsx | No author attribution on reports |
| L-13 | CaseStudies.jsx | No industry/service filter tags |
| L-14 | Integrations.jsx | No maturity/status badges (Beta, GA, Certified) per integration |
| L-15 | Podcasts.jsx | No episode count or show start date |
| L-16 | Compliance.jsx | No compliance roadmap or certification timeline |
| L-17 | About.jsx | No press / awards / recognition section |
| L-18 | Multiple pages | No `aria-label` on icon-only buttons — WCAG 2.1 AA gap |

---

## 📊 Orphaned & Unreachable Pages

The following slugs exist in `servicesData.js` but have NO inbound navigation link:

| Slug | Accessible? |
|---|---|
| `alarm-systems` | ❌ Orphaned — not in any nav |
| `assess` | ⚠️ Mobile only — not in desktop nav |
| `incident-management` | ❌ Not in desktop nav dropdown |
| `log-analysis` | ❌ Not in desktop nav dropdown |
| `defend`, `control`, `security-advisor` | ❌ Orphaned |
| `mfa`, `threat-detection`, `edr` | ❌ Orphaned |
| `erp-consulting`, `process-audits`, `consulting` | ❌ Orphaned |
| `hardware-procurement` | ⚠️ Desktop only — not in mobile nav |

---

## ✅ What Is Working Well (Don't Break These)

- Sticky glassmorphism header with scroll detection and dark/light mode ✅
- Hover dropdown with 200ms delay guard (no accidental close) ✅
- Announcement banner fetched from API, dismissible ✅
- Global Ctrl+K search with live debounced API ✅
- "Under Attack?" emergency floating button + modal ✅
- Body scroll lock when mobile menu is open ✅
- Newsletter API wired to real `home/signups/` endpoint ✅
- Cookie consent banner ✅
- 6-column footer grid with system status live indicator ✅
- Compliance badges in footer (SOC2, ISO 27001, HIPAA, GDPR, PCI-DSS) ✅
- ServiceDetail.jsx: Sticky ToC, scroll spy, schema-less dynamic routing ✅
- FreeTools.jsx: Real ROI calculator logic and real password strength algorithm ✅
- StatusPage.jsx: Real API-driven status checks ✅
- Support.jsx: Real ticket submission with SLA table ✅
- ErrorBoundary in AccountsLayout ✅
- JSON-LD structured data injected in PublicLayout ✅

---

## 🔌 Backend & API Integration Issues

While the backend architecture is highly modular (27+ apps including CRM, ITSM, SOC, HRM), the marketing frontend fails to leverage it properly.

| ID | File/Module | Issue | Fix |
|---|---|---|---|
| B-01 | `config/settings/base.py` | `ALLOWED_HOSTS = ['*']` is set globally. This is a severe security vulnerability for a cybersecurity company. | Restrict to specific domains and use `.env` vars. |
| B-02 | `apps/website/api/views.py` | `WebsiteInquiryViewSet` simply saves to a local table and **does not** create a `Lead` in the CRM. | Integrate with `apps.crm.models.Lead` to ensure sales pipeline continuity. |
| B-03 | Frontend Architecture | The marketing site relies almost entirely on hardcoded data (`servicesData.js`) instead of the backend CMS models (`Page`, `ServicePage`). | Wire the frontend to fetch content from `/api/website/pages/`. |
| B-04 | `apps/website/api/views.py` | `SupportTicketView` creates a new `Client` (type='individual') for *every* anonymous ticket, flooding the CRM with junk clients. | Look up existing clients by domain/email first; create `Lead`s or `Guest Ticket`s instead of full Clients. |
| B-05 | `apps/blog` & `apps/store` | Robust backend models exist for these apps, but the frontend routes (`/blog`, `/store`) are disconnected, rendering the backend APIs unused. | Wire the frontend router to expose these endpoints. |

---

### Phase 1 — Fix the 404s (Do This First)
1. Fix App.jsx route order — move `/*` to last position
2. Add `/blog`, `/store`, `/login` routes
3. Move `/brochure/:slug` inside PublicLayout wrapper
4. Add `legal`, `education`, `energy` to `servicesData.js`
5. Add `case 'store'` to `isActiveSection` switch

### Phase 2 — Fix Broken UX (CRO Critical)
6. Fix all dead buttons in Events.jsx, Podcasts.jsx, Reports.jsx
7. Fix PDF download functionality in Reports.jsx
8. Fix `type="text"` → `type="password"` in FreeTools.jsx
9. Fix UTF-8 encoding error (`â€"`) in Support.jsx
10. Fix `/kb` link in Support.jsx
11. Fix footer social links to real BitGuard profiles
12. Fix "150+ integrations" copy vs. 10 actual in Integrations.jsx
13. Merge duplicate testimonials on LandingPage

### Phase 3 — Fix Auth, Routing & Backend API
14. ConsoleLayout logout — add `navigate('/login')` after `logout()`
15. AccountsLayout, StoreLayout, PlatformLayout — use centralized `useAuth().logout()`
16. Fix PortalRoutes — add SubscriptionGuard to marketing module
17. Fix `/settings` redirect to be role-aware
18. Fix Industries menu key from `'solutions'` to `'industries'`
19. Fix duplicate keys in `servicesData.js`
20. Fix `WebsiteInquiryViewSet` to create CRM `Lead`s (B-02)
21. Fix `SupportTicketView` to avoid spamming CRM `Client`s (B-04)
22. Secure `ALLOWED_HOSTS` in `base.py` (B-01)

### Phase 4 — Enterprise Grade Polish
23. Replace Pixabay stock hero video with branded content
24. Add real client logo strip / "Trusted By" section
25. Add Physical Security links to mobile menu
26. Add `<label>` + GDPR consent to newsletter form
27. Add JSON-LD Service schema to all service pages
28. Add downloadable SOC 2 report to Trust Center (lead-gated)
29. Add "Enterprise / Custom" tier to Pricing page
30. Add LinkedIn links and certification badges to Team page
31. Add 90-day uptime history to Status page
32. Fix user avatar to use `user?.avatar` instead of hardcoded path
33. Replace placeholder phone number in JSON-LD structured data
