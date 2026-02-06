import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../shared/core/components/Sidebar';
import {
    LayoutDashboard, Users, AlertCircle, Settings,
    Shield, Server, HardDrive, Lock
} from 'lucide-react';
import { useSidebarState } from '../shared/core/hooks/useSidebarState';

const AdminModuleLayout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useSidebarState();

    const systemItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/admin/system' }, // Point to CommandCenter or a specific SystemOverview
        { icon: Users, label: 'User Management', path: '/admin/users' },
        { icon: Shield, label: 'Roles & Permissions', path: '/admin/roles' },
        { icon: AlertCircle, label: 'System Logs', path: '/admin/logs' },
        { icon: Server, label: 'Platform Check', path: '/admin/health' }, // New placeholder
        { icon: Settings, label: 'Global Settings', path: '/admin/settings' },
    ];

    return (
        <div className="min-h-screen bg-slate-950 flex text-slate-100 font-sans">
            <Sidebar
                title="System Admin"
                items={systemItems}
                backLink="/admin"
                collapsed={sidebarCollapsed}
                setCollapsed={setSidebarCollapsed}
            />

            <main className={`flex-1 relative transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
                {/* Minimal Header */}
                <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6">
                    <div className="text-lg font-semibold text-white">System Administration</div>
                </header>

                <div className="p-6 max-w-[1920px] mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminModuleLayout;
