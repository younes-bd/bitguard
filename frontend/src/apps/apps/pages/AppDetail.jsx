import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Box, CheckCircle2, Download, AlertTriangle, RefreshCw, Trash2, Globe, FileText, User } from 'lucide-react';
import { useManifest } from '../../../core/hooks/useManifest';
import { settingsService } from '../../system/api/settingsService';
import toast from 'react-hot-toast';

const AppDetail = () => {
    const { refreshManifest } = useManifest();
    const { techName } = useParams();
    const navigate = useNavigate();
    const [app, setApp] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionInProgress, setActionInProgress] = useState(false);

    useEffect(() => {
        const fetchApp = async () => {
            try {
                const response = await settingsService.getModules();
                let appsArray = [];
                if (Array.isArray(response)) appsArray = response;
                else if (response?.data && Array.isArray(response.data)) appsArray = response.data;
                else if (response?.results && Array.isArray(response.results)) appsArray = response.results;
                else if (response?.data?.results && Array.isArray(response.data.results)) appsArray = response.data.results;
                else if (response?.data?.data && Array.isArray(response.data.data)) appsArray = response.data.data;
                
                const foundApp = appsArray.find(a => a.technical_name === techName);
                if (foundApp) {
                    setApp(foundApp);
                } else {
                    toast.error('App not found');
                    navigate('/admin/apps');
                }
            } catch (error) {
                console.error('Failed to fetch app details', error);
                toast.error('Failed to load app');
            } finally {
                setLoading(false);
            }
        };
        fetchApp();
    }, [techName, navigate]);

    const handleInstall = async () => {
        try {
            setActionInProgress(true);
            await settingsService.installModule(app.id);
            toast.success(`${app.name} installed successfully!`);
            await refreshManifest();
            setApp({ ...app, is_installed: true });
        } catch (error) {
            toast.error(error.response?.data?.error || `Failed to install ${app.name}`);
        } finally {
            setActionInProgress(false);
        }
    };

    const handleUninstall = async () => {
        if (!window.confirm(`Are you sure you want to uninstall ${app.name}? This may remove related data.`)) return;
        try {
            setActionInProgress(true);
            await settingsService.uninstallModule(app.id);
            toast.success(`${app.name} uninstalled successfully!`);
            await refreshManifest();
            setApp({ ...app, is_installed: false });
        } catch (error) {
            toast.error(error.response?.data?.error || `Failed to uninstall ${app.name}`);
        } finally {
            setActionInProgress(false);
        }
    };

    if (loading) {
        return <div className="p-8 flex justify-center"><RefreshCw className="animate-spin text-slate-500" /></div>;
    }

    if (!app) return null;

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <Link to="/admin/apps" className="inline-flex items-center text-sm text-slate-400 hover:text-white mb-6">
                <ArrowLeft size={16} className="mr-2" /> Back to Apps
            </Link>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                {/* Header */}
                <div className="p-8 flex items-start gap-6 border-b border-slate-800">
                    <div className="w-24 h-24 bg-slate-800 rounded-2xl flex items-center justify-center shrink-0 border border-slate-700 shadow-inner">
                        <Box size={40} className="text-slate-400" />
                    </div>
                    
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">{app.name}</h1>
                                <p className="text-lg text-slate-400 max-w-2xl">{app.summary}</p>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3 min-w-[140px]">
                                {app.is_installed ? (
                                    <>
                                        <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl font-medium cursor-default">
                                            <CheckCircle2 size={18} /> Installed
                                        </button>
                                        
                                        {['core', 'system', 'auth', 'tenants', 'automation', 'apps', 'users'].includes(app.technical_name) ? (
                                            <div className="text-center mt-2">
                                                <span className="text-xs text-slate-500 font-medium px-2 block">
                                                    Required Kernel Module
                                                </span>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={handleUninstall}
                                                disabled={actionInProgress}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/30 rounded-xl font-medium transition-all"
                                            >
                                                {actionInProgress ? <RefreshCw className="animate-spin" size={18} /> : <Trash2 size={18} />} Uninstall
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <button 
                                        onClick={handleInstall}
                                        disabled={actionInProgress}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 border border-transparent rounded-xl font-medium transition-all"
                                    >
                                        {actionInProgress ? <RefreshCw className="animate-spin" size={18} /> : <Download size={18} />} Install
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 mt-6">
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <FileText size={16} /> <span className="text-slate-300 font-medium">Category:</span> {app.category || 'Uncategorized'}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <User size={16} /> <span className="text-slate-300 font-medium">Author:</span> {app.author || 'BitGuard'}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <Globe size={16} /> <a href={app.website || '#'} className="text-blue-400 hover:underline">Website</a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details Section */}
                <div className="p-8">
                    <h2 className="text-xl font-bold text-white mb-4">Module Information</h2>
                    <div className="prose prose-invert max-w-none">
                        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{app.description || 'No detailed description provided for this module.'}</p>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-8 border-t border-slate-800 pt-8">
                        <div>
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Technical Data</h3>
                            <dl className="space-y-3 text-sm">
                                <div className="flex justify-between border-b border-slate-800/50 pb-2">
                                    <dt className="text-slate-400">Technical Name</dt>
                                    <dd className="font-mono text-slate-300">{app.technical_name}</dd>
                                </div>
                                <div className="flex justify-between border-b border-slate-800/50 pb-2">
                                    <dt className="text-slate-400">Version</dt>
                                    <dd className="text-slate-300">{app.version || '1.0.0'}</dd>
                                </div>
                                <div className="flex justify-between border-b border-slate-800/50 pb-2">
                                    <dt className="text-slate-400">License</dt>
                                    <dd className="text-slate-300">{app.license || 'LGPL-3'}</dd>
                                </div>
                            </dl>
                        </div>
                        
                        <div>
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Dependencies</h3>
                            {app.depends && app.depends.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {app.depends.map((dep, i) => (
                                        <span key={i} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-sm border border-slate-700 font-mono">
                                            {dep}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500 italic">No dependencies required.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppDetail;
