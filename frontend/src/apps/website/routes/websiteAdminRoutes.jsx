import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ModuleLayout from '@/core/layouts/ModuleLayout';
import { websiteMenu } from '../config/menu';

// Lazy loading the pages
const CMSDashboardPage = React.lazy(() => import('../pages/admin/CMSDashboardPage'));
const WebsiteDashboardPage = React.lazy(() => import('../pages/admin/WebsiteDashboardPage'));
const PageEditorPage = React.lazy(() => import('../pages/features/PageEditorPage'));
const InquiriesPage = React.lazy(() => import('../pages/lists/InquiriesPage'));
const CmsSettingsPage = React.lazy(() => import('../pages/settings/CmsSettingsPage'));
const LandingPagesManagerPage = React.lazy(() => import('../pages/lists/LandingPagesManagerPage'));
const MediaLibraryPage = React.lazy(() => import('../pages/features/MediaLibraryPage'));
const WebsiteAnalyticsPage = React.lazy(() => import('../pages/admin/WebsiteAnalyticsPage'));

// New Odoo-style components
const WebsiteMenusPage = React.lazy(() => import('../pages/admin/WebsiteMenusPage'));
const WebsiteRedirectsPage = React.lazy(() => import('../pages/admin/WebsiteRedirectsPage'));
const WebsitesPage = React.lazy(() => import('../pages/admin/WebsitesPage'));
const LiveChatChannelsPage = React.lazy(() => import('../../messaging/pages/features/LiveChatChannelsPage'));
const LiveChatSettingsPage = React.lazy(() => import('../../messaging/pages/features/LiveChatSettingsPage'));



const LoadingScreen = () => (
    <div className="flex h-full items-center justify-center p-8 bg-slate-950">
        <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-slate-400 font-medium">Loading CMS Module...</p>
        </div>
    </div>
);

export const websiteAdminRoutes = () => {
    return (
        <Suspense fallback={<LoadingScreen />}>
            <Routes>
                {/* Main Website Dashboard */}
                <Route
                    path="/"
                    element={
                        <ModuleLayout
                            title="Website Dashboard"
                            subtitle="Overview and Analytics"
                            icon="Globe"
                            sections={websiteMenu}
                        >
                            <WebsiteDashboardPage />
                        </ModuleLayout>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <ModuleLayout
                            title="Website Dashboard"
                            subtitle="Overview and Analytics"
                            icon="Globe"
                            sections={websiteMenu}
                        >
                            <WebsiteDashboardPage />
                        </ModuleLayout>
                    }
                />
                
                {/* Pages List (CMS Dashboard) */}
                <Route
                    path="/pages"
                    element={
                        <ModuleLayout
                            title="Pages"
                            subtitle="Manage public websites and knowledge bases"
                            icon="FileText"
                            sections={websiteMenu}
                        >
                            <CMSDashboardPage />
                        </ModuleLayout>
                    }
                />
                
                {/* Page Editor (Create) */}
                <Route
                    path="/pages/new"
                    element={
                        <ModuleLayout
                            title="Create Page"
                            subtitle="Design a new web page"
                            icon="FileText"
                            backTo="/admin/website"
                            sections={websiteMenu}
                        >
                            <PageEditorPage />
                        </ModuleLayout>
                    }
                />

                {/* Page Editor (Edit) */}
                <Route
                    path="/pages/:slug/edit"
                    element={
                        <ModuleLayout
                            title="Edit Page"
                            subtitle="Modify an existing web page"
                            icon="Edit"
                            backTo="/admin/website"
                            sections={websiteMenu}
                        >
                            <PageEditorPage />
                        </ModuleLayout>
                    }
                />

                {/* Inquiries */}
                <Route
                    path="/inquiries"
                    element={
                        <ModuleLayout
                            title="Website Builder"
                            subtitle="Website form submissions and inquiries"
                            icon="Globe"
                            sections={websiteMenu}
                        >
                            <InquiriesPage />
                        </ModuleLayout>
                    }
                />

                {/* Landing Pages */}
                <Route
                    path="/landing-pages"
                    element={
                        <ModuleLayout
                            title="Landing Pages"
                            subtitle="Manage promotional landing pages"
                            icon="LayoutTemplate"
                            sections={websiteMenu}
                        >
                            <LandingPagesManagerPage />
                        </ModuleLayout>
                    }
                />

                {/* Media Library */}
                <Route
                    path="/media"
                    element={
                        <ModuleLayout
                            title="Media Library"
                            subtitle="Manage images and files"
                            icon="Image"
                            sections={websiteMenu}
                        >
                            <MediaLibraryPage />
                        </ModuleLayout>
                    }
                />

                {/* Menus */}
                <Route
                    path="/menus"
                    element={
                        <ModuleLayout
                            title="Website Menus"
                            subtitle="Manage navigation"
                            icon="Layout"
                            sections={websiteMenu}
                        >
                            <WebsiteMenusPage />
                        </ModuleLayout>
                    }
                />

                {/* Website Redirects */}
                <Route
                    path="/redirects"
                    element={
                        <ModuleLayout
                            title="Website Redirects"
                            subtitle="Manage 301 and 302 redirects"
                            icon="Settings"
                            sections={websiteMenu}
                        >
                            <WebsiteRedirectsPage />
                        </ModuleLayout>
                    }
                />

                {/* Websites */}
                <Route
                    path="/websites"
                    element={
                        <ModuleLayout
                            title="Websites"
                            subtitle="Manage multi-website configuration"
                            icon="Globe"
                            sections={websiteMenu}
                        >
                            <WebsitesPage />
                        </ModuleLayout>
                    }
                />

                {/* Analytics */}
                <Route
                    path="dashboards"
                    element={
                        <ModuleLayout
                            title="Analytics"
                            subtitle="Website analytics"
                            icon="BarChart3"
                            items={websiteMenu[0].items}
                        >
                            <WebsiteAnalyticsPage />
                        </ModuleLayout>
                    }
                />

                {/* Settings */}
                <Route
                    path="/settings"
                    element={
                        <ModuleLayout
                            title="Settings"
                            subtitle="Configure CMS preferences"
                            icon="Settings"
                            items={websiteMenu[0].items}
                        >
                            <CmsSettingsPage />
                        </ModuleLayout>
                    }
                />
            
                {/* Live Chat */}
                <Route
                    path="/messaging/channels"
                    element={
                        <ModuleLayout
                            title="Live Chat Channels"
                            subtitle="Configure live chat widgets"
                            icon="MessageCircle"
                            sections={websiteMenu}
                        >
                            <LiveChatChannelsPage />
                        </ModuleLayout>
                    }
                />
                <Route
                    path="/messaging/settings"
                    element={
                        <ModuleLayout
                            title="Live Chat Settings"
                            subtitle="Configure live chat preferences"
                            icon="Settings"
                            sections={websiteMenu}
                        >
                            <LiveChatSettingsPage />
                        </ModuleLayout>
                    }
                />
            </Routes>
        </Suspense>
    );
};



