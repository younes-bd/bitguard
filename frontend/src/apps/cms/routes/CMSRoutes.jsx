import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ModuleLayout from '../../../core/layouts/ModuleLayout';
import { productMenu } from '../../../core/api/menu';

// Lazy loading the pages
const CMSDashboard = React.lazy(() => import('../pages/CMSDashboard'));
const PageEditor = React.lazy(() => import('../pages/PageEditor'));
const InquiriesPage = React.lazy(() => import('../pages/InquiriesPage'));
const CmsSettings = React.lazy(() => import('../pages/CmsSettings'));
const LandingPagesManager = React.lazy(() => import('../pages/LandingPagesManager'));

const LoadingScreen = () => (
    <div className="flex h-full items-center justify-center p-8 bg-slate-950">
        <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-slate-400 font-medium">Loading CMS Module...</p>
        </div>
    </div>
);

const CMSRoutes = () => {
    return (
        <Suspense fallback={<LoadingScreen />}>
            <Routes>
                {/* CMS Dashboard */}
                <Route
                    path="/"
                    element={
                        <ModuleLayout
                            title="Website Builder"
                            subtitle="Manage public websites and knowledge bases"
                            icon="Globe"
                            items={productMenu.cms[0].items}
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
                            backTo="/admin/cms"
                            items={productMenu.cms[0].items}
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
                            backTo="/admin/cms"
                            items={productMenu.cms[0].items}
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
                            items={productMenu.cms[0].items}
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
                            items={productMenu.cms[0].items}
                        >
                            <LandingPagesManager />
                        </ModuleLayout>
                    }
                />

                {/* Settings */}
                <Route
                    path="/settings"
                    element={
                        <ModuleLayout
                            title="Website Builder"
                            subtitle="Configure CMS preferences"
                            icon="Globe"
                            items={productMenu.cms[0].items}
                        >
                            <CmsSettings />
                        </ModuleLayout>
                    }
                />
            </Routes>
        </Suspense>
    );
};

export default CMSRoutes;

