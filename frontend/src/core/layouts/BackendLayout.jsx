import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/shared/core/Sidebar';
import {
    Menu, Bell, Search
} from 'lucide-react';

import client from '../api/client';
import { useSidebarState } from '../hooks/useSidebarState';
import { adminSections, adminMenu } from '../api/menu';
import { useTenant } from '../context/TenantContext';
import { useAuth } from '../hooks/useAuth';
import NotificationBell from '../components/shared/core/NotificationBell';
import QuickActions from '../components/shared/core/QuickActions';
import TenantSwitcher from '../components/shared/core/TenantSwitcher';
import CommandPalette from '../components/shared/core/CommandPalette';
import UserAvatarDropdown from '../components/shared/core/UserAvatarDropdown';

const BackendLayout = () => {
    const location = useLocation();
    const { hasProduct } = useTenant();
    const { user, logout } = useAuth(); // Use centralized auth
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useSidebarState();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const searchRef = useRef(null);

    const handleLogout = () => {
        logout(); // Use context logout
        navigate('/login');
    };

    // Search handler — filters all admin menu items by label
    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    // Debounced API Search
    useEffect(() => {
        const fetchResults = async () => {
            if (searchQuery.trim().length < 2) {
                setSearchResults([]);
                setShowSearchResults(false);
                return;
            }
            const q = searchQuery.toLowerCase();
            const results = [];
            
            // 1. Local Menu Search
            adminMenu.forEach(item => {
                if (item.label?.toLowerCase().includes(q)) {
                    results.push(item);
                }
                if (item.children) {
                    item.children.forEach(child => {
                        if (child.label?.toLowerCase().includes(q)) {
                            results.push({ ...child, parentLabel: item.label });
                        }
                    });
                }
            });
            
            // 2. Global Backend Search
            try {
                const response = await client.get(`/board/search/?q=${encodeURIComponent(searchQuery)}`);
                if (response.data?.status === 'success' && response.data?.data) {
                    const apiResults = response.data.data.map(item => ({
                        label: item.title,
                        parentLabel: `Global \u2022 ${item.type.toUpperCase()}`,
                        path: item.url
                    }));
                    results.push(...apiResults);
                }
            } catch (error) {
                console.error("Global search error", error);
            }
            
            setSearchResults(results.slice(0, 10));
            setShowSearchResults(true);
        };

        const timerId = setTimeout(() => {
            fetchResults();
        }, 300);

        return () => clearTimeout(timerId);
    }, [searchQuery]);

    // Close search results on click outside
    useEffect(() => {
        function handleClickOutsideSearch(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearchResults(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutsideSearch);
        return () => document.removeEventListener('mousedown', handleClickOutsideSearch);
    }, []);

    // Global Search Keyboard Shortcut (Ctrl+K or Cmd+K)
    const searchInputRef = useRef(null);
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Filter sections based on bundle access and RBAC permissions
    const filteredSections = adminSections.map(section => ({
        ...section,
        items: section.items.filter(item => {
            if (item.requiredProduct && !hasProduct(item.requiredProduct)) return false;
            if (user?.is_superuser) return true;
            if (item.permissions?.length > 0) {
                const userPerms = user?.permissions || [];
                return item.permissions.some(p => userPerms.includes(p));
            }
            return true;
        })
    })).filter(section => section.items.length > 0);

    return (
        <div className="min-h-screen bg-slate-950 flex text-slate-100 font-sans selection:bg-blue-500/30">
            {/* Main Sidebar with grouped sections */}
            <Sidebar
                title="BITGUARD"
                sections={filteredSections}
                moduleKey="global"
                backLink={null}
                collapsed={sidebarCollapsed}
                setCollapsed={setSidebarCollapsed}
                mobileOpen={mobileOpen}
                onMobileClose={() => setMobileOpen(false)}
            />

            <main className={`flex-1 relative bg-gradient-to-br from-slate-950 to-slate-900 transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'md:ml-[72px]' : 'md:ml-64'}`}>

                {/* Hybrid Header: Inlined structure but with Admin Elements */}
                <header className="h-14 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6">

                    {/* Left: Mobile Toggle + Admin Panel Title */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {
                                // Desktop: toggle collapse; Mobile: toggle drawer
                                if (window.innerWidth >= 768) {
                                    setSidebarCollapsed(!sidebarCollapsed);
                                } else {
                                    setMobileOpen(!mobileOpen);
                                }
                            }}
                            className="text-slate-400 hover:text-white transition-colors"
                        >
                            <Menu size={24} />
                        </button>

                        <span className="font-sans text-xl font-bold tracking-tight text-white hidden md:block border-r border-slate-800 pr-4 mr-2">
                            Enterprise Console
                        </span>
                        
                        <div className="hidden md:block">
                            <TenantSwitcher />
                        </div>
                    </div>

                    {/* Center: Search Bar (Functional) */}
                    <div className="hidden md:flex items-center flex-1 max-w-xl mx-8" ref={searchRef}>
                        <div className="relative w-full group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search modules, pages, settings..."
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
                                className="block w-full pl-10 pr-16 py-2 border border-slate-700 rounded-full leading-5 bg-slate-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-lg shadow-black/20"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <span className="hidden lg:inline-flex items-center text-[10px] font-bold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">Ctrl+K</span>
                            </div>
                            {showSearchResults && searchResults.length > 0 && (
                                <div className="absolute top-full mt-2 w-full bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                                    {searchResults.map((item, i) => (
                                        <Link
                                            key={i}
                                            to={item.path || '#'}
                                            onClick={() => { setShowSearchResults(false); setSearchQuery(''); }}
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-blue-500/10 transition-colors border-b border-slate-800 last:border-0"
                                        >
                                            <Search size={14} className="text-slate-500" />
                                            <div>
                                                <p className="text-sm text-white font-medium">{item.label}</p>
                                                {item.parentLabel && <p className="text-xs text-slate-500">{item.parentLabel}</p>}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Actions + User Profile */}
                    <div className="flex items-center space-x-4 ml-auto">

                        {/* System Health Badge */}
                        <div className="hidden xl:flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full mr-1 cursor-help" title="All Systems Operational">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Stable</span>
                        </div>

                        <div className="h-6 w-px bg-slate-800 mx-2 hidden md:block"></div>

                        <QuickActions />
                        
                        <div className="mr-1"></div>

                        <NotificationBell />

                        {/* User Dropdown (Platform Style - Blue) */}
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

export default BackendLayout;
