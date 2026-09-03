import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ModuleLayout from '@/core/layouts/ModuleLayout';
import { websiteMenu } from '../config/menu';

// Lazy loading the pages
const CMSDashboard = React.lazy(() => import('../pages/admin/CMSDashboard'));
const WebsiteDashboard = React.lazy(() => import('../pages/admin/WebsiteDashboard'));
const PageEditor = React.lazy(() => import('../pages/features/PageEditor'));
const InquiriesPage = React.lazy(() => import('../pages/lists/InquiriesPage'));
const CmsSettings = React.lazy(() => import('../pages/settings/CmsSettings'));
const LandingPagesManager = React.lazy(() => import('../pages/lists/LandingPagesManager'));
const MediaLibrary = React.lazy(() => import('../pages/features/MediaLibrary'));
const WebsiteAnalytics = React.lazy(() => import('../pages/admin/WebsiteAnalytics'));

// New Odoo-style components
const WebsiteMenus = React.lazy(() => import('../pages/admin/WebsiteMenus'));
const WebsiteRedirects = React.lazy(() => import('../pages/admin/WebsiteRedirects'));
const Websites = React.lazy(() => import('../pages/admin/Websites'));
const LiveChatChannels = React.lazy(() => import('../../livechat/pages/features/LiveChatChannels'));
const LiveChatSettings = React.lazy(() => import('../../livechat/pages/features/LiveChatSettings'));



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
                            <WebsiteDashboard />
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
                            <WebsiteDashboard />
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
                            <CMSDashboard />
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
                            <PageEditor />
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
                            <PageEditor />
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
                            <LandingPagesManager />
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
                            <MediaLibrary />
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
                            <WebsiteMenus />
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
                            <WebsiteRedirects />
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
                            <Websites />
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
                            <WebsiteAnalytics />
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
                            <CmsSettings />
                        </ModuleLayout>
                    }
                />
            
                {/* Live Chat */}
                <Route
                    path="/livechat/channels"
                    element={
                        <ModuleLayout
                            title="Live Chat Channels"
                            subtitle="Configure live chat widgets"
                            icon="MessageCircle"
                            sections={websiteMenu}
                        >
                            <LiveChatChannels />
                        </ModuleLayout>
                    }
                />
                <Route
                    path="/livechat/settings"
                    element={
                        <ModuleLayout
                            title="Live Chat Settings"
                            subtitle="Configure live chat preferences"
                            icon="Settings"
                            sections={websiteMenu}
                        >
                            <LiveChatSettings />
                        </ModuleLayout>
                    }
                />
            </Routes>
        </Suspense>
    );
};



