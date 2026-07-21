import React, { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/shared/core/Sidebar';
import GlobalSearch from '../components/GlobalSearch';
import {
    Menu, Bell, Search, Command,
    LayoutDashboard, ShoppingBag, FolderKanban, FileText, LifeBuoy,
    Receipt, CheckSquare, CreditCard, ShoppingCart
} from 'lucide-react';

import { useAuth } from '../hooks/useAuth';
import { useSidebarState } from '../hooks/useSidebarState';
import UserAvatarDropdown from '../components/shared/core/UserAvatarDropdown';

const PortalLayout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useSidebarState();
    const { user, logout } = useAuth(); // Use centralized auth
    const [searchOpen, setSearchOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setSearchOpen(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const portalSections = [
        {
            title: 'My Account',
            items: [
                { label: 'Dashboard', icon: LayoutDashboard, path: '/portal' },
                { label: 'My Orders', icon: ShoppingBag, path: '/portal/orders' },
                { label: 'My Quotes', icon: FileText, path: '/portal/quotes' },
                { label: 'My Invoices', icon: Receipt, path: '/portal/invoices' },
                { label: 'My Projects', icon: FolderKanban, path: '/portal/projects' },
                { label: 'My Tasks', icon: CheckSquare, path: '/portal/tasks' },
                { label: 'My Tickets', icon: LifeBuoy, path: '/portal/tickets' },
                { label: 'My Subscriptions', icon: CreditCard, path: '/portal/subscriptions' },
                { label: 'My Purchases', icon: ShoppingCart, path: '/portal/purchase' },
            ]
        }
    ];



    return (
        <div className="min-h-screen bg-slate-950 flex text-slate-100 font-sans selection:bg-blue-500/30">
            {/* Sidebar: Shows BITGUARD logo (Platform Style) */}
            <Sidebar
                title="Client Portal"
                sections={portalSections}
                backLink="/"
                collapsed={sidebarCollapsed}
                setCollapsed={setSidebarCollapsed}
            />

            <main className={`flex-1 relative bg-gradient-to-br from-slate-950 to-slate-900 transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>

                {/* Hybrid Header: Inlined structure but with Admin Elements */}
                <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6">

                    {/* Left: Mobile Toggle + Title */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="text-slate-400 hover:text-white transition-colors"
                        >
                            <Menu size={24} />
                        </button>

                        <span className="font-['Oswald'] text-2xl font-bold tracking-[1px] text-white hidden md:block" style={{ marginTop: '-2px' }}>
                            Client Portal
                        </span>
                    </div>

                    {/* Center: Search Bar Trigger */}
                    <div className="hidden md:flex items-center flex-1 max-w-xl mx-8">
                        <button 
                            onClick={() => setSearchOpen(true)}
                            className="w-full flex items-center gap-3 px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-500 hover:text-slate-300 hover:border-slate-700 transition-all group"
                        >
                            <Search size={16} className="group-hover:text-blue-400 transition-colors" />
                            <span className="text-sm font-medium">Quick search...</span>
                            <div className="ml-auto flex items-center gap-1.5 opacity-50">
                                <Command size={12} />
                                <span className="text-[10px] font-bold">K</span>
                            </div>
                        </button>
                    </div>

                    {/* Right: Actions + User Profile */}
                    <div className="flex items-center space-x-4 ml-auto">
                        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        </button>

                        <UserAvatarDropdown user={user} onLogout={handleLogout} variant="portal" />
                    </div>
                </header>

                <div className="p-6 max-w-[1920px] mx-auto">
                    <Outlet />
                </div>
            </main>

            <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        </div>
    );
};

export default PortalLayout;
