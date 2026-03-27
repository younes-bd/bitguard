import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import Sidebar from '../components/shared/core/Sidebar';
import {
    Menu, Bell, LogOut, Settings, User as UserIcon, ChevronDown, Search,
    LayoutDashboard, Users, ShieldCheck, Building2,
    AlertCircle, FileText, ShoppingBag, Server,
    Layers, Database, Key, PieChart
} from 'lucide-react';

import { useAuth } from '../hooks/useAuth';
import { useSidebarState } from '../hooks/useSidebarState';
import { productMenu } from '../api/menu';

const ProductLayout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useSidebarState();
    const { user, logout } = useAuth(); // Use centralized auth
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const location = useLocation();
    const path = location.pathname;

    let productSections = [];
    let title = 'Product Panel';
    let currentProductId = null;

    if (path.startsWith('/crm')) {
        productSections = productMenu.crm || [];
        title = 'CRM';
        currentProductId = 'crm';
    } else if (path.startsWith('/erp')) {
        productSections = productMenu.erp || [];
        title = 'ERP';
        currentProductId = 'erp';
    } else if (path.startsWith('/store')) {
        productSections = productMenu.store || [];
        title = 'Store';
        currentProductId = 'store';
    } else if (path.startsWith('/soc')) {
        // /soc portal route uses the same security product menu
        productSections = productMenu.security || [];
        title = 'Security';
        currentProductId = 'security';
    }

    // Check trial status
    const subscription = user?.subscriptions?.find(s => s.productId === currentProductId);
    const isTrial = subscription?.status === 'trial';
    const trialDaysLeft = subscription?.trialEnds
        ? Math.ceil((new Date(subscription.trialEnds) - new Date()) / (1000 * 60 * 60 * 24))
        : 0;



    return (
        <div className="min-h-screen bg-slate-950 flex text-slate-100 font-sans selection:bg-blue-500/30">
            {/* Sidebar: Shows BITGUARD logo (Platform Style) */}
            <Sidebar
                title={title}
                sections={productSections}
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
                            {title} Panel
                        </span>

                        {isTrial && (
                            <div className="ml-4 px-3 py-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/50 rounded-full flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                </span>
                                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                                    Trial Mode: {trialDaysLeft} Days Left
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Center: Search Bar */}
                    <div className="hidden md:flex items-center flex-1 max-w-xl mx-8">
                        {/* Search removed for product layout or kept minimal */}
                    </div>

                    {/* Right: Actions + User Profile */}
                    <div className="flex items-center space-x-4 ml-auto">
                        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        </button>

                        <div className="group relative">
                            <button className="flex items-center bg-transparent border-none p-0 cursor-pointer group hover:opacity-100 transition-opacity">
                                <div className="w-9 h-9 relative">
                                    <div className="absolute inset-0 bg-blue-500 blur-sm opacity-20 group-hover:opacity-50 transition-opacity rounded-full"></div>
                                    {user.avatar ? (
                                        <img src={user.avatar} alt="User" className="w-full h-full object-cover rounded-full border border-slate-900 relative z-10" />
                                    ) : (
                                        <div className="w-full h-full rounded-full border border-slate-900 relative z-10 bg-slate-800 flex items-center justify-center text-xs font-bold text-white">
                                            {(user.first_name?.[0] || 'A').toUpperCase()}
                                        </div>
                                    )}
                                </div>
                            </button>
                            {/* User Dropdown */}
                            <div className="hidden group-hover:block absolute right-0 top-full pt-4 w-[220px] z-[1000]">
                                <div className="bg-slate-950 border border-blue-500/30 border-t-[3px] border-t-blue-500 rounded-b-lg shadow-xl overflow-hidden p-2 space-y-1">
                                    <Link
                                        to="/admin"
                                        className="flex items-center gap-3 w-full text-slate-300 p-2.5 rounded-lg text-sm hover:bg-blue-500/10 hover:text-blue-400 transition-colors border border-transparent hover:border-blue-500/20"
                                    >
                                        <LayoutDashboard size={14} className="text-blue-500/60" />
                                        <span className="font-medium">Admin Dashboard</span>
                                    </Link>
                                    <Link
                                        to="/users/profile"
                                        className="flex items-center gap-3 w-full text-slate-300 p-2.5 rounded-lg text-sm hover:bg-blue-500/10 hover:text-blue-400 transition-colors border border-transparent hover:border-blue-500/20"
                                    >
                                        <UserIcon size={14} className="text-blue-500/60" />
                                        <span className="font-medium">Profile</span>
                                    </Link>
                                    <Link
                                        to="/users/settings"
                                        className="flex items-center gap-3 w-full text-slate-300 p-2.5 rounded-lg text-sm hover:bg-blue-500/10 hover:text-blue-400 transition-colors border border-transparent hover:border-blue-500/20"
                                    >
                                        <Settings size={14} className="text-blue-500/60" />
                                        <span className="font-medium">Settings</span>
                                    </Link>
                                    <div className="h-px bg-slate-800 my-1" />
                                    <button onClick={handleLogout} className="flex items-center gap-3 w-full text-red-400 p-2.5 rounded-lg text-sm hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20 bg-transparent cursor-pointer text-left">
                                        <LogOut size={14} className="text-red-500/60" />
                                        <span className="font-medium">Sign Out</span>
                                    </button>
                                </div>
                            </div>
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

export default ProductLayout;
