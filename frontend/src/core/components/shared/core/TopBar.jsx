import React, { useState, useRef, useEffect } from 'react';
import { Search, Menu, LogOut, User, Settings, LayoutDashboard, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import NotificationBell from './NotificationBell';
import client from '../../../api/client';

/**
 * ModuleTopBar — Used by ModuleLayout (per-module views)
 * Connected to real user data, notifications, and global search.
 */
const TopBar = ({ toggleSidebar, title }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [dropOpen, setDropOpen] = useState(false);
    const searchRef = useRef(null);
    const dropRef = useRef(null);

    // ── Search ────────────────────────────────────────────────────────────────
    useEffect(() => {
        const handler = setTimeout(async () => {
            if (searchQuery.trim().length < 2) {
                setSearchResults([]);
                setShowResults(false);
                return;
            }
            try {
                const res = await client.get(`/board/search/?q=${encodeURIComponent(searchQuery)}`);
                if (res.data?.status === 'success' && res.data?.data) {
                    setSearchResults(res.data.data.slice(0, 8));
                    setShowResults(true);
                }
            } catch {
                setShowResults(false);
            }
        }, 300);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    // Close search on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowResults(false);
            }
            if (dropRef.current && !dropRef.current.contains(e.target)) {
                setDropOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const userInitial = (user?.first_name?.[0] || user?.email?.[0] || 'U').toUpperCase();
    const userRole = user?.is_superuser ? 'Super Admin' : user?.is_staff ? 'Admin' : 'Member';

    return (
        <header className="h-14 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30
            flex items-center justify-between px-4 gap-4 flex-shrink-0">

            {/* Left: Hamburger + Module Title */}
            <div className="flex items-center gap-3 min-w-0">
                <button
                    onClick={toggleSidebar}
                    className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800 flex-shrink-0"
                    aria-label="Toggle sidebar"
                >
                    <Menu size={18} />
                </button>

                <div className="hidden sm:flex items-center gap-2 min-w-0">
                    <span className="text-white font-bold text-sm font-[Oswald] tracking-[2px] uppercase truncate">
                        {title || 'BitGuard'}
                    </span>
                    <span className="text-slate-700 text-xs hidden md:block">|</span>
                    <span className="text-slate-500 text-xs hidden md:block">Enterprise Platform</span>
                </div>
            </div>

            {/* Center: Global Search */}
            <div className="hidden lg:flex flex-1 max-w-sm" ref={searchRef}>
                <div className="relative w-full">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search platform..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                        className="w-full h-8 pl-9 pr-10 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200
                            placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-600 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 pointer-events-none">
                        /
                    </span>

                    {/* Search Dropdown */}
                    {showResults && searchResults.length > 0 && (
                        <div className="absolute top-full mt-2 left-0 right-0 bg-slate-900 border border-slate-700/60 rounded-xl shadow-2xl z-[200] overflow-hidden">
                            {searchResults.map((item, i) => (
                                <Link
                                    key={i}
                                    to={item.url || '#'}
                                    onClick={() => { setShowResults(false); setSearchQuery(''); }}
                                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-500/10 transition-colors border-b border-slate-800/60 last:border-0"
                                >
                                    <Search size={13} className="text-slate-500 flex-shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-sm text-white font-medium truncate">{item.title}</p>
                                        <p className="text-xs text-slate-500 truncate">{item.type}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Notifications + User */}
            <div className="flex items-center gap-2 flex-shrink-0">
                <NotificationBell />

                <div className="h-5 w-px bg-slate-800/80" />

                {/* User Dropdown */}
                <div className="relative" ref={dropRef}>
                    <button
                        onClick={() => setDropOpen(o => !o)}
                        className="flex items-center gap-2 group"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500 blur-sm opacity-0 group-hover:opacity-30 transition-opacity rounded-full" />
                            {user?.avatar ? (
                                <img src={user.avatar} alt="User" className="w-8 h-8 rounded-full object-cover border border-slate-700 relative z-10" />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-blue-600/90 border border-blue-500/30 flex items-center justify-center text-xs font-bold text-white relative z-10">
                                    {userInitial}
                                </div>
                            )}
                            <div className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 border-2 border-slate-950 rounded-full z-20" />
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-xs font-semibold text-white leading-tight">{user?.first_name || 'User'}</p>
                            <p className="text-[10px] text-slate-500 leading-tight">{userRole}</p>
                        </div>
                    </button>

                    {dropOpen && (
                        <div className="absolute right-0 top-full mt-2 w-56 bg-slate-950/95 backdrop-blur-xl border border-slate-700/60 rounded-xl shadow-2xl z-[300] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                            {/* User info header */}
                            <div className="px-4 py-3 border-b border-slate-800/60 bg-gradient-to-r from-blue-900/20 to-transparent">
                                <p className="text-sm font-bold text-white">{user?.first_name || 'User'}</p>
                                <p className="text-xs text-slate-400 truncate font-mono">{user?.email}</p>
                                <span className="inline-flex mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/20">
                                    {userRole}
                                </span>
                            </div>

                            <div className="p-1.5 space-y-0.5">
                                <Link to="/admin" onClick={() => setDropOpen(false)}
                                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-blue-500/10 rounded-lg transition-colors">
                                    <LayoutDashboard size={14} className="text-slate-500" />
                                    <span>Command Center</span>
                                </Link>
                                <Link to="/account/personal-info" onClick={() => setDropOpen(false)}
                                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-blue-500/10 rounded-lg transition-colors">
                                    <User size={14} className="text-slate-500" />
                                    <span>My Profile</span>
                                </Link>
                                <Link to="/account/security" onClick={() => setDropOpen(false)}
                                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-blue-500/10 rounded-lg transition-colors">
                                    <Settings size={14} className="text-slate-500" />
                                    <span>Security Settings</span>
                                </Link>

                                <div className="h-px bg-slate-800/60 my-1" />

                                <button onClick={() => { setDropOpen(false); logout(); }}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-left">
                                    <LogOut size={14} />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default TopBar;
