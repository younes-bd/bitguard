import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ModuleLayout from '../layouts/ModuleLayout';
import BackendLayout from '../layouts/BackendLayout';
import StandaloneLayout from '../layouts/StandaloneLayout';

import CommandCenter from '../pages/CommandCenterPage';
import InboxCenter from '../../apps/inbox/pages/InboxCenterPage';
import UserProfile from '../../apps/users/pages/profile/UserProfilePage';
import { websiteAdminRoutes as WebsiteAdminRoutes } from '../../apps/website/routes/websiteAdminRoutes';

// Dynamic import of all admin routes and menus
const routeModules = import.meta.glob('../../apps/*/routes/*AdminRoutes.jsx', { eager: true });
const menuConfigs = import.meta.glob('../../apps/*/config/menu.js', { eager: true });

const COLORS = ['violet', 'slate', 'indigo', 'blue', 'emerald', 'red', 'orange', 'amber', 'pink', 'yellow', 'teal', 'cyan', 'sky', 'purple'];

const getColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return COLORS[Math.abs(hash) % COLORS.length];
};

const formatTitle = (str) => {
    if (str === 'plm') return 'PLM';
    if (str === 'hr') return 'Human Resources';
    if (str === 'crm') return 'CRM';
    return str.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

// Apps fully excluded from the dynamic loader (handled manually above)
const EXCLUDED_APPS = ['website', 'inbox', 'auth'];

import { ManifestProvider, useManifest } from '../hooks/useManifest';

const BackendRoutesInner = () => {
    const { manifestData } = useManifest();

    return (
        <Routes>
            <Route element={<BackendLayout />}>
                <Route index element={<CommandCenter />} />
                <Route path="inbox" element={<InboxCenter />} />
            </Route>

            <Route path="profile" element={<StandaloneLayout title="My Profile" />}>
                <Route index element={<UserProfile />} />
            </Route>

            <Route path="website/*" element={<WebsiteAdminRoutes />} />

            {/* Dynamic module routes — titles resolved from DB via useManifest() */}
            {Object.entries(routeModules).map(([path, module]) => {
                const parts = path.split('/');
                const appName = parts[3];

                if (EXCLUDED_APPS.includes(appName)) return null;

                const exportName = Object.keys(module)[0];
                const RoutesComponent = module[exportName];
                if (!RoutesComponent) return null;

                // Odoo 17 standard: resolve display title from the DB (InstalledModule.display_name),
                // falling back to InstalledModule.name, then to a formatted folder name.
                const dbModule = manifestData.find(m => m.technical_name === appName);
                const moduleTitle = dbModule?.display_name || dbModule?.name || formatTitle(appName);

                const menuPath = `../../apps/${appName}/config/menu.js`;
                const moduleMenuObj = menuConfigs[menuPath];
                let moduleMenu = [];

                if (appName === 'system') {
                    // API-Driven Injection: Pass the live manifest to the system settings builder
                    if (moduleMenuObj && moduleMenuObj.getSettingsMenu) {
                        moduleMenu = moduleMenuObj.getSettingsMenu(manifestData);
                    }
                } else if (moduleMenuObj) {
                    const menuKey = Object.keys(moduleMenuObj).find(k => k.endsWith('Menu') && Array.isArray(moduleMenuObj[k]));
                    if (menuKey) moduleMenu = moduleMenuObj[menuKey];
                }

                // Map the internal 'system' folder to the 'settings' URL path for UX
                const routePath = appName === 'system' ? 'settings' : appName;

                return (
                    <Route
                        key={appName}
                        path={`${routePath}/*`}
                        element={<ModuleLayout title={moduleTitle} sections={moduleMenu} accentColor={getColor(appName)} />}
                    >
                        {RoutesComponent}
                        <Route path="*" element={<Navigate to="" replace />} />
                    </Route>
                );
            })}

            <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
    );
};

export const BackendRoutes = () => {
    return (
        <ManifestProvider>
            <BackendRoutesInner />
        </ManifestProvider>
    );
};
