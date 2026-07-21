import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, User as UserIcon, Settings, LogOut, SlidersHorizontal, BookOpen, LifeBuoy } from 'lucide-react';

const UserAvatarDropdown = ({ user, onLogout, variant = 'backend' }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [onlineStatus, setOnlineStatus] = useState(() => {
        return localStorage.getItem('bitguard_online_status') || 'online';
    });

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleStatusChange = (status) => {
        setOnlineStatus(status);
        localStorage.setItem('bitguard_online_status', status);
    };

    const statusColors = {
        online: 'bg-green-500',
        away: 'bg-yellow-500',
        dnd: 'bg-red-500'
    };

    // Determine Role
    const isAdmin = user?.is_superuser || user?.is_staff;
    let roleName = 'User';
    if (user?.is_superuser) roleName = 'Administrator';
    else if (user?.roles && user.roles.length > 0) roleName = user.roles[0].name;
    else if (isAdmin) roleName = 'Staff';

    // Determine Avatar Initial
    const avatarInitial = (user?.first_name?.[0] || user?.email?.[0] || 'U').toUpperCase();

    // Determine Tenant/Company
    const companyName = user?.tenant?.name || user?.tenant_name || 'BitGuard Platform';

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center bg-transparent border-none p-0 cursor-pointer hover:opacity-100 transition-opacity"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
            >
                <div className="w-9 h-9 relative group">
                    <div className="absolute inset-0 bg-blue-500 blur-sm opacity-20 group-hover:opacity-50 transition-opacity rounded-full"></div>
                    {user?.avatar ? (
                        <img src={user.avatar} alt="User" className="w-full h-full object-cover rounded-full border border-slate-900 relative z-10" />
                    ) : (
                        <div className="w-full h-full rounded-full border border-slate-900 relative z-10 bg-slate-800 flex items-center justify-center text-xs font-bold text-white">
                            {avatarInitial}
                        </div>
                    )}
                    {variant === 'backend' && (
                        <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 ${statusColors[onlineStatus]} border-2 border-slate-950 rounded-full z-20 transition-colors`}></div>
                    )}
                </div>
            </button>

            {dropdownOpen && (
                <div className="absolute right-0 top-full pt-4 w-[260px] z-[1000]">
                    <div className="bg-slate-950/95 backdrop-blur-2xl border border-blue-500/30 border-t-[3px] border-t-blue-500 rounded-b-lg shadow-[0_10px_40px_-10px_rgba(59,130,246,0.3)] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        {/* User Header */}
                        <div className="p-4 border-b border-white/5 bg-gradient-to-r from-blue-900/20 to-transparent relative overflow-hidden">
                            <div className="absolute top-0 right-0 text-[100px] leading-none text-blue-500/5 -translate-y-1/2 translate-x-1/2 pointer-events-none font-bold">{avatarInitial}</div>
                            <div className="font-bold text-white mb-0.5 tracking-tight text-lg truncate">{user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : (user?.email?.split('@')[0] || 'User')}</div>
                            <div className="text-xs text-blue-400/80 truncate font-mono mb-1">{user?.email}</div>
                            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold truncate">{companyName} &bull; {roleName}</div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2 space-y-1">
                            {variant === 'backend' ? (
                                <>
                                    <Link
                                        to="/admin/settings/profile"
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-3 w-full text-slate-300 p-2.5 rounded-lg text-sm hover:bg-blue-500/10 hover:text-blue-400 transition-all duration-300 group/item border border-transparent hover:border-blue-500/20"
                                    >
                                        <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-blue-500/50 group-hover/item:text-blue-400 group-hover/item:bg-blue-500/20 transition-colors">
                                            <UserIcon size={14} />
                                        </div>
                                        <span className="font-medium">My Profile</span>
                                    </Link>
                                    <Link
                                        to="/admin/settings/general"
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-3 w-full text-slate-300 p-2.5 rounded-lg text-sm hover:bg-blue-500/10 hover:text-blue-400 transition-all duration-300 group/item border border-transparent hover:border-blue-500/20"
                                    >
                                        <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-blue-500/50 group-hover/item:text-blue-400 group-hover/item:bg-blue-500/20 transition-colors">
                                            <SlidersHorizontal size={14} />
                                        </div>
                                        <span className="font-medium">Preferences</span>
                                    </Link>
                                    <a
                                        href="/"
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-3 w-full text-slate-300 p-2.5 rounded-lg text-sm hover:bg-blue-500/10 hover:text-blue-400 transition-all duration-300 group/item border border-transparent hover:border-blue-500/20"
                                    >
                                        <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-blue-500/50 group-hover/item:text-blue-400 group-hover/item:bg-blue-500/20 transition-colors">
                                            <BookOpen size={14} />
                                        </div>
                                        <span className="font-medium">Documentation</span>
                                    </a>
                                    <a
                                        href="mailto:support@bitguard.com"
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-3 w-full text-slate-300 p-2.5 rounded-lg text-sm hover:bg-blue-500/10 hover:text-blue-400 transition-all duration-300 group/item border border-transparent hover:border-blue-500/20"
                                    >
                                        <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-blue-500/50 group-hover/item:text-blue-400 group-hover/item:bg-blue-500/20 transition-colors">
                                            <LifeBuoy size={14} />
                                        </div>
                                        <span className="font-medium">Support</span>
                                    </a>
                                </>
                            ) : (
                                <>
                                    {isAdmin && (
                                        <Link
                                            to="/admin"
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-3 w-full text-slate-300 p-2.5 rounded-lg text-sm hover:bg-blue-500/10 hover:text-blue-400 transition-all duration-300 group/item border border-transparent hover:border-blue-500/20"
                                        >
                                            <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-blue-500/50 group-hover/item:text-blue-400 group-hover/item:bg-blue-500/20 transition-colors">
                                                <LayoutDashboard size={14} />
                                            </div>
                                            <span className="font-medium">Backend Dashboard</span>
                                        </Link>
                                    )}
                                    <Link
                                        to="/portal/account"
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-3 w-full text-slate-300 p-2.5 rounded-lg text-sm hover:bg-blue-500/10 hover:text-blue-400 transition-all duration-300 group/item border border-transparent hover:border-blue-500/20"
                                    >
                                        <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-blue-500/50 group-hover/item:text-blue-400 group-hover/item:bg-blue-500/20 transition-colors">
                                            <UserIcon size={14} />
                                        </div>
                                        <span className="font-medium">My Account</span>
                                    </Link>
                                </>
                            )}

                            <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent my-1"></div>

                            {/* Online Status Selector */}
                            {variant === 'backend' && (
                                <>
                                    <div className="px-2 py-1 flex items-center justify-between">
                                        <span className="text-xs text-slate-500 font-medium">Status</span>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleStatusChange('online')} className={`w-3 h-3 rounded-full bg-green-500 cursor-pointer transition-transform ${onlineStatus === 'online' ? 'ring-2 ring-green-500/50 scale-110' : 'opacity-50 hover:opacity-100'}`} title="Online"></button>
                                            <button onClick={() => handleStatusChange('away')} className={`w-3 h-3 rounded-full bg-yellow-500 cursor-pointer transition-transform ${onlineStatus === 'away' ? 'ring-2 ring-yellow-500/50 scale-110' : 'opacity-50 hover:opacity-100'}`} title="Away"></button>
                                            <button onClick={() => handleStatusChange('dnd')} className={`w-3 h-3 rounded-full bg-red-500 cursor-pointer transition-transform ${onlineStatus === 'dnd' ? 'ring-2 ring-red-500/50 scale-110' : 'opacity-50 hover:opacity-100'}`} title="Do Not Disturb"></button>
                                        </div>
                                    </div>
                                    <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent my-1"></div>
                                </>
                            )}

                            <button onClick={() => { setDropdownOpen(false); onLogout(); }} className="w-full flex items-center gap-3 text-red-400 p-2.5 rounded-lg text-sm hover:bg-red-500/10 transition-all duration-300 group/item bg-transparent border border-transparent hover:border-red-500/20 cursor-pointer text-left">
                                <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-red-500/50 group-hover/item:text-red-400 group-hover/item:bg-red-500/20 transition-colors">
                                    <LogOut size={14} />
                                </div>
                                <span className="font-medium">Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserAvatarDropdown;
