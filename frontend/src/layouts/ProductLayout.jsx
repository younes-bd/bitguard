import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../shared/core/components/Sidebar';
import {
    Menu, Bell, LogOut, Settings, User as UserIcon, ChevronDown, Search,
    LayoutDashboard, Users, ShieldCheck, Building2,
    AlertCircle, FileText, ShoppingBag, Server,
    Layers, Database, Key, PieChart
} from 'lucide-react';

import { useAuth } from '../shared/core/hooks/useAuth';
import { useSidebarState } from '../shared/core/hooks/useSidebarState';
import { productMenu } from '../shared/core/config/menu';

const ProductLayout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useSidebarState();
    const { user } = useAuth(); // Use centralized auth
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // ... (rest of component) ...

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
        productSections = productMenu.soc || [];
        title = 'SOC';
        currentProductId = 'soc';
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
                            {/* Minimized User Menu */}
                            <div className="hidden group-hover:block absolute right-0 top-full pt-4 w-[200px] z-[1000]">
                                <div className="bg-slate-950 border border-slate-800 rounded shadow-xl p-2">
                                    <button onClick={handleLogout} className="text-red-400 text-sm w-full text-left p-2 hover:bg-slate-900">Sign Out</button>
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
