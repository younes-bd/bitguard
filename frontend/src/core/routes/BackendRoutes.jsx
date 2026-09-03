import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ModuleLayout from '../layouts/ModuleLayout';
import BackendLayout from '../layouts/BackendLayout';
import StandaloneLayout from '../layouts/StandaloneLayout';

import CommandCenter from '../pages/CommandCenter';
import NotificationCenter from '../../apps/notifications/pages/NotificationCenter';
import UserProfile from '../../apps/users/pages/profile/UserProfile';
import { websiteAdminRoutes } from '../../apps/website/routes/websiteAdminRoutes';
import { boardAdminRoutes } from '../../apps/board/routes/boardAdminRoutes';

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
    if (str === 'mrp_plm') return 'PLM';
    if (str === 'hr') return 'Human Resources';
    if (str === 'crm') return 'CRM';
    return str.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

// Apps fully excluded from the dynamic loader (handled manually above)
const EXCLUDED_APPS = ['website', 'notifications', 'board', 'auth'];

import { ManifestProvider } from '../hooks/useManifest';

export const BackendRoutes = () => {
    return (
        <ManifestProvider>
        <Routes>
            <Route element={<BackendLayout />}>
                {/* Command Center index */}
                <Route index element={<CommandCenter />} />
                {/* All board sub-pages also use the global BackendLayout sidebar */}
                <Route path="board/*">
                    {boardAdminRoutes}
                </Route>
                <Route path="notifications" element={<NotificationCenter />} />
            </Route>

            {/* Standalone Profile Route */}
            <Route path="profile" element={<StandaloneLayout title="My Profile" />}>
                <Route index element={<UserProfile />} />
            </Route>

            {/* Custom Website Router */}
            <Route path="website/*" element={<websiteAdminRoutes />} />

            {/* Dynamic Module Routes */}
            {Object.entries(routeModules).map(([path, module]) => {
                const parts = path.split('/');
                const appName = parts[3]; // e.g. 'accounting'
                
                // Fully exclude apps that are routed manually above
                if (EXCLUDED_APPS.includes(appName)) return null;

                
                const exportName = Object.keys(module)[0];
                const RoutesComponent = module[exportName];
                
                if (!RoutesComponent) return null;

                const menuPath = `../../apps/${appName}/config/menu.js`;
                const moduleMenuObj = menuConfigs[menuPath];
                let moduleMenu = [];
                let moduleTitle = formatTitle(appName);

                if (moduleMenuObj) {
                    const menuKey = Object.keys(moduleMenuObj).find(k => k.endsWith('Menu'));
                    if (menuKey) moduleMenu = moduleMenuObj[menuKey];
                    
                    const manifestKey = Object.keys(moduleMenuObj).find(k => k.endsWith('Manifest'));
                    if (manifestKey && moduleMenuObj[manifestKey]?.displayName) {
                        moduleTitle = moduleMenuObj[manifestKey].displayName;
                    }
                }
                
                // Map the internal 'system' technical folder back to the 'settings' URL for UX
                const routePath = appName === 'system' ? 'settings' : appName;

                // In React Router v6, if the component already includes nested Routes, we must append /*
                // But previously they used <Route path="appName">{routes}</Route> which implies RoutesComponent is children
                // Or if RoutesComponent is a fragment of routes, it goes inside.
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
        </ManifestProvider>
    );
};
