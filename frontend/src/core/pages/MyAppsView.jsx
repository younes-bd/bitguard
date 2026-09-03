import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { LayoutDashboard } from 'lucide-react';
import { settingsService } from '../../apps/system/api/settingsService';

export default function MyAppsView() {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        settingsService.getModules()
            .then(res => {
                const modules = res.data?.results || res.data || [];
                // Only show installed, application-type modules that have URLs
                const installedApps = modules.filter(m => m.is_installed && m.url);
                setApps(installedApps);
            })
            .catch(err => {
                console.error("Failed to load apps", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">My Apps</h1>
                        <p className="text-slate-400 mt-1">Access all your installed applications</p>
                    </div>
                    <Link to="/admin" className="text-sm font-medium text-blue-400 hover:text-blue-300">
                        Go to Dashboard
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <LucideIcons.Loader2 className="animate-spin text-slate-500" size={32} />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                        {apps.map((app, index) => {
                            const Icon = LucideIcons[app.icon] || LayoutDashboard;
                            return (
                                <Link
                                    key={index}
                                    to={app.url}
                                    className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800 transition-all group no-underline"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-slate-800 group-hover:bg-blue-500/20 text-slate-400 group-hover:text-blue-400 flex items-center justify-center mb-3 transition-colors">
                                        <Icon size={32} strokeWidth={1.5} />
                                    </div>
                                    <span className="text-sm font-semibold text-slate-300 group-hover:text-white text-center">
                                        {app.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
