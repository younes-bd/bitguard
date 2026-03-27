import React, { useState, useEffect } from 'react';
import securityService from '../../../core/api/securityService';
import {
    ComputerDesktopIcon,
    ShieldCheckIcon,
    ExclamationTriangleIcon,
    ServerIcon,
    BoltIcon,
} from '@heroicons/react/24/outline';

const AssetsPage = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, online: 0, isolated: 0, at_risk: 0 });

    const fetchAssets = async () => {
        setLoading(true);
        try {
            const response = await securityService.getAssets();
            // Handle both paginated and non-paginated responses
            const data = response?.data?.results ?? response?.data ?? [];
            setAssets(Array.isArray(data) ? data : []);
            setStats({
                total: data.length,
                online: data.filter(a => a.status === 'online').length,
                isolated: data.filter(a => a.status === 'isolated').length,
                at_risk: data.filter(a => a.status === 'at_risk').length,
            });
        } catch (error) {
            console.error('Failed to fetch assets', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAssets(); }, []);

    const handleIsolate = async (id) => {
        if (!window.confirm('Isolate this endpoint? This will block its network access.')) return;
        try {
            await securityService.isolateAsset(id);
            fetchAssets();
        } catch (error) {
            console.error('Failed to isolate endpoint', error);
            alert('Failed to isolate endpoint.');
        }
    };

    // Maps ManagedEndpoint.status → color classes
    const getStatusColor = (status) => {
        switch (status) {
            case 'online': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'offline': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
            case 'maintenance': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'isolated': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            case 'at_risk': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            default: return 'bg-slate-500/10 text-slate-400';
        }
    };

    // Maps risk_score (0-100) → severity badge
    const getRiskBadge = (score) => {
        if (score >= 80) return <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">Critical ({score})</span>;
        if (score >= 50) return <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">Medium ({score})</span>;
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-500/10 text-slate-400">Low ({score})</span>;
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Endpoint Inventory</h1>
                    <p className="text-slate-400 mt-1">Managed devices — workstations, servers, firewalls.</p>
                </div>
                <button
                    onClick={fetchAssets}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                    <ServerIcon className="w-4 h-4" />
                    Sync Endpoints
                </button>
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard label="Total Endpoints" value={stats.total} icon={<ComputerDesktopIcon className="w-8 h-8 text-indigo-500 opacity-80" />} />
                <StatCard label="Online" value={stats.online} icon={<ShieldCheckIcon className="w-8 h-8 text-emerald-500 opacity-80" />} valueClass="text-emerald-500" />
                <StatCard label="Isolated" value={stats.isolated} icon={<ExclamationTriangleIcon className="w-8 h-8 text-purple-500 opacity-80" />} valueClass="text-purple-500" />
                <StatCard label="At Risk" value={stats.at_risk} icon={<BoltIcon className="w-8 h-8 text-rose-500 opacity-80" />} valueClass="text-rose-500" />
            </div>

            {/* Endpoints Table */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/50 text-slate-400 text-sm uppercase tracking-wider">
                                <th className="p-4 font-medium">Hostname</th>
                                <th className="p-4 font-medium">Type</th>
                                <th className="p-4 font-medium">IP Address</th>
                                <th className="p-4 font-medium">Risk Score</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium">OS</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {assets.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-slate-500">
                                        {loading ? 'Loading endpoints…' : 'No endpoints registered yet.'}
                                    </td>
                                </tr>
                            ) : (
                                assets.map((asset) => (
                                    <tr key={asset.id} className="hover:bg-slate-700/30 transition-colors">
                                        <td className="p-4">
                                            <div className="font-medium text-white">{asset.hostname}</div>
                                            <div className="text-xs text-slate-500 font-mono">{asset.mac_address || '—'}</div>
                                        </td>
                                        <td className="p-4 text-slate-300 capitalize">{(asset.device_type || '').replace('_', ' ')}</td>
                                        <td className="p-4 text-slate-300 font-mono text-sm">{asset.ip_address || 'N/A'}</td>
                                        <td className="p-4">{getRiskBadge(asset.risk_score ?? 0)}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium border capitalize ${getStatusColor(asset.status)}`}>
                                                {(asset.status || '').replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-300 text-sm">{asset.os || 'Unknown'}</td>
                                        <td className="p-4 text-right">
                                            {asset.status !== 'isolated' ? (
                                                <button
                                                    onClick={() => handleIsolate(asset.id)}
                                                    className="px-3 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded text-sm transition-colors"
                                                >
                                                    Isolate
                                                </button>
                                            ) : (
                                                <span className="text-xs text-purple-400 italic">Contained</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon, valueClass = 'text-white' }) => (
    <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-slate-400 text-sm">{label}</p>
                <h3 className={`text-2xl font-bold mt-1 ${valueClass}`}>{value}</h3>
            </div>
            {icon}
        </div>
    </div>
);

export default AssetsPage;
