/**
 * BitGuard ERP — ESLint Configuration
 *
 * Boundary zones are derived from .agents/rules/layer_registry.json (Rule 65).
 * If you need to reclassify a module, update layer_registry.json first, then
 * update the matching pattern in `boundaries/elements` below.
 *
 * ┌────────────────────────────────────────────────────────────────────────┐
 * │ Zone                  │ Layer │ Path pattern                           │
 * ├────────────────────────────────────────────────────────────────────────┤
 * │ kernel-engine         │  L1   │ src/core/**                            │
 * │ kernel-domain-service │  L1   │ src/apps/{core,auth,tenants}/(api|ctx) │
 * │ kernel-proxy-ui       │  L1*  │ src/apps/{core,auth,tenants}/** (UI)   │
 * │ platform              │  L2   │ src/apps/{shell,system,apps,…}/**      │
 * │ business-app          │  L3   │ src/apps/{accounting,crm,…}/**         │
 * │ edge                  │  L4   │ src/apps/{amazon,ai_engine}/**         │
 * └────────────────────────────────────────────────────────────────────────┘
 * * Rule 9C & Rule 45: core/auth/tenants backend is L1 kernel.
 *   - Their domain API services & domain contexts are L1 Domain Services.
 *   - Their visual frontend folders under apps/ are L2 proxy UI.
 *
 * Traffic Laws (Rule 9 & Rule 45):
 *   kernel-engine         → kernel-engine, kernel-domain-service
 *   kernel-domain-service → kernel-engine, kernel-domain-service
 *   kernel-proxy-ui       → kernel-engine, kernel-domain-service, kernel-proxy-ui
 *   platform              → kernel-engine, kernel-domain-service, kernel-proxy-ui, platform
 *   business-app          → kernel-engine, kernel-domain-service, kernel-proxy-ui, platform, business-app
 *   edge                  → all zones (external connectors have no restrictions)
 */

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'boundaries'],

  settings: {
    react: { version: 'detect' },

    // --- Zone definitions (must match layer_registry.json) ---
    'boundaries/elements': [
      // ── L1: Headless kernel engine ──────────────────────────────────
      {
        type: 'kernel-engine',
        pattern: 'src/core/**/*',
      },

      // ── L1 Domain Services (Rule 45): API services and domain contexts of L1 apps
      {
        type: 'kernel-domain-service',
        pattern: [
          'src/apps/core/api/**/*',
          'src/apps/auth/api/**/*',
          'src/apps/auth/context/**/*',
          'src/apps/tenants/api/**/*',
          'src/apps/tenants/context/**/*',
        ],
      },

      // ── L1* (Rule 9C): Backend is L1, frontend proxy UI is L2 ──────
      {
        type: 'kernel-proxy-ui',
        pattern: [
          'src/apps/core/**/*',
          'src/apps/auth/**/*',
          'src/apps/tenants/**/*',
        ],
      },

      // ── L2: Platform services (application:true, launcher_tile:false) ─
      {
        type: 'platform',
        pattern: [
          'src/apps/shell/**/*',
          'src/apps/system/**/*',
          'src/apps/apps/**/*',
          'src/apps/users/**/*',
          'src/apps/inbox/**/*',
          'src/apps/portal/**/*',
          'src/apps/automation/**/*',
          'src/apps/reports/**/*',
          'src/apps/product/**/*',
          'src/apps/payments/**/*',
        ],
      },

      // ── L3: Business applications (application:true, launcher_tile:true)
      {
        type: 'business-app',
        pattern: [
          'src/apps/accounting/**/*',
          'src/apps/agents/**/*',
          'src/apps/analytics/**/*',
          'src/apps/appointments/**/*',
          'src/apps/approvals/**/*',
          'src/apps/barcode/**/*',
          'src/apps/blog/**/*',
          'src/apps/calendar/**/*',
          'src/apps/campaigns/**/*',
          'src/apps/consolidation/**/*',
          'src/apps/crm/**/*',
          'src/apps/discuss/**/*',
          'src/apps/dispatch/**/*',
          'src/apps/documents/**/*',
          'src/apps/ecommerce/**/*',
          'src/apps/employees/**/*',
          'src/apps/equity/**/*',
          'src/apps/esg/**/*',
          'src/apps/events/**/*',
          'src/apps/expenses/**/*',
          'src/apps/fleet/**/*',
          'src/apps/forum/**/*',
          'src/apps/frontdesk/**/*',
          'src/apps/helpdesk/**/*',
          'src/apps/inventory/**/*',
          'src/apps/invoicing/**/*',
          'src/apps/iot/**/*',
          'src/apps/journeys/**/*',
          'src/apps/knowledge/**/*',
          'src/apps/learning/**/*',
          'src/apps/lunch/**/*',
          'src/apps/maintenance/**/*',
          'src/apps/manufacturing/**/*',
          'src/apps/messaging/**/*',
          'src/apps/payroll/**/*',
          'src/apps/performance/**/*',
          'src/apps/planning/**/*',
          'src/apps/pos/**/*',
          'src/apps/procurement/**/*',
          'src/apps/production/**/*',
          'src/apps/projects/**/*',
          'src/apps/quality/**/*',
          'src/apps/recruiting/**/*',
          'src/apps/referrals/**/*',
          'src/apps/rental/**/*',
          'src/apps/repair/**/*',
          'src/apps/sales/**/*',
          'src/apps/sign/**/*',
          'src/apps/sms/**/*',
          'src/apps/soc/**/*',
          'src/apps/social/**/*',
          'src/apps/spreadsheet/**/*',
          'src/apps/studio/**/*',
          'src/apps/subscriptions/**/*',
          'src/apps/surveys/**/*',
          'src/apps/timeclock/**/*',
          'src/apps/timeoff/**/*',
          'src/apps/timesheets/**/*',
          'src/apps/voip/**/*',
          'src/apps/website/**/*',
          'src/apps/whatsapp/**/*',
        ],
        capture: ['appName'],
      },

      // ── L4: External integrations (application:false, launcher_tile:false)
      {
        type: 'edge',
        pattern: [
          'src/apps/ai_engine/**/*',
          'src/apps/amazon/**/*',
        ],
      },
    ],
  },

  rules: {
    'react/prop-types': 'off',

    // ── Rule 63: The Syntax Ban ──────────────────────────────────────────
    'no-restricted-syntax': [
      'error',
      {
        selector: "CallExpression[callee.property.name='toLocaleDateString']",
        message:
          "Rule 63 Violation: Never use toLocaleDateString. You MUST import <FormattedDate /> from the shell or use the useFormatters() hook",
      },
    ],

    // ── Rule 9 & Rule 45: The Traffic Laws ───────────────────────────────
    'boundaries/element-types': [
      'error',
      {
        default: 'disallow',
        rules: [
          // 1. L1 kernel engine — may use itself and L1 domain services (Rule 45), but NEVER UI pages.
          {
            from: 'kernel-engine',
            allow: ['kernel-engine', 'kernel-domain-service'],
          },

          // 2. L1 domain services — may use kernel engine and peer L1 domain services.
          {
            from: 'kernel-domain-service',
            allow: ['kernel-engine', 'kernel-domain-service'],
          },

          // 3. L1* proxy UI — may use kernel engine, L1 domain services, and peer proxy-UI modules.
          {
            from: 'kernel-proxy-ui',
            allow: ['kernel-engine', 'kernel-domain-service', 'kernel-proxy-ui'],
          },

          // 4. L2 platform — may use kernel zones, domain services, and peer platform modules.
          {
            from: 'platform',
            allow: ['kernel-engine', 'kernel-domain-service', 'kernel-proxy-ui', 'platform'],
          },

          // 5. L3 business apps — may use all lower layers and domain services.
          {
            from: 'business-app',
            allow: [
              'kernel-engine',
              'kernel-domain-service',
              'kernel-proxy-ui',
              'platform',
              'business-app',
            ],
          },

          // 6. L4 edge connectors — unrestricted.
          {
            from: 'edge',
            allow: ['kernel-engine', 'kernel-domain-service', 'kernel-proxy-ui', 'platform', 'business-app', 'edge'],
          },
        ],
      },
    ],
  },
};
