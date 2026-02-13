import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Menu, Search, Bell, User as UserIcon, LogOut, Settings } from 'lucide-react';
import { useSidebarState } from '../hooks/useSidebarState';

/**
 * Generic Layout for all Admin Modules (CRM, ERP, Store Admin, etc.)
 * @param {string} title - The module title (e.g., "CRM Suite", "Enterprise Resource Planning")
 * @param {Array} items - The sidebar menu items specific to this module
 * @param {string} accentColor - Tailwind color class for accents (e.g., "text-blue-500", "bg-emerald-500")
 * @param {string} backLink - Path to go back (usually "/admin" for the main Console)
 */
const ModuleLayout = ({ title, items, accentColor = "blue", backLink = "/admin" }) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useSidebarState();

    return (
        <div className="min-h-screen bg-slate-950 flex text-slate-100 font-sans selection:bg-blue-500/30">
            {/* Module-Specific Sidebar */}
            <Sidebar
                title={title}
                items={items}
                backLink={backLink}
                collapsed={sidebarCollapsed}
                setCollapsed={setSidebarCollapsed}
            />

            <main className={`flex-1 relative bg-gradient-to-br from-slate-950 to-slate-900 transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
                {/* Standard Module Header */}
                <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="text-slate-400 hover:text-white transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        <h1 className="font-['Oswald'] text-lg font-medium tracking-wide text-slate-200 hidden md:block">
                            {title}
                        </h1>
                    </div>

                    <div className="flex items-center space-x-4 ml-auto">
                        {/* Common Header Actions */}
                        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                            <Bell size={20} />
                        </button>
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                            <UserIcon size={16} className={`text-${accentColor}-400`} />
                        </div>
                    </div>
                </header>

                <div className="p-6 max-w-[1920px] mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default ModuleLayout;
