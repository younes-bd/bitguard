import React, { useMemo } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useTenant } from '@/core/context/TenantContext';

import AnalyticsDashboard from '../pages/dashboards/AnalyticsDashboardPage';
import ExecutiveSummary from '../pages/dashboards/ExecutiveSummaryPage';
import MrrDashboard from '../pages/dashboards/MrrDashboardPage';
import ExportPage from '../pages/features/ExportPage';
import { useManifest } from '@/core/hooks/useManifest';

// Dynamically discover all analytics_plugin.js files across apps
const pluginModules = import.meta.glob('../../*/config/analytics_plugin.js', { eager: true });

const getAnalyticsPlugins = (installedApps) => {
    const plugins = [];
    for (const path in pluginModules) {
        const mod = pluginModules[path].default;
        if (mod && mod.id) {
            // Check Rule 5C Authorization Boundary:
            // Only load the plugin if the module is actually installed
            if (installedApps.some(app => app.technical_name === mod.id)) {
                plugins.push(mod);
            }
        }
    }
    return plugins.sort((a, b) => a.title.localeCompare(b.title));
};

export const AnalyticsRoutes = () => {
    const { installedApps } = useManifest();
    
    // Get valid dynamic plugins
    const plugins = useMemo(() => getAnalyticsPlugins(installedApps), [installedApps]);
    
    return (
        <Routes>
            {/* Redirect root board to analytics */}
            <Route index element={<Navigate to="analytics" replace />} />
            
            {/* Core Analytics Pages */}
            <Route path="analytics" element={<AnalyticsDashboard />} />
            <Route path="executive" element={<ExecutiveSummary />} />
            <Route path="mrr" element={<MrrDashboard />} />
            <Route path="export" element={<ExportPage />} />
            
            {/* Dynamic Plugin Pages */}
            {plugins.map(plugin => {
                const Component = plugin.component;
                return (
                    <Route 
                        key={plugin.id} 
                        path={plugin.path} 
                        element={<Component />} 
                    />
                );
            })}
            
            <Route path="*" element={<Navigate to="" replace />} />
        </Routes>
    );
};

// We need to export this directly for the layout to use
export const analyticsAdminRoutes = <Route path="*" element={<AnalyticsRoutes />} />;
