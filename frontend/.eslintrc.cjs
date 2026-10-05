/**
 * BitGuard ERP — ESLint Configuration
 *
 * Boundary zones are derived from .agents/rules/layer_registry.json (Rule 65).
 * If you need to reclassify a module, update layer_registry.json first, then
 * update the matching pattern in `boundaries/elements` below.
 *
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ Zone              │ Layer │ Path pattern                         │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ kernel-engine     │  L1   │ src/core/**                          │
 * │ kernel-proxy-ui   │  L1*  │ src/apps/{core,auth,tenants}/**      │
 * │ platform          │  L2   │ src/apps/{shell,system,apps,…}/**    │
 * │ business-app      │  L3   │ src/apps/{accounting,crm,…}/**       │
 * │ edge              │  L4   │ src/apps/{amazon,ai_engine}/**       │
 * └─────────────────────────────────────────────────────────────────┘
 * * Rule 9C: core/auth/tenants backend is L1 kernel; their frontend
 *   folders under apps/ are L2 control-plane proxy UI.
 *
 * Traffic Laws (Rule 9):
 *   kernel-engine    → kernel-engine only
 *   kernel-proxy-ui  → kernel-engine, kernel-proxy-ui
 *   platform         → kernel-engine, kernel-proxy-ui, platform
 *   business-app     → kernel-engine, kernel-proxy-ui, platform, business-app
 *   edge             → all zones (external connectors have no restrictions)
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
      // Ordered alphabetically; capture appName for cross-app self-import rule.
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
          // shipping has no frontend folder (registry: frontend:false)
        ],
      },
    ],
  },

  rules: {
    'react/prop-types': 'off', // TypeScript will handle this in a later phase

    // ── Rule 63: The Syntax Ban ──────────────────────────────────────────
    'no-restricted-syntax': [
      'error',
      {
        selector: "CallExpression[callee.property.name='toLocaleDateString']",
        message:
          "Rule 63 Violation: Never use toLocaleDateString. You MUST import <FormattedDate /> from the shell or use the useFormatters() hook",
      },
    ],

    // ── Rule 9: The Traffic Laws ─────────────────────────────────────────
    //
    // default: 'disallow' means every import is blocked unless a rule below
    // explicitly allows it. Add new rules at the END (more-specific rules
    // override less-specific ones in eslint-plugin-boundaries v3+).
    'boundaries/element-types': [
      'error',
      {
        default: 'disallow',
        rules: [
          // 1. L1 kernel engine — pure; imports nothing from the app layer.
          {
            from: 'kernel-engine',
            allow: ['kernel-engine'],
          },

          // 2. L1* proxy UI — may use the kernel engine and peer proxy-UI modules.
          {
            from: 'kernel-proxy-ui',
            allow: ['kernel-engine', 'kernel-proxy-ui'],
          },

          // 3. L2 platform — may use kernel zones and peer platform modules.
          //    This is the critical fix: system importing from core (kernel-engine)
          //    is now explicitly allowed and will no longer emit false positives.
          {
            from: 'platform',
            allow: ['kernel-engine', 'kernel-proxy-ui', 'platform'],
          },

          // 4. L3 business apps — may use all lower layers.
          //    Cross-app imports are allowed only within the SAME app (self-import).
          {
            from: 'business-app',
            allow: [
              'kernel-engine',
              'kernel-proxy-ui',
              'platform',
              // Self-import only — an app may import from its own sub-folders.
              // eslint-plugin-boundaries does not support dynamic capture matching
              // here, so we allow all business-app to business-app and rely on
              // code review + manifest `depends` to enforce cross-app contracts.
              'business-app',
            ],
          },

          // 5. L4 edge connectors — unrestricted (they bridge external systems).
          {
            from: 'edge',
            allow: ['kernel-engine', 'kernel-proxy-ui', 'platform', 'business-app', 'edge'],
          },
        ],
      },
    ],
  },
};
