import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/shared/core/Sidebar';
import {
    Shield, Activity, Server, Globe,
    LayoutGrid, LifeBuoy, Menu, Bell,
    LogOut, Settings, User as UserIcon, ChevronDown
} from 'lucide-react';

import client from '../api/client';
import { usersService } from '../../apps/users/api/usersService';
import { useSidebarState } from '../hooks/useSidebarState';
import { useAuth } from '../hooks/useAuth';
import UserAvatarDropdown from '../components/shared/core/UserAvatarDropdown';

const SecOpsLayout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useSidebarState();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const platformSections = [
        {
            title: 'Platform',
            items: [
                { icon: Activity, label: 'Dashboard', path: '/app/soc' },
                { icon: Globe, label: 'Connect (Apps)', path: '/app/soc/workspaces' },
                { icon: Shield, label: 'Analyze (Events)', path: '/app/soc/security' },
                { icon: Server, label: 'Remediation', path: '/app/soc/assets' },
                { icon: LifeBuoy, label: 'Support Tools', path: '/app/soc/remote' },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-slate-950 flex text-slate-100 font-sans selection:bg-emerald-500/30">
            {/* Sidebar with specialized title and back link */}
            <Sidebar title="BitGuard Ops" sections={platformSections} backLink="/dashboard" collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} moduleKey="platform" />

            <main className={`flex-1 relative bg-gradient-to-br from-slate-950 to-slate-900 transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
                {/* Technical Header */}
                <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6">
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="text-slate-400 hover:text-white mr-4 transition-colors"
                    >
                        <Menu size={24} />
                    </button>

                    {/* Status Indicator */}
                    <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/20">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-xs font-mono text-emerald-400">SYSTEM OPERATIONAL</span>
                    </div>

                    <div className="flex items-center space-x-4 ml-auto">
                        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        </button>

                        <UserAvatarDropdown user={user} onLogout={handleLogout} variant="backend" />
                    </div>
                </header>

                <div className="p-6 max-w-[1920px] mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default SecOpsLayout;
