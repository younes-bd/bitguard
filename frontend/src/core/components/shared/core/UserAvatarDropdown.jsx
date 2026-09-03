import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, User as UserIcon, Settings, LogOut, SlidersHorizontal, BookOpen, LifeBuoy, Keyboard, Globe, ExternalLink, Shield, Building, Check, Activity, Moon, Sun, Camera, ChevronDown, ChevronRight } from 'lucide-react';
import PreferencesModal from './PreferencesModal';
import api from '../../../api/client';
import toast from 'react-hot-toast';
import { useAuth } from '../../../hooks/useAuth';

const UserAvatarDropdown = ({ user, onLogout, variant = 'backend' }) => {
    const { updateUser } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [onlineStatus, setOnlineStatus] = useState(() => {
        return localStorage.getItem('bitguard_online_status') || 'online';
    });
    const [shortcutsOpen, setShortcutsOpen] = useState(false);
    const [preferencesOpen, setPreferencesOpen] = useState(false);
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
    const [companiesOpen, setCompaniesOpen] = useState(false);
    const fileInputRef = useRef(null);
    const [switchingTenant, setSwitchingTenant] = useState(false);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
                setCompaniesOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && shortcutsOpen) {
                setShortcutsOpen(false);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [shortcutsOpen]);

    const handleStatusChange = (status) => {
        setOnlineStatus(status);
        localStorage.setItem('bitguard_online_status', status);
    };

    const toggleTheme = (e) => {
        e.stopPropagation();
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('avatar', file);
        try {
            const toastId = toast.loading('Uploading avatar...');
            const res = await api.patch('users/me/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            updateUser(res.data?.data ?? res.data);
            toast.success('Avatar updated', { id: toastId });
        } catch (err) {
            toast.error('Failed to upload avatar');
        }
    };

    const handleSwitchTenant = async (tenantId) => {
        if (switchingTenant || user?.tenant?.id === tenantId) return;
        setSwitchingTenant(true);
        try {
            const toastId = toast.loading('Switching company...');
            const res = await api.post('tenants/switch/', { tenant_id: tenantId });
            localStorage.setItem('access_token', res.data.access_token);
            localStorage.setItem('refresh_token', res.data.refresh_token);
            localStorage.setItem('erp_tenant_id', tenantId);
            toast.success('Company switched successfully', { id: toastId });
            window.location.assign(window.location.pathname);
        } catch (err) {
            toast.error('Failed to switch company');
            setSwitchingTenant(false);
        }
    };

    const statusColors = {
        online: 'bg-green-500',
        away: 'bg-yellow-500',
        dnd: 'bg-red-500'
    };

    const isAdmin = user?.is_superuser || user?.is_staff;
    let roleName = 'User';
    if (user?.is_superuser) roleName = 'Administrator';
    else if (user?.roles && user.roles.length > 0) roleName = user.roles[0].name;
    else if (isAdmin) roleName = 'Staff';

    const avatarInitial = (user?.first_name?.[0] || user?.email?.[0] || 'U').toUpperCase();
    const companyName = user?.tenant?.name || user?.tenant_name || 'BitGuard Platform';
    const lastLogin = user?.last_login ? new Date(user.last_login).toLocaleString() : 'Never';

    return (
        <>
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
                    <div className="absolute right-0 top-full pt-4 w-[320px] z-[1000]">
                        <div className="bg-slate-950/95 backdrop-blur-2xl border border-blue-500/30 border-t-[3px] border-t-blue-500 rounded-b-lg shadow-[0_10px_40px_-10px_rgba(59,130,246,0.3)] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                            {/* User Header */}
                            <div className="p-4 border-b border-white/5 bg-gradient-to-r from-blue-900/20 to-transparent relative overflow-hidden flex gap-4">
                                <div className="relative group shrink-0 w-14 h-14">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt="User" className="w-full h-full object-cover rounded-full border border-slate-800" />
                                    ) : (
                                        <div className="w-full h-full rounded-full border border-slate-800 bg-slate-800 flex items-center justify-center text-lg font-bold text-white">
                                            {avatarInitial}
                                        </div>
                                    )}
                                    <div 
                                        className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Camera size={16} className="text-white" />
                                    </div>
                                    <input type="file" className="hidden" ref={fileInputRef} accept="image/*" onChange={handleAvatarUpload} />
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    <div className="font-bold text-white mb-0.5 tracking-tight text-base truncate flex items-center gap-2">
                                        {user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : (user?.email?.split('@')[0] || 'User')}
                                        <span className="px-1.5 py-0.5 text-[9px] bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/20">{roleName}</span>
                                    </div>
                                    <div className="text-xs text-slate-400 truncate font-mono">{user?.email}</div>
                                    <div className="text-[10px] text-slate-500 mt-1 truncate">Last login: {lastLogin}</div>
                                </div>
                            </div>

                            {/* Menu Items */}
                            <div className="p-2 space-y-1">
                                {/* Company Context Switcher */}
                                {((user?.memberships && user.memberships.length > 0) || (user?.tenants && user.tenants.length > 0)) && (
                                    <div className="mb-2">
                                        <button
                                            onClick={() => setCompaniesOpen(!companiesOpen)}
                                            className="flex items-center justify-between w-full p-2.5 rounded-lg text-sm bg-slate-900/50 hover:bg-slate-800/80 transition-all border border-slate-800 cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Building size={14} className="text-slate-400" />
                                                <div className="flex flex-col text-left">
                                                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Active Company</span>
                                                    <span className="font-medium text-slate-300 truncate max-w-[200px]">{companyName}</span>
                                                </div>
                                            </div>
                                            {companiesOpen ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
                                        </button>
                                        
                                        {companiesOpen && (
                                            <div className="mt-1 ml-4 pl-4 border-l border-slate-800 space-y-1 animate-in slide-in-from-top-2">
                                                {(user.memberships || user.tenants).map(tenant => (
                                                    <button
                                                        key={tenant.id}
                                                        onClick={() => handleSwitchTenant(tenant.id)}
                                                        disabled={switchingTenant}
                                                        className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-colors cursor-pointer ${
                                                            user?.tenant?.id === tenant.id 
                                                                ? 'bg-blue-500/10 text-blue-400 font-medium' 
                                                                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-300'
                                                        }`}
                                                    >
                                                        <span className="truncate">{tenant.name}</span>
                                                        {user?.tenant?.id === tenant.id && <Check size={12} />}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent my-1"></div>

                                <Link to="/admin/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 w-full text-slate-300 p-2.5 rounded-lg text-sm hover:bg-blue-500/10 hover:text-blue-400 transition-all group/item">
                                    <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-blue-500/50 group-hover/item:text-blue-400 group-hover/item:bg-blue-500/20 transition-colors"><UserIcon size={14} /></div>
                                    <span className="font-medium">My Profile</span>
                                </Link>
                                <Link to="/admin/profile?tab=activity" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 w-full text-slate-300 p-2.5 rounded-lg text-sm hover:bg-blue-500/10 hover:text-blue-400 transition-all group/item">
                                    <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-blue-500/50 group-hover/item:text-blue-400 group-hover/item:bg-blue-500/20 transition-colors"><Activity size={14} /></div>
                                    <span className="font-medium">My Activity</span>
                                </Link>
                                
                                <button
                                    onClick={() => { setDropdownOpen(false); setPreferencesOpen(true); }}
                                    className="flex items-center justify-between w-full text-slate-300 p-2.5 rounded-lg text-sm hover:bg-blue-500/10 hover:text-blue-400 transition-all group/item cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-blue-500/50 group-hover/item:text-blue-400 group-hover/item:bg-blue-500/20 transition-colors">
                                            <SlidersHorizontal size={14} />
                                        </div>
                                        <span className="font-medium">Preferences</span>
                                    </div>
                                    <div onClick={toggleTheme} className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer" title="Toggle Theme">
                                        {theme === 'dark' ? <Moon size={12} /> : <Sun size={12} />}
                                    </div>
                                </button>
                                
                                <button
                                    onClick={() => { setDropdownOpen(false); setShortcutsOpen(true); }}
                                    className="flex items-center gap-3 w-full text-slate-300 p-2.5 rounded-lg text-sm hover:bg-blue-500/10 hover:text-blue-400 transition-all group/item cursor-pointer"
                                >
                                    <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-blue-500/50 group-hover/item:text-blue-400 group-hover/item:bg-blue-500/20 transition-colors"><Keyboard size={14} /></div>
                                    <span className="font-medium">Keyboard Shortcuts</span>
                                    <span className="ml-auto text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 border border-slate-700">⌘K</span>
                                </button>
                                
                                <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent my-1"></div>

                                {/* Context Switcher */}
                                {user?.is_staff && (
                                    <Link to="/admin" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 w-full text-slate-300 p-2.5 rounded-lg text-sm hover:bg-blue-500/10 hover:text-blue-400 transition-all group/item">
                                        <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-blue-500/50 group-hover/item:text-blue-400 group-hover/item:bg-blue-500/20 transition-colors"><LayoutDashboard size={14} /></div>
                                        <span className="font-medium">Switch to Backend</span>
                                    </Link>
                                )}
                                <Link to="/portal" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 w-full text-slate-300 p-2.5 rounded-lg text-sm hover:bg-blue-500/10 hover:text-blue-400 transition-all group/item">
                                    <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-blue-500/50 group-hover/item:text-blue-400 group-hover/item:bg-blue-500/20 transition-colors"><Globe size={14} /></div>
                                    <span className="font-medium">Switch to Portal</span>
                                </Link>
                                {user?.is_superuser && (
                                    <Link to="/secops" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 w-full text-slate-300 p-2.5 rounded-lg text-sm hover:bg-red-500/10 hover:text-red-400 transition-all group/item">
                                        <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-red-500/50 group-hover/item:text-red-400 group-hover/item:bg-red-500/20 transition-colors"><Shield size={14} /></div>
                                        <span className="font-medium">Switch to SecOps</span>
                                    </Link>
                                )}

                                {/* Footer Online Status & Sign Out */}
                                <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent my-2"></div>
                                <div className="flex items-center justify-between px-2 pb-1">
                                    <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-full border border-slate-800">
                                        <button onClick={() => handleStatusChange('online')} className={`w-3 h-3 rounded-full bg-green-500 transition-transform cursor-pointer ${onlineStatus === 'online' ? 'ring-2 ring-green-500/50 ring-offset-2 ring-offset-slate-950' : 'opacity-40 hover:opacity-100'}`} title="Online"></button>
                                        <button onClick={() => handleStatusChange('away')} className={`w-3 h-3 rounded-full bg-yellow-500 transition-transform cursor-pointer ${onlineStatus === 'away' ? 'ring-2 ring-yellow-500/50 ring-offset-2 ring-offset-slate-950' : 'opacity-40 hover:opacity-100'}`} title="Away"></button>
                                        <button onClick={() => handleStatusChange('dnd')} className={`w-3 h-3 rounded-full bg-red-500 transition-transform cursor-pointer ${onlineStatus === 'dnd' ? 'ring-2 ring-red-500/50 ring-offset-2 ring-offset-slate-950' : 'opacity-40 hover:opacity-100'}`} title="Do Not Disturb"></button>
                                    </div>
                                    
                                    <button onClick={() => { setDropdownOpen(false); onLogout(); }} className="flex items-center gap-2 text-red-400 px-3 py-1.5 rounded-lg text-sm hover:bg-red-500/10 transition-colors group cursor-pointer">
                                        <LogOut size={14} />
                                        <span className="font-medium">Sign Out</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {shortcutsOpen && (
                <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShortcutsOpen(false)}>
                    <div className="bg-slate-950 border border-blue-500/20 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">Keyboard Shortcuts <span className="text-[10px] uppercase tracking-wider bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">Coming Soon</span></h2>
                            <button onClick={() => setShortcutsOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><LogOut size={16}/></button>
                        </div>
                        <div className="p-6 space-y-1">
                            {[{ key: 'Ctrl + K', desc: 'Global Search' }, { key: 'Escape', desc: 'Close dialogs' }].map((s, i) => (
                                <div key={i} className="flex justify-between py-2.5 border-b border-slate-800 last:border-0">
                                    <span className="text-sm text-slate-400">{s.desc}</span>
                                    <kbd className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-xs font-mono text-slate-300">{s.key}</kbd>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            
            <PreferencesModal isOpen={preferencesOpen} onClose={() => setPreferencesOpen(false)} />
        </>
    );
};

export default UserAvatarDropdown;
