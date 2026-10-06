import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useManifest } from '@/core/hooks/useManifest';

export const TenantModuleGuard = ({ moduleName }) => {
    const { manifestData, loading } = useManifest();

    if (loading) return null;

    const isInstalled = manifestData?.some(m => m.technical_name === moduleName && m.is_installed !== false);

    if (!isInstalled) {
        return <Navigate to='/portal' replace />;
    }

    return <Outlet />;
};

