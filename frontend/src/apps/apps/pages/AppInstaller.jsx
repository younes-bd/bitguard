import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
    Search, Server, Users, Filter, ShieldCheck, LifeBuoy, Briefcase, CreditCard, PieChart,
    ShoppingBag, FileText, CheckSquare, BarChart3, Database, Globe, Key,
    CheckCircle2, Box, RefreshCw, Wrench, MessageSquare, Monitor, Rocket,
    LayoutDashboard, Settings, Activity, FileSpreadsheet, Layers,
    Link as LinkIcon, Cpu, List, Grid, Star, Building2, Calendar, Clock,
    DollarSign, FolderOpen, HelpCircle, Mail, Package, Printer, Tag, TrendingUp,
    Zap, ShoppingCart, Truck, Award, BookOpen, Clipboard, Bot, LineChart, Map,
    Megaphone, Phone, Send, Shield, Smartphone, Target, AlertTriangle, Archive,
    AtSign, BarChart2, Bell, Book, Camera, Edit3, Flag, GitBranch, Hash, Headphones,
    Home, Image, Info, Leaf, Lock, PenTool, Percent, Play, Plus, Radio, Save,
    Share2, Sliders, Terminal, ThumbsUp, Upload, Video, Volume2, Watch, Webhook, ChevronDown
} from 'lucide-react';
import { useManifest } from '../../../core/hooks/useManifest';
import { settingsService } from '../../system/api/settingsService';
import toast from 'react-hot-toast';

const IconMap = {
    Activity, AlertTriangle, Archive, AtSign, Award, BarChart2, BarChart3, Bell,
    Book, BookOpen, Bot, Box, Briefcase, Building2, Calendar, Camera, CheckSquare,
    Clipboard, Clock, Cpu, CreditCard, Database, DollarSign, Edit3, FileSpreadsheet,
    FileText, Flag, FolderOpen, GitBranch, Globe, Hash, Headphones, HelpCircle,
    Home, Image, Info, Key, LayoutDashboard, Layers, Leaf, LifeBuoy, LineChart,
    Link: LinkIcon, Lock, Mail, Map, Megaphone, MessageSquare, Monitor, Package,
    PenTool, Percent, Phone, PieChart, Printer, Radio, Rocket, Save, Send, Server,
    Settings, Share2, Shield, ShieldCheck, ShoppingBag, ShoppingCart, Sliders,
    Smartphone, Star, Tag, Target, Terminal, ThumbsUp, TrendingUp, Truck, Upload,
    Users, Video, Volume2, Watch, Webhook, Wrench, Zap,
};

const AppInstaller = () => {
    const { manifestData, refreshManifest, loading: manifestLoading } = useManifest();
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const urlCategory = queryParams.get('category');
    const isThemesMode = location.pathname.includes('/themes');
    const isUpdatesMode = location.pathname.includes('/updates');
    
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [installStatusFilter, setInstallStatusFilter] = useState(isUpdatesMode ? 'Installed' : 'All');
    const [actionInProgress, setActionInProgress] = useState(new Set());

    // We no longer fetch apps manually; we consume them from the global ManifestContext
    const apps = manifestData || [];
    const loading = manifestLoading;

    useEffect(() => {
        if (urlCategory) {
            setCategoryFilter(decodeURIComponent(urlCategory));
        } else if (isThemesMode) {
            setCategoryFilter('Theme');
        } else {
            setCategoryFilter('All');
        }
    }, [urlCategory, isThemesMode, location.pathname]);

    const installApp = async (app) => {
        try {
            setActionInProgress(prev => new Set([...prev, app.id]));
            await settingsService.installModule(app.id);
            toast.success(`${app.name} ${app.has_update ? 'upgraded' : 'installed'} successfully`);
            await refreshManifest();
            setActionInProgress(prev => { const s = new Set(prev); s.delete(app.id); return s; });
        } catch (error) {
            toast.error(`Failed to install ${app.name}`);
            setActionInProgress(prev => { const s = new Set(prev); s.delete(app.id); return s; });
        }
    };

    const filteredApps = apps.filter(app => {
        const matchesSearch = app.name?.toLowerCase().includes(search.toLowerCase()) || 
                              app.summary?.toLowerCase().includes(search.toLowerCase());
                              
        const majorCat = app.command_center_section || 'Other';
        
        let matchesCategory = false;
        if (categoryFilter === 'All') {
            matchesCategory = true;
        } else if (categoryFilter === 'Theme') {
            matchesCategory = app.category && app.category.includes('Theme');
        } else {
            matchesCategory = majorCat === categoryFilter;
        }
        
        let matchesInstallStatus = true;
        if (isUpdatesMode) {
            matchesInstallStatus = app.is_installed && app.has_update;
        } else {
            if (installStatusFilter === 'Installed') matchesInstallStatus = app.is_installed;
            if (installStatusFilter === 'Not Installed') matchesInstallStatus = !app.is_installed;
        }
        
        return matchesSearch && matchesCategory && matchesInstallStatus;
    });

    if (loading) {
        return (
            <div className="p-8 flex justify-center items-center h-64">
                <RefreshCw className="animate-spin text-blue-500 w-8 h-8" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            {/* Control Panel (Odoo Style) */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-800 mb-8">
                
                {/* Search Bar */}
                <div className="relative w-full md:flex-1 max-w-2xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                        type="text"
                        placeholder="Search apps by name or description..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>
                
                {/* Filter Dropdown */}
                <div className="relative w-full md:w-auto flex items-center gap-4">
                    <div className="relative flex-1">
                        <select
                            value={installStatusFilter}
                            onChange={(e) => setInstallStatusFilter(e.target.value)}
                            className="w-full md:w-48 appearance-none bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-3 pr-10 focus:outline-none focus:border-blue-500 cursor-pointer"
                        >
                            <option value="All">All Apps</option>
                            <option value="Installed">Installed Apps</option>
                            <option value="Not Installed">Not Installed</option>
                        </select>
                        <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                    </div>
                    
                    {/* Tier-1 ERP Standard: Update Apps List */}
                    <button
                        onClick={async () => {
                            try {
                                setActionInProgress(prev => new Set([...prev, 'update_list']));
                                const res = await settingsService.updateModuleList();
                                toast.success(`Synced ${res.data?.modules_found || 'all'} modules from disk successfully`);
                                await refreshManifest();
                            } catch (err) {
                                toast.error('Failed to update apps list');
                            } finally {
                                setActionInProgress(prev => { const s = new Set(prev); s.delete('update_list'); return s; });
                            }
                        }}
                        disabled={actionInProgress.has('update_list')}
                        className={`p-3 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-2 ${actionInProgress.has('update_list') ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title="Update Apps List (Scan disk for new modules or manifest changes)"
                    >
                        <RefreshCw size={18} className={actionInProgress.has('update_list') ? "animate-spin" : ""} />
                        <span className="hidden md:inline text-sm font-medium">Update Apps List</span>
                    </button>
                </div>
            </div>

            {/* Apps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredApps.map(app => {
                    const AppIcon = IconMap[app.icon] || Box;
                    
                    return (
                        <div 
                            key={app.id} 
                            onClick={() => navigate(`/admin/apps/${app.technical_name}`)}
                            className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all cursor-pointer group flex flex-col h-full"
                        >
                            {/* Card Body */}
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex gap-4">
                                    <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center shrink-0 border border-slate-700 shadow-inner">
                                        <AppIcon size={32} className={app.is_installed ? "text-blue-400" : "text-slate-400"} />
                                    </div>
                                    <div className="flex-1 min-w-0 pt-1">
                                        <h3 className="text-lg font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                                            {app.name}
                                        </h3>
                                        <p className="text-sm text-slate-500 truncate mb-2">
                                            {app.category || 'Uncategorized'}
                                        </p>
                                        <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                                            {app.summary}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Card Footer */}
                            <div className="px-5 py-3 bg-slate-950/50 border-t border-slate-800 flex justify-between items-center">
                                <div className="text-xs font-medium text-slate-500">
                                    v{app.version || '1.0'} • {app.author || 'BitGuard'}
                                </div>
                                
                                <div>
                                    {actionInProgress.has(app.id) ? (
                                        <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                                            <RefreshCw size={12} className="animate-spin" /> Working...
                                        </span>
                                    ) : (
                                        app.is_installed ? (
                                            app.has_update ? (
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); installApp(app); }}
                                                    className="px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors bg-amber-500 hover:bg-amber-400 text-white shadow shadow-amber-500/20"
                                                >
                                                    Upgrade
                                                </button>
                                            ) : (
                                                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 shadow-sm">
                                                    Installed
                                                </span>
                                            )
                                        ) : (
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); installApp(app); }}
                                                className="px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors bg-blue-600 hover:bg-blue-500 text-white shadow shadow-blue-500/20"
                                            >
                                                Install
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredApps.length === 0 && (
                <div className="text-center py-20 bg-slate-900 rounded-xl border border-slate-800">
                    <Database className="mx-auto h-12 w-12 text-slate-600 mb-4" />
                    <h3 className="text-lg font-medium text-white mb-1">No applications found</h3>
                    <p className="text-slate-400">Adjust your search or clear filters to see more results.</p>
                </div>
            )}
        </div>
    );
};

export default AppInstaller;
