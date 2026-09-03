import React, { useState } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { Menu, Search, ChevronRight, Home, Command } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import NotificationBell from '../components/shared/core/NotificationBell';
import CommandPalette from '../components/shared/core/CommandPalette';
import AppSwitcher from '../components/shared/core/AppSwitcher';
import UserAvatarDropdown from '../components/shared/core/UserAvatarDropdown';

import { useTenant } from '../context/TenantContext';

// ─── Module Top Bar ───────────────────────────────────────────────────────────
const StandaloneTopBar = ({ title }) => {
    const { user, logout } = useAuth();
    const { tenant } = useTenant();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="h-14 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30
            flex items-center justify-between px-4 gap-4 flex-shrink-0">

            {/* Left: App Switcher + Module Title */}
            <div className="flex items-center gap-4 min-w-0">
                <AppSwitcher />
                
                <div className="hidden sm:flex items-center gap-2 min-w-0 ml-2">
                    {tenant?.logo ? (
                        <img 
                            src={tenant.logo} 
                            alt={tenant.name || "Company Logo"} 
                            className="h-6 w-auto object-contain mr-2 brightness-0 invert" 
                        />
                    ) : null}
                    <span className="text-white font-bold text-sm font-[Oswald] tracking-[2px] uppercase truncate">
                        {tenant?.name || title}
                    </span>
                    <span className="text-slate-700 text-xs hidden md:block">|</span>
                    <span className="text-slate-500 text-xs hidden md:block">{title}</span>
                </div>
            </div>

            {/* Right: Notification + User */}
            <div className="flex items-center gap-2 flex-shrink-0">
                <NotificationBell />

                <div className="h-5 w-px bg-slate-800" />

                <div className="flex items-center gap-2">
                    <UserAvatarDropdown user={user} onLogout={handleLogout} variant="backend" />
                </div>
            </div>
        </header>
    );
};

// ─── Standalone Layout (No Sidebar) ───────────────────────────────────────────
const StandaloneLayout = ({ title }) => {
    return (
        <div className="flex h-screen bg-slate-950 overflow-hidden">
            <CommandPalette />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 ease-in-out ml-0">
                <StandaloneTopBar title={title} />

                <main className="flex-1 overflow-y-auto bg-slate-950 custom-scrollbar">
                    <div className="p-5 md:p-8 max-w-[1800px] mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default StandaloneLayout;
