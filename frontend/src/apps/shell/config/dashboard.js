// Tiles that are hidden from the Command Center grid.
// L2 Platform modules: application=true so tenants can install them, but
// launcher_tile=false — they are reachable only through Settings.
// Source of truth: .agents/rules/layer_registry.json (Rule 65).
// DO NOT add L4 modules here — they use application:false and are filtered out upstream.
// DO NOT add L3 modules here — they must always have a visible tile.
export const HIDDEN_DASHBOARD_TILES = [
    // L2 — Platform Services (no Command Center tile)
    'system',
    'apps',
    'users',
    'automation',
    'inbox',
    'portal',
    'product',
    'reports',
    'payments',  // L2 payment framework (provider connectors are L4)
    'shell',     // frontend-only, never has a backend tile
];
