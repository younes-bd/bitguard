import React, { useState, useEffect } from 'react';
import { Target } from 'lucide-react';
import maintenanceService from '../../../../maintenance/api/maintenanceService';
import toast from 'react-hot-toast';

export default function PortalAssets() {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const response = await maintenanceService.getAssets();
                const items = response?.data || response?.results || response || [];
                setAssets(Array.isArray(items) ? items : []);
            } catch (error) {
                toast.error('Failed to load assets');
            } finally {
                setLoading(false);
            }
        };
        fetchAssets();
    }, []);

    return (
        <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-500">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center text-teal-500">
                    <Target className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold dark:text-white text-slate-900">Managed Assets</h1>
                    <p className="dark:text-slate-400 text-slate-500">View endpoints and assets managed under your service plans.</p>
                </div>
            </div>

            <div className="dark:bg-slate-900/50 bg-white border dark:border-slate-800 border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            <th className="p-4 font-semibold">Asset Name</th>
                            <th className="p-4 font-semibold">Category</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold">Assignee</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="p-12 text-center text-slate-500">
                                    <div className="w-6 h-6 border-2 border-teal-500/20 border-t-teal-500 rounded-full animate-spin mx-auto mb-2"></div>
                                    Loading managed assets...
                                </td>
                            </tr>
                        ) : assets.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="p-12 text-center text-slate-500">
                                    <Target size={32} className="mx-auto mb-3 text-slate-300 dark:text-slate-700" />
                                    No managed assets found.
                                </td>
                            </tr>
                        ) : (
                            assets.map(asset => (
                                <tr key={asset.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                    <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{asset.name || asset.serial_number || asset.id}</td>
                                    <td className="p-4 text-slate-500 text-sm">{asset.category?.name || asset.category_name || 'N/A'}</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                            asset.status === 'operational' || asset.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 
                                            asset.status === 'maintenance' ? 'bg-amber-100 text-amber-700' :
                                            asset.status === 'retired' ? 'bg-red-100 text-red-700' :
                                            'bg-slate-100 text-slate-700'
                                        }`}>
                                            {asset.status || 'Active'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-500 text-sm">{asset.assignee_name || asset.assignee?.name || asset.user?.name || 'Unassigned'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

