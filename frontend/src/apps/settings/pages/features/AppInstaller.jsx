import React, { useState, useEffect } from 'react';
import { 
    Search, Server, Users, ShieldCheck, LifeBuoy, 
    Briefcase, CreditCard, PieChart, ShoppingBag, 
    FileText, CheckSquare, BarChart3, Database,
    Globe, Key, Filter, CheckCircle2, Circle, Box, RefreshCw, Wrench,
    MessageSquare, Monitor, Rocket, LayoutDashboard, Settings, Activity, FileSpreadsheet, Layers, Link as LinkIcon, Cpu, List, Grid
} from 'lucide-react';
import api from '../../../../core/api/client';
import toast from 'react-hot-toast';

// Map string icon names to Lucide components
const IconMap = {
    'Users': Users,
    'Globe': Globe,
    'ShoppingBag': ShoppingBag,
    'CreditCard': CreditCard,
    'PieChart': PieChart,
    'Briefcase': Briefcase,
    'Database': Database,
    'LifeBuoy': LifeBuoy,
    'Server': Server,
    'ShieldCheck': ShieldCheck,
    'Key': Key,
    'FileText': FileText,
    'CheckSquare': CheckSquare,
    'BarChart3': BarChart3,
    'Box': Box,
    'Wrench': Wrench,
    'MessageSquare': MessageSquare,
    'Monitor': Monitor,
    'Rocket': Rocket,
    'LayoutDashboard': LayoutDashboard,
    'Settings': Settings,
    'Activity': Activity,
    'FileSpreadsheet': FileSpreadsheet,
    'Layers': Layers,
    'Link': LinkIcon,
    'Cpu': Cpu,
};

const CategoryColors = {
    'Sales': { text: 'text-amber-500', bg: 'bg-amber-500/10' },
    'Finance': { text: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    'Human Resources': { text: 'text-purple-500', bg: 'bg-purple-500/10' },
    'Manufacturing': { text: 'text-orange-500', bg: 'bg-orange-500/10' },
    'Inventory': { text: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    'Operations': { text: 'text-blue-500', bg: 'bg-blue-500/10' },
    'Administration': { text: 'text-slate-400', bg: 'bg-slate-800' },
    'Security': { text: 'text-red-500', bg: 'bg-red-500/10' },
    'Productivity': { text: 'text-indigo-500', bg: 'bg-indigo-500/10' }
};

import { useLocation, Link } from 'react-router-dom';

export default function AppInstaller() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const urlCategory = queryParams.get('category');
    const isThemesMode = location.pathname.includes('/themes');
    const isUpdatesMode = location.pathname.includes('/updates');
    
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState(isThemesMode ? 'Website' : 'All');
    const [installStatusFilter, setInstallStatusFilter] = useState(isUpdatesMode ? 'Installed' : 'All');
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    
    // Modal states
    const [selectedApp, setSelectedApp] = useState(null);
    const [uninstallWarningApp, setUninstallWarningApp] = useState(null);
    const [actionInProgress, setActionInProgress] = useState(new Set());
    const [viewMode, setViewMode] = useState('grid');
    const [missingDepsApp, setMissingDepsApp] = useState(null);

    const fetchApps = async () => {
        try {
            setLoading(true);
            const response = await api.get('base_setup/modules/');
            let data = response.data;
            if (data.success && data.data) {
                data = data.data;
            }
            if (data.results) {
                data = data.results;
            }
            setApps(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch apps", error);
            setApps([]);
        } finally {
            setLoading(false);
        }
    };

    const getAppRoute = (app) => {
        if (app.url) return app.url;
        
        // Fallbacks for older apps without URLs
        const routes = {
            'base_setup': '/admin/settings',
            'board': '/admin',
            'soc': '/admin/security',
            'users': '/admin/settings/users'
        };
        return routes[app.technical_name] || `/admin/${app.technical_name}`;
    };

    const updateAppsList = async () => {
        try {
            setUpdating(true);
            await api.post('base_setup/modules/update_list/');
            await fetchApps();
        } catch (error) {
            console.error("Failed to update apps list", error);
        } finally {
            setUpdating(false);
        }
    };

    useEffect(() => {
        fetchApps();
    }, []);

    useEffect(() => {
        if (urlCategory) {
            setCategoryFilter(urlCategory);
        } else if (isThemesMode) {
            setCategoryFilter('Website');
        } else {
            setCategoryFilter('All');
        }
    }, [urlCategory, isThemesMode]);

    const categories = ['All', ...new Set(apps.map(a => a.category))].filter(Boolean);

    const toggleInstall = async (app, force = false) => {
        setActionInProgress(prev => new Set([...prev, app.id]));
        try {
            if (app.is_installed) {
                // Check if any installed apps depend on this one
                const dependents = apps.filter(a => a.is_installed && Array.isArray(a.depends) && a.depends.includes(app.technical_name));
                if (dependents.length > 0 && !uninstallWarningApp && !force) {
                    setUninstallWarningApp(app);
                    setActionInProgress(prev => { const s = new Set(prev); s.delete(app.id); return s; });
                    return; // Abort uninstall and show warning
                }
                
                await api.post(`base_setup/modules/${app.id}/uninstall/`);
                
                // Simulate uninstall delay for background cleanup tasks
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                setUninstallWarningApp(null);
            } else {
                await api.post(`base_setup/modules/${app.id}/install/`);
                
                // Simulate install delay for migrations, loading fixtures, etc
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            // Update local state
            setApps(apps.map(a => 
                a.id === app.id ? { ...a, is_installed: !a.is_installed } : a
            ));
            
            // Also update selectedApp if it's open
            if (selectedApp && selectedApp.id === app.id) {
                setSelectedApp({ ...selectedApp, is_installed: !app.is_installed });
            }
        } catch (error) {
            console.error("Failed to toggle install state", error);
            if (error.response && error.response.status === 400) {
                setMissingDepsApp({
                    app: app,
                    missing: error.response.data.unmet_dependencies || error.response.data.blocking_modules || []
                });
            } else {
                toast.error(`Action failed: ${error.message}`);
            }
        } finally {
            setActionInProgress(prev => { const s = new Set(prev); s.delete(app.id); return s; });
        }
    };

    const upgradeApp = async (app) => {
        setActionInProgress(prev => new Set([...prev, app.id]));
        try {
            await api.post(`base_setup/modules/${app.id}/upgrade/`);
            
            // Simulate long upgrade process
            await new Promise(resolve => setTimeout(resolve, 2500));
            
            toast.success('App upgraded successfully!');
            fetchApps();
        } catch (error) {
            toast.error('Failed to upgrade app');
        } finally {
            setActionInProgress(prev => { const s = new Set(prev); s.delete(app.id); return s; });
        }
    };

    const filteredApps = apps.filter(app => {
        const matchesSearch = app.name?.toLowerCase().includes(search.toLowerCase()) || 
                              app.summary?.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || app.category === categoryFilter;
        
        let matchesInstallStatus = true;
        if (installStatusFilter === 'Installed') {
            matchesInstallStatus = app.is_installed;
        } else if (installStatusFilter === 'Not Installed') {
            matchesInstallStatus = !app.is_installed;
        }
        
        return matchesSearch && matchesCategory && matchesInstallStatus;
    });

    if (loading && apps.length === 0) {
        return <div className="text-white p-8">Loading Enterprise App Registry...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Enterprise App Store</h1>
                    <p className="text-slate-400">Install or uninstall modules to customize your platform experience.</p>
                </div>
                <button 
                    onClick={updateAppsList}
                    disabled={updating}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center gap-2 border border-slate-700 transition-colors disabled:opacity-50"
                >
                    <RefreshCw size={18} className={updating ? 'animate-spin text-blue-400' : 'text-slate-400'} />
                    {updating ? 'Scanning...' : 'Update Apps List'}
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                        type="text"
                        placeholder="Search apps by name or description..."
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                    
                    {/* Status Filter */}
                    <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                        {['All', 'Installed', 'Not Installed'].map(status => (
                            <button
                                key={status}
                                onClick={() => setInstallStatusFilter(status)}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${installStatusFilter === status ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-300'}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-300'}`}
                            title="Grid View"
                        >
                            <Grid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-300'}`}
                            title="List View"
                        >
                            <List size={18} />
                        </button>
                    </div>

                    <div className="w-px h-8 bg-slate-800 hidden md:block"></div>

                    {/* Category Filter */}
                    <div className="flex items-center gap-2">
                        <Filter className="text-slate-500 flex-shrink-0" size={16} />
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategoryFilter(cat)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors border
                                ${categoryFilter === cat 
                                    ? 'bg-blue-600/20 text-blue-400 border-blue-500/50' 
                                    : 'bg-slate-800 text-slate-400 border-transparent hover:bg-slate-700'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>
            </div>

            {/* Featured Apps Banner */}
            {categoryFilter === 'All' && !search && apps.filter(a => a.featured).length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-white mb-4">Featured Applications</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {apps.filter(a => a.featured).map(app => {
                            const AppIcon = IconMap[app.icon] || Box;
                            const colors = CategoryColors[app.category] || { text: 'text-blue-500', bg: 'bg-blue-500/10' };
                            return (
                                <div key={app.id} className="relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-700 shadow-xl group flex">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full -z-10 group-hover:bg-blue-500/20 transition-colors"></div>
                                    <div className="p-6 flex flex-col justify-between w-full z-10">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${colors.bg} ${colors.text.replace('text-', 'border-').replace('400', '500/20').replace('500', '500/20')}`}>
                                                <AppIcon className={colors.text} size={28} />
                                            </div>
                                            {app.is_installed && (
                                                <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                                                    <CheckCircle2 size={14} /> Installed
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-1">{app.name}</h3>
                                            <p className="text-slate-400 text-sm mb-4 line-clamp-2">{app.summary || app.description}</p>
                                        </div>
                                        <div className="flex items-center justify-between mt-auto">
                                            <button onClick={() => setSelectedApp(app)} className="text-sm font-semibold text-blue-400 hover:text-blue-300">Learn More</button>
                                            {actionInProgress.has(app.id) ? (
                                                <span className="px-4 py-2 text-sm text-slate-400 flex items-center gap-2">
                                                    <RefreshCw size={14} className="animate-spin" /> Working...
                                                </span>
                                            ) : (
                                                <button 
                                                    onClick={() => toggleInstall(app)}
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${app.is_installed ? 'bg-slate-800 text-slate-300 hover:bg-red-500/20 hover:text-red-400 border border-transparent hover:border-red-500/30' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'}`}
                                                >
                                                    {app.is_installed ? 'Uninstall' : 'Install Now'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Apps Display */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredApps.map(app => {
                        const AppIcon = IconMap[app.icon] || Box;
                        const colors = CategoryColors[app.category] || { text: 'text-blue-500', bg: 'bg-blue-500/10' };
                    const colorClass = colors.text;
                    const bgClass = colors.bg;

                    return (
                        <div 
                            key={app.id}
                            className={`bg-slate-900 rounded-xl p-5 border transition-all duration-300
                                ${app.is_installed ? 'border-slate-700' : 'border-slate-800 hover:border-slate-600'}
                            `}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgClass}`}>
                                    <AppIcon className={colorClass} size={24} />
                                </div>
                                <div className="flex items-center gap-2">
                                    {app.is_installed && (
                                        <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                                            <CheckCircle2 size={14} /> Installed
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="cursor-pointer group-hover:text-blue-300 transition-colors" onClick={() => setSelectedApp(app)}>
                                <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                                    {app.name}
                                </h3>
                                <p className={`text-xs font-medium mb-3 ${colorClass}`}>{app.category}</p>
                                <p className="text-slate-400 text-sm mb-6 line-clamp-2 h-10">
                                    {app.summary || app.description}
                                </p>
                            </div>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                                <div className="text-xs text-slate-500">
                                    v{app.version} • {app.author || 'BitGuard'}
                                </div>
                                <div className="flex items-center gap-2">
                                    {app.is_installed && (
                                        <>
                                            <button 
                                                onClick={() => upgradeApp(app)}
                                                className="px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-amber-600/20 hover:bg-amber-600/30 text-amber-500 border border-amber-500/30"
                                                title="Upgrade Module"
                                            >
                                                Upgrade
                                            </button>
                                            <Link 
                                                to={getAppRoute(app)}
                                                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 border border-transparent"
                                            >
                                                Enter
                                            </Link>
                                        </>
                                    )}
                                    {actionInProgress.has(app.id) ? (
                                        <span className="px-4 py-2 text-sm text-slate-400 flex items-center gap-2">
                                            <RefreshCw size={14} className="animate-spin" /> Working...
                                        </span>
                                    ) : (
                                        <button 
                                            onClick={() => toggleInstall(app)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                                                ${app.is_installed 
                                                    ? 'bg-slate-800 text-slate-300 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30' 
                                                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                                                } border border-transparent`}
                                        >
                                            {app.is_installed ? 'Uninstall' : 'Install'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="text-xs uppercase bg-slate-950/50 text-slate-500">
                            <tr>
                                <th className="px-6 py-4 font-semibold">App</th>
                                <th className="px-6 py-4 font-semibold">Category</th>
                                <th className="px-6 py-4 font-semibold">Author</th>
                                <th className="px-4 py-4 font-semibold text-center">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredApps.map(app => {
                                const AppIcon = IconMap[app.icon] || Box;
                                const colors = CategoryColors[app.category] || { text: 'text-blue-500', bg: 'bg-blue-500/10' };
                                return (
                                    <tr key={app.id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setSelectedApp(app)}>
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${colors.bg}`}>
                                                    <AppIcon className={colors.text} size={20} />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors">{app.name}</div>
                                                    <div className="text-xs text-slate-500">v{app.version}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={colors.text + ' font-medium'}>{app.category}</span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">{app.author || 'BitGuard'}</td>
                                        <td className="px-4 py-4 text-center">
                                            {app.is_installed ? (
                                                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                                                    <CheckCircle2 size={12} /> Installed
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
                                                    Not Installed
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {app.is_installed && (
                                                    <>
                                                        <button 
                                                            onClick={() => upgradeApp(app)}
                                                            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-amber-600/20 hover:bg-amber-600/30 text-amber-500 border border-amber-500/30"
                                                        >
                                                            Upgrade
                                                        </button>
                                                        <Link 
                                                            to={getAppRoute(app)}
                                                            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 border border-transparent"
                                                        >
                                                            Enter
                                                        </Link>
                                                    </>
                                                )}
                                                {actionInProgress.has(app.id) ? (
                                                    <span className="px-3 py-1.5 text-xs text-slate-400 flex items-center gap-2">
                                                        <RefreshCw size={12} className="animate-spin" />
                                                    </span>
                                                ) : (
                                                    <button 
                                                        onClick={() => toggleInstall(app)}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border border-transparent
                                                            ${app.is_installed 
                                                                ? 'bg-slate-800 text-slate-300 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30' 
                                                                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                                                            }`}
                                                    >
                                                        {app.is_installed ? 'Uninstall' : 'Install'}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            )}

            {filteredApps.length === 0 && (
                <div className="text-center py-20 bg-slate-900 rounded-xl border border-slate-800">
                    <Database className="mx-auto h-12 w-12 text-slate-600 mb-4" />
                    <h3 className="text-lg font-medium text-white mb-1">No applications found</h3>
                    <p className="text-slate-400">Try adjusting your search or category filters.</p>
                </div>
            )}

            {/* App Detail Modal */}
            {selectedApp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-2xl w-full shadow-2xl relative">
                        <button onClick={() => setSelectedApp(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                        
                        <div className="flex items-start gap-4 mb-6">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border flex-shrink-0
                                ${CategoryColors[selectedApp.category]?.bg || 'bg-blue-500/10'} 
                                ${CategoryColors[selectedApp.category] ? CategoryColors[selectedApp.category].text.replace('text-', 'border-').replace('400', '500/20').replace('500', '500/20') : 'border-blue-500/20'}`}>
                                {(() => {
                                    const AppIcon = IconMap[selectedApp.icon] || Box;
                                    const iconColor = CategoryColors[selectedApp.category]?.text || 'text-blue-500';
                                    return <AppIcon className={iconColor} size={32} />;
                                })()}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">{selectedApp.name}</h2>
                                <p className={`text-sm font-medium ${CategoryColors[selectedApp.category]?.text || 'text-blue-400'}`}>{selectedApp.category}</p>
                                <div className="text-xs text-slate-500 mt-1 flex gap-4">
                                    <span>v{selectedApp.version}</span>
                                    <span>By {selectedApp.author || 'BitGuard'}</span>
                                    <span className="font-mono text-slate-400 text-[10px] bg-slate-950 px-1.5 py-0.5 rounded">{selectedApp.technical_name}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-950 rounded-xl p-4 mb-6 border border-slate-800 text-sm text-slate-300">
                            {selectedApp.description || selectedApp.summary || 'No detailed description available.'}
                        </div>

                        {Array.isArray(selectedApp.screenshots) && selectedApp.screenshots.length > 0 && (
                            <div className="mb-6 flex gap-4 overflow-x-auto pb-2 snap-x hide-scrollbar">
                                {selectedApp.screenshots.map((screenshot, idx) => (
                                    <img key={idx} src={screenshot} alt="Screenshot" className="h-48 rounded-lg border border-slate-700 snap-center object-cover shrink-0" />
                                ))}
                            </div>
                        )}

                        {Array.isArray(selectedApp.depends) && selectedApp.depends.length > 0 && (
                            <div className="mb-6">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Dependencies</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedApp.depends.map(dep => (
                                        <span key={dep} className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded border border-slate-700">
                                            {dep}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                            {selectedApp.is_installed && (
                                <>
                                    <button 
                                        onClick={() => upgradeApp(selectedApp)}
                                        className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-amber-600/20 hover:bg-amber-600/30 text-amber-500 border border-amber-500/30"
                                    >
                                        Upgrade
                                    </button>
                                    <Link 
                                        to={getAppRoute(selectedApp)}
                                        className="px-5 py-2 rounded-lg text-sm font-medium transition-colors bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                                    >
                                        Open App
                                    </Link>
                                </>
                            )}
                            {actionInProgress.has(selectedApp.id) ? (
                                <span className="px-4 py-2 text-sm text-slate-400 flex items-center gap-2">
                                    <RefreshCw size={14} className="animate-spin" /> Working...
                                </span>
                            ) : (
                                <button 
                                    onClick={() => toggleInstall(selectedApp)}
                                    className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors
                                        ${selectedApp.is_installed 
                                            ? 'bg-slate-800 text-slate-300 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30' 
                                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                                        }`}
                                >
                                    {selectedApp.is_installed ? 'Uninstall' : 'Install'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Uninstall Warning Modal */}
            {uninstallWarningApp && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
                        <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                            <ShieldCheck size={32} className="text-red-500" />
                        </div>
                        <h2 className="text-xl font-bold text-white text-center mb-2">Dependency Warning</h2>
                        <p className="text-slate-300 text-sm text-center mb-6">
                            Other installed applications depend on <span className="font-bold text-white">{uninstallWarningApp.name}</span>. Uninstalling it may cause them to malfunction or be automatically removed.
                        </p>
                        
                        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 mb-6 max-h-32 overflow-y-auto">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Dependent Apps:</div>
                            <ul className="list-disc pl-5 text-sm text-slate-300">
                                {apps.filter(a => a.is_installed && Array.isArray(a.depends) && a.depends.includes(uninstallWarningApp.technical_name)).map(dep => (
                                    <li key={dep.technical_name}>{dep.name}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex gap-3">
                            <button 
                                onClick={() => setUninstallWarningApp(null)}
                                className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => {
                                    const appToUninstall = uninstallWarningApp;
                                    setUninstallWarningApp(null);
                                    toggleInstall(appToUninstall, true);
                                }}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-red-600/20"
                            >
                                Force Uninstall
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Missing Dependencies Warning Modal */}
            {missingDepsApp && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
                        <div className="mx-auto w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-4">
                            <ShieldCheck size={32} className="text-amber-500" />
                        </div>
                        <h2 className="text-xl font-bold text-white text-center mb-2">Dependency Error</h2>
                        <p className="text-slate-300 text-sm text-center mb-6">
                            Cannot change <span className="font-bold text-white">{missingDepsApp.app.name}</span> because of the following dependencies:
                        </p>
                        
                        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 mb-6 max-h-32 overflow-y-auto">
                            <ul className="list-disc pl-5 text-sm text-slate-300">
                                {missingDepsApp.missing.map(dep => (
                                    <li key={dep}>{dep}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex gap-3">
                            <button 
                                onClick={() => setMissingDepsApp(null)}
                                className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
